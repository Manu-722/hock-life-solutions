from rest_framework import serializers
from .models import SlideshowItem


class SlideshowItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SlideshowItem
        fields = ["id", "title", "subtitle", "image", "link_url", "order", "active"]
