import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../api/client";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProductReviews from "../components/ProductReviews";

const HOUSEHOLD_LABELS = {
  watts: "Power",
  voltage: "Voltage",
  capacity_litres: "Capacity",
  warranty_months: "Warranty",
  frost_type: "Frost type",
  color: "Color",
  size: "Size",
  pieces: "Pieces in set",
  material: "Material",
  notes: "Details",
};
const HOUSEHOLD_UNITS = { watts: "W", capacity_litres: "L", warranty_months: " months" };

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    client.get(`/products/${id}/`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  const handleAdd = () => {
    if (!user) {
      navigate("/login", { state: { from: "add_to_cart" } });
      return;
    }
    addItem(product, qty);
  };

  const household = product.extra_specs && product.extra_specs.item_type ? product.extra_specs : null;

  return (
    <div>
      <div className="card" style={{ maxWidth: 800, margin: "24px auto", display: "flex", gap: 24, flexWrap: "wrap" }}>
        <img
          src={product.image || "https://placehold.co/500x400?text=Hawk+Life"}
          alt={product.name}
          className="product-detail-img"
        />
        <div style={{ flex: 1, minWidth: 260 }}>
          <div>
            {product.is_on_offer && <span className="badge offer">OFFER</span>}{" "}
            {!product.in_stock && <span className="badge out">OUT OF STOCK</span>}
          </div>
          <h1>{product.name}</h1>
          <p style={{ color: "var(--hl-gray)" }}>{product.category_name}</p>
          <p>{product.description}</p>

          {product.induction_cooker_spec && (
            <ul>
              <li>Power: {product.induction_cooker_spec.watts}W</li>
              <li>Power levels: {product.induction_cooker_spec.power_output_levels}</li>
              <li>Lock system: {product.induction_cooker_spec.channel_lock_system}</li>
              <li>Voltage: {product.induction_cooker_spec.voltage}</li>
              <li>Warranty: {product.induction_cooker_spec.warranty_months} months</li>
            </ul>
          )}

          {product.sufuria_spec && (
            <ul>
              <li>Size: {product.sufuria_spec.size}</li>
              <li>Material: {product.sufuria_spec.material}</li>
              <li>Induction compatible: {product.sufuria_spec.induction_compatible ? "Yes" : "No"}</li>
              <li>Lid included: {product.sufuria_spec.has_lid ? "Yes" : "No"}</li>
            </ul>
          )}

          {household && (
            <ul>
              <li>Type: {household.item_type}</li>
              {Object.entries(household).map(([key, value]) => {
                if (key === "item_type" || !value) return null;
                return (
                  <li key={key}>
                    {HOUSEHOLD_LABELS[key] || key}: {value}{HOUSEHOLD_UNITS[key] || ""}
                  </li>
                );
              })}
            </ul>
          )}

          <p className="price" style={{ fontSize: "1.5rem" }}>
            KES {Number(product.display_price).toLocaleString()}
          </p>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} style={{ width: 80 }} />
            <button className="btn" disabled={!product.in_stock} onClick={handleAdd}>
              {product.in_stock ? (user ? "Add to cart" : "Login to buy") : "Out of stock"}
            </button>
          </div>
        </div>
      </div>

      <ProductReviews productId={product.id} />
    </div>
  );
}