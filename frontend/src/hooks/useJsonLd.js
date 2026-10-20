import { useEffect } from "react";

// Adds structured data (JSON-LD) to the page so Google understands things
// like "this is a shop at this address". Removed again when you leave.
export function useJsonLd(id, data) {
  const json = JSON.stringify(data);
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = `jsonld-${id}`;
    script.text = json;
    document.head.appendChild(script);
    return () => script.remove();
  }, [id, json]);
}