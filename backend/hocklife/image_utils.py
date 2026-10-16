def cloudinary_variant(url, width):
    """
    Returns a resized copy of a Cloudinary image URL: automatic format
    (WebP or AVIF where the browser supports it), automatic quality, and
    scaled down to at most `width` pixels wide (never scaled up). Big phone
    photos become small files, which is the biggest single fix for slow
    image loading. Any URL that isn't a Cloudinary upload URL, or that
    already has transformations, is returned unchanged.
    """
    if not url or "res.cloudinary.com" not in url or "/upload/" not in url:
        return url
    if "/upload/f_auto" in url or "/upload/w_" in url:
        return url
    return url.replace("/upload/", f"/upload/f_auto,q_auto,w_{width},c_limit/", 1)