from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

User = get_user_model()

# This is the ONE-TIME starter password. The admin is forced to change it
# the moment they log in (see must_change_password / ChangePasswordView).
# Change this value before you run the command for the first time in
# production, then rotate it again afterwards.
HARDCODED_STARTER_PASSWORD = "HockAdmin#2026"


class Command(BaseCommand):
    help = "Creates (or resets) the Hock Life Solutions admin account with a hardcoded starter password."

    def add_arguments(self, parser):
        parser.add_argument("--username", default="admin")
        parser.add_argument("--email", default="admin@hocklife.com")

    def handle(self, *args, **options):
        username = options["username"]
        email = options["email"]

        user, created = User.objects.get_or_create(
            username=username,
            defaults={"email": email, "role": User.Role.ADMIN, "is_staff": True},
        )
        user.role = User.Role.ADMIN
        user.is_staff = True
        user.must_change_password = True
        user.set_password(HARDCODED_STARTER_PASSWORD)
        user.save()

        verb = "Created" if created else "Reset"
        self.stdout.write(self.style.SUCCESS(
            f"{verb} admin '{username}'. Starter password: {HARDCODED_STARTER_PASSWORD}\n"
            f"They will be required to change it on first login."
        ))
