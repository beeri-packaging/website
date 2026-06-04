import { defineQuery } from "next-sanity";

import { client } from "./client";
import {
  homeCopy,
  homeImages,
  capabilities as bundledCaps,
  faqItems as bundledFaqs,
  journeyPanels as bundledJourney,
  type HomeCopy,
  type Lang,
} from "@/app/content/home";
import { chromeContent, type Chrome } from "@/app/content/site";

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
  capabilities[]{ n, title, body },
  faqItems[]{ n, q, a },
  journeyPanels[]{
    key, theme, accent, tagColor, tag, title, body, link,
    legacyImagePath,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt
  },
  "heroImageUrl": heroImage.asset->url,
  "bentoServiceImageUrl": bentoServiceImage.asset->url
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
  capabilities?: { n: string; title: string; body: string }[];
  faqItems?: { n: string; q: string; a: string }[];
  journeyPanels?: {
    key: string; theme: "dark" | "light"; accent: "purple" | "yellow";
    tagColor: string; tag: string; title: string; body: string; link: string;
    legacyImagePath?: string; imageUrl?: string; imageAlt?: string;
  }[];
  heroImageUrl?: string;
  bentoServiceImageUrl?: string;
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
  };
}

// ---------------------------------------------------------------------------
// Home — resolved content types + mapper (lists + images)
// ---------------------------------------------------------------------------

export type HomeCapability = { n: string; title: string; body: string };
export type HomeFaqItem = { n: string; q: string; a: string };
export type HomeJourneyPanel = {
  key: string; theme: "dark" | "light"; accent: "purple" | "yellow";
  tagColor: "text-yellow" | "text-purple" | "text-magenta";
  tag: string; title: string; body: string; link: string; src: string;
};
export type HomeContent = {
  copy: HomeCopy;
  capabilities: readonly HomeCapability[];
  faqItems: readonly HomeFaqItem[];
  journeyPanels: readonly HomeJourneyPanel[];
  heroImage: string;
  bentoServiceImage: string;
};

export function toHomeContent(doc: HomeDoc | null, locale: Lang): HomeContent {
  const copy = toHomeCopy(doc, locale);
  const capabilities: HomeCapability[] = doc?.capabilities?.length
    ? doc.capabilities.map((c) => ({ n: c.n, title: c.title, body: c.body }))
    : bundledCaps.map((c) => ({ n: c.n, title: c[locale].title, body: c[locale].body }));
  const faqItems: HomeFaqItem[] = doc?.faqItems?.length
    ? doc.faqItems.map((f) => ({ n: f.n, q: f.q, a: f.a }))
    : bundledFaqs.map((f) => ({ n: f.n, q: f[locale].q, a: f[locale].a }));
  const journeyPanels: HomeJourneyPanel[] = doc?.journeyPanels?.length
    ? doc.journeyPanels.map((p) => {
        const fb = bundledJourney.find((b) => b.key === p.key);
        return {
          key: p.key, theme: p.theme, accent: p.accent,
          tagColor: p.tagColor as HomeJourneyPanel["tagColor"],
          tag: p.tag, title: p.title, body: p.body, link: p.link,
          src: p.imageUrl ?? p.legacyImagePath ?? fb?.src ?? "",
        };
      })
    : bundledJourney.map((p) => ({
        key: p.key, theme: p.theme, accent: p.accent, tagColor: p.tagColor,
        tag: p[locale].tag, title: p[locale].title, body: p[locale].body,
        link: p[locale].link, src: p.src,
      }));
  return {
    copy, capabilities, faqItems, journeyPanels,
    heroImage: doc?.heroImageUrl ?? homeImages.hero,
    bentoServiceImage: doc?.bentoServiceImageUrl ?? homeImages.bentoService,
  };
}

// ---------------------------------------------------------------------------
// Chrome (siteSettings) — global header / nav / footer / contact
// ---------------------------------------------------------------------------

export const chromeQuery = defineQuery(`*[_type == "siteSettings" && language == $locale][0]{
  menu, close, lang, contact,
  navLinks[]{ he, en, href },
  footerEyebrow, footerAddr, footerLinks, footerCopy,
  "logoHeUrl": logoHe.asset->url, "logoHeLegacy": logoHe.legacyImagePath,
  "logoEnUrl": logoEn.asset->url, "logoEnLegacy": logoEn.legacyImagePath
}`);

type ChromeDoc = {
  menu?: string;
  close?: string;
  lang?: string;
  contact?: string;
  navLinks?: { he: string; en: string; href: string }[];
  footerEyebrow?: string;
  footerAddr?: string[];
  footerLinks?: string[];
  footerCopy?: string;
  logoHeUrl?: string;
  logoHeLegacy?: string;
  logoEnUrl?: string;
  logoEnLegacy?: string;
};

export async function getChrome(locale: Lang): Promise<ChromeDoc | null> {
  try {
    return await client.fetch<ChromeDoc | null>(chromeQuery, { locale });
  } catch (err) {
    console.error("getChrome: Sanity fetch failed, using bundled chrome", err);
    return null;
  }
}

export function toChrome(doc: ChromeDoc | null, locale: Lang): Chrome {
  const fb = chromeContent[locale];
  if (!doc) return fb;
  return {
    menu: doc.menu ?? fb.menu,
    close: doc.close ?? fb.close,
    lang: doc.lang ?? fb.lang,
    contact: doc.contact ?? fb.contact,
    navLinks:
      doc.navLinks && doc.navLinks.length > 0 ? doc.navLinks : fb.navLinks,
    footerEyebrow: doc.footerEyebrow ?? fb.footerEyebrow,
    footerAddr: tuple(doc.footerAddr, fb.footerAddr),
    footerLinks:
      doc.footerLinks && doc.footerLinks.length > 0
        ? doc.footerLinks
        : fb.footerLinks,
    footerCopy: doc.footerCopy ?? fb.footerCopy,
    logoHe: doc.logoHeUrl ?? doc.logoHeLegacy ?? fb.logoHe,
    logoEn: doc.logoEnUrl ?? doc.logoEnLegacy ?? fb.logoEn,
  };
}

// ---------------------------------------------------------------------------
// Careers — /careers page
// ---------------------------------------------------------------------------

import { careersCopy } from "@/app/content/careers";
import type { CareersCopy } from "@/app/content/careers";

export const careersQuery = defineQuery(`*[_type == "careers" && language == $locale][0]{
  eyebrow, title, intro, searchPlaceholder, searchButtonLabel,
  rolesTitle, apply, noRoles,
  newsletterTitle, newsletterBody, emailPlaceholder, newsletterCta,
  articles[]{ tag, meta, title, body, cta, theme,
    "imageUrl": image.asset->url, "imageLegacy": image.legacyImagePath },
  filters[]{ key, label },
  roles[]{ code, status, title, scope, location, department }
}`);

export async function getCareers(locale: Lang) {
  try { return await client.fetch(careersQuery, { locale }); }
  catch (err) { console.error("getCareers failed, using bundled copy", err); return null; }
}

export function toCareersCopy(doc: Awaited<ReturnType<typeof getCareers>>, locale: Lang): CareersCopy {
  const fb = careersCopy[locale];
  if (!doc) return fb;
  return {
    eyebrow: doc.eyebrow ?? fb.eyebrow,
    title: tuple(doc.title, fb.title),
    intro: doc.intro ?? fb.intro,
    searchPlaceholder: doc.searchPlaceholder ?? fb.searchPlaceholder,
    searchButtonLabel: doc.searchButtonLabel ?? fb.searchButtonLabel,
    articles: doc.articles?.length
      ? doc.articles.map((a: { tag: string; meta?: string; title?: string[]; body?: string; imageUrl?: string; imageLegacy?: string; cta?: string; theme: "feature" | "plain" | "yellow" | "image" | "wide" }) => ({
          tag: a.tag, meta: a.meta ?? undefined,
          title: a.title ?? [], body: a.body ?? undefined,
          image: a.imageUrl ?? a.imageLegacy ?? undefined,
          cta: a.cta ?? undefined, theme: a.theme,
        }))
      : fb.articles,
    rolesTitle: doc.rolesTitle ?? fb.rolesTitle,
    filters: doc.filters?.length ? doc.filters : fb.filters,
    apply: doc.apply ?? fb.apply,
    noRoles: doc.noRoles ?? fb.noRoles,
    roles: doc.roles?.length ? doc.roles : fb.roles,
    newsletterTitle: tuple(doc.newsletterTitle, fb.newsletterTitle),
    newsletterBody: doc.newsletterBody ?? fb.newsletterBody,
    emailPlaceholder: doc.emailPlaceholder ?? fb.emailPlaceholder,
    newsletterCta: doc.newsletterCta ?? fb.newsletterCta,
  } as CareersCopy;
}

// ---------------------------------------------------------------------------
// Finishing — /finishing page
// ---------------------------------------------------------------------------

import { finishingCopy } from "@/app/content/finishing";
import type { FinishingCopy, FinishingGridItem } from "@/app/content/finishing";

const ITEM = `{ eyebrow, title, body, sample, cta,
  "imageUrl": image.asset->url, "imageLegacy": image.legacyImagePath }`;

export const finishingQuery = defineQuery(`*[_type == "finishing" && language == $locale][0]{
  step, title, intro,
  feature${ITEM},
  metricsTitle, metrics[]{ label, value },
  quote, quoteBy,
  deboss${ITEM}, texture${ITEM},
  ctaTitle, ctaPrimary, ctaSecondary,
  sampleCard{ value, label }, isoCard{ value, label }
}`);

export async function getFinishing(locale: Lang) {
  try { return await client.fetch(finishingQuery, { locale }); }
  catch (err) { console.error("getFinishing failed, using bundled copy", err); return null; }
}

function mapItem(i: { eyebrow?: string; title?: string; body?: string; sample?: string; cta?: string; imageUrl?: string; imageLegacy?: string } | null, fb: FinishingGridItem): FinishingGridItem {
  if (!i) return fb;
  return {
    eyebrow: i.eyebrow ?? fb.eyebrow,
    title: i.title ?? fb.title,
    body: i.body ?? fb.body,
    image: i.imageUrl ?? i.imageLegacy ?? fb.image,
    sample: i.sample ?? fb.sample,
    cta: i.cta ?? fb.cta,
  };
}

export function toFinishingCopy(doc: Awaited<ReturnType<typeof getFinishing>>, locale: Lang): FinishingCopy {
  const fb = finishingCopy[locale];
  if (!doc) return fb;
  return {
    step: doc.step ?? fb.step,
    title: tuple(doc.title, fb.title),
    intro: doc.intro ?? fb.intro,
    feature: mapItem(doc.feature, fb.feature),
    metricsTitle: doc.metricsTitle ?? fb.metricsTitle,
    metrics: doc.metrics?.length ? doc.metrics : fb.metrics,
    quote: doc.quote ?? fb.quote,
    quoteBy: doc.quoteBy ?? fb.quoteBy,
    deboss: mapItem(doc.deboss, fb.deboss),
    texture: mapItem(doc.texture, fb.texture),
    ctaTitle: doc.ctaTitle ?? fb.ctaTitle,
    ctaPrimary: doc.ctaPrimary ?? fb.ctaPrimary,
    ctaSecondary: doc.ctaSecondary ?? fb.ctaSecondary,
    sampleCard: doc.sampleCard ?? fb.sampleCard,
    isoCard: doc.isoCard ?? fb.isoCard,
  } as FinishingCopy;
}

// ---------------------------------------------------------------------------
// Blog — /blog page (settings + posts)
// ---------------------------------------------------------------------------

import { blogIndexCopy, blogPosts, categoryLabels } from "@/app/content/blog";
import type { BlogIndexCopy, BlogPost, BlogCategory } from "@/app/content/blog";

// --- Blog settings (index copy + category labels) ---
export const blogSettingsQuery = defineQuery(`*[_type == "blogSettings" && language == $locale][0]{
  eyebrow, title, lead, body, comingSoon, readMore, backToBlog, publishedOn,
  notFoundTitle, notFoundBody, categoryLabels[]{ key, label }
}`);

export async function getBlogSettings(locale: Lang) {
  try { return await client.fetch(blogSettingsQuery, { locale }); }
  catch (err) { console.error("getBlogSettings failed, using bundled copy", err); return null; }
}

export function toBlogIndexCopy(doc: Awaited<ReturnType<typeof getBlogSettings>>, locale: Lang): BlogIndexCopy {
  const fb = blogIndexCopy[locale];
  if (!doc) return fb;
  return {
    eyebrow: doc.eyebrow ?? fb.eyebrow,
    title: (doc.title?.length ? doc.title : fb.title) as BlogIndexCopy["title"],
    lead: doc.lead ?? fb.lead,
    body: doc.body ?? fb.body,
    comingSoon: doc.comingSoon ?? fb.comingSoon,
    readMore: doc.readMore ?? fb.readMore,
    backToBlog: doc.backToBlog ?? fb.backToBlog,
    publishedOn: doc.publishedOn ?? fb.publishedOn,
    notFoundTitle: doc.notFoundTitle ?? fb.notFoundTitle,
    notFoundBody: doc.notFoundBody ?? fb.notFoundBody,
  };
}

/** Per-locale category label map, falling back to bundled labels. */
export function toCategoryLabels(doc: Awaited<ReturnType<typeof getBlogSettings>>, locale: Lang): Record<BlogCategory, string> {
  const fb = Object.fromEntries(
    (Object.keys(categoryLabels) as BlogCategory[]).map((k) => [k, categoryLabels[k][locale]])
  ) as Record<BlogCategory, string>;
  if (!doc?.categoryLabels?.length) return fb;
  const out = { ...fb };
  for (const { key, label } of doc.categoryLabels) {
    if (key && label && key in out) out[key as BlogCategory] = label;
  }
  return out;
}

// --- Posts (single-locale projection) ---
const POST = `{
  "slug": slug.current, date, read, category,
  "imageUrl": image.asset->url, "imageLegacy": image.legacyImagePath,
  title, excerpt, body
}`;

export const allPostsQuery = defineQuery(`*[_type == "post" && language == $locale] | order(date desc) ${POST}`);
export const postQuery = defineQuery(`*[_type == "post" && language == $locale && slug.current == $slug][0] ${POST}`);

type PostDoc = {
  slug?: string; date?: string; read?: string; category?: BlogCategory;
  imageUrl?: string; imageLegacy?: string;
  title?: string; excerpt?: string; body?: string[];
};

/** A single-locale post shape consumed by the blog components. */
export type LocalizedPost = {
  slug: string; date: string; read: string; category: BlogCategory;
  image?: string; title: string; excerpt: string; body: readonly string[];
};

function fbPost(p: BlogPost, locale: Lang): LocalizedPost {
  return {
    slug: p.slug, date: p.date, read: p.read[locale], category: p.category,
    image: p.image, title: p[locale].title, excerpt: p[locale].excerpt, body: p[locale].body,
  };
}

function mapPost(d: PostDoc, locale: Lang): LocalizedPost {
  const fb = blogPosts.find((p) => p.slug === d.slug);
  return {
    slug: d.slug ?? fb?.slug ?? "",
    date: d.date ?? fb?.date ?? "",
    read: d.read ?? (fb ? fb.read[locale] : ""),
    category: d.category ?? fb?.category ?? "studio",
    image: d.imageUrl ?? d.imageLegacy ?? fb?.image,
    title: d.title ?? (fb ? fb[locale].title : ""),
    excerpt: d.excerpt ?? (fb ? fb[locale].excerpt : ""),
    body: d.body?.length ? d.body : (fb ? fb[locale].body : []),
  };
}

export async function getAllPosts(locale: Lang): Promise<LocalizedPost[]> {
  try {
    const docs = await client.fetch<PostDoc[]>(allPostsQuery, { locale });
    if (!docs?.length) return blogPosts.map((p) => fbPost(p, locale));
    return docs.map((d) => mapPost(d, locale));
  } catch (err) {
    console.error("getAllPosts failed, using bundled copy", err);
    return blogPosts.map((p) => fbPost(p, locale));
  }
}

export async function getPost(slug: string, locale: Lang): Promise<LocalizedPost | null> {
  try {
    const doc = await client.fetch<PostDoc | null>(postQuery, { locale, slug });
    if (doc) return mapPost(doc, locale);
  } catch (err) {
    console.error("getPost failed, using bundled copy", err);
  }
  const fb = blogPosts.find((p) => p.slug === slug);
  return fb ? fbPost(fb, locale) : null;
}

// ---------------------------------------------------------------------------
// Catalog — /catalog page
// ---------------------------------------------------------------------------

import { catalogCopy } from "@/app/content/catalog";
import type {
  CatalogCopy,
  CatalogCategory,
  CatalogItem,
  CatalogTag,
  CatalogSpec,
} from "@/app/content/catalog";

export const catalogQuery = defineQuery(`*[_type == "catalog" && language == $locale][0]{
  language, eyebrow, title, intro, specCard,
  categories[]{
    key, number, name, count, layout,
    items[]{
      key, name, series, description,
      tags[]{ label, tone },
      specs[]{ label, value },
      overlayLabel, overlaySpecs, cta,
      "imageUrl": image.asset->url, "imageLegacy": image.legacyImagePath
    }
  }
}`);

type CatalogItemDoc = {
  key?: string; name?: string; series?: string; description?: string;
  tags?: { label: string; tone: CatalogTag["tone"] }[];
  specs?: { label: string; value: string }[];
  overlayLabel?: string; overlaySpecs?: string[]; cta?: string;
  imageUrl?: string; imageLegacy?: string;
};
type CatalogCategoryDoc = {
  key?: string; number?: string; name?: string; count?: string;
  layout?: CatalogCategory["layout"]; items?: CatalogItemDoc[];
};
type CatalogDoc = {
  language?: Lang; eyebrow?: string; title?: string[]; intro?: string;
  specCard?: string[]; categories?: CatalogCategoryDoc[];
};

export async function getCatalog(locale: Lang): Promise<CatalogDoc | null> {
  try {
    return await client.fetch<CatalogDoc | null>(catalogQuery, { locale });
  } catch (err) {
    console.error("getCatalog: Sanity fetch failed, using bundled copy", err);
    return null;
  }
}

/**
 * Map a fetched `catalog` document to the exact `CatalogCopy` shape the
 * components consume, resolving each item's image (uploaded asset URL, else
 * the local fallback path) and filling any gaps from the bundled copy by key.
 */
export function toCatalogContent(doc: CatalogDoc | null, locale: Lang): CatalogCopy {
  const fb = catalogCopy[locale];
  if (!doc?.categories?.length) return fb;

  const categories: CatalogCategory[] = doc.categories.map((c) => {
    const fbCat = fb.categories.find((x) => x.key === c.key);
    const items: CatalogItem[] = (c.items ?? []).map((it) => {
      const fbItem = fbCat?.items.find((x) => x.key === it.key);
      return {
        key: it.key ?? fbItem?.key ?? "",
        name: it.name ?? fbItem?.name ?? "",
        series: it.series ?? fbItem?.series,
        description: it.description ?? fbItem?.description ?? "",
        image: it.imageUrl ?? it.imageLegacy ?? fbItem?.image,
        tags: (it.tags?.length ? it.tags : fbItem?.tags) as readonly CatalogTag[] | undefined,
        specs: (it.specs?.length ? it.specs : fbItem?.specs) as readonly CatalogSpec[] | undefined,
        overlayLabel: it.overlayLabel ?? fbItem?.overlayLabel,
        overlaySpecs: it.overlaySpecs?.length ? it.overlaySpecs : fbItem?.overlaySpecs,
        cta: it.cta ?? fbItem?.cta,
      };
    });
    return {
      key: c.key ?? fbCat?.key ?? "",
      number: c.number ?? fbCat?.number ?? "",
      name: c.name ?? fbCat?.name ?? "",
      count: c.count ?? fbCat?.count ?? "",
      layout: c.layout ?? fbCat?.layout ?? "grid",
      items: items.length ? items : (fbCat?.items ?? []),
    };
  });

  return {
    eyebrow: doc.eyebrow ?? fb.eyebrow,
    title: tuple(doc.title, fb.title),
    intro: doc.intro ?? fb.intro,
    specCard: (doc.specCard?.length === 3 ? doc.specCard : fb.specCard) as CatalogCopy["specCard"],
    categories,
  };
}

// ---------------------------------------------------------------------------
// Placeholder pages — /portfolio (+ /finishing, /careers, /blog)
// ---------------------------------------------------------------------------

import { placeholderContent } from "@/app/content/placeholder";
import type { PlaceholderCopy, PlaceholderRoute } from "@/app/content/placeholder";

export const placeholderQuery = defineQuery(`*[_type == "placeholderPage" && language == $locale && route == $route][0]{
  eyebrow, title, lead, body, preview, ctaPrimary, ctaSecondary
}`);

export async function getPlaceholder(route: PlaceholderRoute, locale: Lang) {
  try { return await client.fetch(placeholderQuery, { locale, route }); }
  catch (err) { console.error("getPlaceholder failed, using bundled copy", err); return null; }
}

export function toPlaceholderCopy(doc: Awaited<ReturnType<typeof getPlaceholder>>, route: PlaceholderRoute, locale: Lang): PlaceholderCopy {
  const fb = placeholderContent[route][locale];
  if (!doc) return fb;
  return {
    eyebrow: doc.eyebrow ?? fb.eyebrow,
    title: (doc.title?.length ? doc.title : fb.title) as PlaceholderCopy["title"],
    lead: doc.lead ?? fb.lead,
    body: doc.body ?? fb.body,
    preview: doc.preview?.length ? doc.preview : fb.preview,
    ctaPrimary: doc.ctaPrimary ?? fb.ctaPrimary,
    ctaSecondary: doc.ctaSecondary ?? fb.ctaSecondary,
  };
}
