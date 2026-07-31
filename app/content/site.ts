// app/content/site.ts
import type { Lang, NavLink } from "@/app/content/home";
import { COMPANY, MAPS_HREF, MAPS_DIRECTIONS_HREF, mapsEmbedSrc } from "@/app/content/company";

export type FooterLink = { label: string; href: string };

/** A social profile link; `platform` selects the icon + brand colour. */
export type SocialLink = { label: string; href: string; platform: "linkedin" | "facebook" };

/** Sister-brand link in the "About" dropdown. `external` → opens a new tab. */
export type BrandLink = { label: string; href: string; external?: boolean };

export type Chrome = {
  menu: string;
  close: string;
  lang: string;
  contact: string;
  navLinks: readonly NavLink[];
  /** "מבית דפוס בארי" — small group byline shown under the logo. */
  byline: string;
  /** Sister-brand links surfaced from the "About" nav item (hover dropdown). */
  brandLinks: readonly BrandLink[];
  /** Compact "street · city" pair (mobile drawer + sticky header). */
  footerAddr: readonly [string, string];
  /** Full office address line shown in the footer. */
  footerAddressFull: string;
  /** Logistics-centre address line shown in the footer. */
  footerWarehouse: string;
  footerLinks: readonly string[];
  footerCopy: string;
  logoHe: string;
  logoEn: string;
  // Footer composition
  wordmark: string;
  footerTagline: string;
  footerHeritage: string;
  footerNavHeading: string;
  footerConnectHeading: string;
  email: string;
  mapsHref: string;
  // Footer location band
  /** Eyebrow above the address + map ("המיקום שלנו"). */
  footerLocationHeading: string;
  /** Label on the turn-by-turn directions link. */
  footerDirections: string;
  /** Accessible name for the map <iframe>. */
  footerMapTitle: string;
  mapsDirectionsHref: string;
  mapEmbedSrc: string;
  social: readonly SocialLink[];
  legal: readonly FooterLink[];
};

const linkedinHref = COMPANY.linkedin;
const facebookHref = COMPANY.facebook;
const emailAddr = COMPANY.email;
const mapsHref = MAPS_HREF;

export const navLinks: readonly NavLink[] = [
  { he: "אודות", en: "About", href: "/about" },
  { he: "השבחות", en: "Finishing", href: "/finishing" },
  { he: "בלוג", en: "Blog", href: "/blog" },
  { he: "קטלוג", en: "Catalog", href: "/catalog" },
];

export const chromeContent: Record<Lang, Chrome> = {
  he: {
    menu: "תפריט",
    close: "סגירה",
    lang: "שפה",
    contact: "ליצירת קשר",
    navLinks,
    byline: "מבית דפוס בארי",
    brandLinks: [
      { label: "בארי אריזות", href: "/about" },
      { label: "דפוס בארי", href: "https://www.beeriprint.co.il/", external: true },
      { label: "PIX", href: "https://pix.co.il/", external: true },
    ],
    footerAddr: [COMPANY.address.he.street, COMPANY.address.he.city],
    footerAddressFull: COMPANY.address.he.full,
    footerWarehouse: COMPANY.address.he.warehouse,
    footerLinks: ["תנאים", "פרטיות"],
    footerCopy: "© 2026 בארי אריזות. כל הזכויות שמורות.",
    logoHe: "/images/logo-he.svg",
    logoEn: "/images/logo-en.svg",
    wordmark: "בארי אריזות",
    footerTagline: "אריזות קרטון בהתאמה אישית — תכנון, דפוס והשבחה תחת קורת גג אחת.",
    footerHeritage: "",
    footerNavHeading: "ניווט",
    footerConnectHeading: "יצירת קשר",
    email: emailAddr,
    mapsHref,
    footerLocationHeading: "המיקום שלנו",
    footerDirections: "הוראות הגעה",
    footerMapTitle: "מפת המיקום של בארי אריזות, רחוב פארן 4, יבנה",
    mapsDirectionsHref: MAPS_DIRECTIONS_HREF,
    mapEmbedSrc: mapsEmbedSrc("he"),
    social: [
      { label: "LinkedIn", href: linkedinHref, platform: "linkedin" },
      { label: "Facebook", href: facebookHref, platform: "facebook" },
    ],
    legal: [
      { label: "תנאים", href: "/terms" },
      { label: "פרטיות", href: "/privacy" },
      { label: "נגישות", href: "/accessibility" },
    ],
  },
  en: {
    menu: "Menu",
    close: "Close",
    lang: "Language",
    contact: "Contact",
    navLinks,
    byline: "From Beeri Print",
    brandLinks: [
      { label: "Beeri Packaging", href: "/about" },
      { label: "Beeri Print", href: "https://www.beeriprint.co.il/", external: true },
      { label: "PIX", href: "https://pix.co.il/", external: true },
    ],
    footerAddr: [COMPANY.address.en.street, `${COMPANY.address.en.city}, ${COMPANY.address.en.country}`],
    footerAddressFull: COMPANY.address.en.full,
    footerWarehouse: COMPANY.address.en.warehouse,
    footerLinks: ["Terms", "Privacy"],
    footerCopy: "© 2026 Beeri Packaging. All rights reserved.",
    logoHe: "/images/logo-he.svg",
    logoEn: "/images/logo-en.svg",
    wordmark: "Beeri Packaging",
    footerTagline: "Custom folding-carton packaging — designed, printed and finished under one roof.",
    footerHeritage: "",
    footerNavHeading: "Explore",
    footerConnectHeading: "Get in touch",
    email: emailAddr,
    mapsHref,
    footerLocationHeading: "Our location",
    footerDirections: "Get directions",
    footerMapTitle: "Map of Beeri Packaging, 4 Paran St., Yavne",
    mapsDirectionsHref: MAPS_DIRECTIONS_HREF,
    mapEmbedSrc: mapsEmbedSrc("en"),
    social: [
      { label: "LinkedIn", href: linkedinHref, platform: "linkedin" },
      { label: "Facebook", href: facebookHref, platform: "facebook" },
    ],
    legal: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
};
