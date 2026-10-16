import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

// Two kinds of cart storage:
//  - a GUEST cart, for visitors who haven't signed in yet
//  - a per-account cart, keyed by user id, for signed-in users
// When a guest signs in, their guest cart is merged into their account
// cart (so nothing they added is lost) and the guest cart is cleared.
const GUEST_KEY = "hocklife_cart:guest";
const keyFor = (userId) => `hocklife_cart:${userId}`;

function readCart(key) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function mergeCarts(base, extra) {
  const merged = base.map((i) => ({ ...i }));
  for (const item of extra) {
    const existing = merged.find((i) => i.id === item.id);
    if (existing) existing.quantity += item.quantity;
    else merged.push({ ...item });
  }
  return merged;
}

export function CartProvider({ children }) {
  const { user, loading } = useAuth();
  const [items, setItems] = useState(() => readCart(GUEST_KEY));
  const [readyKey, setReadyKey] = useState(null);

  const userId = user?.id ?? null;
  const activeKey = userId ? keyFor(userId) : GUEST_KEY;

  // Whenever who is "active" changes (page load, login, logout), load the
  // right cart. We wait until auth has finished loading, so we know
  // whether someone is signed in before deciding which cart to show.
  useEffect(() => {
    if (loading) return;

    if (userId) {
      const guest = readCart(GUEST_KEY);
      const own = readCart(keyFor(userId));
      if (guest.length > 0) {
        const merged = mergeCarts(own, guest);
        localStorage.setItem(keyFor(userId), JSON.stringify(merged));
        localStorage.removeItem(GUEST_KEY);
        setItems(merged);
      } else {
        setItems(own);
      }
    } else {
      setItems(readCart(GUEST_KEY));
    }
    setReadyKey(activeKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, loading]);

  // Persist changes - but only once the cart for the current owner has
  // been loaded, so we never write one person's items into another's slot.
  useEffect(() => {
    if (loading || readyKey !== activeKey) return;
    localStorage.setItem(activeKey, JSON.stringify(items));
  }, [items, activeKey, readyKey, loading]);

  const ready = !loading && readyKey === activeKey;

  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [
        ...prev,
        { id: product.id, name: product.name, price: Number(product.display_price), image: product.image, quantity },
      ];
    });
  };

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) return removeItem(id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, total, count, ready }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);