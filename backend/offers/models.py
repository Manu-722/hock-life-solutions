from django.db import models


class SlideshowItem(models.Model):
    """One slide in the homepage offers slideshow. The admin can add,
    edit, reorder, or remove these from the admin dashboard."""
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to="slideshow/")
    link_url = models.CharField(max_length=255, blank=True, help_text="Optional link, e.g. to a product or category")
    order = models.PositiveIntegerField(default=0)
    active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "-id"]

    def __str__(self):
        return self.title
