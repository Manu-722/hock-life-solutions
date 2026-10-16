from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

User = get_user_model()


class Command(BaseCommand):
    help = "Creates the Hawk Life Solutions admin account with a starter password from .env."

    def add_arguments(self, parser):
        parser.add_argument("--username", default="admin")
        parser.add_argument("--email", default="lifesolutions.hawk@gmail.com")
        parser.add_argument(
            "--force",
            action="store_true",
            help="Required to reset the password of an admin who has already changed it themselves.",
        )

    def handle(self, *args, **options):
        username = options["username"]
        email = options["email"]
        force = options["force"]

        starter_password = settings.ADMIN_STARTER_PASSWORD
        if not starter_password:
            raise CommandError(
                "ADMIN_STARTER_PASSWORD is not set. Add it to your backend/.env file "
                "(see .env.example) before running this command."
            )

        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "email": email,
                "role": User.Role.ADMIN,
                "is_staff": True,
                "is_superuser": True,
                "must_change_password": True,
            },
        )

        # SECURITY: once an admin has chosen their own password, this command
        # never reverts it to the starter password unless told to with --force.
        if not created and not user.must_change_password and not force:
            # The password is left alone, but the account's access is
            # repaired if needed (for accounts created before the superuser
            # flag existed, which caused "no permission" in Django admin).
            repaired = []
            if user.role != User.Role.ADMIN:
                user.role = User.Role.ADMIN
                repaired.append("role")
            if not user.is_staff:
                user.is_staff = True
                repaired.append("is_staff")
            if not user.is_superuser:
                user.is_superuser = True
                repaired.append("is_superuser")
            if repaired:
                user.save(update_fields=repaired)
                self.stdout.write(self.style.SUCCESS(
                    f"Repaired admin access for '{username}' ({', '.join(repaired)}). Password left unchanged."
                ))
            self.stdout.write(self.style.WARNING(
                f"Admin '{username}' already has their own password, so it was not reset. "
                f"To reset it on purpose, re-run with --force."
            ))
            return

        user.role = User.Role.ADMIN
        user.is_staff = True
        user.is_superuser = True
        user.must_change_password = True
        user.set_password(starter_password)
        user.save()

        verb = "Created" if created else "Reset"
        self.stdout.write(self.style.SUCCESS(
            f"{verb} admin '{username}'. The starter password is the ADMIN_STARTER_PASSWORD value. "
            f"They must change it on first login."
        ))