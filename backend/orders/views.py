from django.conf import settings
from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import IsAdminRole

from .models import Order
from .serializers import CreateOrderSerializer, OrderSerializer


class OrderViewSet(viewsets.ModelViewSet):
    """
    Customers: see only their own order history (past + pending orders),
    and can POST a new order at checkout (create()).
    Admins: see every order, and can approve/reject a pending one - once
    approved, the customer's own order history immediately shows "Approved".
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "head"]  # updates only via the approve/reject actions below

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Order.objects.all().prefetch_related("items")
        return Order.objects.filter(customer=user).prefetch_related("items")

    def create(self, request, *args, **kwargs):
        serializer = CreateOrderSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(
            {
                **OrderSerializer(order).data,
                "till_number": settings.COMPANY_TILL_NUMBER,
                "company_name": settings.COMPANY_NAME,
                "message": (
                    f"Please pay via Till/Paybill {settings.COMPANY_TILL_NUMBER} "
                    f"({settings.COMPANY_NAME}). Your order will show as Approved "
                    "once the admin confirms payment."
                ),
            },
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"], permission_classes=[IsAdminRole])
    def approve(self, request, pk=None):
        order = self.get_object()
        order.status = Order.Status.APPROVED
        order.approved_at = timezone.now()
        order.admin_notes = request.data.get("admin_notes", order.admin_notes)
        order.save()
        return Response(OrderSerializer(order).data)

    @action(detail=True, methods=["post"], permission_classes=[IsAdminRole])
    def reject(self, request, pk=None):
        order = self.get_object()
        order.status = Order.Status.REJECTED
        order.admin_notes = request.data.get("admin_notes", order.admin_notes)
        order.save()
        return Response(OrderSerializer(order).data)
