import django_filters
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response

from accounts.permissions import IsAdminOrReadOnly, IsOwnerOrAdmin

from .models import Category, Product, Review
from .serializers import CategorySerializer, ProductSerializer, ReviewSerializer


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


class ReviewViewSet(viewsets.ModelViewSet):
    """
    GET /api/products/reviews/?product=<id> - anyone can read a product's reviews.
    POST /api/products/reviews/ - any logged-in user can post one; if they've
    already reviewed this product, their existing review is updated instead
    of creating a duplicate (this is how a user "edits" their review - they
    just submit the form again).
    PATCH/PUT/DELETE - only the review's author or an admin.
    """
    queryset = Review.objects.select_related("user", "product").all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrAdmin]
    filterset_fields = ["product"]

    def create(self, request, *args, **kwargs):
        product_id = request.data.get("product")
        existing = Review.objects.filter(product_id=product_id, user=request.user).first()

        if existing:
            serializer = self.get_serializer(existing, data=request.data, partial=True)
        else:
            serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_200_OK if existing else status.HTTP_201_CREATED)
