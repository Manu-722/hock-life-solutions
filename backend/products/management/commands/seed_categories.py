from django.core.management.base import BaseCommand
from django.utils.text import slugify

from products.models import Category

# The categories Hawk Life Solutions actually sells. Slugs matter: the
# admin dashboard's product form shows extra spec fields (watts/power for
# induction cookers, size/material for pans and sufurias) based on whether
# the category slug contains "induction", "sufuria", or "pan".
CATEGORIES = [
    "Induction Cookers",
    "Non-stick Pans",
    "Sufuria Set",
]


class Command(BaseCommand):
    help = "Creates the standard Hawk Life Solutions product categories if they don't already exist."

    def handle(self, *args, **options):
        for name in CATEGORIES:
            slug = slugify(name)
            category, created = Category.objects.get_or_create(slug=slug, defaults={"name": name})
            verb = "Created" if created else "Already exists"
            self.stdout.write(self.style.SUCCESS(f"{verb}: {category.name} ({category.slug})"))