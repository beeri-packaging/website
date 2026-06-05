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
  /** Primary contact email (placeholder until the production address is set). */
  email: "contact@beeri.com",
  /** Company LinkedIn page. */
  linkedin: "https://www.linkedin.com/company/beeri-packaging/",
  /** Postal address, per locale. */
  address: {
    he: { street: "פארן 4", city: "יבנה", country: "ישראל" },
    en: { street: "4 Paran St.", city: "Yavne", country: "Israel" },
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
  address: Record<Lang, CompanyAddress>;
};

/** `mailto:` href for the primary contact email. */
export const EMAIL_HREF = `mailto:${COMPANY.email}`;

/** Pre-encoded Google Maps search link for the company address. */
export const MAPS_HREF =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(`${COMPANY.address.he.street} ${COMPANY.address.he.city}`);

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
