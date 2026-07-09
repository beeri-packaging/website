import { describe, it, expect } from "vitest";
import { aboutCopy } from "@/app/content/about";

describe("aboutCopy", () => {
  it("has he and en with identical key sets", () => {
    expect(Object.keys(aboutCopy.he).sort()).toEqual(Object.keys(aboutCopy.en).sort());
  });

  it("has the client-approved milestone set and excludes October 7 content", () => {
    for (const lang of ["he", "en"] as const) {
      expect(aboutCopy[lang].milestones.map((m) => m.year)).toEqual([
        "2019",
        "2020",
        "2021",
      ]);
      // Guardrail: the page must not carry any Oct-7 / תקומה reference.
      const blob = JSON.stringify(aboutCopy[lang]);
      expect(blob).not.toMatch(/7\.10\.2023|השבת השחורה|October 7|תקומה/i);
    }
  });

  it("links out to the parent group site per locale", () => {
    // The group site exists only in Hebrew — en.beeriprint.co.il is dead.
    expect(aboutCopy.he.groupLinkHref).toBe("https://beeriprint.co.il");
    expect(aboutCopy.en.groupLinkHref).toBe("https://beeriprint.co.il");
  });

  it("keeps the 1950 group heritage distinct from the 1964 entity", () => {
    expect(aboutCopy.he.heritageBody).toContain("1950");
    expect(aboutCopy.he.milestones.some((m) => m.year === "1964")).toBe(false);
  });

  it("uses the client-approved Hebrew hero copy", () => {
    expect(aboutCopy.he.title).toEqual([
      "כשמסורת של דפוס פוגשת",
      "את האריזה של ימינו",
    ]);
    expect(aboutCopy.he.intro).toContain(
      "בארי אריזות הוא בית הדפוס המוביל בישראל בתחום ייצור אריזות ותוויות",
    );
    expect(aboutCopy.he.intro).toContain("התחדשות מתמדת");
  });

  it("uses the July 8 client-approved stats and client list", () => {
    expect(aboutCopy.he.stats.map((s) => `${s.value} ${s.label}`)).toEqual([
      "מעל 100 עובדים",
      "10,000 מ\"ר של אולמות ייצור ומרלו\"ג",
      "מעל 200 שנות ניסיון מצטבר",
      "24/6 מפעל חיוני עובד",
    ]);
    expect(aboutCopy.he.clients.map((client) => client.name)).toEqual([
      "שטראוס קפה בי. וי (קפה עלית)",
      "קרלסברג",
      "CBC",
      "תה ויסוצקי בע\"מ",
      "נסטלה",
      'אגודת הכורמים הקואופרטיבית של יקבי ראשל"צ וזכרון',
      "יקב רקאנטי",
      "יקב רמת הגולן",
      "טמפו",
      "ליימן שליסל בע\"מ",
      "אלטמן",
    ]);
  });
});
