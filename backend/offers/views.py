from rest_framework import viewsets

from accounts.permissions import IsAdminOrReadOnly

from .models import SlideshowItem
from .serializers import SlideshowItemSerializer


class SlideshowItemViewSet(viewsets.ModelViewSet):
    """Public GET (only active=True slides ordered for display).
    Admin can create/edit/delete/reorder/deactivate slides."""
    serializer_class = SlideshowItemSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        qs = SlideshowItem.objects.all()
        if not (self.request.user.is_authenticated and self.request.user.is_admin):
            qs = qs.filter(active=True)
        return qs
