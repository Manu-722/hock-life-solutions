import { useSEO } from "../hooks/useSEO";
import { PHONE_NUMBER, PHONE_DISPLAY, EMAIL, POSTAL, STORE } from "../config/contact";

export default function ReturnPolicy() {
  useSEO({
    title: "Return Policy | Hawk Life Solutions",
    description:
      "Hawk Life Solutions return policy for appliances, cookware and utensils: 24 hour returns, damaged or defective items, refunds, exchanges and warranty.",
  });

  return (
    <article className="rp">
      <div className="rp-sheet">
        <header className="rp-letterhead">
          <p className="rp-company">{POSTAL.company}</p>
          <dl className="rp-contact">
            <div>
              <dt>Phone</dt>
              <dd><a href={`tel:${PHONE_NUMBER}`}>{PHONE_DISPLAY}</a></dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd><a href={`mailto:${EMAIL}`}>{EMAIL}</a></dd>
            </div>
            <div>
              <dt>Post</dt>
              <dd>{POSTAL.lines.join(", ")}</dd>
            </div>
          </dl>
        </header>

        <h1 className="rp-title">Return Policy</h1>
        <p className="rp-sub">Appliances, cookware, utensils and more</p>
        <p className="rp-intro">
          At Hawk Life Solutions Ltd, we are committed to ensuring your satisfaction with every
          purchase. If you are not completely satisfied with your kitchen item(s), we're here to help.
        </p>

        <div className="rp-times">
          <div>
            <span className="rp-big">24 hrs</span>
            <span className="rp-time-label">to return an unused item for replacement</span>
          </div>
          <div>
            <span className="rp-big">24 hrs</span>
            <span className="rp-time-label">to report damage after delivery or pick-up</span>
          </div>
          <div>
            <span className="rp-big">7 to 14</span>
            <span className="rp-time-label">business days for approved refunds</span>
          </div>
        </div>

        <section className="rp-section">
          <span className="rp-num">1</span>
          <div>
            <h2>Eligibility for returns</h2>
            <p>
              You may return most new, opened or unopened, and unused kitchen items within 24 hours of
              purchase for replacement, subject to the conditions below:
            </p>
            <ul>
              <li>Items must be returned in their original packaging with all accessories, manuals, and receipts.</li>
              <li>Proof of purchase (receipt, order confirmation, or invoice) is required for all returns.</li>
              <li>Used, damaged, or altered items may not be eligible for replacement unless found to be defective.</li>
            </ul>
          </div>
        </section>

        <section className="rp-section">
          <span className="rp-num">2</span>
          <div>
            <h2>Non-returnable items</h2>
            <p>We do not accept returns on the following:</p>
            <ul>
              <li>Opened or used kitchen consumables (for example food-safe oils and cleaners).</li>
              <li>Items marked "Final sale", "Clearance" or "Non-returnable" on the product page.</li>
              <li>Custom orders or personalized items.</li>
              <li>Items without original packaging or missing parts.</li>
            </ul>
          </div>
        </section>

        <section className="rp-section">
          <span className="rp-num">3</span>
          <div>
            <h2>Damaged, defective or incorrect items</h2>
            <p>
              If your item arrives damaged or defective, please notify us within 24 hours of delivery or
              pick-up. It is the responsibility of the client to inspect the product upon delivery.
            </p>
            <p>
              We will offer a replacement (if available), a repair (if applicable), another item(s) to
              cover the cost, or a full refund, depending on the issue.
            </p>
            <p>Please include photos of the item and packaging when submitting a damage claim.</p>
          </div>
        </section>

        <section className="rp-section">
          <span className="rp-num">4</span>
          <div>
            <h2>Refunds</h2>
            <ul>
              <li>Approved refunds will be issued via the original method of payment within 7 to 14 business days.</li>
              <li>Shipping fees are non-refundable unless the return is due to our error or a defective item.</li>
              <li>If you paid by cash or mobile money, we may issue a store credit or refund via mobile payment.</li>
            </ul>
          </div>
        </section>

        <section className="rp-section">
          <span className="rp-num">5</span>
          <div>
            <h2>Exchanges</h2>
            <ul>
              <li>Exchanges are subject to stock availability.</li>
              <li>Items must meet the same return conditions as listed above.</li>
            </ul>
          </div>
        </section>

        <section className="rp-section">
          <span className="rp-num">6</span>
          <div>
            <h2>How to start a return</h2>
            <p>To start a return, contact us through:</p>
            <ul>
              <li>Phone: <a href={`tel:${PHONE_NUMBER}`}>{PHONE_DISPLAY}</a></li>
              <li>Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
              <li>In store: visit any of our outlets with your receipt.</li>
            </ul>
            <h3>Return shipping for online orders</h3>
            <ul>
              <li>Return shipping costs are the responsibility of the customer unless the item is defective or sent in error.</li>
              <li>We recommend using a trackable shipping service for safety.</li>
            </ul>
          </div>
        </section>

        <section className="rp-section">
          <span className="rp-num">7</span>
          <div>
            <h2>Warranty policy</h2>
            <p>We offer a limited warranty on selected kitchen appliances sold through our store.</p>
            <h3>Warranty coverage</h3>
            <ul>
              <li>Covers manufacturing defects in materials or workmanship.</li>
              <li>Does not cover damage caused by misuse, normal wear and tear, accidents, or unauthorized repairs.</li>
              <li>Warranty periods vary by product, typically 12 months for induction cookers. Refer to the product page or packaging for specific terms.</li>
            </ul>
            <h3>Not included in warranty coverage</h3>
            <ul>
              <li>Physical damage caused by misuse, normal wear and tear, accidents, or unauthorized repairs, for example pressure marks on the screen or breakage.</li>
              <li>Water or any form of liquid spillage.</li>
              <li>Power surge and related issues.</li>
            </ul>
          </div>
        </section>

        <section className="rp-end">
          <h2>Contact us</h2>
          <p>For questions or assistance with returns, warranties or support, please contact our team.</p>
          <dl className="rp-end-list">
            <div><dt>Phone</dt><dd><a href={`tel:${PHONE_NUMBER}`}>{PHONE_DISPLAY}</a></dd></div>
            <div><dt>Email</dt><dd><a href={`mailto:${EMAIL}`}>{EMAIL}</a></dd></div>
            <div><dt>Visit</dt><dd>{STORE.lines.join(", ")}, Kenya</dd></div>
          </dl>
        </section>
      </div>
    </article>
  );
}