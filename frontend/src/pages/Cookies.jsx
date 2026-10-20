import { Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import { useConsent } from "../hooks/useConsent";
import { setConsent, clearConsent } from "../utils/consent";
import { EMAIL, PHONE_NUMBER, PHONE_DISPLAY } from "../config/contact";

// DRAFT POLICY: written around how the website works today. Have it
// reviewed by a Kenyan lawyer, and update it if you add analytics,
// advertising or new third party tools.
const LAST_UPDATED = "October 2026";

const ROWS = [
  {
    item: "Login session",
    does: "Keeps you signed in as you move around the shop.",
    where: "Browser local storage",
    lasts: "Until you log out, or the login expires (up to 7 days)",
    kind: "Essential",
  },
  {
    item: "Shopping cart",
    does: "Remembers the items you added, even before you sign in.",
    where: "Browser local storage",
    lasts: "Until you place the order or clear it",
    kind: "Essential",
  },
  {
    item: "Saved shop data",
    does: "Keeps copies of products, categories and offers so pages load faster next time. Never includes passwords or account details.",
    where: "Browser local storage",
    lasts: "Until newer data replaces it",
    kind: "Essential",
  },
  {
    item: "Saved images",
    does: "Keeps product pictures you have already seen so they appear instantly.",
    where: "Browser cache",
    lasts: "The most recent 60 images",
    kind: "Essential",
  },
  {
    item: "Your cookie choice",
    does: "Remembers whether you accepted all or chose essential only.",
    where: "Browser local storage",
    lasts: "Until you change it or clear your browser",
    kind: "Essential",
  },
  {
    item: "Google Maps",
    does: "Shows the map of our shop in the footer. Google may set its own cookies.",
    where: "Set by Google",
    lasts: "Decided by Google",
    kind: "Optional",
  },
  {
    item: "Sign in with Google",
    does: "Lets you sign in with your Google account. Only used if you press the button.",
    where: "Set by Google",
    lasts: "Decided by Google",
    kind: "Optional",
  },
];

const CHOICE_TEXT = {
  all: "You have accepted all cookies.",
  essential: "You have chosen essential only.",
};

export default function Cookies() {
  useSEO({
    title: "Cookie Policy | Hawk Life Solutions",
    description:
      "The cookies and browser storage Hawk Life Solutions uses, which are essential, which are optional, and how to change your choice.",
  });

  const consent = useConsent();

  return (
    <article className="ck">
      <header className="ck-head">
        <h1>Cookie Policy</h1>
        <p>
          Our shop mainly uses your browser's local storage rather than traditional cookies. We describe
          both together here. We do not use advertising cookies or tracking tools that follow you around
          the web.
        </p>
        <p className="ck-meta">Last updated {LAST_UPDATED}</p>
      </header>

      <section className="ck-choice" aria-live="polite">
        <div>
          <p className="ck-choice-label">Your choice right now</p>
          <p className="ck-choice-state">{CHOICE_TEXT[consent] || "You haven't made a choice yet."}</p>
        </div>
        <div className="ck-choice-actions">
          <button
            type="button"
            className={`ck-btn ${consent === "essential" ? "on" : ""}`}
            aria-pressed={consent === "essential"}
            onClick={() => setConsent("essential")}
          >
            Essential only
          </button>
          <button
            type="button"
            className={`ck-btn ${consent === "all" ? "on" : ""}`}
            aria-pressed={consent === "all"}
            onClick={() => setConsent("all")}
          >
            Accept all
          </button>
          <button type="button" className="ck-link" onClick={clearConsent}>
            Ask me again
          </button>
        </div>
      </section>

      <section className="ck-section">
        <h2>What the website stores</h2>
        <p>
          Essential items are needed for the shop to work, so the cookie notice does not switch them
          off. Optional items only load with your permission.
        </p>
        <div className="ck-scroll">
          <table className="ck-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>What it does</th>
                <th>Where it lives</th>
                <th>How long</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.item}>
                  <th scope="row">{row.item}</th>
                  <td>{row.does}</td>
                  <td>{row.where}</td>
                  <td>{row.lasts}</td>
                  <td>
                    <span className={`ck-kind ${row.kind === "Optional" ? "optional" : ""}`}>{row.kind}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ck-section">
        <h2>Our map and image services</h2>
        <p>
          The map in our footer is provided by Google. If you choose "Essential only", it stays off
          until you press "Load map". Product pictures are delivered by Cloudinary, a content delivery
          service, which may see your IP address when your browser asks for an image. It does not set
          cookies for this.
        </p>
      </section>

      <section className="ck-section">
        <h2>Changing your mind</h2>
        <ul className="ck-list">
          <li>Use the buttons at the top of this page, or the "Cookie settings" link at the bottom of any page.</li>
          <li>Delete cookies and site data in your browser settings at any time.</li>
          <li>If you block essential storage, you won't be able to stay signed in or keep a cart.</li>
        </ul>
      </section>

      <section className="ck-section">
        <h2>Questions</h2>
        <p>
          Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or call <a href={`tel:${PHONE_NUMBER}`}>{PHONE_DISPLAY}</a>.
          For how we handle personal information, see our <Link to="/privacy">Privacy Policy</Link>. We
          may update this page from time to time, and the date at the top shows when it last changed.
        </p>
      </section>
    </article>
  );
}