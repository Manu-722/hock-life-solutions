import { useSEO } from "../hooks/useSEO";
import { PHONE_NUMBER, PHONE_DISPLAY, whatsappLink } from "../config/contact";

const GROUPS = [
  {
    number: "1",
    title: "Smart Living",
    subtitle: "Modernity, Safety & Design",
    items: [
      {
        title: "Product Excellence & Flame-Free Safety",
        text: "We engineer durable, high-performance induction cookers and cookware that conform to strict Kenyan and international standards, ensuring a sleek, safe, and pristine kitchen environment.",
      },
      {
        title: "Innovation & Sleek Convenience",
        text: "We push boundaries to bring intuitive, modern appliances to every home, simplifying daily routines, reducing clutter, and elevating the modern aesthetic.",
      },
      {
        title: "Total Peace of Mind",
        text: "We build trust through absolute product reliability, long-term durability, and safe technology that brings pride and comfort to your home.",
      },
    ],
  },
  {
    number: "2",
    title: "Living Smart",
    subtitle: "Efficiency, Action & Practical Value",
    items: [
      {
        title: "Maximum Energy Efficiency & Savings",
        text: "We prioritize direct-heat induction technology that eliminates wasted energy, slashes power bills, and cooks meals in half the time.",
      },
      {
        title: "Customer-Centric Value & Accessibility",
        text: "We ensure premium, high-utility appliances remain practical, accessible, and designed around the real-world operational needs of modern households.",
      },
      {
        title: "Trust, Integrity & Accountability",
        text: "We operate with total transparency, ethical governance, and dependable post-purchase support so that choosing HAWK is always a smart, confident investment.",
      },
    ],
  },
  {
    number: "3",
    title: "Operational Pillars",
    subtitle: "How We Deliver",
    items: [
      {
        title: "Integrity & Compliance",
        text: "Conducting every operation with transparency, strict regulatory adherence, and unwavering business ethics.",
      },
      {
        title: "Teamwork & Respect",
        text: "Fostering a high-performance, collaborative culture dedicated to serving our customers with excellence every day.",
      },
    ],
  },
];

export default function About() {
  useSEO({
    title: "About Hawk Life Solutions | Smart Living, Living Smart in Kenya",
    description:
      "Hawk Life Solutions brings energy-efficient, safe and innovative induction cookers and cookware to Kenyan homes. Learn about our vision, mission and values.",
  });

  return (
    <article className="ab">
      <header className="ab-open">
        <div>
          <p className="ab-label">About us</p>
          <h1 className="ab-title">
            Smart living.<br />
            <em>Living smart.</em>
          </h1>
        </div>
        <p className="ab-lede">
          Hawk Life Solutions brings energy-efficient, safe and innovative induction technology and
          cookware to Kenyan homes.
        </p>
      </header>

      <section className="ab-statements">
        <div className="ab-statement">
          <p className="ab-label">Our vision</p>
          <blockquote>
            “To lead Kenya into an era of Smart Living and Living Smart by becoming the most trusted
            partner for energy-efficient, safe, and innovative home solutions.”
          </blockquote>
          <p className="ab-note">
            <strong>Smart Living.</strong> Delivering sleek, flame-free, and high-tech kitchen environments.
          </p>
          <p className="ab-note">
            <strong>Living Smart.</strong> Empowering households with practical, cost-saving, and
            friction-free daily living.
          </p>
        </div>

        <div className="ab-statement">
          <p className="ab-label">Our mission</p>
          <blockquote>
            “To elevate Kenyan homes through high-performance induction technology and cookware that
            combine modern elegance with maximum energy efficiency, enabling our customers to live
            smarter, save more, and cook with complete peace of mind.”
          </blockquote>
        </div>
      </section>

      <section className="ab-values">
        <h2 className="ab-values-head">Our core values</h2>

        {GROUPS.map((group) => (
          <div className="ab-group" key={group.number}>
            <div className="ab-group-side">
              <span className="ab-group-num">{group.number}</span>
              <h3 className="ab-group-title">{group.title}</h3>
              <p className="ab-group-sub">{group.subtitle}</p>
            </div>
            <div className="ab-group-items">
              {group.items.map((item) => (
                <div className="ab-item" key={item.title}>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <footer className="ab-close">
        <p className="ab-close-line">Questions? We would love to hear from you.</p>
        <p className="ab-close-links">
          <a
            href={whatsappLink("Hello Hawk Life Solutions, I have a question about your products.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            Message us on WhatsApp
          </a>
          <span>or call</span>
          <a href={`tel:${PHONE_NUMBER}`}>{PHONE_DISPLAY}</a>
        </p>
      </footer>
    </article>
  );
}