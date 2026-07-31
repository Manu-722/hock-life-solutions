import { Link } from "react-router-dom";
import { Zap, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="brand" style={{ fontSize: "1.2rem" }}>
            <Zap size={18} style={{ verticalAlign: "-3px", marginRight: 6 }} />
            Hawk Life Solutions
          </div>
          <p style={{ color: "var(--hl-gray)", maxWidth: 320, marginTop: 10 }}>
            Quality cells, induction cookers, and kitchenware — built for everyday Kenyan homes.
          </p>
        </div>

        <div>
          <h4 style={{ color: "var(--hl-amber)", marginBottom: 12, fontSize: "0.95rem" }}>Shop</h4>
          <Link to="/" style={{ display: "block", marginBottom: 8, color: "var(--hl-gray)" }}>All products</Link>
          <Link to="/cart" style={{ display: "block", marginBottom: 8, color: "var(--hl-gray)" }}>Your cart</Link>
          <Link to="/profile" style={{ display: "block", color: "var(--hl-gray)" }}>Order history</Link>
        </div>

        <div>
          <h4 style={{ color: "var(--hl-amber)", marginBottom: 12, fontSize: "0.95rem" }}>Contact & payment</h4>
          <p style={{ color: "var(--hl-gray)", display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Phone size={15} /> Available at checkout
          </p>
          <p style={{ color: "var(--hl-gray)", display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Mail size={15} /> support@hawklife.com
          </p>
          <p style={{ color: "var(--hl-gray)", display: "flex", alignItems: "center", gap: 8 }}>
            <MapPin size={15} /> Nairobi, Kenya
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} Hawk Life Solutions. All rights reserved.
      </div>
    </footer>
  );
}