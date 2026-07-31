import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    client.get(`/products/${id}/`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="card" style={{ maxWidth: 800, margin: "24px auto", display: "flex", gap: 24, flexWrap: "wrap" }}>
      <img
        src={product.image || "https://placehold.co/500x400?text=Hawk+Life"}
        alt={product.name}
        style={{ width: 320, height: 260, objectFit: "cover", borderRadius: 8 }}
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

        <p className="price" style={{ fontSize: "1.5rem" }}>
          KES {Number(product.display_price).toLocaleString()}
        </p>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} style={{ width: 80 }} />
          <button className="btn" disabled={!product.in_stock} onClick={() => addItem(product, qty)}>
            {product.in_stock ? "Add to cart" : "Out of stock"}
          </button>
        </div>
      </div>
    </div>
  );
}