import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const { items, updateQuantity, removeItem, total, ready } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!ready) {
    return <p style={{ color: "var(--hl-gray)" }}>Loading your cart...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <ShoppingBag size={44} />
        <p>Your cart is empty.</p>
        <Link to="/" className="btn">Continue shopping</Link>
      </div>
    );
  }

  // Sign-in is only needed here, at checkout. Guests are sent to login and
  // brought straight back to checkout afterwards, with their cart intact.
  const goToCheckout = () => {
    if (!user) {
      toast.info("Please sign in to complete your order. Your cart will be waiting for you.");
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    navigate("/checkout");
  };

  return (
    <div>
      <h2>Your cart</h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr><th>Item</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>KES {item.price.toLocaleString()}</td>
                <td>
                  <input
                    type="number" min={1} value={item.quantity} style={{ width: 70 }}
                    onChange={(e) => {
                      const q = parseInt(e.target.value, 10);
                      if (!Number.isNaN(q)) updateQuantity(item.id, q);
                    }}
                  />
                </td>
                <td>KES {(item.price * item.quantity).toLocaleString()}</td>
                <td><button className="btn danger" onClick={() => removeItem(item.id)}><Trash2 size={15} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 style={{ textAlign: "right", marginTop: 20 }}>Total: <span className="price">KES {total.toLocaleString()}</span></h3>
      {!user && (
        <p style={{ textAlign: "right", color: "var(--hl-gray)", fontSize: "0.9rem", margin: "0 0 12px" }}>
          You'll be asked to sign in or create an account at checkout.
        </p>
      )}
      <div style={{ textAlign: "right" }}>
        <button className="btn" onClick={goToCheckout}>
          {user ? "Checkout" : "Sign in to checkout"}
        </button>
      </div>
    </div>
  );
}