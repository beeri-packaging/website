// Swap the home "customer" journey panel image (מבינים את האתגר / Understand
// the brief) from the Blue Moon ambience shot to Michal's Moroccanoil gift
// pack — the same asset already used as the first Cosmetics catalog item.
//
// Run:
//   npx tsx scripts/apply-home-journey-moroccanoil-2026-08-31.ts

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function loadEnvLocal() {
  // Worktrees don't carry .env.local, so fall back to the main checkout.
  const candidates = [
    path.join(process.cwd(), ".env.local"),
    "/Users/ilanchelly/Desktop/beeri-arizot/.env.local",
  ];
  const envPath = candidates.find((candidate) => existsSync(candidate));
  if (!envPath) throw new Error("No .env.local found");

  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
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
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error("Missing Sanity configuration");
}

const apiBase = `https://${projectId}.api.sanity.io/v${apiVersion}`;

async function sanityRequest<T>(pathname: string, body: unknown): Promise<T> {
  const response = await fetch(`${apiBase}${pathname}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Sanity request failed (${response.status}): ${await response.text()}`);
  }
  return (await response.json()) as T;
}

async function sanityQuery<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  const payload = await sanityRequest<{ result: T }>(`/data/query/${dataset}`, { query, params });
  return payload.result;
}

// The Moroccanoil pack already uploaded for the Cosmetics catalog item.
const assetFilename = "beeri-catalog-moroccanoil-ai-v3.png";

const alt = {
  he: "מארז שמן מרוקאי של Moroccanoil",
  en: "Moroccanoil gift pack",
} as const;

const locales = ["he", "en"] as const;

async function main() {
  const asset = await sanityQuery<{ _id: string; url: string } | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename] | order(_createdAt desc)[0]{ _id, url }`,
    { filename: assetFilename },
  );
  if (!asset) throw new Error(`Asset ${assetFilename} not found in Sanity`);

  for (const locale of locales) {
    const documentId = `home-${locale}`;
    const panelKey = await sanityQuery<string | null>(
      `*[_id == $id][0].journeyPanels[key == "customer"][0]._key`,
      { id: documentId },
    );
    if (!panelKey) throw new Error(`${documentId}: customer journey panel not found`);

    await sanityRequest(`/data/mutate/${dataset}`, {
      mutations: [
        {
          patch: {
            id: documentId,
            set: {
              [`journeyPanels[_key == "${panelKey}"].image`]: {
                _type: "image",
                asset: { _type: "reference", _ref: asset._id },
                alt: alt[locale],
              },
            },
            // legacyImagePath would otherwise linger as a stale fallback.
            unset: [`journeyPanels[_key == "${panelKey}"].legacyImagePath`],
          },
        },
      ],
    });
    console.log(`patched ${documentId}: customer panel -> ${assetFilename}`);
  }

  const verification = await sanityQuery(
    `*[_id in $documentIds] | order(_id asc){
      _id,
      "panel": journeyPanels[key == "customer"][0]{
        title,
        "imageUrl": image.asset->url,
        "alt": image.alt,
        legacyImagePath
      }
    }`,
    { documentIds: locales.map((locale) => `home-${locale}`) },
  );

  console.log(JSON.stringify({ assetId: asset._id, verification }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
