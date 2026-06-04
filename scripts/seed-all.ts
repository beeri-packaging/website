// scripts/seed-all.ts
import { writeClient } from "./lib/sanity-write-client";
import { uploadImage, type ImageRef } from "./lib/upload-images";
import { capabilities, faqItems, homeCopy, homeImages, journeyPanels } from "../app/content/home";
import { chromeContent } from "../app/content/site";
import { careersCopy, careersImages } from "../app/content/careers";
import { finishingCopy, finishingImages } from "../app/content/finishing";
import { blogIndexCopy, blogPosts, categoryLabels } from "../app/content/blog";
import { placeholderContent } from "../app/content/placeholder";
import type { Lang } from "../app/content/home";

const LANGS: Lang[] = ["he", "en"];
const legacy = (p: string, alt: string) => ({ _type: "image" as const, alt, legacyImagePath: p });

async function linkTranslations(id: string, type: string, heId: string, enId: string) {
  await writeClient.createOrReplace({
    _id: id, _type: "translation.metadata", schemaTypes: [type],
    translations: [
      { _key: "he", value: { _type: "reference", _ref: heId } },
      { _key: "en", value: { _type: "reference", _ref: enId } },
    ],
  });
}

async function main() {
  console.log("Uploading images...");
  const heroImage = await uploadImage(homeImages.hero, "אריזות קרטון בהתאמה אישית");
  const bentoServiceImage = await uploadImage(homeImages.bentoService, "חיתוך שטנץ");
  const logoHe = await uploadImage(chromeContent.en.logoHe, "בארי אריזות");
  const logoEn = await uploadImage(chromeContent.en.logoEn, "Beeri Packaging");
  // journey panels (shared across locales) keyed by panel.key
  const journeyImg: Record<string, ImageRef> = {};
  for (const p of journeyPanels) journeyImg[p.key] = await uploadImage(p.src, p.he.title);
  // finishing items
  const finFoil = await uploadImage(finishingImages.foil, "פויל");
  const finDeboss = await uploadImage(finishingImages.deboss, "הבלטה");
  const finTexture = await uploadImage(finishingImages.texture, "מרקם");
  // careers
  const carFeature = await uploadImage(careersImages.feature, "תהליך ייצור");
  const carMaterials = await uploadImage(careersImages.materials, "מעבדת חומרים");

  for (const lang of LANGS) {
    const t = homeCopy[lang];
    // HOME
    await writeClient.createOrReplace({
      _id: `home-${lang}`, _type: "home", language: lang,
      eyebrow: t.eyebrow, h1: [...t.h1], cta1: t.cta1, cta2: t.cta2, scroll: t.scroll, contact: t.contact,
      journeyEyebrow: t.journeyEyebrow, journeyTitle: t.journeyTitle, journeyDesc: t.journeyDesc,
      techTitle: t.techTitle, techBody: t.techBody,
      bento1Title: t.bento1Title, bento1Body: t.bento1Body, bento2Title: t.bento2Title, bento2Body: t.bento2Body,
      badge1: t.badge1, badge2: t.badge2,
      faqEyebrow: t.faqEyebrow, faqTitle: t.faqTitle, faqBody: t.faqBody, ctaTitle: [...t.ctaTitle],
      capabilities: capabilities.map((c) => ({ _type: "capability", _key: c.n, n: c.n, title: c[lang].title, body: c[lang].body })),
      faqItems: faqItems.map((f) => ({ _type: "faqItem", _key: f.n, n: f.n, q: f[lang].q, a: f[lang].a })),
      journeyPanels: journeyPanels.map((p) => ({
        _type: "journeyPanel", _key: p.key, key: p.key, image: journeyImg[p.key],
        theme: p.theme, accent: p.accent, tagColor: p.tagColor,
        tag: p[lang].tag, title: p[lang].title, body: p[lang].body, link: p[lang].link,
      })),
      heroImage, bentoServiceImage,
    });

    // SITE SETTINGS (chrome)
    const c = chromeContent[lang];
    await writeClient.createOrReplace({
      _id: `siteSettings-${lang}`, _type: "siteSettings", language: lang,
      menu: c.menu, close: c.close, lang: c.lang, contact: c.contact,
      navLinks: c.navLinks.map((n, i) => ({ _type: "navLink", _key: `nav-${i}`, he: n.he, en: n.en, href: n.href })),
      footerEyebrow: c.footerEyebrow, footerAddr: [...c.footerAddr], footerLinks: [...c.footerLinks], footerCopy: c.footerCopy,
      logoHe, logoEn,
    });

    // CAREERS
    const ca = careersCopy[lang];
    const carImg: Record<string, ImageRef> = { [careersImages.feature]: carFeature, [careersImages.materials]: carMaterials };
    await writeClient.createOrReplace({
      _id: `careers-${lang}`, _type: "careers", language: lang,
      eyebrow: ca.eyebrow, title: [...ca.title], intro: ca.intro,
      searchPlaceholder: ca.searchPlaceholder, searchButtonLabel: ca.searchButtonLabel,
      articles: ca.articles.map((a, i) => ({
        _type: "careersArticle", _key: `art-${i}`, tag: a.tag, meta: a.meta, title: [...a.title],
        body: a.body, cta: a.cta, theme: a.theme, ...(a.image ? { image: carImg[a.image] } : {}),
      })),
      rolesTitle: ca.rolesTitle,
      filters: ca.filters.map((f, i) => ({ _type: "careerFilter", _key: `flt-${i}`, key: f.key, label: f.label })),
      apply: ca.apply, noRoles: ca.noRoles,
      roles: ca.roles.map((r, i) => ({ _type: "careerRole", _key: `role-${i}`, ...r })),
      newsletterTitle: [...ca.newsletterTitle], newsletterBody: ca.newsletterBody,
      emailPlaceholder: ca.emailPlaceholder, newsletterCta: ca.newsletterCta,
    });

    // FINISHING
    const fi = finishingCopy[lang];
    const finImg: Record<string, ImageRef> = { [finishingImages.foil]: finFoil, [finishingImages.deboss]: finDeboss, [finishingImages.texture]: finTexture };
    const finItem = (it: typeof fi.feature) => ({
      _type: "finishingItem", eyebrow: it.eyebrow, title: it.title, body: it.body,
      sample: it.sample, cta: it.cta, ...(it.image ? { image: finImg[it.image] } : {}),
    });
    await writeClient.createOrReplace({
      _id: `finishing-${lang}`, _type: "finishing", language: lang,
      step: fi.step, title: [...fi.title], intro: fi.intro,
      feature: finItem(fi.feature),
      metricsTitle: fi.metricsTitle,
      metrics: fi.metrics.map((m, i) => ({ _type: "finishingMetric", _key: `m-${i}`, ...m })),
      quote: fi.quote, quoteBy: fi.quoteBy,
      deboss: finItem(fi.deboss), texture: finItem(fi.texture),
      ctaTitle: fi.ctaTitle, ctaPrimary: fi.ctaPrimary, ctaSecondary: fi.ctaSecondary,
      sampleCard: fi.sampleCard, isoCard: fi.isoCard,
    });

    // BLOG SETTINGS
    const bi = blogIndexCopy[lang];
    await writeClient.createOrReplace({
      _id: `blogSettings-${lang}`, _type: "blogSettings", language: lang,
      eyebrow: bi.eyebrow, title: [...bi.title], lead: bi.lead, body: bi.body,
      comingSoon: bi.comingSoon, readMore: bi.readMore, backToBlog: bi.backToBlog,
      publishedOn: bi.publishedOn, notFoundTitle: bi.notFoundTitle, notFoundBody: bi.notFoundBody,
      categoryLabels: (Object.keys(categoryLabels) as (keyof typeof categoryLabels)[]).map((k) => ({
        _type: "categoryLabel", _key: k, key: k, label: categoryLabels[k][lang],
      })),
    });

    // POSTS
    for (const p of blogPosts) {
      await writeClient.createOrReplace({
        _id: `post-${p.slug}-${lang}`, _type: "post", language: lang,
        slug: { _type: "slug", current: p.slug },
        date: p.date, read: p.read[lang], category: p.category,
        ...(p.image ? { image: legacy(p.image, p[lang].title) } : {}),
        title: p[lang].title, excerpt: p[lang].excerpt, body: [...p[lang].body],
      });
    }

    // PLACEHOLDER PAGES (catalog + portfolio)
    for (const route of ["catalog", "portfolio"] as const) {
      const pc = placeholderContent[route][lang];
      await writeClient.createOrReplace({
        _id: `placeholder-${route}-${lang}`, _type: "placeholderPage", language: lang, route,
        eyebrow: pc.eyebrow, title: [...pc.title], lead: pc.lead, body: pc.body,
        preview: [...pc.preview], ctaPrimary: pc.ctaPrimary, ctaSecondary: pc.ctaSecondary,
      });
    }
    console.log(`  ✓ all docs for ${lang}`);
  }

  // Link translation pairs (singletons + page docs)
  await linkTranslations("home-translation", "home", "home-he", "home-en");
  await linkTranslations("careers-translation", "careers", "careers-he", "careers-en");
  await linkTranslations("finishing-translation", "finishing", "finishing-he", "finishing-en");
  await linkTranslations("siteSettings-translation", "siteSettings", "siteSettings-he", "siteSettings-en");
  await linkTranslations("blogSettings-translation", "blogSettings", "blogSettings-he", "blogSettings-en");
  for (const route of ["catalog", "portfolio"] as const)
    await linkTranslations(`placeholder-${route}-translation`, "placeholderPage", `placeholder-${route}-he`, `placeholder-${route}-en`);
  for (const p of blogPosts)
    await linkTranslations(`post-${p.slug}-translation`, "post", `post-${p.slug}-he`, `post-${p.slug}-en`);

  console.log("Done.");
}

main().catch((err) => { console.error(err); process.exit(1); });
