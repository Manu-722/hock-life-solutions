import { Instagram, Facebook, Youtube } from "lucide-react";
import { TikTokIcon } from "./icons";
import { SOCIAL_LINKS } from "../config/contact";

// One shared row of social icons, used in the navbar, mobile menu and
// footer. Any link left blank in config/contact.js is simply hidden.
export default function SocialLinks({ size = 20, className = "" }) {
  const items = [
    { key: "instagram", label: "Instagram", href: SOCIAL_LINKS.instagram, icon: <Instagram size={size} /> },
    { key: "facebook", label: "Facebook", href: SOCIAL_LINKS.facebook, icon: <Facebook size={size} /> },
    { key: "youtube", label: "YouTube", href: SOCIAL_LINKS.youtube, icon: <Youtube size={size} /> },
    { key: "tiktok", label: "TikTok", href: SOCIAL_LINKS.tiktok, icon: <TikTokIcon size={size} /> },
  ].filter((item) => item.href);

  return (
    <div className={`social-links ${className}`}>
      {items.map((item) => (
        <a
          key={item.key}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          title={item.label}
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
}