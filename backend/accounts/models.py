import random
from datetime import timedelta

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    """
    Extends Django's built-in user with a role field.
    ADMIN users see the admin dashboard link and can manage the whole site.
    CUSTOMER is every normal shopper.
    """

    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        CUSTOMER = "CUSTOMER", "Customer"

    role = models.CharField(max_length=10, choices=Role.choices, default=Role.CUSTOMER)
    phone_number = models.CharField(max_length=20, blank=True)

    # Forces an admin to change their hardcoded starter password on first login.
    must_change_password = models.BooleanField(default=False)

    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN

    def __str__(self):
        return f"{self.username} ({self.role})"


class PasswordResetCode(models.Model):
    """
    A short-lived 6-digit code emailed to a user who forgot their password.
    Expires 5 minutes after creation (see settings.PASSWORD_RESET_CODE_LIFETIME_MINUTES).
    """

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reset_codes")
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    used = models.BooleanField(default=False)

    @staticmethod
    def generate_code():
        return f"{random.randint(0, 999999):06d}"

    @property
    def is_expired(self):
        from django.conf import settings as dj_settings
        lifetime = timedelta(minutes=dj_settings.PASSWORD_RESET_CODE_LIFETIME_MINUTES)
        return timezone.now() > self.created_at + lifetime

    def is_valid(self):
        return not self.used and not self.is_expired

    def __str__(self):
        return f"Reset code for {self.user.username} (used={self.used})"
