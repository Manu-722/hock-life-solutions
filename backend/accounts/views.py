from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import PasswordResetCode
from .serializers import (
    ChangePasswordSerializer,
    ForgotPasswordSerializer,
    HockLoginSerializer,
    RegisterSerializer,
    ResetPasswordSerializer,
    UserSerializer,
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """Public sign-up. Always creates a normal CUSTOMER account."""
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class LoginView(TokenObtainPairView):
    """
    One login form for everyone. The returned payload tells the frontend
    whether this account is an admin (is_admin: true) so it can greet them
    by name as an admin and reveal the dashboard link - normal users never
    get that flag and never see the link.
    """
    serializer_class = HockLoginSerializer
    permission_classes = [permissions.AllowAny]


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        """Lets a logged-in user edit their own profile (name, email, phone).
        Username, role, and admin status stay read-only here regardless of
        what's sent - see UserSerializer's read_only_fields."""
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ChangePasswordView(APIView):
    """Used both for a voluntary password change in Settings, and to force
    an admin to replace their hardcoded starter password on first login."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        if not user.check_password(serializer.validated_data["old_password"]):
            return Response({"detail": "Current password is incorrect."}, status=400)
        user.set_password(serializer.validated_data["new_password"])
        user.must_change_password = False
        user.save()
        return Response({"detail": "Password updated successfully."})


class ForgotPasswordView(APIView):
    """Step 1: user submits their email, we email them a 6-digit code that
    expires after 5 minutes."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            # Don't reveal whether the email exists - just say it was sent.
            return Response({"detail": "If that email exists, a code has been sent."})

        code = PasswordResetCode.generate_code()
        PasswordResetCode.objects.create(user=user, code=code)

        try:
            send_mail(
                subject="Your Hawk Life Solutions password reset code",
                message=(
                    f"Hi {user.first_name or user.username},\n\n"
                    f"Your password reset code is: {code}\n"
                    f"This code expires in {settings.PASSWORD_RESET_CODE_LIFETIME_MINUTES} minutes.\n\n"
                    "If you didn't request this, you can ignore this email."
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
        except Exception as exc:
            # Don't leak whether the email exists to the client, but DO log
            # the real reason to the server console - a misconfigured SMTP
            # backend (wrong password, blocked port, etc.) otherwise fails
            # completely silently and looks like "codes never arrive".
            print(f"[ForgotPassword] Could not send reset email to {user.email}: {exc}")

        return Response({"detail": "If that email exists, a code has been sent."})


class ResetPasswordView(APIView):
    """Step 2: user submits the code + new password."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        code = serializer.validated_data["code"]

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response({"detail": "Invalid code."}, status=400)

        reset_code = (
            PasswordResetCode.objects.filter(user=user, code=code)
            .order_by("-created_at")
            .first()
        )
        if not reset_code or not reset_code.is_valid():
            return Response({"detail": "That code is invalid or has expired."}, status=400)

        user.set_password(serializer.validated_data["new_password"])
        user.save()
        reset_code.used = True
        reset_code.save()
        return Response({"detail": "Password reset successfully. You can now log in."})


class FirebaseLoginView(APIView):
    """
    Google Sign-In via Firebase Authentication.

    The frontend uses Firebase's own SDK to run the Google sign-in popup,
    then sends us the resulting Firebase ID token. We verify that token
    server-side with the Firebase Admin SDK (proving it's genuinely from
    Google/Firebase and hasn't been tampered with), then find-or-create a
    normal CUSTOMER account for that email and hand back the exact same
    JWT response shape as the regular /accounts/login/ endpoint, so the
    frontend's existing login-success handling works unchanged.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        id_token = request.data.get("id_token")
        if not id_token:
            return Response({"detail": "id_token is required."}, status=400)

        if not settings.FIREBASE_SERVICE_ACCOUNT_PATH:
            return Response(
                {"detail": "Google sign-in isn't configured on the server yet."},
                status=503,
            )

        try:
            import firebase_admin
            from firebase_admin import auth as firebase_auth

            if not firebase_admin._apps:
                return Response(
                    {"detail": "Google sign-in isn't configured on the server yet."},
                    status=503,
                )
            decoded = firebase_auth.verify_id_token(id_token)
        except Exception as exc:
            # Log the REAL reason to the server console - wrong project ID,
            # expired token, clock skew, malformed service account file,
            # etc. all get swallowed into one vague message for the client,
            # but you need the real detail to debug which one it actually is.
            print(f"[FirebaseLogin] Token verification failed: {type(exc).__name__}: {exc}")
            return Response({"detail": "Invalid or expired Google sign-in token."}, status=401)

        email = decoded.get("email")
        if not email:
            return Response({"detail": "Google account has no email address."}, status=400)

        name = decoded.get("name", "")
        first_name, _, last_name = name.partition(" ")

        user = User.objects.filter(email__iexact=email).first()
        if not user:
            user = User.objects.create(
                username=email.split("@")[0] + "_" + decoded.get("uid", "")[:6],
                email=email,
                first_name=first_name,
                last_name=last_name,
                role=User.Role.CUSTOMER,
            )
            # Firebase already verified this person's identity - they never
            # need a local password, so set one they can't guess or use.
            user.set_unusable_password()
            user.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": user.role,
            "is_admin": user.is_admin,
            "username": user.username,
            "must_change_password": user.must_change_password,
        })