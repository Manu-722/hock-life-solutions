import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Settings, LayoutDashboard, LogOut, Zap, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  const linkRow = (icon, label, to) => (
    <Link to={to} onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {icon} {label}
    </Link>
  );

  return (
    <header className="navbar">
      <Link to="/" className="brand" onClick={closeMenu}>
        <Zap size={20} style={{ verticalAlign: "-4px", marginRight: 6 }} />
        Hawk Life Solutions
      </Link>

      <nav className="nav-desktop">
        <Link to="/cart" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <ShoppingCart size={17} /> Cart {count > 0 && <span className="admin-pill">{count}</span>}
        </Link>

        {user ? (
          <>
            {linkRow(<User size={17} />, "Profile", "/profile")}
            {linkRow(<Settings size={17} />, "Settings", "/settings")}
            {user.is_admin && (
              <>
                <span className="admin-pill">Admin: {user.first_name || user.username}</span>
                {linkRow(<LayoutDashboard size={17} />, "Dashboard", "/admin")}
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

      <div className="nav-mobile-trigger">
        <Link to="/cart" onClick={closeMenu} className="mobile-cart-icon">
          <ShoppingCart size={20} />
          {count > 0 && <span className="cart-count-dot">{count}</span>}
        </Link>
        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          {user ? (
            <>
              {user.is_admin && (
                <span className="admin-pill" style={{ alignSelf: "flex-start" }}>
                  Admin: {user.first_name || user.username}
                </span>
              )}
              {linkRow(<User size={18} />, "Profile", "/profile")}
              {linkRow(<Settings size={18} />, "Settings", "/settings")}
              {user.is_admin && linkRow(<LayoutDashboard size={18} />, "Dashboard", "/admin")}
              <button className="linklike" onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} className="btn secondary" style={{ width: "100%", textAlign: "center", color: "var(--hl-white)", borderColor: "var(--hl-white)" }}>
  Login
</Link>
<Link to="/register" onClick={closeMenu} className="btn" style={{ width: "100%", textAlign: "center" }}>
  Sign up
</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}