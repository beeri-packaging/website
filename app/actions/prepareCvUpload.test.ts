// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { prepareCvUpload } from "./prepareCvUpload";
import { createCvUpload } from "@/lib/cv-storage";
import { MAX_CV_BYTES } from "@/lib/cv-upload";
vi.mock("next/server", () => ({ after: vi.fn() }));
vi.mock("@/lib/cv-storage", () => ({ createCvUpload: vi.fn(), cleanupAbandonedCvs: vi.fn() }));
beforeEach(() => vi.resetAllMocks());
function application() {
  const data = new FormData();
  data.set("name", "Test Applicant"); data.set("email", "test@example.com"); data.set("phone", "0501234567");
  return data;
}
describe("CV upload authorization", () => {
  it("does not authorize bots or invalid applications", async () => {
    const bot = application(); bot.set("company_url", "bot");
    expect((await prepareCvUpload(bot, "cv.pdf", 100)).ok).toBe(false);
    expect((await prepareCvUpload(new FormData(), "cv.pdf", 100)).ok).toBe(false);
    expect(createCvUpload).not.toHaveBeenCalled();
  });
  it("rejects more than 10 MB and unsupported types before storage access", async () => {
    expect(await prepareCvUpload(application(), "cv.pdf", MAX_CV_BYTES + 1)).toEqual({ ok: false, error: "file_too_large" });
    expect(await prepareCvUpload(application(), "cv.exe", 100)).toEqual({ ok: false, error: "file_type" });
    expect(createCvUpload).not.toHaveBeenCalled();
  });
});
