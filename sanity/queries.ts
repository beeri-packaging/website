import { defineQuery } from "next-sanity";

import { client } from "./client";
import {
  homeCopy,
  type HomeCopy,
  type Lang,
} from "@/app/content/home";

/**
 * One `home` document per locale (document-internationalization). Select every
 * `HomeCopy` field plus the embedded arrays and image refs (resolving the
 * asset URL where uploaded, keeping `legacyImagePath` otherwise).
 */
export const homeQuery = defineQuery(`*[_type == "home" && language == $locale][0]{
  language,
  eyebrow, h1, cta1, cta2, scroll, contact,
  journeyEyebrow, journeyTitle, journeyDesc,
  techTitle, techBody,
  bento1Title, bento1Body, bento2Title, bento2Body,
  badge1, badge2,
  faqEyebrow, faqTitle, faqBody,
  ctaTitle,
  footerEyebrow, footerAddr, footerLinks, footerCopy,
  menu, close, lang,
  capabilities[]{ n, title, body },
  faqItems[]{ n, q, a },
  journeyPanels[]{
    key, theme, accent, tagColor, tag, title, body, link,
    legacyImagePath,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt
  },
  navLinks[]{ he, en, href },
  "heroImageUrl": heroImage.asset->url,
  "bentoServiceImageUrl": bentoServiceImage.asset->url,
  "logoHeUrl": logoHe.asset->url,
  "logoEnUrl": logoEn.asset->url
}`);

export type HomeDoc = {
  language: Lang;
  eyebrow: string;
  h1: string[];
  cta1: string;
  cta2: string;
  scroll: string;
  contact: string;
  journeyEyebrow: string;
  journeyTitle: string;
  journeyDesc: string;
  techTitle: string;
  techBody: string;
  bento1Title: string;
  bento1Body: string;
  bento2Title: string;
  bento2Body: string;
  badge1: string;
  badge2: string;
  faqEyebrow: string;
  faqTitle: string;
  faqBody: string;
  ctaTitle: string[];
  footerEyebrow: string;
  footerAddr: string[];
  footerLinks: string[];
  footerCopy: string;
  menu: string;
  close: string;
  lang: string;
};

/**
 * Fetch the localized `home` document. Returns `null` if none exists yet
 * (e.g. before the content has been seeded), so callers can fall back to the
 * bundled copy and keep the page rendering identically.
 */
export async function getHome(locale: Lang): Promise<HomeDoc | null> {
  try {
    return await client.fetch<HomeDoc | null>(homeQuery, { locale });
  } catch (err) {
    // Fail soft: any Sanity outage/auth issue falls back to the bundled copy
    // so the page (and the build) never breaks on the CMS.
    console.error("getHome: Sanity fetch failed, using bundled copy", err);
    return null;
  }
}

const tuple = (
  arr: string[] | undefined,
  fallback: readonly [string, string]
): readonly [string, string] =>
  arr && arr.length >= 2 ? [arr[0], arr[1]] : fallback;

/**
 * Map a fetched `home` document to the exact `HomeCopy` shape the home
 * components expect. When `doc` is null/missing, returns the bundled copy for
 * the locale so the page renders unchanged until Sanity is seeded.
 */
export function toHomeCopy(doc: HomeDoc | null, locale: Lang): HomeCopy {
  const fallback = homeCopy[locale];
  if (!doc) return fallback;

  return {
    eyebrow: doc.eyebrow ?? fallback.eyebrow,
    h1: tuple(doc.h1, fallback.h1),
    cta1: doc.cta1 ?? fallback.cta1,
    cta2: doc.cta2 ?? fallback.cta2,
    scroll: doc.scroll ?? fallback.scroll,
    contact: doc.contact ?? fallback.contact,
    journeyEyebrow: doc.journeyEyebrow ?? fallback.journeyEyebrow,
    journeyTitle: doc.journeyTitle ?? fallback.journeyTitle,
    journeyDesc: doc.journeyDesc ?? fallback.journeyDesc,
    techTitle: doc.techTitle ?? fallback.techTitle,
    techBody: doc.techBody ?? fallback.techBody,
    bento1Title: doc.bento1Title ?? fallback.bento1Title,
    bento1Body: doc.bento1Body ?? fallback.bento1Body,
    bento2Title: doc.bento2Title ?? fallback.bento2Title,
    bento2Body: doc.bento2Body ?? fallback.bento2Body,
    badge1: doc.badge1 ?? fallback.badge1,
    badge2: doc.badge2 ?? fallback.badge2,
    faqEyebrow: doc.faqEyebrow ?? fallback.faqEyebrow,
    faqTitle: doc.faqTitle ?? fallback.faqTitle,
    faqBody: doc.faqBody ?? fallback.faqBody,
    ctaTitle: tuple(doc.ctaTitle, fallback.ctaTitle),
    footerEyebrow: doc.footerEyebrow ?? fallback.footerEyebrow,
    footerAddr: tuple(doc.footerAddr, fallback.footerAddr),
    footerLinks:
      doc.footerLinks && doc.footerLinks.length > 0
        ? doc.footerLinks
        : fallback.footerLinks,
    footerCopy: doc.footerCopy ?? fallback.footerCopy,
    menu: doc.menu ?? fallback.menu,
    close: doc.close ?? fallback.close,
    lang: doc.lang ?? fallback.lang,
  };
}
