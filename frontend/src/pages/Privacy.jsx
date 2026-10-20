import { Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import { EMAIL, PHONE_NUMBER, PHONE_DISPLAY, POSTAL, STORE } from "../config/contact";

// DRAFT POLICY: written around how the website works today. Have it
// reviewed by a Kenyan lawyer, and update it if you add new tools (such as
// analytics) or new service providers.
const LAST_UPDATED = "October 2026";

const DATA_ROWS = [
  {
    what: "Account details",
    detail: "Username, name, email address, phone number and a password (stored scrambled, so we cannot read it).",
    why: "To create your account and contact you about your orders.",
    who: "Neon, Render",
  },
  {
    what: "Google sign in",
    detail: "Your name and email address from Google. We never see your Google password.",
    why: "To sign you in without a separate password.",
    who: "Google",
  },
  {
    what: "Orders",
    detail: "The items you order, amounts, order status and dates.",
    why: "To process your order and match your M-Pesa payment to it.",
    who: "Neon, Render",
  },
  {
    what: "Reviews",
    detail: "Your star rating and comment, shown with your first name (or username if you haven't added a name).",
    why: "To show customer feedback on product pages.",
    who: "Neon, Render",
  },
  {
    what: "Password reset emails",
    detail: "Your email address and a one time code.",
    why: "To let you set a new password safely.",
    who: "Resend",
  },
  {
    what: "Messages to us",
    detail: "What you send on WhatsApp, by phone or by email.",
    why: "To answer your questions.",
    who: "WhatsApp, your email provider",
  },
  {
    what: "Technical data",
    detail: "Device, browser type and IP address, recorded in server logs.",
    why: "For security and to find and fix faults.",
    who: "Render, Vercel",
  },
];

const PROVIDERS = [
  ["Vercel", "Hosts the website."],
  ["Render", "Runs our server."],
  ["Neon", "Stores our database."],
  ["Cloudinary", "Stores and delivers product pictures."],
  ["Resend", "Sends emails such as password reset codes."],
  ["Google", "Provides sign in with Google and the footer map."],
];

const RIGHTS = [
  "Know how your information is being used.",
  "Access the personal information we hold about you.",
  "Ask us to correct information that is wrong or misleading.",
  "Ask us to delete your information where we have no good reason to keep it.",
  "Object to how we use it, or withdraw consent you gave earlier.",
  "Receive a copy of your information in a common format.",
];

export default function Privacy() {
  useSEO({
    title: "Privacy Policy | Hawk Life Solutions",
    description:
      "How Hawk Life Solutions collects, uses and protects your personal information, and the choices and rights you have.",
  });

  return (
    <article className="pv">
      <header className="pv-head">
        <h1>Privacy Policy</h1>
        <p className="pv-intro">
          Your privacy matters to us. This policy explains what personal information Hawk Life Solutions
          Limited collects through this website, why we collect it, who it is shared with, and the
          choices you have. It is written with Kenya's Data Protection Act, 2019 in mind.
        </p>
        <p className="pv-meta">Last updated {LAST_UPDATED}</p>
      </header>

      <aside className="pv-short">
        <p className="pv-short-label">In short</p>
        <ul>
          <li>We collect only what we need to run your account and your orders.</li>
          <li>We never sell your information.</li>
          <li>You pay through M-Pesa, and we never see your PIN.</li>
          <li>You can ask to see, correct or delete your information at any time.</li>
        </ul>
      </aside>

      <section className="pv-section">
        <h2>Who is responsible for your data</h2>
        <p>
          Hawk Life Solutions Limited is responsible for the personal information collected through this
          website. Reach us on <a href={`tel:${PHONE_NUMBER}`}>{PHONE_DISPLAY}</a>, at{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>, by post at {POSTAL.lines.join(", ")}, or at our shop,{" "}
          {STORE.lines.join(", ")}.
        </p>
      </section>

      <section className="pv-section">
        <h2>What we collect, and why</h2>
        <div className="pv-scroll">
          <table className="pv-table">
            <thead>
              <tr>
                <th>What</th>
                <th>Details</th>
                <th>Why we need it</th>
                <th>Who may handle it</th>
              </tr>
            </thead>
            <tbody>
              {DATA_ROWS.map((row) => (
                <tr key={row.what}>
                  <th scope="row">{row.what}</th>
                  <td>{row.detail}</td>
                  <td>{row.why}</td>
                  <td>{row.who}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="pv-after">
          We rely on your consent (for example when you choose Google sign in), on our need to carry out
          your order, and on our legal obligations.
        </p>
      </section>

      <section className="pv-section">
        <h2>Who we share it with</h2>
        <p>
          We do not sell your personal information. We use these services to run the shop, and each one
          handles data only to provide its service.
        </p>
        <dl className="pv-providers">
          {PROVIDERS.map(([name, role]) => (
            <div key={name}>
              <dt>{name}</dt>
              <dd>{role}</dd>
            </div>
          ))}
        </dl>
        <p>
          Some of these services process data on servers outside Kenya. We choose providers with
          established security practices and share only what is needed. We may also share information if
          the law requires it, or to protect our rights and the safety of others.
        </p>
      </section>

      <section className="pv-section">
        <h2>Payments</h2>
        <p>
          You pay through M-Pesa directly to our Paybill. We never see or store your M-Pesa PIN. We use
          the amount and account details to match your payment to your order.
        </p>
      </section>

      <section className="pv-section">
        <h2>Cookies and browser storage</h2>
        <p>
          We do not use advertising or tracking cookies. Your browser stores your login, your cart and
          saved copies of shop pages so the website works and loads quickly. The footer map only loads if
          you accept all cookies or press "Load map". Our <Link to="/cookies">Cookie Policy</Link> lists
          everything in detail.
        </p>
      </section>

      <section className="pv-section">
        <h2>How long we keep it</h2>
        <p>
          We keep your account information while your account is open. We keep order records for as long
          as we need them for support, warranty and legal or accounting reasons. When information is no
          longer needed, we delete it or make it anonymous.
        </p>
      </section>

      <section className="pv-section">
        <h2>How we protect it</h2>
        <p>
          We use secure connections (HTTPS), store passwords in scrambled form, limit repeated login
          attempts, and keep our admin tools for authorised staff only. No system is completely secure,
          so please use a strong, unique password and keep it private.
        </p>
      </section>

      <section className="pv-section">
        <h2>Your rights</h2>
        <p>Under the Data Protection Act, 2019 you have the right to:</p>
        <ol className="pv-rights">
          {RIGHTS.map((right) => (
            <li key={right}>{right}</li>
          ))}
        </ol>
        <p>
          You can update your name, email and phone number yourself on your Profile page. For anything
          else, contact us and we will respond as quickly as we can and within the time the law
          requires. If you are not happy with how we handle your information, you can complain to the
          Office of the Data Protection Commissioner in Kenya.
        </p>
      </section>

      <section className="pv-section">
        <h2>Children</h2>
        <p>
          Our shop is meant for adults. We do not knowingly collect information from children under 18.
          If you think a child has given us their information, please contact us and we will delete it.
        </p>
      </section>

      <section className="pv-section">
        <h2>Changes to this policy</h2>
        <p>
          We may update this policy from time to time. The date at the top shows when it was last
          changed. Our <Link to="/terms">Terms &amp; Conditions</Link> explain the rules for using the
          shop.
        </p>
      </section>

      <section className="pv-section">
        <h2>Contact us</h2>
        <p>
          Questions or requests about your information? Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or
          call <a href={`tel:${PHONE_NUMBER}`}>{PHONE_DISPLAY}</a>.
        </p>
      </section>
    </article>
  );
}