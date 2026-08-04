import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const placeOrder = async () => {
    setError("");
    setPlacing(true);
    try {
      const payload = { items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })) };
      const { data } = await client.post("/orders/", payload);
      setResult(data);
      clearCart();
    } catch {
      setError("Could not place your order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (result) {
    return (
      <div className="card checkout-success">
        <div className="success-badge">✓</div>
        <h2>Order placed!</h2>
        <p style={{ color: "var(--hl-gray)" }}>{result.message}</p>

        <div className="payment-box">
          <div className="payment-row">
            <span>Paybill Number</span>
            <strong>{result.paybill_number}</strong>
          </div>
          <div className="payment-row">
            <span>Account Number</span>
            <strong>{result.account_number}</strong>
          </div>
          <div className="payment-row">
            <span>Amount</span>
            <strong className="price">KES {Number(result.total_amount).toLocaleString()}</strong>
          </div>
        </div>

        <p className="status-pending" style={{ textAlign: "center", fontSize: "1.05rem" }}>
          Status: Pending admin approval
        </p>
        <p style={{ color: "var(--hl-gray)", textAlign: "center" }}>
          Once we confirm your payment, your order will show as <strong>Approved</strong> in your Profile order history.
        </p>
        <button className="btn" style={{ width: "100%" }} onClick={() => navigate("/profile")}>Go to my orders</button>
      </div>
    );
  }

  return (
    <div className="card checkout-card">
      <h2>Checkout</h2>
      {error && <p className="status-rejected">{error}</p>}
      <table>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td>{i.name} <span style={{ color: "var(--hl-gray)" }}>x{i.quantity}</span></td>
              <td style={{ textAlign: "right" }}>KES {(i.price * i.quantity).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 style={{ textAlign: "right", marginTop: 14 }}>
        Total: <span className="price">KES {total.toLocaleString()}</span>
      </h3>
      <p style={{ color: "var(--hl-gray)" }}>
        After placing your order, you'll be given Hawk Life Solutions' M-Pesa Paybill and
        account number to pay. Your order stays "Pending" until an admin confirms your
        payment and approves it.
      </p>
      <button className="btn" style={{ width: "100%" }} disabled={placing} onClick={placeOrder}>
        {placing ? "Placing order..." : "Place order"}
      </button>
    </div>
  );
}
