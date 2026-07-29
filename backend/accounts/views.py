from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
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

        send_mail(
            subject="Your Hock Life Solutions password reset code",
            message=(
                f"Hi {user.first_name or user.username},\n\n"
                f"Your password reset code is: {code}\n"
                f"This code expires in {settings.PASSWORD_RESET_CODE_LIFETIME_MINUTES} minutes.\n\n"
                "If you didn't request this, you can ignore this email."
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=True,
        )
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
