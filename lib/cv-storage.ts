import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { del, get, list } from "@vercel/blob";
import { generateClientTokenFromReadWriteToken } from "@vercel/blob/client";
import { MAX_CV_BYTES, cvContentType } from "./cv-upload";

const PREFIX = "cv-uploads/";
const UPLOAD_LIFETIME_MS = 15 * 60 * 1000;
const RECEIPT_LIFETIME_MS = 60 * 60 * 1000;

type Receipt = {
  pathname: string;
  filename: string;
  size: number;
  applicationHash: string;
  expires: number;
};

function storageToken(): string {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error("CV storage is not configured");
  return token;
}

function applicationHash(data: FormData): string {
  return createHash("sha256").update(JSON.stringify(
    ["name", "phone", "email", "roleCode", "roleTitle"].map((key) => String(data.get(key) ?? "").trim()),
  )).digest("hex");
}

function sign(payload: string): Buffer {
  return createHmac("sha256", storageToken()).update(`beeri-cv-v1:${payload}`).digest();
}

export function verifyCvReceipt(value: string, data: FormData): Receipt {
  if (value.length > 4096) throw new Error("Invalid CV receipt");
  const [payload, signature, extra] = value.split(".");
  if (!payload || !signature || extra) throw new Error("Invalid CV receipt");
  const actual = Buffer.from(signature, "base64url");
  const expected = sign(payload);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    throw new Error("Invalid CV receipt");
  }
  const receipt = JSON.parse(Buffer.from(payload, "base64url").toString()) as Receipt;
  if (receipt.expires < Date.now() || receipt.applicationHash !== applicationHash(data)
    || !/^cv-uploads\/[0-9a-f-]{36}\.(pdf|doc|docx)$/.test(receipt.pathname)
    || receipt.size <= 0 || receipt.size > MAX_CV_BYTES) {
    throw new Error("Expired or mismatched CV receipt");
  }
  return receipt;
}

/** A short-lived capability for exactly one file, bound to this application. */
export async function createCvUpload(data: FormData, filename: string, size: number) {
  const contentType = cvContentType(filename);
  if (!contentType || !Number.isInteger(size) || size <= 0 || size > MAX_CV_BYTES) {
    throw new Error("Invalid CV file");
  }
  const cleanName = filename.replace(/[\\/\r\n\x00-\x1f]/g, "_").slice(-180);
  const extension = filename.split(".").pop()!.toLowerCase();
  const pathname = `${PREFIX}${randomUUID()}.${extension}`;
  const receipt: Receipt = {
    pathname, filename: cleanName, size,
    applicationHash: applicationHash(data), expires: Date.now() + RECEIPT_LIFETIME_MS,
  };
  const payload = Buffer.from(JSON.stringify(receipt)).toString("base64url");
  const clientToken = await generateClientTokenFromReadWriteToken({
    token: storageToken(), pathname,
    maximumSizeInBytes: size,
    allowedContentTypes: [contentType],
    validUntil: Date.now() + UPLOAD_LIFETIME_MS,
    addRandomSuffix: false,
    allowOverwrite: false,
    cacheControlMaxAge: 60,
  });
  return { pathname, contentType, clientToken, receipt: `${payload}.${sign(payload).toString("base64url")}` };
}

/** Only signed store paths are read; never fetch a URL supplied by the client. */
export async function readCvAttachment(receiptValue: string, data: FormData) {
  const receipt = verifyCvReceipt(receiptValue, data);
  const result = await get(receipt.pathname, {
    access: "private", token: storageToken(), useCache: false,
  });
  if (!result || result.statusCode !== 200) throw new Error("CV upload was not found");
  if (result.blob.size !== receipt.size || result.blob.size > MAX_CV_BYTES) {
    await result.stream.cancel();
    throw new Error("CV size mismatch");
  }
  const content = Buffer.from(await new Response(result.stream).arrayBuffer());
  if (content.length !== receipt.size) throw new Error("Incomplete CV upload");
  return { attachment: { filename: receipt.filename, content }, pathname: receipt.pathname };
}

export async function deleteCvUpload(pathname: string) {
  await del(pathname, { token: storageToken() });
}

/** Sweep abandoned uploads on subsequent applications; successful sends delete immediately. */
export async function cleanupAbandonedCvs() {
  try {
    const { blobs } = await list({ prefix: PREFIX, limit: 1000, token: storageToken() });
    const stale = blobs.filter((blob) => blob.uploadedAt.getTime() < Date.now() - 24 * 60 * 60 * 1000);
    if (stale.length) await del(stale.map((blob) => blob.url), { token: storageToken() });
  } catch {
    console.error("[job-application] abandoned CV cleanup failed");
  }
}
