// @vitest-environment node
import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { get, del, list } from "@vercel/blob";
import { generateClientTokenFromReadWriteToken } from "@vercel/blob/client";
import { createCvUpload, verifyCvReceipt, readCvAttachment, cleanupAbandonedCvs } from "./cv-storage";
import { MAX_CV_BYTES } from "./cv-upload";

vi.mock("@vercel/blob", () => ({ get: vi.fn(), del: vi.fn(), list: vi.fn() }));
vi.mock("@vercel/blob/client", () => ({ generateClientTokenFromReadWriteToken: vi.fn() }));
beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("BLOB_READ_WRITE_TOKEN", "private-test-secret");
  vi.mocked(generateClientTokenFromReadWriteToken).mockResolvedValue("scoped-client-token");
});
afterEach(() => vi.unstubAllEnvs());
function application(email = "test@example.com") {
  const data = new FormData();
  data.set("name", "Test Applicant");
  data.set("email", email);
  return data;
}

const blobMetadata = { url: "private-url", downloadUrl: "private-url", pathname: "cv-uploads/test.pdf", contentDisposition: "attachment", cacheControl: "no-store", uploadedAt: new Date(), etag: "test-etag" };

describe("private CV uploads", () => {
  it("scopes an upload to one path, exact size, type and short expiry", async () => {
    const before = Date.now();
    const prepared = await createCvUpload(application(), "קורות חיים.pdf", MAX_CV_BYTES);
    expect(prepared.pathname).toMatch(/^cv-uploads\/[0-9a-f-]+\.pdf$/);
    expect(generateClientTokenFromReadWriteToken).toHaveBeenCalledWith(expect.objectContaining({
      pathname: prepared.pathname, maximumSizeInBytes: MAX_CV_BYTES,
      allowedContentTypes: ["application/pdf"], allowOverwrite: false, addRandomSuffix: false, cacheControlMaxAge: 60,
      validUntil: expect.any(Number),
    }));
    expect(vi.mocked(generateClientTokenFromReadWriteToken).mock.calls[0][0].validUntil).toBeLessThanOrEqual(before + 16 * 60_000);
    expect(prepared.clientToken).not.toContain("private-test-secret");
    expect(verifyCvReceipt(prepared.receipt, application()).filename).toBe("קורות חיים.pdf");
  });

  it("rejects oversized and unsupported files before issuing a token", async () => {
    await expect(createCvUpload(application(), "large.pdf", MAX_CV_BYTES + 1)).rejects.toThrow();
    await expect(createCvUpload(application(), "script.exe", 10)).rejects.toThrow();
    expect(generateClientTokenFromReadWriteToken).not.toHaveBeenCalled();
  });

  it("rejects forged, expired or other applicants' receipts without fetching", async () => {
    const prepared = await createCvUpload(application(), "cv.docx", 12);
    await expect(readCvAttachment(prepared.receipt + "x", application())).rejects.toThrow();
    await expect(readCvAttachment(prepared.receipt, application("other@example.com"))).rejects.toThrow();
    vi.spyOn(Date, "now").mockReturnValue(Date.now() + 61 * 60_000);
    await expect(readCvAttachment(prepared.receipt, application())).rejects.toThrow();
    vi.restoreAllMocks();
    expect(get).not.toHaveBeenCalled();
  });

  it("reads the full 10 MB file privately with its original filename", async () => {
    const prepared = await createCvUpload(application(), "resume.pdf", MAX_CV_BYTES);
    const bytes = new Uint8Array(MAX_CV_BYTES).fill(65);
    vi.mocked(get).mockResolvedValue({
      statusCode: 200, stream: new Response(bytes).body!, headers: new Headers(),
      blob: { ...blobMetadata, size: bytes.length, contentType: "application/pdf" },
    });
    const result = await readCvAttachment(prepared.receipt, application());
    expect(get).toHaveBeenCalledWith(prepared.pathname, expect.objectContaining({ access: "private", useCache: false }));
    expect(result.attachment.filename).toBe("resume.pdf");
    expect(result.attachment.content.equals(Buffer.from(bytes))).toBe(true);
  });

  it("rejects a truncated upload", async () => {
    const prepared = await createCvUpload(application(), "resume.pdf", 12);
    vi.mocked(get).mockResolvedValue({
      statusCode: 200, stream: new Response("short").body!, headers: new Headers(),
      blob: { ...blobMetadata, size: 12, contentType: "application/pdf" },
    });
    await expect(readCvAttachment(prepared.receipt, application())).rejects.toThrow("Incomplete");
  });

  it("cleans abandoned files older than 24 hours without deleting active uploads", async () => {
    vi.mocked(list).mockResolvedValue({ blobs: [
      { url: "stale", uploadedAt: new Date(Date.now() - 25 * 60 * 60_000) },
      { url: "active", uploadedAt: new Date() },
    ], hasMore: false } as Awaited<ReturnType<typeof list>>);
    await cleanupAbandonedCvs();
    expect(del).toHaveBeenCalledWith(["stale"], expect.any(Object));
  });
});
