from django.core.management.base import BaseCommand
from django.utils.text import slugify

from products.models import Category

# Exactly three real categories. "All items" is not a database category -
# it's just the default/no-filter state on the homepage. Fridges,
# Microwaves, Cutlery etc. are NOT separate categories - they're all
# Household Items, distinguished by the "item_type" field within
# extra_specs (see AdminProducts.jsx).
CATEGORIES = [
    "Induction Cookers",
    "Cookware",
    "Household Items",
]


class Command(BaseCommand):
    help = "Creates the standard Hawk Life Solutions product categories if they don't already exist."

    def handle(self, *args, **options):
        for name in CATEGORIES:
            slug = slugify(name)
            category, created = Category.objects.get_or_create(slug=slug, defaults={"name": name})
            verb = "Created" if created else "Already exists"
            self.stdout.write(self.style.SUCCESS(f"{verb}: {category.name} ({category.slug})"))