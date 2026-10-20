import { Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import { EMAIL, PHONE_NUMBER, PHONE_DISPLAY, POSTAL, STORE } from "../config/contact";

// DRAFT TERMS: written around how the shop works today. Have them reviewed
// by a Kenyan lawyer, and change anything that doesn't match how you operate.
const LAST_UPDATED = "October 2026";

const CLAUSES = [
  {
    id: "who",
    title: "Who we are",
    body: (
      <p>
        This website is run by Hawk Life Solutions Limited ("Hawk Life Solutions", "we" or "us"), a
        retailer of induction cookers, cookware and household appliances in Kenya. Our shop is at{" "}
        {STORE.lines.join(", ")}, and our postal address is {POSTAL.lines.join(", ")}. You can reach us
        on <a href={`tel:${PHONE_NUMBER}`}>{PHONE_DISPLAY}</a> or at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    ),
  },
  {
    id: "account",
    title: "Using the website and your account",
    body: (
      <ol className="tc-alpha">
        <li>You can browse and add items to your cart without an account. You need an account, or Google sign in, to place an order.</li>
        <li>Give us accurate details and keep them up to date.</li>
        <li>Keep your password private. You are responsible for what happens on your account, so tell us straight away if you think someone else has used it.</li>
        <li>We may suspend or close accounts that are used to cheat, abuse or harm the website or other people.</li>
      </ol>
    ),
  },
  {
    id: "products",
    title: "Products and availability",
    body: (
      <ol className="tc-alpha">
        <li>We try to describe and photograph our products accurately, but colours, packaging and small details can differ slightly from the pictures.</li>
        <li>Specifications are shown on each product page. If a detail matters to you, ask us before you buy.</li>
        <li>An item shown as in stock can still sell out before your order is confirmed. If that happens we will tell you and refund any payment you have made.</li>
      </ol>
    ),
  },
  {
    id: "prices",
    title: "Prices and offers",
    body: (
      <ol className="tc-alpha">
        <li>All prices are in Kenyan shillings (KES).</li>
        <li>Prices and offers can change without notice, but the price you see when you place your order is the price for that order.</li>
        <li>If we spot an obvious pricing mistake, we may cancel the order and refund any payment you made.</li>
        <li>Items marked "Offer" are at a special price for as long as the offer lasts.</li>
      </ol>
    ),
  },
  {
    id: "orders",
    title: "Placing an order and paying",
    body: (
      <>
        <ol className="tc-steps">
          <li>Add items to your cart, then sign in or create an account at checkout.</li>
          <li>Place your order. It is created with the status "Pending".</li>
          <li>We show you our M-Pesa Paybill number, an account number and the amount to pay.</li>
          <li>Pay with M-Pesa, using the exact amount and account number we give you so we can match your payment to your order.</li>
          <li>Once we confirm your payment, we approve your order and its status changes to "Approved" in your Profile.</li>
        </ol>
        <p>
          Placing an order is a request to buy. A contract is formed only when we approve your order
          after confirming payment. We may decline or cancel an order, for example if payment is not
          received, the item is unavailable, or we cannot verify your details. If we cancel an order you
          have already paid for, we will refund you in full.
        </p>
      </>
    ),
  },
  {
    id: "delivery",
    title: "Delivery and collection",
    body: (
      <p>
        Delivery or collection depends on the item and where you are, and is agreed with you once your
        order is confirmed. If you want to know before you order, ask us on WhatsApp or by phone. Please
        check your items when you receive them and tell us quickly about any damage.
      </p>
    ),
  },
  {
    id: "returns",
    title: "Returns, refunds and warranty",
    body: (
      <p>
        Our <Link to="/return-policy">Return Policy</Link> explains when and how you can return an item,
        including the 24 hour windows for replacements and damage reports, how refunds are paid, and how
        our warranty works. Nothing in these terms limits your rights under the Consumer Protection Act,
        2012 or other Kenyan law.
      </p>
    ),
  },
  {
    id: "reviews",
    title: "Reviews",
    body: (
      <p>
        Signed in customers can leave reviews. Please keep them honest and respectful. Do not post
        anything unlawful, abusive, misleading or private. We may remove reviews that break these rules.
      </p>
    ),
  },
  {
    id: "use",
    title: "Acceptable use",
    body: (
      <ol className="tc-alpha">
        <li>Do not try to break, overload or gain unauthorised access to the website, our systems or other people's accounts.</li>
        <li>Do not use automated tools to copy or scrape the website in bulk.</li>
        <li>Do not use the website for anything unlawful.</li>
      </ol>
    ),
  },
  {
    id: "content",
    title: "Our content",
    body: (
      <p>
        The Hawk Life Solutions name, logo, text, photos and design belong to us or are used with
        permission. You may view and share pages for personal use, but please do not copy or reuse our
        content commercially without asking us first.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Our responsibility to you",
    body: (
      <p>
        We take care to keep the website accurate and available, but we cannot promise it will always be
        free of errors or interruptions. To the fullest extent the law allows, we are not responsible for
        indirect losses, and our responsibility for any order is limited to the amount you paid for it.
        Nothing in these terms limits liability that cannot be limited by law, including liability for
        fraud or for death or personal injury caused by negligence.
      </p>
    ),
  },
  {
    id: "privacy",
    title: "Privacy and cookies",
    body: (
      <p>
        How we collect and use your personal information is explained in our{" "}
        <Link to="/privacy">Privacy Policy</Link>, and how we use cookies is explained in our{" "}
        <Link to="/cookies">Cookie Policy</Link>.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <p>
        We may update these terms from time to time. The date at the top shows when they were last
        changed. Your order is governed by the terms in place when you placed it.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    body: (
      <p>
        These terms are governed by the laws of Kenya, and the courts of Kenya have jurisdiction over
        any dispute, subject to any rights you have as a consumer.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <p>
        Questions about these terms? Call <a href={`tel:${PHONE_NUMBER}`}>{PHONE_DISPLAY}</a> or email{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>
    ),
  },
];

export default function Terms() {
  useSEO({
    title: "Terms and Conditions | Hawk Life Solutions",
    description:
      "The terms for using the Hawk Life Solutions website and buying from us: accounts, prices, orders, M-Pesa payment, delivery, returns and more.",
  });

  return (
    <article className="tc">
      <header className="tc-head">
        <h1>Terms &amp; Conditions</h1>
        <p>
          These terms explain how you can use our website and buy from Hawk Life Solutions. Please read
          them before you place an order. By using the website or placing an order, you agree to them.
        </p>
        <p className="tc-meta">Last updated {LAST_UPDATED}</p>
      </header>

      <div className="tc-layout">
        <nav className="tc-toc" aria-label="Contents">
          <p className="tc-toc-title">Contents</p>
          <ol>
            {CLAUSES.map((clause) => (
              <li key={clause.id}>
                <a href={`#${clause.id}`}>{clause.title}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="tc-body">
          {CLAUSES.map((clause, index) => (
            <section className="tc-clause" id={clause.id} key={clause.id}>
              <h2>
                <span>{index + 1}.</span> {clause.title}
              </h2>
              {clause.body}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}