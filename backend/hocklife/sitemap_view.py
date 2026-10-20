from django.conf import settings
from django.http import HttpResponse

from products.models import Product


def sitemap_view(request):
    """
    Generates sitemap.xml listing the homepage, the information pages, and
    every in-stock product, all using the FRONTEND's real domain (not this
    API server). Set FRONTEND_PUBLIC_URL to https://www.hawklife.co.ke so
    these match the address Google treats as canonical.
    """
    base = settings.FRONTEND_PUBLIC_URL.rstrip("/")
    urls = [
        f"{base}/",
        f"{base}/about",
        f"{base}/return-policy",
        f"{base}/terms",
        f"{base}/privacy",
        f"{base}/cookies",
    ]

    for product in Product.objects.filter(in_stock=True).only("id"):
        urls.append(f"{base}/product/{product.id}")

    xml_parts = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml_parts.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    for url in urls:
        xml_parts.append(f"<url><loc>{url}</loc></url>")
    xml_parts.append("</urlset>")

    return HttpResponse("".join(xml_parts), content_type="application/xml")