"""
Django settings for Hawk Life Solutions e-commerce backend.
"""
import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

# ---------------------------------------------------------------------------
# CORE / SECURITY
# ---------------------------------------------------------------------------
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "insecure-dev-key-do-not-use-in-production")

DEBUG = os.environ.get("DJANGO_DEBUG", "True") == "True"

ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")

AUTH_USER_MODEL = "accounts.User"

# ---------------------------------------------------------------------------
# APPS
# ---------------------------------------------------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    "django_filters",

    # Our apps
    "accounts",
    "products",
    "offers",
    "orders",
]

# Cloudinary storage for product/slideshow images - avoids Render's free
# tier wiping uploaded files on every redeploy/restart. Only added when
# actually configured, so local dev keeps using plain local file storage.
USE_CLOUDINARY_STORAGE = os.environ.get("USE_CLOUDINARY_STORAGE", "False") == "True"
if USE_CLOUDINARY_STORAGE:
    INSTALLED_APPS += ["cloudinary_storage", "cloudinary"]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "hocklife.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "hocklife.wsgi.application"

# ---------------------------------------------------------------------------
# DATABASE
# ---------------------------------------------------------------------------
# Defaults to SQLite for easy local development.
# For production, these point at Neon (permanent free Postgres hosting -
# unlike Render's free Postgres, which expires after a period of time).
# Neon requires SSL and, for pooled connections, channel binding too.
DATABASES = {
    "default": {
        "ENGINE": os.environ.get("DB_ENGINE", "django.db.backends.sqlite3"),
        "NAME": os.environ.get("DB_NAME", BASE_DIR / "db.sqlite3"),
        "USER": os.environ.get("DB_USER", ""),
        "PASSWORD": os.environ.get("DB_PASSWORD", ""),
        "HOST": os.environ.get("DB_HOST", ""),
        "PORT": os.environ.get("DB_PORT", ""),
        "OPTIONS": {
            "sslmode": os.environ.get("DB_SSLMODE", "prefer"),
            "channel_binding": os.environ.get("DB_CHANNEL_BINDING", "prefer"),
        },
    }
}

# ---------------------------------------------------------------------------
# PASSWORD VALIDATION
# ---------------------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator", "OPTIONS": {"min_length": 8}},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Africa/Nairobi"
USE_I18N = True
USE_TZ = True

# ---------------------------------------------------------------------------
# STATIC & MEDIA FILES
# ---------------------------------------------------------------------------
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

if USE_CLOUDINARY_STORAGE:
    # Product/slideshow images go to Cloudinary instead of local disk -
    # this is what makes uploaded images survive redeploys on Render.
    STORAGES["default"] = {
        "BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage",
    }
    CLOUDINARY_STORAGE = {
        "CLOUD_NAME": os.environ.get("CLOUDINARY_CLOUD_NAME"),
        "API_KEY": os.environ.get("CLOUDINARY_API_KEY"),
        "API_SECRET": os.environ.get("CLOUDINARY_API_SECRET"),
    }

BACKEND_PUBLIC_URL = os.environ.get("BACKEND_PUBLIC_URL", "http://localhost:8000")

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ---------------------------------------------------------------------------
# REST FRAMEWORK / JWT
# ---------------------------------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ),
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=6),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
CORS_ALLOWED_ORIGINS = os.environ.get(
    "CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
).split(",")
CORS_ALLOW_CREDENTIALS = True

# ---------------------------------------------------------------------------
# EMAIL
# ---------------------------------------------------------------------------
EMAIL_BACKEND = os.environ.get(
    "EMAIL_BACKEND", "django.core.mail.backends.console.EmailBackend"
)
EMAIL_HOST = os.environ.get("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.environ.get("EMAIL_PORT", 587))
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", "")
DEFAULT_FROM_EMAIL = os.environ.get("DEFAULT_FROM_EMAIL", "Hawk Life Solutions <no-reply@hawklife.com>")

PASSWORD_RESET_CODE_LIFETIME_MINUTES = 5

# ---------------------------------------------------------------------------
# FIREBASE (Google Sign-In)
# ---------------------------------------------------------------------------
FIREBASE_SERVICE_ACCOUNT_PATH = os.environ.get("FIREBASE_SERVICE_ACCOUNT_PATH", "")

# ---------------------------------------------------------------------------
# HAWK LIFE SOLUTIONS - BUSINESS SETTINGS
# ---------------------------------------------------------------------------
COMPANY_NAME = "Hawk Life Solutions"
COMPANY_PAYBILL_NUMBER = os.environ.get("COMPANY_PAYBILL_NUMBER", "522522")
COMPANY_ACCOUNT_NUMBER = os.environ.get("COMPANY_ACCOUNT_NUMBER", "7518213")
ADMIN_STARTER_PASSWORD = os.environ.get("ADMIN_STARTER_PASSWORD", "")