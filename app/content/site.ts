// app/content/site.ts
import type { Lang, NavLink } from "@/app/content/home";
import { COMPANY, MAPS_HREF } from "@/app/content/company";

export type FooterLink = { label: string; href: string };

export type Chrome = {
  menu: string;
  close: string;
  lang: string;
  contact: string;
  navLinks: readonly NavLink[];
  footerEyebrow: string;
  footerAddr: readonly [string, string];
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
  social: readonly FooterLink[];
  legal: readonly FooterLink[];
};

const linkedinHref = COMPANY.linkedin;
const emailAddr = COMPANY.email;
const mapsHref = MAPS_HREF;

export const navLinks: readonly NavLink[] = [
  { he: "אודות", en: "About", href: "/about" },
  { he: "השבחות", en: "Finishing", href: "/finishing" },
  { he: "תובנות", en: "Insights", href: "/blog" },
  { he: "קטלוג", en: "Catalog", href: "/catalog" },
];

export const chromeContent: Record<Lang, Chrome> = {
  he: {
    menu: "תפריט",
    close: "סגירה",
    lang: "שפה",
    contact: "ליצירת קשר",
    navLinks,
    footerEyebrow: "סטודיו ומפעל",
    footerAddr: [COMPANY.address.he.street, COMPANY.address.he.city],
    footerLinks: ["תנאים", "פרטיות"],
    footerCopy: "© 2026 בארי אריזות. כל הזכויות שמורות.",
    logoHe: "/images/logo-he.svg",
    logoEn: "/images/logo-en.svg",
    wordmark: "בארי אריזות",
    footerTagline: "אריזות קרטון בהתאמה אישית — תכנון, דפוס והשבחה תחת קורת גג אחת.",
    footerHeritage: "משנת 1964",
    footerNavHeading: "ניווט",
    footerConnectHeading: "יצירת קשר",
    email: emailAddr,
    mapsHref,
    social: [{ label: "LinkedIn", href: linkedinHref }],
    legal: [
      { label: "תנאים", href: "/terms" },
      { label: "פרטיות", href: "/privacy" },
    ],
  },
  en: {
    menu: "Menu",
    close: "Close",
    lang: "Language",
    contact: "Contact",
    navLinks,
    footerEyebrow: "Studio & factory",
    footerAddr: [COMPANY.address.en.street, `${COMPANY.address.en.city}, ${COMPANY.address.en.country}`],
    footerLinks: ["Terms", "Privacy"],
    footerCopy: "© 2026 Beeri Packaging. All rights reserved.",
    logoHe: "/images/logo-he.svg",
    logoEn: "/images/logo-en.svg",
    wordmark: "Beeri Packaging",
    footerTagline: "Custom folding-carton packaging — designed, printed and finished under one roof.",
    footerHeritage: "Since 1964",
    footerNavHeading: "Explore",
    footerConnectHeading: "Get in touch",
    email: emailAddr,
    mapsHref,
    social: [{ label: "LinkedIn", href: linkedinHref }],
    legal: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
};
