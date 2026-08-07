import os

from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "accounts"

    def ready(self):
        # Initialize Firebase Admin SDK once, at startup, so the
        # firebase-login endpoint can verify Google ID tokens sent by the
        # frontend's Firebase Auth. This is guarded: if the service account
        # file isn't configured yet, the server still starts normally -
        # Firebase login just won't work until FIREBASE_SERVICE_ACCOUNT_PATH
        # is set in .env and the request would fail with a friendly error.
        from django.conf import settings

        path = settings.FIREBASE_SERVICE_ACCOUNT_PATH
        if not path:
            print("[Firebase] FIREBASE_SERVICE_ACCOUNT_PATH is not set in .env - Google sign-in disabled.")
            return
        if not os.path.exists(path):
            print(f"[Firebase] FIREBASE_SERVICE_ACCOUNT_PATH is set to '{path}' but no file exists there - Google sign-in disabled.")
            return

        try:
            import firebase_admin
            from firebase_admin import credentials

            if not firebase_admin._apps:
                cred = credentials.Certificate(path)
                firebase_admin.initialize_app(cred)
                print("[Firebase] Admin SDK initialized successfully - Google sign-in is active.")
        except Exception as exc:
            # Don't let a bad/missing Firebase config take down the whole
            # server - but DO print exactly why it failed, since a silent
            # `pass` here is impossible to debug from the frontend side.
            print(f"[Firebase] Failed to initialize Admin SDK: {type(exc).__name__}: {exc}")