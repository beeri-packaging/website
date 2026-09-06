"use server";

import { after } from "next/server";
import { createCvUpload, cleanupAbandonedCvs } from "@/lib/cv-storage";
import { MAX_CV_BYTES, cvContentType } from "@/lib/cv-upload";

export async function prepareCvUpload(data: FormData, filename: string, size: number) {
  // Server Actions enforce same-origin POSTs. Anonymous applicants are authorized
  // only after form validation; the token permits one bounded, private upload.
  if (String(data.get("company_url") ?? "").trim()) return { ok: false, error: "validation" } as const;
  const name = String(data.get("name") ?? "").trim();
  const phone = String(data.get("phone") ?? "").replace(/\D/g, "");
  const email = String(data.get("email") ?? "").trim();
  if (!name || name.length > 200 || phone.length < 7 || phone.length > 30
    || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "validation" } as const;
  }
  if (size > MAX_CV_BYTES) return { ok: false, error: "file_too_large" } as const;
  if (!cvContentType(filename) || filename.length > 255 || size <= 0 || !Number.isInteger(size)) {
    return { ok: false, error: "file_type" } as const;
  }
  try {
    const upload = await createCvUpload(data, filename, size);
    after(cleanupAbandonedCvs);
    return { ok: true, upload } as const;
  } catch {
    console.error("[job-application] could not authorize CV upload");
    return { ok: false, error: "send_failed" } as const;
  }
}
