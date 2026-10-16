from django.conf import settings
from django.http import HttpResponse

from products.models import Product


def sitemap_view(request):
    """
    Generates sitemap.xml listing the homepage, the About and Return Policy
    pages, and every in-stock product - all using the FRONTEND's real
    domain (not this API server). URLs must exactly match the real route
    format used in the React app (no trailing slash on inner pages).
    """
    base = settings.FRONTEND_PUBLIC_URL.rstrip("/")
    urls = [f"{base}/", f"{base}/about", f"{base}/return-policy"]

    for product in Product.objects.filter(in_stock=True).only("id"):
        urls.append(f"{base}/product/{product.id}")

    xml_parts = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml_parts.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    for url in urls:
        xml_parts.append(f"<url><loc>{url}</loc></url>")
    xml_parts.append("</urlset>")

    return HttpResponse("".join(xml_parts), content_type="application/xml")