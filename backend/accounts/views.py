import secrets

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.cache import cache
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.mail import send_mail
from rest_framework import generics, permissions
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from hocklife.throttles import client_ip

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

# Brute force protection settings
LOGIN_MAX_PER_DEVICE = 5        # failed logins per username and address
LOGIN_MAX_PER_ACCOUNT = 25      # failed logins per username from anywhere
LOGIN_WINDOW = 15 * 60          # seconds
FORGOT_MAX_PER_EMAIL = 3        # reset emails per address
FORGOT_WINDOW = 60 * 60
RESET_MAX_ATTEMPTS = 5          # wrong reset codes per address
RESET_WINDOW = 15 * 60


def _bump(key, window):
    cache.set(key, cache.get(key, 0) + 1, window)


def revoke_all_tokens(user):
    """Signs the user out everywhere by cancelling all their refresh tokens."""
    for token in OutstandingToken.objects.filter(user=user):
        BlacklistedToken.objects.get_or_create(token=token)


class RegisterView(generics.CreateAPIView):
    """Public sign-up. Always creates a normal CUSTOMER account."""
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    throttle_scope = "register"


class LoginView(TokenObtainPairView):
    """
    One login form for everyone. The returned payload tells the frontend
    whether this account is an admin (is_admin: true). Repeated failed
    attempts lock the login for 15 minutes.
    """
    serializer_class = HockLoginSerializer
    permission_classes = [permissions.AllowAny]
    throttle_scope = "login"

    def post(self, request, *args, **kwargs):
        data = request.data if hasattr(request.data, "get") else {}
        username = str(data.get("username", "")).strip().lower()[:150]
        device_key = f"login_fail:{username}:{client_ip(request)}"
        account_key = f"login_fail_acct:{username}"

        if username and (
            cache.get(device_key, 0) >= LOGIN_MAX_PER_DEVICE
            or cache.get(account_key, 0) >= LOGIN_MAX_PER_ACCOUNT
        ):
            return Response(
                {"detail": "Too many failed attempts. Please wait 15 minutes, or reset your password."},
                status=429,
            )

        try:
            response = super().post(request, *args, **kwargs)
        except APIException:
            if username:
                _bump(device_key, LOGIN_WINDOW)
                _bump(account_key, LOGIN_WINDOW)
            raise

        if username:
            cache.delete(device_key)
        return response


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
    an admin to replace their starter password on first login."""
    permission_classes = [permissions.IsAuthenticated]
    throttle_scope = "password"

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        if not user.check_password(serializer.validated_data["old_password"]):
            return Response({"detail": "Current password is incorrect."}, status=400)

        new_password = serializer.validated_data["new_password"]
        try:
            validate_password(new_password, user)
        except DjangoValidationError as exc:
            return Response({"detail": " ".join(exc.messages)}, status=400)

        user.set_password(new_password)
        user.must_change_password = False
        user.save()
        return Response({"detail": "Password updated successfully."})


class ForgotPasswordView(APIView):
    """Step 1: user submits their email, we email them a 6-digit code that
    expires after 5 minutes."""
    permission_classes = [permissions.AllowAny]
    throttle_scope = "forgot"

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        def neutral():
            # Same answer whether or not the email exists, so this form
            # can't be used to discover who has an account.
            return Response({"detail": "If that email exists, a code has been sent."})

        # At most a few reset emails per address per hour, so nobody can
        # flood someone's inbox. Counted even for unknown emails.
        email_key = f"forgot:{email.strip().lower()}"
        if cache.get(email_key, 0) >= FORGOT_MAX_PER_EMAIL:
            return neutral()
        _bump(email_key, FORGOT_WINDOW)

        user = User.objects.filter(email__iexact=email, is_active=True).first()
        if not user:
            return neutral()

        # Only the newest code should ever work.
        PasswordResetCode.objects.filter(user=user, used=False).update(used=True)
        code = f"{secrets.randbelow(1_000_000):06d}"
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
            print(f"[ForgotPassword] Could not send reset email to {user.email}: {exc}")

        return neutral()


class ResetPasswordView(APIView):
    """Step 2: user submits the code + new password."""
    permission_classes = [permissions.AllowAny]
    throttle_scope = "reset"

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        code = serializer.validated_data["code"]
        new_password = serializer.validated_data["new_password"]

        # Only a few wrong guesses per address, so the 6-digit code can't
        # be brute forced.
        attempts_key = f"reset_fail:{email.strip().lower()}"
        if cache.get(attempts_key, 0) >= RESET_MAX_ATTEMPTS:
            return Response(
                {"detail": "Too many attempts. Please request a new code later."},
                status=429,
            )

        user = User.objects.filter(email__iexact=email, is_active=True).first()
        reset_code = None
        if user:
            reset_code = (
                PasswordResetCode.objects.filter(user=user, used=False)
                .order_by("-created_at")
                .first()
            )

        if (
            not user
            or not reset_code
            or not secrets.compare_digest(str(reset_code.code), str(code))
            or not reset_code.is_valid()
        ):
            _bump(attempts_key, RESET_WINDOW)
            return Response({"detail": "That code is invalid or has expired."}, status=400)

        try:
            validate_password(new_password, user)
        except DjangoValidationError as exc:
            return Response({"detail": " ".join(exc.messages)}, status=400)

        user.set_password(new_password)
        user.save()
        reset_code.used = True
        reset_code.save()

        # A reset can mean the account was at risk, so sign out every other
        # session and clear any login lock.
        revoke_all_tokens(user)
        cache.delete(attempts_key)
        cache.delete(f"login_fail_acct:{user.username.lower()}")

        return Response({"detail": "Password reset successfully. You can now log in."})


class FirebaseLoginView(APIView):
    """
    Google Sign-In via Firebase Authentication.

    The frontend runs the Google sign-in popup with Firebase and sends us
    the resulting Firebase ID token. We verify it server-side with the
    Firebase Admin SDK, then find or create a normal CUSTOMER account for
    that email and return the same JWT response as /accounts/login/.
    """
    permission_classes = [permissions.AllowAny]
    throttle_scope = "firebase"

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
            # Log the real reason to the server console, but keep the
            # message to the client vague.
            print(f"[FirebaseLogin] Token verification failed: {type(exc).__name__}: {exc}")
            return Response({"detail": "Invalid or expired Google sign-in token."}, status=401)

        email = decoded.get("email")
        if not email:
            return Response({"detail": "Google account has no email address."}, status=400)
        if not decoded.get("email_verified", False):
            return Response({"detail": "Your Google email address is not verified."}, status=400)

        name = decoded.get("name", "")
        first_name, _, last_name = name.partition(" ")

        user = User.objects.filter(email__iexact=email).first()
        if not user:
            # Try a clean username first (just the email prefix). Only add
            # a number if that exact username is already taken.
            base_username = email.split("@")[0]
            username = base_username
            suffix = 1
            while User.objects.filter(username=username).exists():
                suffix += 1
                username = f"{base_username}{suffix}"

            user = User.objects.create(
                username=username,
                email=email,
                first_name=first_name,
                last_name=last_name,
                role=User.Role.CUSTOMER,
            )
            # Google already verified this person, so they never need a
            # local password. Set one nobody can guess or use.
            user.set_unusable_password()
            user.save()

        if not user.is_active:
            return Response({"detail": "This account has been disabled."}, status=403)

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": user.role,
            "is_admin": user.is_admin,
            "username": user.username,
            "must_change_password": user.must_change_password,
        })