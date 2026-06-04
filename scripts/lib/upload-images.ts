// scripts/lib/upload-images.ts
import { readFileSync } from "node:fs";
import path from "node:path";
import { writeClient, repoRoot } from "./sanity-write-client";

export type ImageRef = { _type: "image"; asset: { _type: "reference"; _ref: string }; alt: string };

const cache = new Map<string, string>(); // publicPath -> asset._id

/** Upload a /public image once; return an image field referencing it. */
export async function uploadImage(publicPath: string, alt: string): Promise<ImageRef> {
  let assetId = cache.get(publicPath);
  if (!assetId) {
    const filePath = path.join(repoRoot, "public", publicPath.replace(/^\//, ""));
    const buffer = readFileSync(filePath);
    const asset = await writeClient.assets.upload("image", buffer, { filename: path.basename(filePath) });
    assetId = asset._id;
    cache.set(publicPath, assetId);
    console.log(`  uploaded ${publicPath} -> ${assetId}`);
  }
  return { _type: "image", asset: { _type: "reference", _ref: assetId }, alt };
}
