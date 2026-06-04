// scripts/lib/sanity-write-client.ts
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const repoRoot = path.resolve(__dirname, "..", "..");

function loadEnvLocal() {
  let raw: string;
  try { raw = readFileSync(path.join(repoRoot, ".env.local"), "utf8"); } catch { return; }
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("="); if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!(k in process.env)) process.env[k] = v;
  }
}
loadEnvLocal();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";
// Prefer a dedicated write token; fall back to the existing var if the client reused it.
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error("Missing Sanity env: need PROJECT_ID, DATASET, and SANITY_API_WRITE_TOKEN (Editor) in .env.local");
}

export const writeClient = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
