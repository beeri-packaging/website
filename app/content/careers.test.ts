import { describe, expect, it } from "vitest";
import { careersCopy } from "./careers";

describe("careers content", () => {
  it("keeps the four open roles aligned across both locales", () => {
    const heRoles = careersCopy.he.roles;
    const enRoles = careersCopy.en.roles;

    expect(heRoles).toHaveLength(4);
    expect(enRoles).toHaveLength(4);
    expect(enRoles.map((role) => role.code)).toEqual(
      heRoles.map((role) => role.code),
    );
  });

  it("provides complete application details for every role", () => {
    for (const locale of ["he", "en"] as const) {
      for (const role of careersCopy[locale].roles) {
        expect(role.location).toBeTruthy();
        expect(role.scope).toBeTruthy();
        expect(role.description).toBeTruthy();
        expect(role.highlights?.length).toBeGreaterThanOrEqual(3);
        expect(role.highlights?.length).toBeLessThanOrEqual(5);
      }
    }
  });
});
