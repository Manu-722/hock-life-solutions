import { useEffect } from "react";

/**
 * Sets this page's <title> and meta description dynamically. Since this is
 * a single-page React app, every route otherwise shares the same static
 * title from index.html - this hook lets each page (Home, product pages,
 * etc.) have its own accurate, keyword-relevant title and description,
 * which matters for how Google displays and ranks each page individually.
 */
export function useSEO({ title, description }) {
  useEffect(() => {
    if (title) document.title = title;

    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", description);
    }
  }, [title, description]);
}