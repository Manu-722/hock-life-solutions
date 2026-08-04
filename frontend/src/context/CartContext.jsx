import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

// Cart is stored per-user (keyed by their account id), not as one shared
// browser-wide cart. That way, logging in with a specific account always
// shows that account's own saved cart - even after logging out and back in
// later, or if a different person logs into the same browser.
const keyFor = (userId) => `hocklife_cart:${userId}`;

function loadCartFor(userId) {
  if (!userId) return [];
  try {
    const saved = localStorage.getItem(keyFor(userId));
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  // Whenever who's logged in changes (login, logout, or switching
  // accounts), load that specific account's saved cart instead of
  // whatever was showing before.
  useEffect(() => {
    setItems(loadCartFor(user?.id));
  }, [user?.id]);

  // Persist every change to the currently logged-in user's own cart slot.
  useEffect(() => {
    if (!user?.id) return;
    localStorage.setItem(keyFor(user.id), JSON.stringify(items));
  }, [items, user?.id]);

  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, { id: product.id, name: product.name, price: Number(product.display_price), image: product.image, quantity }];
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) return removeItem(id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const clearCart = () => {
    setItems([]);
    if (user?.id) localStorage.removeItem(keyFor(user.id));
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
