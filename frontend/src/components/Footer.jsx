import { Instagram, Facebook, Youtube, MapPin, Phone, Mail } from "lucide-react";

// function TikTokIcon({ size = 22 }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
//       <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
//     </svg>
//   );
// }

export default function Footer() {
  return (
    <footer className="hl-footer">
      <div className="container hl-footer-grid">
        <div className="hl-footer-col">
          <h4 className="hl-footer-heading">Hawk Life Solutions</h4>
          <p className="hl-footer-text">
            Quality induction cookers, cookware, and household appliances built for everyday Kenyan homes.
          </p>
          <div className="hl-footer-socials">
            {/* Replace these href values with your real social media page links */}
            <a href="https://www.instagram.com/hawkinduction.254?igsi=MWRpejU0c2ZoaXN0OA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={22} />
            </a>
            <a href="https://www.facebook.com/share/1F44hup4Rz/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={22} />
            </a>
            <a href="https://www.youtube.com/@Hawkinduction.254" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <Youtube size={22} />
            </a>
            {/* <a href="https://www.tiktok.com/@hawkinduction.254?_r=1&_t=ZS-99Gb6aX1KgG" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <TikTokIcon />
            </a> */}
          </div>
        </div>

        <div className="hl-footer-col">
          <h4 className="hl-footer-heading">About</h4>
          <p className="hl-footer-text">
            Hawk Life Solutions is a Kenyan retailer of induction cookers, cookware, and household appliances.
            We're committed to honest prices and quality you can trust.
          </p>
        </div>

        <div className="hl-footer-col">
          <h4 className="hl-footer-heading">Contact</h4>
          <p className="hl-footer-text hl-footer-row"><Phone size={15} /> 0112660355</p>
          <p className="hl-footer-text hl-footer-row"><Mail size={15} /> lifesolutions.hawk@gmail.com</p>
          <p className="hl-footer-text hl-footer-row"><MapPin size={15} /> Nairobi, Kenya</p>
        </div>
      </div>
      <div className="hl-footer-bottom">
        © {new Date().getFullYear()} Hawk Life Solutions. All rights reserved.
      </div>
    </footer>
  );
}