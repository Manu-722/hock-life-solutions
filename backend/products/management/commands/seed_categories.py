from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify

from products.models import Category, Product

# The categories Hawk Life Solutions sells. "All items" isn't a database
# category - it's just the no-filter state on the homepage. Fridges,
# Microwaves, Cutlery etc. are all "Household Items", told apart by the
# item_type field inside extra_specs (see AdminProducts.jsx).
CATEGORIES = [
    "Induction Cookers",
    "Cookware",
    "Household Items",
]

# Old categories that were merged into "Cookware". Order matters: the first
# one that exists is renamed to Cookware if Cookware doesn't exist yet.
LEGACY_COOKWARE_SLUGS = ["sufuria-set", "sufuria", "non-stick-pans", "non-stick-pan"]


class Command(BaseCommand):
    help = (
        "Creates the standard Hawk Life Solutions categories and merges the old "
        "'Non-stick Pans' and 'Sufuria Set' categories into 'Cookware'. "
        "Safe to run more than once - products are never deleted."
    )

    @transaction.atomic
    def handle(self, *args, **options):
        cookware = self._ensure_cookware()
        self._merge_legacy_into(cookware)

        for name in CATEGORIES:
            slug = slugify(name)
            category, created = Category.objects.get_or_create(slug=slug, defaults={"name": name})
            verb = "Created" if created else "Already exists"
            self.stdout.write(self.style.SUCCESS(f"{verb}: {category.name} ({category.slug})"))

    def _ensure_cookware(self):
        cookware = Category.objects.filter(slug="cookware").first()
        if cookware:
            return cookware

        # No Cookware yet: promote the first old category we find by renaming
        # it, so its products come along automatically.
        for slug in LEGACY_COOKWARE_SLUGS:
            legacy = Category.objects.filter(slug=slug).first()
            if legacy:
                old_name = legacy.name
                legacy.name = "Cookware"
                legacy.slug = "cookware"
                legacy.save()
                self.stdout.write(self.style.SUCCESS(f"Renamed '{old_name}' to 'Cookware'"))
                return legacy

        cookware = Category.objects.create(name="Cookware", slug="cookware")
        self.stdout.write(self.style.SUCCESS("Created: Cookware (cookware)"))
        return cookware

    def _merge_legacy_into(self, cookware):
        for slug in LEGACY_COOKWARE_SLUGS:
            for legacy in Category.objects.filter(slug=slug).exclude(pk=cookware.pk):
                # Move the products FIRST - deleting a category would
                # otherwise delete every product inside it.
                moved = Product.objects.filter(category=legacy).update(category=cookware)
                legacy_name = legacy.name
                legacy.delete()
                self.stdout.write(self.style.SUCCESS(
                    f"Merged '{legacy_name}' into Cookware ({moved} product(s) moved, old category removed)"
                ))