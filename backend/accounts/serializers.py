from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "phone_number", "role", "is_admin", "must_change_password"]
        read_only_fields = ["role", "is_admin", "must_change_password"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ["username", "email", "password", "first_name", "last_name", "phone_number"]

    def create(self, validated_data):
        # Registrations through this endpoint are always normal customers.
        # Admin accounts are created only via the Django management command
        # (see accounts/management/commands/create_admin.py) - never through
        # the public API - so a customer can never grant themselves admin.
        user = User.objects.create_user(role=User.Role.CUSTOMER, **validated_data)
        return user


class HockLoginSerializer(TokenObtainPairSerializer):
    """
    Custom login: same form for everyone. The response simply reports back
    whether the account is an admin. The frontend uses that flag to decide
    whether to show "Welcome, <name> (Admin)" and reveal the dashboard link,
    or just log the person in as a normal user.
    """

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["role"] = self.user.role
        data["is_admin"] = self.user.is_admin
        data["username"] = self.user.username
        data["must_change_password"] = self.user.must_change_password
        return data


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)
    new_password = serializers.CharField(validators=[validate_password])