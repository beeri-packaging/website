// app/content/company.ts
//
// Single source of truth for Beeri Packaging's real-world business details.
// Verified against the Israeli Companies Registrar (רשם החברות):
//   בארי אריזות בע"מ · ח.פ. 520026113 · registered 28/04/1964 · Paran 4, Yavne.
// Import from here instead of re-hardcoding the email, address, registration
// number or social links anywhere else.

import type { Lang } from "@/app/content/home";

export type CompanyAddress = {
  street: string;
  city: string;
  country: string;
  /** Full single-line postal address (office), incl. park, ZIP and PO box. */
  full: string;
  /** Logistics centre / warehouse address (מרלו"ג). */
  warehouse: string;
};

export const COMPANY = {
  /** Registered legal entity name (Israeli Companies Registrar). */
  legalNameHe: 'בארי אריזות בע"מ',
  legalNameEn: "Beeri Packaging Ltd.",
  /** Brand / display name. */
  nameHe: "בארי אריזות",
  nameEn: "Beeri Packaging",
  /** Company registration number (ח.פ.). */
  registrationNumber: "520026113",
  /** Year the company was founded. */
  foundingYear: 1964,
  /** Parent group. */
  groupHe: "קבוצת דפוס בארי",
  groupEn: "Beeri Print Group",
  /** Primary contact email — the real משל"ט inbox; also the contact-form recipient. */
  email: "orders@beeripacks.co.il",
  /** Company LinkedIn page. */
  linkedin: "https://www.linkedin.com/company/beeri-packaging/",
  /** Facebook — the parent Beeri Print group page (בארי אריזות has no own page). */
  facebook: "https://www.facebook.com/100063563441171",
  /** Postal address, per locale. */
  address: {
    he: {
      street: "פארן 4",
      city: "יבנה",
      country: "ישראל",
      full: 'רחוב פארן 4, פארק טכנולוגי יבנה, מיקוד 8122503, ת.ד 13187',
      warehouse: 'מרלו"ג: רחוב שידלובסקי 1, מתחם ארגמן, יבנה',
    },
    en: {
      street: "4 Paran St.",
      city: "Yavne",
      country: "Israel",
      full: "4 Paran St., Yavne Technology Park, 8122503, P.O. Box 13187",
      warehouse: "Warehouse: 1 Shidlovsky St., Argaman Complex, Yavne",
    },
  },
} as const satisfies {
  legalNameHe: string;
  legalNameEn: string;
  nameHe: string;
  nameEn: string;
  registrationNumber: string;
  foundingYear: number;
  groupHe: string;
  groupEn: string;
  email: string;
  linkedin: string;
  facebook: string;
  address: Record<Lang, CompanyAddress>;
};

/** Pre-encoded Google Maps search link for the company address. */
export const MAPS_HREF =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(`${COMPANY.address.he.street} ${COMPANY.address.he.city}`);

// Google resolves Israeli addresses most reliably from the Hebrew form, so both
// locales point at the same query string — only the UI language (`hl`) changes.
const MAPS_QUERY = encodeURIComponent(
  `${COMPANY.address.he.street}, ${COMPANY.address.he.city}, ${COMPANY.address.he.country}`,
);

/** Pre-encoded turn-by-turn directions link to the office. */
export const MAPS_DIRECTIONS_HREF =
  `https://www.google.com/maps/dir/?api=1&destination=${MAPS_QUERY}`;

/**
 * Embeddable Google Maps URL for the office. This is the keyless `output=embed`
 * form, so it needs no API key — and because the footer map is click-to-load,
 * nothing is ever requested from Google until a visitor asks for the map.
 */
export function mapsEmbedSrc(lang: Lang): string {
  return `https://www.google.com/maps?q=${MAPS_QUERY}&hl=${lang}&z=16&output=embed`;
}

/** Localised company display name. */
export function companyName(lang: Lang): string {
  return lang === "he" ? COMPANY.nameHe : COMPANY.nameEn;
}

/** Localised registered legal name. */
export function companyLegalName(lang: Lang): string {
  return lang === "he" ? COMPANY.legalNameHe : COMPANY.legalNameEn;
}

/** Localised postal address. */
export function companyAddress(lang: Lang): CompanyAddress {
  return COMPANY.address[lang];
}
