import { useEffect } from "react";
import { SITE_URL, SITE_NAME } from "../config/site";

function setMeta(attr, key, content) {
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setCanonical(href) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

/**
 * Sets this page's title, description, canonical address and social
 * preview tags. The canonical address tells Google which exact URL is the
 * "real" one for each page, so the www and non-www versions never compete
 * with each other.
 */
export function useSEO({ title, description, noindex = false } = {}) {
  useEffect(() => {
    const path = window.location.pathname.replace(/\/+$/, "") || "/";
    const url = `${SITE_URL}${path}`;

    if (title) {
      document.title = title;
      setMeta("property", "og:title", title);
      setMeta("name", "twitter:title", title);
    }
    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
      setMeta("name", "twitter:description", description);
    }
    setMeta("property", "og:url", url);
    setMeta("property", "og:site_name", SITE_NAME);
    setCanonical(url);

    const robots = document.querySelector('meta[name="robots"]');
    if (noindex) {
      setMeta("name", "robots", "noindex, nofollow");
    } else if (robots) {
      robots.remove();
    }
  }, [title, description, noindex]);
}