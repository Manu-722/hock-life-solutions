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

        # SECURITY: once an admin has changed their starter password to
        # something of their own, this command refuses to silently revert
        # it back to ADMIN_STARTER_PASSWORD unless explicitly told to with
        # --force. Without this guard, an accidental re-run (e.g. during a
        # deploy or a teammate following old instructions) would undo the
        # admin's real password without warning - a genuine security hole.
        if not created and not user.must_change_password and not force:
            self.stdout.write(self.style.WARNING(
                f"Admin '{username}' already exists and has already set their own password "
                f"(they are not currently required to change it). Refusing to reset it back to "
                f"the starter password.\n\n"
                f"If you really do need to reset it (e.g. they forgot it), re-run with:\n"
                f"    python manage.py create_admin --force"
            ))
            return

        user.role = User.Role.ADMIN
        user.is_staff = True
        user.is_superuser = True  # required for full access to Django's own /admin/ panel
        user.must_change_password = True
        user.set_password(starter_password)
        user.save()

        verb = "Created" if created else "Reset"
        self.stdout.write(self.style.SUCCESS(
            f"{verb} admin '{username}'. Starter password is whatever you set as "
            f"ADMIN_STARTER_PASSWORD in your .env file.\n"
            f"They will be required to change it on first login - and once they do, "
            f"this command will refuse to reset it again without --force."
        ))