import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, PackageSearch, Flame, UtensilsCrossed, Soup, Refrigerator, LayoutGrid } from "lucide-react";
import client from "../api/client";
import Slideshow from "../components/Slideshow";
import ProductCard from "../components/ProductCard";
import { useSEO } from "../hooks/useSEO";

// Picks an icon for a category based on its slug. Named distinctly from
// the page component itself (which is also called "Home") to avoid any
// naming collision.
function iconForCategory(slug) {
  if (slug.includes("induction")) return Flame;
  if (slug.includes("cookware") || slug.includes("pan") || slug.includes("sufuria") || slug.includes("kitchen")) return Soup;
  if (slug.includes("household")) return Refrigerator;
  return LayoutGrid;
}

export default function Home() {
  useSEO({
    title: "Induction Cookers, Cookware & Household Appliances in Kenya | Hawk Life Solutions",
    description: "Shop quality induction cookers, cookware, and household appliances in Kenya at honest prices. Hawk Life Solutions - trusted by everyday Kenyan homes.",
  });

  const [slides, setSlides] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [onOfferOnly, setOnOfferOnly] = useState(false);

  useEffect(() => {
    client.get("/offers/slideshow/").then((res) => setSlides(res.data));
    client.get("/products/categories/").then((res) => setCategories(res.data));
  }, []);

  const runSearch = async (overrides = {}) => {
    setLoading(true);
    const params = {};
    const cat = overrides.category !== undefined ? overrides.category : category;
    const offerOnly = overrides.onOfferOnly !== undefined ? overrides.onOfferOnly : onOfferOnly;

    if (search) params.search = search;
    if (cat) params.category = cat;
    if (offerOnly) params.is_on_offer = true;

    const { data } = await client.get("/products/", { params });
    setProducts(data.results || data);
    setLoading(false);
  };

  useEffect(() => {
    runSearch();
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
        <h1>Power your home with <span className="accent">Hawk Life Solutions</span></h1>
        <p>Reliable cells, induction cookers, cookware, and household appliances — trusted quality, honest prices.</p>
      </div>

      {slides.length > 0 ? (
        <Slideshow slides={slides} />
      ) : (
        <div className="slideshow-empty">No current offers — check back soon!</div>
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
      ) : products.length === 0 ? (
        <div className="empty-state">
          <PackageSearch size={40} />
          <p>{onOfferOnly ? "No items are currently on offer." : "No products match your search."}</p>
        </div>
      ) : (
        <div className="grid">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}