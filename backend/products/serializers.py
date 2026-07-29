from rest_framework import serializers

from .models import Category, InductionCookerSpec, Product, SufuriaSpec


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class InductionCookerSpecSerializer(serializers.ModelSerializer):
    class Meta:
        model = InductionCookerSpec
        fields = ["watts", "power_output_levels", "channel_lock_system", "voltage", "warranty_months"]


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
