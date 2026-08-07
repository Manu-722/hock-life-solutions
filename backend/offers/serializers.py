from rest_framework import serializers
from .models import SlideshowItem


class SlideshowItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SlideshowItem
        fields = ["id", "title", "subtitle", "image", "link_url", "order", "active"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.image:
            request = self.context.get("request")
            if request is not None:
                data["image"] = request.build_absolute_uri(instance.image.url)
            else:
                from django.conf import settings
                data["image"] = f"{settings.BACKEND_PUBLIC_URL.rstrip('/')}{instance.image.url}"
        return data