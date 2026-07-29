from rest_framework.routers import DefaultRouter
from .views import SlideshowItemViewSet

router = DefaultRouter()
router.register("slideshow", SlideshowItemViewSet, basename="slideshow")

urlpatterns = router.urls
