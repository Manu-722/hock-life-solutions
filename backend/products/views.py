import django_filters
from rest_framework import viewsets

from accounts.permissions import IsAdminOrReadOnly

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class ProductFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    category = django_filters.CharFilter(field_name="category__slug")
    in_stock = django_filters.BooleanFilter(field_name="in_stock")
    is_on_offer = django_filters.BooleanFilter(field_name="is_on_offer")

    class Meta:
        model = Product
        fields = ["category", "min_price", "max_price", "in_stock", "is_on_offer"]


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class ProductViewSet(viewsets.ModelViewSet):
    """
    Public: GET /api/products/ supports ?search=<name/description>,
    ?category=<slug>, ?min_price=, ?max_price=, ?in_stock=, ?is_on_offer=,
    ?ordering=price / -price / created_at - this is the search + filter bar
    below the slideshow.

    Admin-only: POST / PUT / PATCH / DELETE - lets the admin add a product
    (with induction-cooker or sufuria specific fields), edit prices, toggle
    stock, mark/unmark offers, or remove a product entirely.
    """
    queryset = Product.objects.select_related("category", "induction_cooker_spec", "sufuria_spec").all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_class = ProductFilter
    search_fields = ["name", "description"]
    ordering_fields = ["price", "created_at", "name"]
