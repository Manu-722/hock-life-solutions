import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, PackageSearch } from "lucide-react";
import client from "../api/client";
import Slideshow from "../components/Slideshow";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [slides, setSlides] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onOfferOnly, setOnOfferOnly] = useState(false);

  useEffect(() => {
    client.get("/offers/slideshow/").then((res) => setSlides(res.data));
    client.get("/products/categories/").then((res) => setCategories(res.data));
  }, []);

  const runSearch = async (overrides = {}) => {
    setLoading(true);
    const params = {};
    const cat = overrides.category !== undefined ? overrides.category : category;
    if (search) params.search = search;
    if (cat) params.category = cat;
    if (minPrice) params.min_price = minPrice;
    if (maxPrice) params.max_price = maxPrice;
    if (onOfferOnly) params.is_on_offer = true;
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

  return (
    <div>
      <div className="hero">
        <h1>Power your home with <span className="accent">Hawk Life Solutions</span></h1>
        <p>Reliable cells, induction cookers, and kitchenware — trusted quality, honest prices.</p>
      </div>

      {slides.length > 0 ? (
        <Slideshow slides={slides} />
      ) : (
        <div className="slideshow-empty">No current offers — check back soon!</div>
      )}

      {categories.length > 0 && (
        <div className="category-chips">
          {categories.map((c) => (
            <button
              key={c.id}
              className={`chip ${category === c.slug ? "active" : ""}`}
              onClick={() => selectCategory(c.slug)}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <div className="searchbar card">
        <div className="field">
          <label><Search size={14} style={{ verticalAlign: "-2px" }} /> Search</label>
          <input placeholder="Search cells, cookers, sufurias..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="field">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Min price</label>
          <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        </div>
        <div className="field">
          <label>Max price</label>
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>
        <div className="field" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" style={{ width: "auto" }} checked={onOfferOnly} onChange={(e) => setOnOfferOnly(e.target.checked)} />
          <label style={{ margin: 0 }}>On offer only</label>
        </div>
        <button className="btn" onClick={() => runSearch()}>
          <SlidersHorizontal size={16} style={{ verticalAlign: "-3px", marginRight: 6 }} />
          Filter
        </button>
      </div>

      {loading ? (
        <p style={{ color: "var(--hl-gray)" }}>Loading products...</p>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <PackageSearch size={40} />
          <p>No products match your search.</p>
        </div>
      ) : (
        <div className="grid">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}