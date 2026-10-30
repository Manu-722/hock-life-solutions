// ---------------------------------------------------------------------
// Edit your details HERE, once. The header, footer, About page, policy
// pages and the home page business details all read from this file.
// ---------------------------------------------------------------------

// For the tap-to-call link: country code, no spaces.
export const PHONE_NUMBER = "+254112660355";
// How the number is displayed to visitors.
export const PHONE_DISPLAY = "+254 112 660355";

// For WhatsApp: country code + number, DIGITS ONLY (no + sign, no spaces,
// no leading 0). Change this if your WhatsApp number is different.
export const WHATSAPP_NUMBER = "254112660355";
export const WHATSAPP_MESSAGE = "Hello Hawk Life Solutions, I'd like to make an enquiry.";

export const EMAIL = "lifesolutions.hawk@gmail.com";

// Replace these with your real page links. Leave a value as "" to hide
// that icon everywhere.
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/hawkinduction.254?igsi=MWRpejU0c2ZoaXN0OA==",
  facebook: "https://www.facebook.com/share/1F44hup4Rz/",
  youtube: "https://www.youtube.com/@Hawkinduction.254",
  tiktok: "https://www.tiktok.com/@hawkinduction.254?_r=1&_t=ZS-99Gb6aX1KgG",
};

// Opens a WhatsApp chat with a pre-filled message.
export const whatsappLink = (message = WHATSAPP_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

// Postal address, as used on the company letterhead.
export const POSTAL = {
  company: "Hawk Life Solutions Limited",
  lines: ["P. O. Box 79644-00200", "City Square, Nairobi, Kenya"],
};

// Shop location. mapQuery is what Google Maps searches for.
export const STORE = {
  lines: ["Royal Palm Mall, 3rd Floor, Shop BS43", "Ronald Ngala Street, Nairobi"],
  mapQuery: "Royal Palm Mall, Ronald Ngala Street, Nairobi, Kenya",
};

// PLACEHOLDER HOURS: change these to your real opening hours.
export const BUSINESS_HOURS = [
  { days: "Mon to Fri", hours: "8 AM to 6 PM" },
  { days: "Saturday", hours: "8 AM to 6 PM" },
  { days: "Sunday", hours: "Closed" },
];

// Live Google Map (no API key needed) plus "open" and "directions" links.
export const mapsEmbedUrl = () =>
  `https://maps.google.com/maps?q=${encodeURIComponent(STORE.mapQuery)}&z=17&output=embed`;
export const mapsOpenUrl = () =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE.mapQuery)}`;
export const mapsDirectionsUrl = () =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(STORE.mapQuery)}`;