/**
 * Seed the current home content into Sanity.
 *
 * Ports app/content/home.ts (homeCopy, capabilities, faqItems, journeyPanels,
 * homeImages) into two localized `home` documents (`home-he`,
 * `home-en`) plus a linking `translation.metadata` doc so the two appear as
 * translations of each other in Studio.
 *
 * - Idempotent: uses deterministic _ids + createOrReplace, so re-running
 *   overwrites cleanly.
 * - Images: uploads homeImages.hero and homeImages.bentoService to the Sanity
 *   asset CDN (so the CDN pipeline is real); all other images are stored as
 *   `legacyImagePath` strings to migrate later.
 *
 * Run: npx tsx scripts/seed-home.ts
 * Requires .env.local with NEXT_PUBLIC_SANITY_PROJECT_ID, _DATASET,
 * _API_VERSION and SANITY_API_READ_TOKEN (Editor perms).
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createClient } from "@sanity/client";

import {
  capabilities,
  faqItems,
  homeCopy,
  homeImages,
  journeyPanels,
  type Lang,
} from "../app/content/home";

// tsx does not auto-load .env.local — read it explicitly.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

function loadEnvLocal() {
  const envPath = path.join(repoRoot, ".env.local");
  let raw: string;
  try {
    raw = readFileSync(envPath, "utf8");
  } catch {
    return;
  }
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";
const token = process.env.SANITY_API_READ_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error(
    "Missing Sanity env: need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_READ_TOKEN in .env.local"
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

type ImageRef = {
  _type: "image";
  asset: { _type: "reference"; _ref: string };
  alt: string;
};

/** Upload a local public/ image and return an image field referencing it. */
async function uploadLocalImage(
  publicPath: string,
  alt: string
): Promise<ImageRef> {
  const filePath = path.join(repoRoot, "public", publicPath.replace(/^\//, ""));
  const buffer = readFileSync(filePath);
  const filename = path.basename(filePath);
  const asset = await client.assets.upload("image", buffer, { filename });
  console.log(`  uploaded ${publicPath} -> ${asset._id}`);
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
    alt,
  };
}

async function buildHomeDoc(
  lang: Lang,
  heroImage: ImageRef,
  bentoServiceImage: ImageRef
) {
  const t = homeCopy[lang];

  return {
    _id: `home-${lang}`,
    _type: "home" as const,
    language: lang,

    // HomeCopy (flat) — field names mirror app/content/home.ts exactly.
    eyebrow: t.eyebrow,
    h1: [...t.h1],
    cta1: t.cta1,
    cta2: t.cta2,
    scroll: t.scroll,
    contact: t.contact,
    journeyEyebrow: t.journeyEyebrow,
    journeyTitle: t.journeyTitle,
    journeyDesc: t.journeyDesc,
    techTitle: t.techTitle,
    techBody: t.techBody,
    bento1Title: t.bento1Title,
    bento1Body: t.bento1Body,
    bento2Title: t.bento2Title,
    bento2Body: t.bento2Body,
    badge1: t.badge1,
    badge2: t.badge2,
    faqEyebrow: t.faqEyebrow,
    faqTitle: t.faqTitle,
    faqBody: t.faqBody,
    ctaTitle: [...t.ctaTitle],

    // Embedded arrays — single-language projection of each type.
    capabilities: capabilities.map((c) => ({
      _type: "capability" as const,
      _key: c.n,
      n: c.n,
      title: c[lang].title,
      body: c[lang].body,
    })),
    faqItems: faqItems.map((f) => ({
      _type: "faqItem" as const,
      _key: f.n,
      n: f.n,
      q: f[lang].q,
      a: f[lang].a,
    })),
    journeyPanels: journeyPanels.map((p) => ({
      _type: "journeyPanel" as const,
      _key: p.key,
      key: p.key,
      legacyImagePath: p.src,
      theme: p.theme,
      accent: p.accent,
      tagColor: p.tagColor,
      tag: p[lang].tag,
      title: p[lang].title,
      body: p[lang].body,
      link: p[lang].link,
    })),
    // Media: hero + bento uploaded to the CDN.
    heroImage,
    bentoServiceImage,
  };
}

async function main() {
  console.log(`Seeding home content to ${projectId}/${dataset} ...`);

  console.log("Uploading shared images...");
  const heroImage = await uploadLocalImage(
    homeImages.hero,
    "אריזות קרטון בהתאמה אישית"
  );
  const bentoServiceImage = await uploadLocalImage(
    homeImages.bentoService,
    "חיתוך שטנץ"
  );

  for (const lang of ["he", "en"] as const) {
    const doc = await buildHomeDoc(lang, heroImage, bentoServiceImage);
    await client.createOrReplace(doc);
    console.log(`  ✓ home-${lang}`);
  }

  // Link the two as translations of each other so Studio shows them paired.
  await client.createOrReplace({
    _id: "home-translation-metadata",
    _type: "translation.metadata",
    schemaTypes: ["home"],
    translations: [
      {
        _key: "he",
        value: { _type: "reference", _ref: "home-he" },
      },
      {
        _key: "en",
        value: { _type: "reference", _ref: "home-en" },
      },
    ],
  });
  console.log("  ✓ translation.metadata (he <-> en)");

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
