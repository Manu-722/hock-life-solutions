import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div>
        <h2>Your cart</h2>
        <p>Your cart is empty. <Link to="/">Continue shopping</Link>.</p>
      </div>
    );
  }

  const goToCheckout = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div>
      <h2>Your cart</h2>
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
                  onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                />
              </td>
              <td>KES {(item.price * item.quantity).toLocaleString()}</td>
              <td><button className="btn danger" onClick={() => removeItem(item.id)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 style={{ textAlign: "right", marginTop: 20 }}>Total: <span className="price">KES {total.toLocaleString()}</span></h3>
      <div style={{ textAlign: "right" }}>
        <button className="btn" onClick={goToCheckout}>Checkout</button>
      </div>
    </div>
  );
}
