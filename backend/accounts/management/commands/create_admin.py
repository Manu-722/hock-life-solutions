from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

User = get_user_model()


class Command(BaseCommand):
    help = "Creates (or resets) the Hawk Life Solutions admin account with a starter password from .env."

    def add_arguments(self, parser):
        parser.add_argument("--username", default="admin")
        parser.add_argument("--email", default="admin@hawklife.com")

    def handle(self, *args, **options):
        username = options["username"]
        email = options["email"]

        starter_password = settings.ADMIN_STARTER_PASSWORD
        if not starter_password:
            raise CommandError(
                "ADMIN_STARTER_PASSWORD is not set. Add it to your backend/.env file "
                "(see .env.example) before running this command."
            )

        user, created = User.objects.get_or_create(
            username=username,
            defaults={"email": email, "role": User.Role.ADMIN, "is_staff": True},
        )
        user.role = User.Role.ADMIN
        user.is_staff = True
        user.must_change_password = True
        user.set_password(starter_password)
        user.save()

        verb = "Created" if created else "Reset"
        self.stdout.write(self.style.SUCCESS(
            f"{verb} admin '{username}'. Starter password is whatever you set as "
            f"ADMIN_STARTER_PASSWORD in your .env file.\n"
            f"They will be required to change it on first login."
        ))