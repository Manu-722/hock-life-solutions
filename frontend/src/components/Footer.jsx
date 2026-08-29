import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h4 className="footer-heading">Hawk Life Solutions</h4>
          <p style={{ color: "var(--hl-gray)", maxWidth: 320, margin: 0 }}>
            Quality induction cookers, cookware, and household appliances built for everyday Kenyan homes.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
            {/* Replace these href values with your real social media page links */}
            <a href="https://instagram.com/hawklifesolutions" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: "var(--hl-gray)" }}>
              <Instagram size={22} />
            </a>
            <a href="https://facebook.com/hawklifesolutions" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: "var(--hl-gray)" }}>
              <Facebook size={22} />
            </a>
            <a href="https://www.tiktok.com/@hawkinduction.254?_r=1&_t=ZS-99HLF1jyF7M" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ color: "var(--hl-gray)" }}>
              <TikTok size={22} />
            </a>
            <a href="https://youtube.com/@hawklifesolutions" target="_blank" rel="noopener noreferrer" aria-label="YouTube" style={{ color: "var(--hl-gray)" }}>
              <Youtube size={22} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="footer-heading">About</h4>
          <p style={{ color: "var(--hl-gray)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
            Hawk Life Solutions is a Kenyan retailer of induction cookers, cookware, and household appliances.
            We're committed to honest prices and quality you can trust.
          </p>
        </div>

        <div>
          <h4 className="footer-heading">Contact</h4>
          <p style={{ color: "var(--hl-gray)", display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Phone size={15} /> 0112660355
          </p>
          <p style={{ color: "var(--hl-gray)", display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Mail size={15} /> lifesolutions.hawk@gmail.com
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