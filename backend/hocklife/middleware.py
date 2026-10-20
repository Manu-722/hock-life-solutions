from django.conf import settings
from django.core.cache import cache
from django.http import HttpResponse

from .throttles import client_ip


class AdminLoginRateLimitMiddleware:
    """
    Blocks repeated failed logins on the Django admin login form. After 8
    failed attempts from one address, further attempts are refused for 15
    minutes. A successful login clears the count.
    """

    MAX_FAILURES = 8
    WINDOW = 15 * 60

    def __init__(self, get_response):
        self.get_response = get_response
        self.login_path = f"/{settings.ADMIN_URL}login/"

    def __call__(self, request):
        if request.method == "POST" and request.path == self.login_path:
            key = f"admin_login_fail:{client_ip(request)}"
            if cache.get(key, 0) >= self.MAX_FAILURES:
                return HttpResponse(
                    "Too many failed login attempts. Please wait 15 minutes and try again.",
                    status=429,
                )
            response = self.get_response(request)
            if response.status_code == 302:
                cache.delete(key)
            else:
                cache.set(key, cache.get(key, 0) + 1, self.WINDOW)
            return response
        return self.get_response(request)