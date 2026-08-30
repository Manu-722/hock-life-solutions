import { Instagram, Facebook, Youtube, MapPin, Phone, Mail } from "lucide-react";

function TikTokIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
    </svg>
  );
}

// TODO: replace with your real phone number (E.164 format for the tel:
// link - country code, no spaces, e.g. +254712345678).
const PHONE_NUMBER = "+254700000000";
const PHONE_DISPLAY = "+254 700 000 000";

export default function Footer() {
  return (
    <footer className="hl-footer">
      <div className="container hl-footer-grid">
        <div className="hl-footer-col">
          <h4 className="hl-footer-heading">Hawk Life Solutions</h4>
          <p className="hl-footer-text">
            Quality cells, induction cookers, cookware, and household appliances — built for everyday Kenyan homes.
          </p>
          <div className="hl-footer-socials">
            {/* Replace these href values with your real social media page links */}
            <a href="https://instagram.com/hawklifesolutions" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={22} />
            </a>
            <a href="https://facebook.com/hawklifesolutions" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={22} />
            </a>
            <a href="https://youtube.com/@hawklifesolutions" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <Youtube size={22} />
            </a>
            <a href="https://tiktok.com/@hawklifesolutions" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <TikTokIcon />
            </a>
          </div>
        </div>

        <div className="hl-footer-col">
          <h4 className="hl-footer-heading">About</h4>
          <p className="hl-footer-text">
            Hawk Life Solutions is a Kenyan retailer of cells, induction cookers, cookware, and household appliances.
            We're committed to honest prices and quality you can trust.
          </p>
        </div>

        <div className="hl-footer-col">
          <h4 className="hl-footer-heading">Contact & payment</h4>
          {/* tel: link - tapping this on a phone opens the dialer directly */}
          <a href={`tel:${PHONE_NUMBER}`} className="hl-footer-text hl-footer-row" style={{ color: "#c7c7cf" }}>
            <Phone size={15} /> {PHONE_DISPLAY}
          </a>
          <a href="mailto:lifesolutions.hawk@gmail.com" className="hl-footer-text hl-footer-row" style={{ color: "#c7c7cf" }}>
            <Mail size={15} /> lifesolutions.hawk@gmail.com
          </a>
          <p className="hl-footer-text hl-footer-row"><MapPin size={15} /> Nairobi, Kenya</p>
        </div>
      </div>
      <div className="hl-footer-bottom">
        © {new Date().getFullYear()} Hawk Life Solutions. All rights reserved.
      </div>
    </footer>
  );
}