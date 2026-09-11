from rest_framework import serializers

from .models import Category, InductionCookerSpec, Product, Review, SufuriaSpec


def _optimize_cloudinary_url(url):
    """
    Injects Cloudinary's automatic format + quality optimization into an
    image URL - serves WebP/AVIF to browsers that support it and picks a
    smart compression level automatically, meaningfully shrinking file
    size (and therefore load time) for every visitor, not just returning
    ones. Safe no-op for any URL that isn't actually a Cloudinary one.
    """
    if url and "res.cloudinary.com" in url and "/upload/" in url and "f_auto" not in url:
        return url.replace("/upload/", "/upload/f_auto,q_auto/", 1)
    return url


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
        Always return a full absolute URL for the image (or null), never a
        bare relative path - a relative path only works by accident when
        the frontend happens to be served from the same origin as the API.
        Also applies Cloudinary auto-optimization (see helper above).
        """
        data = super().to_representation(instance)
        if instance.image:
            request = self.context.get("request")
            if request is not None:
                url = request.build_absolute_uri(instance.image.url)
            else:
                from django.conf import settings
                url = f"{settings.BACKEND_PUBLIC_URL.rstrip('/')}{instance.image.url}"
            data["image"] = _optimize_cloudinary_url(url)
        else:
            data["image"] = None
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
        if obj.user.first_name:
            return obj.user.first_name
        return obj.user.username