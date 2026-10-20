import { Link } from "react-router-dom";
import { setConsent } from "../utils/consent";
import { useConsent } from "../hooks/useConsent";

export default function CookieBanner() {
  const consent = useConsent();
  if (consent) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie notice">
      <div className="cookie-text">
        <strong>Cookies and browser storage</strong>
        <p>
          We use essential storage to keep you signed in, remember your cart and load pages faster.
          With your OK we also load Google Maps, which may set Google cookies. We do not use
          advertising or tracking cookies. <Link to="/cookies">Read our cookie policy</Link>.
        </p>
      </div>
      <div className="cookie-actions">
        <button type="button" className="cookie-btn" onClick={() => setConsent("essential")}>
          Essential only
        </button>
        <button type="button" className="cookie-btn accept" onClick={() => setConsent("all")}>
          Accept all
        </button>
      </div>
    </div>
  );
}