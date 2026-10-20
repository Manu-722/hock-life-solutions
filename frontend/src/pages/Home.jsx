import { useEffect, useState } from "react";
import {
  Search, SlidersHorizontal, PackageSearch, Flame, Soup, Refrigerator, LayoutGrid, ChevronDown,
} from "lucide-react";
import client from "../api/client";
import Slideshow from "../components/Slideshow";
import ProductCard from "../components/ProductCard";
import { useSEO } from "../hooks/useSEO";
import { useJsonLd } from "../hooks/useJsonLd";
import { readCache, writeCache } from "../utils/catalogCache";
import { PHONE_NUMBER, EMAIL, SOCIAL_LINKS, STORE } from "../config/contact";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "../config/site";

// Picks an icon for a category based on its slug. Anything that doesn't
// match gets a generic grid icon, so categories added later still work.
function iconForCategory(slug) {
  if (slug.includes("induction")) return Flame;
  if (slug.includes("cookware") || slug.includes("pan") || slug.includes("sufuria") || slug.includes("kitchen")) return Soup;
  if (slug.includes("household")) return Refrigerator;
  return LayoutGrid;
}

// Business details for Google (shown in search results and on Maps). They
// come from config/contact.js, so keep that file accurate.
const businessSchema = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: SITE_NAME,
  url: SITE_URL,
  image: DEFAULT_OG_IMAGE,
  telephone: PHONE_NUMBER,
  email: EMAIL,
  description:
    "Induction cookers, cookware and household appliances in Nairobi, Kenya. Pay with M-Pesa.",
  address: {
    "@type": "PostalAddress",
    streetAddress: `${STORE.lines[0]}, Ronald Ngala Street`,
    addressLocality: "Nairobi",
    addressCountry: "KE",
  },
  sameAs: Object.values(SOCIAL_LINKS).filter(Boolean),
};

const FAQS = [
  {
    q: "Why choose an induction cooker?",
    a: "An induction cooker heats the pot directly instead of heating a flame or the air around it, so less energy is wasted and your kitchen stays cooler. There is also no open flame, which makes it a safer choice for busy homes.",
  },
  {
    q: "Which cookware works on an induction cooker?",
    a: "Induction cookers need a pot or pan with a magnetic base. Look for the induction compatible label on our cookware pages, or ask us on WhatsApp and we'll help you choose.",
  },
  {
    q: "How do I pay for my order?",
    a: "Add items to your cart, sign in at checkout and place your order. We then show you our M-Pesa Paybill number and an account number. Once we confirm your payment, your order is approved.",
  },
  {
    q: "Where can I see the products in person?",
    a: `Visit our shop at ${STORE.lines.join(", ")}. The map and opening hours are at the bottom of every page.`,
  },
];

export default function Home() {
  useSEO({
    title: "Induction Cookers, Cookware & Household Appliances in Kenya | Hawk Life Solutions",
    description: "Shop quality induction cookers, cookware, and household appliances in Kenya at honest prices. Hawk Life Solutions, trusted by everyday Kenyan homes.",
  });
  useJsonLd("local-business", businessSchema);

  // Start from whatever was saved on the last visit, so returning visitors
  // see the shop immediately instead of a blank "Loading..." screen. Fresh
  // data replaces it as soon as it arrives.
  const [slides, setSlides] = useState(() => readCache("slides") || []);
  const [categories, setCategories] = useState(() => readCache("categories") || []);
  const [products, setProducts] = useState(() => readCache("products:all") || []);
  const [loading, setLoading] = useState(() => !readCache("products:all"));
  const [failed, setFailed] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [onOfferOnly, setOnOfferOnly] = useState(false);

  useEffect(() => {
    client
      .get("/offers/slideshow/")
      .then((res) => {
        setSlides(res.data);
        writeCache("slides", Array.isArray(res.data) ? res.data.filter((s) => s.active) : res.data);
      })
      .catch(() => {});
    client
      .get("/products/categories/")
      .then((res) => {
        setCategories(res.data);
        writeCache("categories", res.data);
      })
      .catch(() => {});
  }, []);

  // "background" means we already have saved products on screen, so we
  // refresh quietly without flashing a loading message.
  const runSearch = async (overrides = {}, background = false) => {
    if (!background) setLoading(true);
    setFailed(false);

    const params = {};
    const cat = overrides.category !== undefined ? overrides.category : category;
    const offerOnly = overrides.onOfferOnly !== undefined ? overrides.onOfferOnly : onOfferOnly;

    if (search) params.search = search;
    if (cat) params.category = cat;
    if (offerOnly) params.is_on_offer = true;

    // Only the plain "all items" view is saved for next time.
    const isDefaultView = Object.keys(params).length === 0;

    try {
      const { data } = await client.get("/products/", { params });
      const list = data.results || data;
      setProducts(list);
      if (isDefaultView) writeCache("products:all", list);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSearch({}, Boolean(readCache("products:all")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectCategory = (slug) => {
    const next = category === slug ? "" : slug;
    setCategory(next);
    runSearch({ category: next });
  };

  const toggleOfferOnly = (e) => {
    const next = e.target.checked;
    setOnOfferOnly(next);
    runSearch({ onOfferOnly: next });
  };

  return (
    <div>
      <div className="hero">
        <h1>Smart Living. <span className="accent">Living Smart.</span></h1>
        <p>Effortless Induction Cookers, Flawless Cookware, and Curated Home Essentials.</p>
      </div>

      {slides.length > 0 ? (
        <Slideshow slides={slides} />
      ) : (
        <div className="slideshow-empty">No current offers. Check back soon!</div>
      )}

      {categories.length > 0 && (
        <div className="category-boxes">
          <button
            className={`category-box ${category === "" ? "active" : ""}`}
            onClick={() => selectCategory("")}
          >
            <LayoutGrid size={26} />
            <span>All items</span>
          </button>
          {categories.map((c) => {
            const Icon = iconForCategory(c.slug);
            return (
              <button
                key={c.id}
                className={`category-box ${category === c.slug ? "active" : ""}`}
                onClick={() => selectCategory(c.slug)}
              >
                <Icon size={26} />
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="searchbar card">
        <div className="field" style={{ flex: 1, minWidth: 220 }}>
          <label><Search size={14} style={{ verticalAlign: "-2px" }} /> Search</label>
          <input
            placeholder="Search cells, cookers, cookware..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") runSearch(); }}
          />
        </div>
        <div className="field" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            id="offer-only-checkbox"
            style={{ width: "auto" }}
            checked={onOfferOnly}
            onChange={toggleOfferOnly}
          />
          <label htmlFor="offer-only-checkbox" style={{ margin: 0, cursor: "pointer" }}>On offer only</label>
        </div>
        <button className="btn" onClick={() => runSearch()}>
          <SlidersHorizontal size={16} style={{ verticalAlign: "-3px", marginRight: 6 }} />
          Search
        </button>
      </div>

      {loading ? (
        <p style={{ color: "var(--hl-gray)" }}>Loading products...</p>
      ) : failed && products.length === 0 ? (
        <div className="empty-state">
          <PackageSearch size={40} />
          <p>We couldn't load the products just now. Please refresh in a moment.</p>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <PackageSearch size={40} />
          <p>{onOfferOnly ? "No items are currently on offer." : "No products match your search."}</p>
        </div>
      ) : (
        <div className="grid">
          {products.map((p, index) => (
            <ProductCard key={p.id} product={p} priority={index < 4} />
          ))}
        </div>
      )}

      <section className="seo-section">
        <h2>Induction cookers, cookware and household appliances in Kenya</h2>
        <p>
          Hawk Life Solutions is a Nairobi shop for energy efficient induction cookers, quality
          cookware, and household appliances such as fridges, microwaves and cutlery. Browse our
          range online, pay with M-Pesa, and visit us at Royal Palm Mall on Ronald Ngala Street.
        </p>
        <div className="faq-list">
          {FAQS.map((item) => (
            <details className="faq-item" key={item.q}>
              <summary>
                {item.q}
                <ChevronDown className="faq-chevron" size={18} />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}