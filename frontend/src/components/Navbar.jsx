import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart, User, Settings, LayoutDashboard, LogOut, Menu, X, Phone, Info, RotateCcw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import SocialLinks from "./SocialLinks";
import { WhatsAppIcon } from "./icons";
import { PHONE_NUMBER, PHONE_DISPLAY, whatsappLink } from "../config/contact";

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
    <header className="site-header">
      {/* Top row */}
      <div className="topbar">
        <div className="topbar-inner">
          <div className="topbar-contact">
            <a href={`tel:${PHONE_NUMBER}`} className="topbar-link" aria-label="Call us">
              <Phone size={14} /> <span className="topbar-phone-text">{PHONE_DISPLAY}</span>
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-btn"
              aria-label="Chat with us on WhatsApp"
              title="Chat on WhatsApp"
            >
              <WhatsAppIcon size={15} /> <span>WhatsApp</span>
            </a>
          </div>
          <SocialLinks size={16} className="topbar-socials" />
        </div>
      </div>

      {/* Main navigation row */}
      <div className="navbar">

        {/* ⭐ Logo + Name aligned together */}
        <div className="brand-wrap">
          <img
            src="src/assets/Hawk new.jpeg"
            alt="Hawk Life Solutions"
            className="navbar-logo"
          />

          <Link to="/" className="brand" onClick={closeMenu}>
            Hawk Life Solutions
          </Link>
        </div>

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
              <div className="mobile-auth-buttons">
                <Link to="/login" onClick={closeMenu} className="mobile-login-btn">Login</Link>
                <Link to="/register" onClick={closeMenu} className="mobile-signup-btn">Sign up</Link>
              </div>
            )}

            <div className="mobile-menu-divider" />
            {linkRow(<Info size={18} />, "About us", "/about")}
            {linkRow(<RotateCcw size={18} />, "Return policy", "/return-policy")}
          </div>
        )}
      </div>
    </header>
  );
}
