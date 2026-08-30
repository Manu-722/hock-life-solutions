from django.conf import settings
from django.db import models


class Category(models.Model):
    """
    e.g. Cells (batteries), Induction Cookers, Kitchenware.
    New categories can be added freely from the admin dashboard; only
    "Induction Cookers" and "Kitchenware/Sufuria" get their own dedicated
    spec form (see InductionCookerSpec / SufuriaSpec below). Any other
    category still works fine with just the base Product fields plus the
    generic `extra_specs` field.
    """
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name


class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to="products/", blank=True, null=True)

    in_stock = models.BooleanField(default=True)  # admin flips this off when stock is over
    is_on_offer = models.BooleanField(default=False)
    offer_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    # Catch-all for any category-specific attribute that doesn't need its
    # own dedicated table, e.g. {"voltage": "1.5V", "pack_size": 4} for cells.
    extra_specs = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    @property
    def display_price(self):
        return self.offer_price if (self.is_on_offer and self.offer_price) else self.price

class InductionCookerSpec(models.Model):
    """Dedicated fields for the Induction Cooker category, as requested:
    watts, power output, channel/lock system, dimensions, and room for more."""
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name="induction_cooker_spec")
    watts = models.PositiveIntegerField(help_text="Power rating in watts, e.g. 2000")
    power_output_levels = models.PositiveIntegerField(help_text="Number of power/heat levels, e.g. 10")
    channel_lock_system = models.CharField(
        max_length=100, blank=True,
        help_text="e.g. 'Child lock', 'Touch lock', 'Auto shut-off'"
    )
    voltage = models.CharField(max_length=50, blank=True)
    dimensions = models.CharField(
        max_length=100, blank=True,
        help_text="e.g. '32cm x 28cm x 6cm' (L x W x H)"
    )
    warranty_months = models.PositiveIntegerField(default=12)

    def __str__(self):
        return f"Induction spec for {self.product.name}"



class SufuriaSpec(models.Model):
    """Dedicated fields for sufurias / kitchenware pots: size, material, and more."""
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name="sufuria_spec")
    size = models.CharField(max_length=50, help_text="e.g. '28cm', '5 Litres'")
    material = models.CharField(max_length=100, help_text="e.g. 'Aluminium', 'Stainless Steel'")
    induction_compatible = models.BooleanField(default=False)
    has_lid = models.BooleanField(default=True)

    def __str__(self):
        return f"Sufuria spec for {self.product.name}"


class Review(models.Model):
    """A customer's star rating + comment on a product. Submitting a review
    for a product you've already reviewed updates your existing one instead
    of creating a duplicate - this is how a user 'edits' their review."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reviews")
    rating = models.PositiveSmallIntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("product", "user")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} rated {self.product.name}: {self.rating}/5"
