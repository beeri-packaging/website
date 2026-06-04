// app/content/site.ts
import type { Lang, NavLink } from "@/app/content/home";

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
};

export const navLinks: readonly NavLink[] = [
  { he: "פורטפוליו", en: "Work", href: "/portfolio" },
  { he: "השבחות", en: "Finishing", href: "/finishing" },
  { he: "קריירה", en: "Careers", href: "/careers" },
  { he: "קטלוג", en: "Catalog", href: "/catalog" },
  { he: "בלוג", en: "Blog", href: "/blog" },
];

export const chromeContent: Record<Lang, Chrome> = {
  he: {
    menu: "תפריט",
    close: "סגירה",
    lang: "שפה",
    contact: "צור קשר",
    navLinks,
    footerEyebrow: "סטודיו ומפעל",
    footerAddr: ["פארן 4", "יבנה"],
    footerLinks: ["INSTAGRAM", "LINKEDIN", "תנאים", "פרטיות"],
    footerCopy: "© 2026 בארי אריזות. כל הזכויות שמורות.",
    logoHe: "/images/logo-he.svg",
    logoEn: "/images/logo-en.svg",
  },
  en: {
    menu: "Menu",
    close: "Close",
    lang: "Language",
    contact: "Contact",
    navLinks,
    footerEyebrow: "Studio & factory",
    footerAddr: ["4 Paran St.", "Yavne, Israel"],
    footerLinks: ["INSTAGRAM", "LINKEDIN", "Terms", "Privacy"],
    footerCopy: "© 2026 Beeri Packaging. All rights reserved.",
    logoHe: "/images/logo-he.svg",
    logoEn: "/images/logo-en.svg",
  },
};
