import { describe, expect, it } from "vitest";
import { validateContactInquiry } from "./contact-inquiry";

const valid = {
  fullName: "דנה כהן",
  phone: "050-1234567",
  email: "dana@studio.co.il",
  company: "",
  reason: "quote" as const,
  details: "",
};

describe("validateContactInquiry", () => {
  it("passes a minimal valid inquiry (name + phone + email + reason)", () => {
    expect(validateContactInquiry(valid)).toEqual({});
  });

  it("requires a full name", () => {
    expect(validateContactInquiry({ ...valid, fullName: "  " }).fullName).toBeTruthy();
  });

  it("requires a phone with at least 7 digits", () => {
    expect(validateContactInquiry({ ...valid, phone: "" }).phone).toBeTruthy();
    expect(validateContactInquiry({ ...valid, phone: "12345" }).phone).toBeTruthy();
    expect(validateContactInquiry({ ...valid, phone: "+972 50 123 4567" }).phone).toBeUndefined();
  });

  it("requires reason to be one of the three known values", () => {
    expect(validateContactInquiry({ ...valid, reason: "" as never }).reason).toBeTruthy();
    expect(validateContactInquiry({ ...valid, reason: "bogus" as never }).reason).toBeTruthy();
    for (const r of ["quote", "meeting", "other"] as const) {
      expect(validateContactInquiry({ ...valid, reason: r }).reason).toBeUndefined();
    }
  });

  it("requires a valid email", () => {
    expect(validateContactInquiry({ ...valid, email: "" }).email).toBeTruthy();
    expect(validateContactInquiry({ ...valid, email: "   " }).email).toBeTruthy();
    expect(validateContactInquiry({ ...valid, email: "nope" }).email).toBeTruthy();
    expect(validateContactInquiry({ ...valid, email: "a@b.co" }).email).toBeUndefined();
  });
});
