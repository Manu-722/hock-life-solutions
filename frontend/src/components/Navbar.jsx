import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Settings, LayoutDashboard, LogOut, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <Zap size={20} style={{ verticalAlign: "-4px", marginRight: 6 }} />
        Hawk Life Solutions
      </Link>
      <nav>
        <Link to="/cart" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <ShoppingCart size={17} /> Cart {count > 0 && <span className="admin-pill">{count}</span>}
        </Link>

        {user ? (
          <>
            <Link to="/profile" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <User size={17} /> Profile
            </Link>
            <Link to="/settings" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Settings size={17} /> Settings
            </Link>

            {/* Only ever renders when the backend confirms this account's
                role is ADMIN - normal customers never see this link. */}
            {user.is_admin && (
              <>
                <span className="admin-pill">Admin: {user.first_name || user.username}</span>
                <Link to="/admin" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <LayoutDashboard size={17} /> Dashboard
                </Link>
              </>
            )}

            <button className="linklike" onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <LogOut size={17} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn" style={{ padding: "8px 16px" }}>Sign up</Link>
          </>
        )}
      </nav>
    </header>
  );
}