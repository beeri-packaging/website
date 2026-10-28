// @vitest-environment node
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { submitContactInquiry } from "./contact";
import { sendEmail } from "@/lib/email";
import type { ContactInquiryInput } from "@/lib/contact-inquiry";

vi.mock("@/lib/email", () => ({ sendEmail: vi.fn() }));

const valid: ContactInquiryInput = {
  fullName: "Test Person",
  phone: "0501234567",
  email: "person@example.com",
  company: "",
  reason: "quote",
  details: "Test inquiry",
};

beforeEach(() => {
  vi.mocked(sendEmail).mockReset().mockResolvedValue(true);
  vi.stubEnv("RESEND_API_KEY", "test-only-not-a-real-key");
  vi.stubEnv("CONTACT_FROM_EMAIL", "website@example.com");
  vi.stubEnv("CONTACT_TO_EMAIL", "legacy@example.com");
});
afterEach(() => vi.unstubAllEnvs());

describe("contact inquiry destination", () => {
  it.each([
    ["quote", "orders@beeripacks.co.il"],
    ["meeting", "office@beeripacks.co.il"],
    ["other", "office@beeripacks.co.il"],
  ] as const)("routes %s to %s, ignoring the legacy shared override", async (reason, to) => {
    expect(await submitContactInquiry({ ...valid, reason })).toEqual({ ok: true });
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({
      to,
      from: "website@example.com",
      replyTo: "person@example.com",
    }));
  });

  it.each(["", "invalid", "__proto__"])("does not send for invalid reason %s", async (reason) => {
    expect(await submitContactInquiry({ ...valid, reason: reason as ContactInquiryInput["reason"] }))
      .toMatchObject({ ok: false, error: "validation" });
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("does not send a honeypot submission", async () => {
    expect(await submitContactInquiry({ ...valid, company_url: "bot" })).toEqual({ ok: true });
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("does not send when required fields are missing", async () => {
    expect(await submitContactInquiry({ ...valid, fullName: "", phone: "", email: "" }))
      .toMatchObject({ ok: false, error: "validation" });
    expect(sendEmail).not.toHaveBeenCalled();
  });
});
