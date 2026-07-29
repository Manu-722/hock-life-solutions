import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const placeOrder = async () => {
    setError("");
    try {
      const payload = { items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })) };
      const { data } = await client.post("/orders/", payload);
      setResult(data);
      clearCart();
    } catch {
      setError("Could not place your order. Please try again.");
    }
  };

  if (result) {
    return (
      <div className="card" style={{ maxWidth: 560, margin: "40px auto" }}>
        <h2>Order placed!</h2>
        <p>{result.message}</p>
        <p style={{ fontSize: "1.4rem" }}>
          Till/Paybill Number: <span className="price">{result.till_number}</span>
        </p>
        <p>Order total: <strong>KES {Number(result.total_amount).toLocaleString()}</strong></p>
        <p className="status-pending">Status: Pending admin approval</p>
        <p style={{ color: "var(--hl-gray)" }}>
          Once we confirm your payment, your order will show as <strong>Approved</strong> in your Profile order history.
        </p>
        <button className="btn" onClick={() => navigate("/profile")}>Go to my orders</button>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: 560, margin: "40px auto" }}>
      <h2>Checkout</h2>
      {error && <p className="status-rejected">{error}</p>}
      <table>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td>{i.name} x{i.quantity}</td>
              <td>KES {(i.price * i.quantity).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 style={{ textAlign: "right" }}>Total: KES {total.toLocaleString()}</h3>
      <p style={{ color: "var(--hl-gray)" }}>
        After placing your order, you'll be given Hock Life Solutions' Till/Paybill number to pay.
        Your order stays "Pending" until an admin confirms your payment and approves it.
      </p>
      <button className="btn" style={{ width: "100%" }} onClick={placeOrder}>Place order</button>
    </div>
  );
}
