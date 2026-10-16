from django.conf import settings
from rest_framework import serializers

from hocklife.image_utils import cloudinary_variant
from .models import Category, InductionCookerSpec, Product, Review, SufuriaSpec


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class InductionCookerSpecSerializer(serializers.ModelSerializer):
    class Meta:
        model = InductionCookerSpec
        fields = ["watts", "power_output_levels", "channel_lock_system", "voltage", "dimensions", "warranty_months"]


class SufuriaSpecSerializer(serializers.ModelSerializer):
    class Meta:
        model = SufuriaSpec
        fields = ["size", "material", "induction_compatible", "has_lid"]


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    induction_cooker_spec = InductionCookerSpecSerializer(required=False, allow_null=True)
    sufuria_spec = SufuriaSpecSerializer(required=False, allow_null=True)
    display_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "category", "category_name", "name", "description", "price", "image",
            "in_stock", "is_on_offer", "offer_price", "extra_specs",
            "induction_cooker_spec", "sufuria_spec", "display_price",
            "created_at", "updated_at",
        ]

    def to_representation(self, instance):
        """
        Always return full absolute image URLs (or null), never a bare
        relative path. "image" is a 900px copy for the product page and
        "image_thumb" is a small 480px copy for the product cards, so the
        shop grid downloads far less data.
        """
        data = super().to_representation(instance)
        if instance.image:
            request = self.context.get("request")
            if request is not None:
                url = request.build_absolute_uri(instance.image.url)
            else:
                url = f"{settings.BACKEND_PUBLIC_URL.rstrip('/')}{instance.image.url}"
            data["image"] = cloudinary_variant(url, 900)
            data["image_thumb"] = cloudinary_variant(url, 480)
        else:
            data["image"] = None
            data["image_thumb"] = None
        return data

    def create(self, validated_data):
        induction_data = validated_data.pop("induction_cooker_spec", None)
        sufuria_data = validated_data.pop("sufuria_spec", None)
        product = Product.objects.create(**validated_data)
        if induction_data:
            InductionCookerSpec.objects.create(product=product, **induction_data)
        if sufuria_data:
            SufuriaSpec.objects.create(product=product, **sufuria_data)
        return product

    def update(self, instance, validated_data):
        induction_data = validated_data.pop("induction_cooker_spec", None)
        sufuria_data = validated_data.pop("sufuria_spec", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if induction_data is not None:
            InductionCookerSpec.objects.update_or_create(product=instance, defaults=induction_data)
        if sufuria_data is not None:
            SufuriaSpec.objects.update_or_create(product=instance, defaults=sufuria_data)
        return instance


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    display_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ["id", "product", "username", "display_name", "rating", "comment", "created_at", "updated_at"]
        read_only_fields = ["username", "display_name", "created_at", "updated_at"]

    def get_display_name(self, obj):
        # Prefer the person's real first name over their raw username.
        if obj.user.first_name:
            return obj.user.first_name
        return obj.user.username