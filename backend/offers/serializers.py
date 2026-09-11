from rest_framework import serializers
from .models import SlideshowItem


def _optimize_cloudinary_url(url):
    if url and "res.cloudinary.com" in url and "/upload/" in url and "f_auto" not in url:
        return url.replace("/upload/", "/upload/f_auto,q_auto/", 1)
    return url


class SlideshowItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SlideshowItem
        fields = ["id", "title", "subtitle", "image", "link_url", "order", "active"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.image:
            request = self.context.get("request")
            if request is not None:
                url = request.build_absolute_uri(instance.image.url)
            else:
                from django.conf import settings
                url = f"{settings.BACKEND_PUBLIC_URL.rstrip('/')}{instance.image.url}"
            data["image"] = _optimize_cloudinary_url(url)
        return data