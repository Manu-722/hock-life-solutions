from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from django.urls import path


class GoogleLoginView(SocialLoginView):
    """
    POST here with {"access_token": "<google id/access token from the
    Google Sign-In button on the frontend>"} and this returns the same
    JWT access/refresh tokens as a normal login. New Google users are
    created automatically as CUSTOMER accounts (never admin).
    """
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    callback_url = "postmessage"


urlpatterns = [
    path("", GoogleLoginView.as_view(), name="google-login"),
]
