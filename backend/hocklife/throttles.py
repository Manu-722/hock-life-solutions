from rest_framework.throttling import AnonRateThrottle, ScopedRateThrottle, UserRateThrottle


def client_ip(request):
    """
    Best guess at the real visitor address. Render puts the real client
    address first in X-Forwarded-For. When running locally there is no such
    header, so the connection address is used instead.
    """
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if forwarded:
        first = forwarded.split(",")[0].strip()
        if first:
            return first
    return request.META.get("REMOTE_ADDR") or "unknown"


class _ClientIPMixin:
    def get_ident(self, request):
        return client_ip(request)


class AnonThrottle(_ClientIPMixin, AnonRateThrottle):
    pass


class UserThrottle(_ClientIPMixin, UserRateThrottle):
    pass


class ScopedThrottle(_ClientIPMixin, ScopedRateThrottle):
    pass