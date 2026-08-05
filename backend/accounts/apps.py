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

        # path = settings.FIREBASE_SERVICE_ACCOUNT_PATH
        path = getattr(settings, "FIREBASE_SERVICE_ACCOUNT_PATH", "")
        if not path or not os.path.exists(path):
            return

        try:
            import firebase_admin
            from firebase_admin import credentials

            if not firebase_admin._apps:
                cred = credentials.Certificate(path)
                firebase_admin.initialize_app(cred)
        except Exception:
            # Don't let a bad/missing Firebase config take down the whole
            # server - Firebase login will just fail gracefully at request
            # time instead (see FirebaseLoginView).
            pass
