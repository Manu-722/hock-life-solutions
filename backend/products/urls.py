from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, ProductViewSet, ReviewViewSet

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("reviews", ReviewViewSet, basename="review")
# IMPORTANT: this catch-all product registration must come LAST - its detail
# route (^(?P<pk>...)/$) would otherwise swallow /products/reviews/ as if
# "reviews" were a product's primary key.
router.register("", ProductViewSet, basename="product")

urlpatterns = router.urls
