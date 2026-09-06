// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { submitJobApplication } from "./jobApplication";
import { sendEmail } from "@/lib/email";
import { MAX_CV_BYTES } from "@/lib/cv-upload";

vi.mock("@/lib/cv-storage", () => ({ readCvAttachment: vi.fn(), deleteCvUpload: vi.fn() }));
import { readCvAttachment, deleteCvUpload } from "@/lib/cv-storage";

vi.mock("@/lib/email", () => ({ sendEmail: vi.fn() }));

beforeEach(() => {
  vi.mocked(readCvAttachment).mockReset();
  vi.mocked(deleteCvUpload).mockReset().mockResolvedValue(undefined);
  vi.stubEnv("RESEND_API_KEY", "test-key");
  vi.stubEnv("CONTACT_FROM_EMAIL", "website@example.com");
  vi.stubEnv("CONTACT_TO_EMAIL", "contact@example.com");
  vi.stubEnv("JOBS_TO_EMAIL", "jobs@example.com");
  vi.mocked(sendEmail).mockReset().mockResolvedValue(true);
});
afterEach(() => vi.unstubAllEnvs());

function application(file?: File) {
  const data = new FormData();
  data.set("name", "Test Applicant");
  data.set("phone", "0501234567");
  data.set("email", "applicant@example.com");
  if (file) data.set("cv", file);
  return data;
}

describe("CV attachments", () => {
  it("passes a 10 MB attachment intact to the configured jobs inbox", async () => {
    const bytes = new Uint8Array(MAX_CV_BYTES).fill(65);
    const result = await submitJobApplication(application(new File([bytes], "resume.pdf")));
    expect(result).toEqual({ ok: true });
    expect(sendEmail).toHaveBeenCalledOnce();
    const message = vi.mocked(sendEmail).mock.calls[0][0];
    expect(message.to).toBe("jobs@example.com");
    expect(message.attachments?.[0].filename).toBe("resume.pdf");
    expect(message.attachments?.[0].content.equals(Buffer.from(bytes))).toBe(true);
  });

  it("rejects an oversized attachment on the server without sending", async () => {
    const cv = new File([new Uint8Array(MAX_CV_BYTES + 1)], "large.pdf");
    expect(await submitJobApplication(application(cv))).toEqual({ ok: false, error: "file_too_large" });
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("uses the official jobs inbox when its override is absent", async () => {
    vi.stubEnv("JOBS_TO_EMAIL", undefined);
    expect(await submitJobApplication(application())).toEqual({ ok: true });
    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({ to: "jobs@beeripacks.co.il" }));
  });
});

describe("private CV email delivery", () => {
  it("attaches all 10 MB to the jobs email, then deletes the temporary file", async () => {
    const content = Buffer.alloc(MAX_CV_BYTES, 65);
    vi.mocked(readCvAttachment).mockResolvedValue({ attachment: { filename: "resume.pdf", content }, pathname: "cv-uploads/one.pdf" });
    const data = application();
    data.set("cvReceipt", "signed-receipt");
    expect(await submitJobApplication(data)).toEqual({ ok: true });
    expect(sendEmail).toHaveBeenCalledOnce();
    const email = vi.mocked(sendEmail).mock.calls[0][0];
    expect(email.to).toBe("jobs@example.com");
    expect(email.attachments?.[0].filename).toBe("resume.pdf");
    expect(email.attachments?.[0].content.equals(content)).toBe(true);
    expect(deleteCvUpload).toHaveBeenCalledWith("cv-uploads/one.pdf");
    expect(vi.mocked(sendEmail).mock.invocationCallOrder[0]).toBeLessThan(vi.mocked(deleteCvUpload).mock.invocationCallOrder[0]);
  });
  it("does not send an email if its uploaded CV cannot be read", async () => {
    vi.mocked(readCvAttachment).mockRejectedValue(new Error("Missing upload"));
    const data = application(); data.set("cvReceipt", "signed-receipt");
    expect(await submitJobApplication(data)).toEqual({ ok: false, error: "send_failed" });
    expect(sendEmail).not.toHaveBeenCalled();
  });
  it("retains the uploaded CV on email failure so delivery can be retried", async () => {
    vi.mocked(readCvAttachment).mockResolvedValue({ attachment: { filename: "cv.pdf", content: Buffer.from("CV") }, pathname: "cv-uploads/one.pdf" });
    vi.mocked(sendEmail).mockRejectedValueOnce(new Error("Email unavailable"));
    const data = application(); data.set("cvReceipt", "signed-receipt");
    expect(await submitJobApplication(data)).toEqual({ ok: false, error: "send_failed" });
    expect(deleteCvUpload).not.toHaveBeenCalled();
  });
  it("still reports success if cleanup fails after the email was sent", async () => {
    vi.mocked(readCvAttachment).mockResolvedValue({ attachment: { filename: "cv.pdf", content: Buffer.from("CV") }, pathname: "cv-uploads/one.pdf" });
    vi.mocked(deleteCvUpload).mockRejectedValueOnce(new Error("Delete unavailable"));
    const data = application(); data.set("cvReceipt", "signed-receipt");
    expect(await submitJobApplication(data)).toEqual({ ok: true });
    expect(sendEmail).toHaveBeenCalledOnce();
  });
});
