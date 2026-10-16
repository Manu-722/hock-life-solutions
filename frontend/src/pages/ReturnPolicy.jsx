import {
  Clock, Package, Wallet, CheckCircle2, XCircle, ListChecks, ShieldCheck, MessageCircle, Phone, Mail,
} from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import { WhatsAppIcon } from "../components/icons";
import { PHONE_NUMBER, PHONE_DISPLAY, EMAIL, RETURN_DAYS, whatsappLink } from "../config/contact";

// DRAFT TERMS - change the number of days in config/contact.js and the
// wording below to match the policy Hawk Life Solutions actually wants.

export default function ReturnPolicy() {
  useSEO({
    title: "Return Policy | Hawk Life Solutions",
    description:
      "Hawk Life Solutions return policy: how to return a faulty, damaged or incorrect item, and how refunds and warranty claims work.",
  });

  return (
    <div className="policy-page">
      <div className="policy-head">
        <span className="about-eyebrow policy-eyebrow">Customer care</span>
        <h1>Return Policy</h1>
        <p>
          We want you to be completely happy with your purchase from Hawk Life Solutions. If
          something isn't right, here is how returns, replacements and refunds work.
        </p>
      </div>

      <div className="policy-highlights">
        <div className="policy-highlight">
          <Clock size={24} />
          <h3>{RETURN_DAYS}-day window</h3>
          <p>Tell us about any problem within {RETURN_DAYS} days of receiving your item.</p>
        </div>
        <div className="policy-highlight">
          <Package size={24} />
          <h3>Original condition</h3>
          <p>Keep the item with its accessories, manuals and packaging.</p>
        </div>
        <div className="policy-highlight">
          <Wallet size={24} />
          <h3>Refund via M-Pesa</h3>
          <p>Approved refunds go back to the M-Pesa number used to pay.</p>
        </div>
      </div>

      <section className="policy-section">
        <h2><CheckCircle2 size={20} /> What can be returned</h2>
        <ul>
          <li>Items that arrive faulty or not working as described.</li>
          <li>Items damaged in transit.</li>
          <li>Items that are different from what you ordered.</li>
          <li>Items that are materially different from their product page description.</li>
        </ul>
      </section>

      <section className="policy-section">
        <h2><XCircle size={20} /> What can't be returned</h2>
        <ul>
          <li>Items damaged through misuse, accidents, or not following the user manual.</li>
          <li>Items that have been altered, repaired or tampered with by someone other than us.</li>
          <li>Normal wear and tear.</li>
          <li>Items returned without their original accessories or packaging.</li>
          <li>Requests made after the {RETURN_DAYS}-day window, except valid warranty claims (see below).</li>
        </ul>
      </section>

      <section className="policy-section">
        <h2><ListChecks size={20} /> How to start a return</h2>
        <ol>
          <li>Contact us on WhatsApp, by phone or by email with your order number.</li>
          <li>Send clear photos or a short video showing the problem.</li>
          <li>We'll review your request and let you know the next step, including how to send the item back or arrange collection.</li>
          <li>Once we've received and inspected the item, we'll replace it or refund you.</li>
        </ol>
      </section>

      <section className="policy-section">
        <h2><Wallet size={20} /> Refunds and replacements</h2>
        <p>
          If your return is approved, you can choose a replacement (subject to stock) or a refund.
          Refunds are sent to the M-Pesa number used for the original payment, once the returned
          item has been received and inspected.
        </p>
      </section>

      <section className="policy-section">
        <h2><ShieldCheck size={20} /> Warranty</h2>
        <p>
          Many of our appliances carry a warranty, shown on the product page where it applies. If
          your item develops a fault during its warranty period, contact us with your order number
          and we'll guide you through the claim.
        </p>
      </section>

      <section className="policy-section">
        <h2><MessageCircle size={20} /> Contact us about a return</h2>
        <div className="policy-contact-actions">
          <a
            href={whatsappLink("Hello Hawk Life Solutions, I'd like to return or exchange an item. My order number is: ")}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-btn"
          >
            <WhatsAppIcon size={18} /> <span>WhatsApp</span>
          </a>
          <a href={`tel:${PHONE_NUMBER}`} className="policy-contact-link"><Phone size={16} /> {PHONE_DISPLAY}</a>
          <a href={`mailto:${EMAIL}`} className="policy-contact-link"><Mail size={16} /> {EMAIL}</a>
        </div>
      </section>
    </div>
  );
}