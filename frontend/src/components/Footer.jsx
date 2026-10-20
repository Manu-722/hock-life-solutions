import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Navigation, ExternalLink, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useConsent } from "../hooks/useConsent";
import { clearConsent } from "../utils/consent";
import { WhatsAppIcon } from "./icons";
import {
  PHONE_NUMBER, PHONE_DISPLAY, EMAIL, BUSINESS_HOURS, STORE,
  whatsappLink, mapsEmbedUrl, mapsOpenUrl, mapsDirectionsUrl,
} from "../config/contact";

export default function Footer() {
  const { user } = useAuth();
  const consent = useConsent();
  const [mapRequested, setMapRequested] = useState(false);

  // The Google Map can set Google cookies, so it only loads if the visitor
  // accepted all cookies, or pressed "Load map" for this visit.
  const showMap = consent === "all" || mapRequested;

  return (
    <footer className="hl-footer">
      <div className="container hl-footer-grid">
        {/* Return policy */}
        <div className="hl-footer-col">
          <h4 className="hl-footer-heading">Return policy</h4>
          <p className="hl-footer-text">
            Item faulty or damaged? Tell us within 24 hours of delivery or pick-up and we'll replace,
            repair or refund it, depending on the issue.
          </p>
          <Link to="/return-policy" className="hl-footer-link hl-footer-link-accent hl-footer-arrow">
            Read the full policy <ArrowRight size={15} />
          </Link>
        </div>

        {/* Quick links */}
        <div className="hl-footer-col">
          <h4 className="hl-footer-heading">Quick links</h4>
          <Link to="/" className="hl-footer-link">Shop</Link>
          <Link to="/about" className="hl-footer-link">About us</Link>
          <Link to="/cart" className="hl-footer-link">Cart</Link>
          {user ? (
            <Link to="/profile" className="hl-footer-link">My account</Link>
          ) : (
            <>
              <Link to="/login" className="hl-footer-link">Login</Link>
              <Link to="/register" className="hl-footer-link">Create account</Link>
            </>
          )}
        </div>

        {/* Business hours + contact */}
        <div className="hl-footer-col">
          <h4 className="hl-footer-heading">Business hours</h4>
          <ul className="hl-hours">
            {BUSINESS_HOURS.map((h) => (
              <li key={h.days}>
                <span>{h.days}</span>
                <strong>{h.hours}</strong>
              </li>
            ))}
          </ul>

          <a href={`tel:${PHONE_NUMBER}`} className="hl-footer-text hl-footer-row" style={{ color: "#c7c7cf" }}>
            <Phone size={15} /> {PHONE_DISPLAY}
          </a>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hl-footer-text hl-footer-row" style={{ color: "#c7c7cf" }}>
            <WhatsAppIcon size={15} /> Chat on WhatsApp
          </a>
          <a href={`mailto:${EMAIL}`} className="hl-footer-text hl-footer-row" style={{ color: "#c7c7cf" }}>
            <Mail size={15} /> {EMAIL}
          </a>
        </div>

        {/* Where to find us */}
        <div className="hl-footer-col">
          <h4 className="hl-footer-heading">Where to find us</h4>
          <div className="hl-footer-text hl-footer-row hl-footer-address">
            <MapPin size={15} style={{ flexShrink: 0, marginTop: 3 }} />
            <span>
              {STORE.lines.map((line) => (
                <span key={line} style={{ display: "block" }}>{line}</span>
              ))}
            </span>
          </div>

          <div className="hl-map-wrap">
            {showMap ? (
              <iframe
                title="Hawk Life Solutions location on Google Maps"
                src={mapsEmbedUrl()}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <div className="hl-map-placeholder">
                <p>The map is provided by Google, which may set cookies. Load it only if you're happy with that.</p>
                <button type="button" className="hl-map-btn primary" onClick={() => setMapRequested(true)}>
                  Load map
                </button>
              </div>
            )}
          </div>

          <div className="hl-map-actions">
            <a href={mapsDirectionsUrl()} target="_blank" rel="noopener noreferrer" className="hl-map-btn primary">
              <Navigation size={15} /> Get directions
            </a>
            <a href={mapsOpenUrl()} target="_blank" rel="noopener noreferrer" className="hl-map-btn ghost">
              <ExternalLink size={14} /> Open in Maps
            </a>
          </div>
        </div>
      </div>

      <div className="hl-footer-bottom">
        <div className="hl-footer-legal">
          <Link to="/terms">Terms &amp; Conditions</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/cookies">Cookie Policy</Link>
          <Link to="/return-policy">Return policy</Link>
          <button type="button" className="hl-footer-linkbtn" onClick={clearConsent}>Cookie settings</button>
        </div>
        © {new Date().getFullYear()} Hawk Life Solutions Limited. All rights reserved.
      </div>
    </footer>
  );
}