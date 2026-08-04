from rest_framework import permissions


class IsAdminRole(permissions.BasePermission):
    """Allows access only to users whose role is ADMIN."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_admin)


class IsAdminOrReadOnly(permissions.BasePermission):
    """Anyone can view (browse products, offers, etc.) but only an admin
    can create/update/delete - this is what lets the admin 'do everything'
    on the site while normal shoppers can only look and buy."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.is_admin)


class IsOwnerOrAdmin(permissions.BasePermission):
    """Used for reviews: only the person who wrote a review (or an admin)
    can edit or delete it. Everyone can read; any logged-in user can post."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(
            request.user and request.user.is_authenticated
            and (obj.user_id == request.user.id or request.user.is_admin)
        )
