import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "../context/CartContext";

// "priority" is true for the first few cards on the page: their images load
// straight away. The rest load only as you scroll near them.
export default function ProductCard({ product, priority = false }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  // Anyone can add to cart, signed in or not. Sign-in is only required
  // later, at checkout.
  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  // Cards use the small 480px copy of the image, not the full size one.
  const imageSrc = product.image_thumb || product.image || "https://placehold.co/400x300?text=Hawk+Life";

  return (
    <div className="card product-card">
      <div className="product-image-wrap">
        <Link to={`/product/${product.id}`}>
          <img
            src={imageSrc}
            alt={product.name}
            loading={priority ? "eager" : "lazy"}
            fetchpriority={priority ? "high" : undefined}
            decoding="async"
          />
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
      </div>

      <button className="btn" disabled={!product.in_stock} onClick={handleAdd}>
        {added ? (
          <><Check size={16} style={{ verticalAlign: "-3px", marginRight: 6 }} /> Added!</>
        ) : product.in_stock ? (
          <><ShoppingCart size={16} style={{ verticalAlign: "-3px", marginRight: 6 }} /> Add to cart</>
        ) : "Unavailable"}
      </button>
    </div>
  );
}