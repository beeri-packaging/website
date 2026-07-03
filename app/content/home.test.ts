import { describe, expect, it } from "vitest";
import { faqItems, homeCopy, homeImages } from "@/app/content/home";
import { chromeContent } from "@/app/content/site";

describe("home client feedback content", () => {
  it("uses the client-approved hero labels without a prominent 1964 claim", () => {
    expect(homeCopy.he.eyebrow).toBe("אריזות קרטון בהתאמה אישית");
    expect(homeCopy.he.cta1).toBe("להשבחות וגימורים");
    expect(homeCopy.he.cta2).toBe("בארי אריזות");
    expect(chromeContent.he.footerHeritage).toBe("");
  });

  it("uses the client-approved Hebrew FAQ set", () => {
    expect(faqItems).toHaveLength(6);
    expect(faqItems.map((item) => item.he.q)).toEqual([
      "האם יש יכולת לתכנן אריזה?",
      "האם נדרש לעצב גרפיקה מראש?",
      "מה צריך לשלוח על מנת לקבל הצעת מחיר?",
      "האם אפשר לקבל דוגמה לפני הייצור?",
      "ממה מורכב מחיר האריזה?",
      "באילו דרכים ניתן לקבל את האריזות לאחר הייצור?",
    ]);
  });

  it("points home image fallbacks to the selected client feedback assets", () => {
    expect(homeImages.journeyDeveloping).toBe(
      "/images/generated/website-content/packaging/retail-coffee-display-window-carton.png",
    );
    expect(homeImages.journeyPrecise).toBe(
      "/images/generated/website-content/packaging/olive-oil-shaped-window-sleeve.png",
    );
    expect(homeImages.journeyToday).toBe("/images/generated/timeline/beeri-today-simple.png");
    expect(homeImages.bentoService).toBe(
      "/images/generated/website-content/packaging/cosmetics-drawer-window-sleeve.png",
    );
  });
});
