import { useEffect, useState } from "react";
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

  const runSearch = async () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
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

  return (
    <div>
      <Slideshow slides={slides} />

      <div className="searchbar card">
        <div className="field">
          <label>Search</label>
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
        <button className="btn" onClick={runSearch}>Filter</button>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products match your search.</p>
      ) : (
        <div className="grid">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
