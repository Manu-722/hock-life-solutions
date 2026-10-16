import {
  Eye, Target, Sparkles, Zap, ShieldCheck, Lightbulb, Heart,
  PiggyBank, Wallet, Scale, BadgeCheck, Users, Phone,
} from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import { WhatsAppIcon } from "../components/icons";
import { PHONE_NUMBER, PHONE_DISPLAY, whatsappLink } from "../config/contact";

const SMART_LIVING = [
  {
    icon: ShieldCheck,
    title: "Product Excellence & Flame-Free Safety",
    text: "We engineer durable, high-performance induction cookers and cookware that conform to strict Kenyan and international standards, ensuring a sleek, safe, and pristine kitchen environment.",
  },
  {
    icon: Lightbulb,
    title: "Innovation & Sleek Convenience",
    text: "We push boundaries to bring intuitive, modern appliances to every home, simplifying daily routines, reducing clutter, and elevating the modern aesthetic.",
  },
  {
    icon: Heart,
    title: "Total Peace of Mind",
    text: "We build trust through absolute product reliability, long-term durability, and safe technology that brings pride and comfort to your home.",
  },
];

const LIVING_SMART = [
  {
    icon: PiggyBank,
    title: "Maximum Energy Efficiency & Savings",
    text: "We prioritize direct-heat induction technology that eliminates wasted energy, slashes power bills, and cooks meals in half the time.",
  },
  {
    icon: Wallet,
    title: "Customer-Centric Value & Accessibility",
    text: "We ensure premium, high-utility appliances remain practical, accessible, and designed around the real-world operational needs of modern households.",
  },
  {
    icon: Scale,
    title: "Trust, Integrity & Accountability",
    text: "We operate with total transparency, ethical governance, and dependable post-purchase support so that choosing HAWK is always a smart, confident investment.",
  },
];

const PILLARS = [
  {
    icon: BadgeCheck,
    title: "Integrity & Compliance",
    text: "Conducting every operation with transparency, strict regulatory adherence, and unwavering business ethics.",
  },
  {
    icon: Users,
    title: "Teamwork & Respect",
    text: "Fostering a high-performance, collaborative culture dedicated to serving our customers with excellence every day.",
  },
];

function ValueGroup({ number, title, items }) {
  return (
    <div className="values-group">
      <h3 className="values-group-title">
        <span className="values-number">{number}</span>
        {title}
      </h3>
      <div className="values-grid">
        {items.map(({ icon: Icon, title: itemTitle, text }) => (
          <div className="value-card" key={itemTitle}>
            <div className="value-icon"><Icon size={22} /></div>
            <h4>{itemTitle}</h4>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function About() {
  useSEO({
    title: "About Hawk Life Solutions | Smart Living, Living Smart in Kenya",
    description:
      "Hawk Life Solutions brings energy-efficient, safe and innovative induction cookers and cookware to Kenyan homes. Learn about our vision, mission and values.",
  });

  return (
    <div className="about-page">
      <section className="about-hero">
        <span className="about-eyebrow">About us</span>
        <h1>Smart Living. <span className="accent">Living Smart.</span></h1>
        <p>
          Hawk Life Solutions brings energy-efficient, safe and innovative induction technology
          and cookware to Kenyan homes.
        </p>
        <div className="about-chips">
          <span className="about-chip"><Sparkles size={14} /> Smart Living</span>
          <span className="about-chip"><Zap size={14} /> Living Smart</span>
        </div>
      </section>

      <section className="about-pair">
        <article className="about-card about-card-dark">
          <div className="about-card-icon"><Eye size={26} /></div>
          <h2>Our Vision</h2>
          <blockquote>
            “To lead Kenya into an era of Smart Living and Living Smart by becoming the most trusted
            partner for energy-efficient, safe, and innovative home solutions.”
          </blockquote>
          <ul className="about-bullets">
            <li><strong>Smart Living:</strong> Delivering sleek, flame-free, and high-tech kitchen environments.</li>
            <li><strong>Living Smart:</strong> Empowering households with practical, cost-saving, and friction-free daily living.</li>
          </ul>
        </article>

        <article className="about-card">
          <div className="about-card-icon"><Target size={26} /></div>
          <h2>Our Mission</h2>
          <blockquote>
            “To elevate Kenyan homes through high-performance induction technology and cookware that
            combine modern elegance with maximum energy efficiency, enabling our customers to live
            smarter, save more, and cook with complete peace of mind.”
          </blockquote>
        </article>
      </section>

      <section>
        <div className="about-section-head">
          <h2>Our Core Values</h2>
          <p>The principles behind every product we sell and every order we deliver.</p>
        </div>

        <ValueGroup number="1" title="Smart Living: Modernity, Safety & Design" items={SMART_LIVING} />
        <ValueGroup number="2" title="Living Smart: Efficiency, Action & Practical Value" items={LIVING_SMART} />
        <ValueGroup number="3" title="Operational Pillars: How We Deliver" items={PILLARS} />
      </section>

      <section className="about-cta">
        <h2>Questions? We'd love to hear from you.</h2>
        <p>Chat with us on WhatsApp or give us a call. We're happy to help you choose.</p>
        <div className="about-cta-actions">
          <a
            href={whatsappLink("Hello Hawk Life Solutions, I have a question about your products.")}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-btn"
          >
            <WhatsAppIcon size={18} /> <span>Chat on WhatsApp</span>
          </a>
          <a href={`tel:${PHONE_NUMBER}`} className="about-cta-call">
            <Phone size={17} /> {PHONE_DISPLAY}
          </a>
        </div>
      </section>
    </div>
  );
}