// scripts/lib/upload-images.ts
import { readFileSync } from "node:fs";
import path from "node:path";
import { writeClient, repoRoot } from "./sanity-write-client";

export type ImageRef = { _type: "image"; asset: { _type: "reference"; _ref: string }; alt: string };

const cache = new Map<string, string>(); // publicPath -> asset._id

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Upload a buffer, retrying on transient 5xx / network errors with backoff. */
async function uploadWithRetry(filename: string, buffer: Buffer, attempts = 4) {
  for (let i = 1; i <= attempts; i++) {
    try {
      return await writeClient.assets.upload("image", buffer, { filename });
    } catch (err: unknown) {
      const status = (err as { statusCode?: number; response?: { statusCode?: number } })?.statusCode
        ?? (err as { response?: { statusCode?: number } })?.response?.statusCode;
      const retryable = status === undefined || status >= 500 || status === 429;
      if (i === attempts || !retryable) throw err;
      const wait = 500 * 2 ** (i - 1); // 0.5s, 1s, 2s …
      console.warn(`  upload ${filename} failed (status ${status ?? "network"}), retry ${i}/${attempts - 1} in ${wait}ms`);
      await sleep(wait);
    }
  }
  throw new Error(`uploadWithRetry exhausted for ${filename}`);
}

/** Upload a /public image once; return an image field referencing it. */
export async function uploadImage(publicPath: string, alt: string): Promise<ImageRef> {
  let assetId = cache.get(publicPath);
  if (!assetId) {
    const filePath = path.join(repoRoot, "public", publicPath.replace(/^\//, ""));
    const buffer = readFileSync(filePath);
    const asset = await uploadWithRetry(path.basename(filePath), buffer);
    assetId = asset._id;
    cache.set(publicPath, assetId);
    console.log(`  uploaded ${publicPath} -> ${assetId}`);
  }
  return { _type: "image", asset: { _type: "reference", _ref: assetId }, alt };
}
