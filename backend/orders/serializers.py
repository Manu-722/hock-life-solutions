from django.conf import settings
from rest_framework import serializers

from products.models import Product

from .models import Order, OrderItem


class OrderItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_name_snapshot", "unit_price_snapshot", "quantity", "line_total"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_username = serializers.CharField(source="customer.username", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "customer", "customer_username", "status", "till_number_used",
            "total_amount", "admin_notes", "items", "created_at", "approved_at",
        ]
        read_only_fields = ["customer", "status", "total_amount", "till_number_used", "approved_at"]


class CreateOrderSerializer(serializers.Serializer):
    """Cart -> checkout. Customer sends the list of {product_id, quantity}.
    We snapshot prices at time of purchase and show the company till number.
    The order starts PENDING until the admin approves it after payment."""
    items = OrderItemInputSerializer(many=True)

    def create(self, validated_data):
        request = self.context["request"]
        items_data = validated_data["items"]

        total = 0
        order = Order.objects.create(
            customer=request.user,
            total_amount=0,
            till_number_used=settings.COMPANY_TILL_NUMBER,
        )
        for item in items_data:
            product = Product.objects.get(id=item["product_id"])
            price = product.display_price
            OrderItem.objects.create(
                order=order,
                product=product,
                product_name_snapshot=product.name,
                unit_price_snapshot=price,
                quantity=item["quantity"],
            )
            total += price * item["quantity"]

        order.total_amount = total
        order.save()
        return order
