import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    // Anyone can browse and view products, but adding to cart requires an
    // account - send an anonymous visitor straight to the login page.
    if (!user) {
      navigate("/login", { state: { from: "add_to_cart" } });
      return;
    }
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="card product-card">
      {/* Badges float over the image corners instead of taking up their
          own row - so cards with/without an offer badge stay the same
          height and every "Add to cart" button lines up across the grid. */}
      <div className="product-image-wrap">
        <Link to={`/product/${product.id}`}>
          <img src={product.image || "https://placehold.co/400x300?text=Hawk+Life"} alt={product.name} />
        </Link>
        {product.is_on_offer && <span className="badge offer badge-corner-left">OFFER</span>}
        {!product.in_stock && <span className="badge out badge-corner-right">OUT OF STOCK</span>}
      </div>

      <div className="product-card-body">
        <h3><Link to={`/product/${product.id}`}>{product.name}</Link></h3>
        <p style={{ color: "var(--hl-gray)", fontSize: "0.85rem" }}>{product.category_name}</p>
        <p>
          {product.is_on_offer && product.offer_price && (
            <span className="old-price">KES {Number(product.price).toLocaleString()}</span>
          )}
          <span className="price">KES {Number(product.display_price).toLocaleString()}</span>
        </p>
        <button className="btn" disabled={!product.in_stock} onClick={handleAdd}>
          {added ? (
            <><Check size={16} style={{ verticalAlign: "-3px", marginRight: 6 }} /> Added!</>
          ) : product.in_stock ? (
            <><ShoppingCart size={16} style={{ verticalAlign: "-3px", marginRight: 6 }} /> {user ? "Add to cart" : "Login to buy"}</>
          ) : "Unavailable"}
        </button>
      </div>
    </div>
  );
}
