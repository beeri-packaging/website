// Apply Michal's 20 Aug 2026 catalog review to Sanity.
//
// Source: the /review/catalog board feedback emailed 20 Aug 2026 13:17. She
// marked all 21 items "צריך תיקון" and supplied the replacement name,
// description and tags per item in Hebrew. English is translated to match.
//
// Not applied here (tracked in Linear, see the project "Catalog fixes — Michal
// review (Aug 2026)"):
//   - perfume            PRO-409 — needs the שמן מרוקאי photo + a reorder
//   - beverage-finishing PRO-426 — her name and description disagree
// wine-carmel gets its copy now; its replacement photo is still pending.
//
// Run: npx tsx scripts/apply-catalog-michal-review-2026-08-20.ts

import { writeClient } from "./lib/sanity-write-client";

type Tone = "outline" | "cyan" | "purple" | "magenta";
type Tag = { label: string; tone: Tone };
type Fields = { name?: string; description?: string; tags?: Tag[] };
type Change = { category: string; he: Fields; en: Fields };

const CHANGES: Record<string, Change> = {
  serum: {
    category: "cosmetics",
    he: {
      name: "מארז פרימיום",
      description:
        "קיט מוצרי קוסמטיקה יוקרתי. מיוצר מחומר גלם מתכתי. מודפס בפנטון זהב מטאלי כולל למינציה.",
      tags: [{ label: "למינציה", tone: "outline" }, { label: "נייר מתכתי", tone: "cyan" }],
    },
    en: {
      name: "Premium pack",
      description:
        "A luxury cosmetics product kit. Made from metallised board, printed in metallic gold Pantone with lamination.",
      tags: [{ label: "Lamination", tone: "outline" }, { label: "Metallised paper", tone: "cyan" }],
    },
  },
  ampoule: {
    category: "cosmetics",
    he: {
      name: "מארז שלישיית צנצנות",
      description:
        "העיצוב מאפשר זיהוי ברור של המוצרים ממבט ראשון מבלי לפתוח את האריזה.",
      tags: [{ label: "קיט מוצר", tone: "outline" }],
    },
    en: {
      name: "Three-jar pack",
      description:
        "The design makes the products clearly identifiable at a glance, without opening the pack.",
      tags: [{ label: "Product kit", tone: "outline" }],
    },
  },
  cream: {
    category: "cosmetics",
    he: {
      name: "מארז צנצנות קוסמטיקה",
      description:
        "אריזת קרטון מיועדת לצנצנת קרם עם מבנה המעניק למוצר נראות יוקרתית. ניתן לשלב בהדפסה השבחות כגון פויל זהב או כסף והבלטות.",
      tags: [{ label: "השבחות", tone: "outline" }],
    },
    en: {
      name: "Cosmetics jar pack",
      description:
        "A carton pack built for a cream jar, with a structure that gives the product a premium presence. Print finishes such as gold or silver foil and embossing can be combined.",
      tags: [{ label: "Finishes", tone: "outline" }],
    },
  },

  "wine-mony": {
    category: "spirits",
    he: {
      name: "יקב מוני",
      description: "מארז יין בודד יוקרתי מכסה ותחתית כולל השבחות מותאם למוצר.",
    },
    en: {
      name: "Mony Winery",
      description:
        "A premium single-bottle wine pack with lid and base, including finishes fitted to the product.",
    },
  },
  "wine-barkan": {
    category: "spirits",
    he: {
      name: "יקב ברקן",
      description:
        "מארז יין שחור מסדרת Altitude בודד יוקרתי מכסה ותחתית כולל השבחות מותאם למוצר.",
    },
    en: {
      name: "Barkan Winery",
      description:
        "A premium single-bottle black wine pack from the Altitude series, with lid and base, including finishes fitted to the product.",
    },
  },
  "wine-golan": {
    category: "spirits",
    he: {
      name: "יקב רמת הגולן",
      description:
        "מארז שי לבקבוק יין ושתי כוסות, עם חלונות צורניים ומבנה שמציג ומקבע כל פריט. המארז מודפס על קראפט חום.",
      tags: [{ label: "בקבוק ושתי כוסות", tone: "outline" }, { label: "קראפט", tone: "cyan" }],
    },
    en: {
      name: "Golan Heights Winery",
      description:
        "A gift pack for a wine bottle and two glasses, with shaped windows and a structure that presents and secures each item. Printed on brown kraft.",
      tags: [{ label: "Bottle + two glasses", tone: "outline" }, { label: "Kraft", tone: "cyan" }],
    },
  },
  "wine-carmel": {
    category: "spirits",
    he: {
      name: "יקב כרמל",
      description:
        "מארז גנארי מיוחד שמותאם למוצרים שונים עם ידית נשיאה פטנט יחודי שלנו.",
      tags: [{ label: "פטנט ידית נשיאה", tone: "outline" }, { label: "מארז גנארי", tone: "magenta" }],
    },
    en: {
      name: "Carmel Winery",
      description:
        "A special generic pack adapted to different products, with a carry handle of our own unique patent.",
      tags: [{ label: "Patented carry handle", tone: "outline" }, { label: "Generic pack", tone: "magenta" }],
    },
  },
  "wine-tabor": {
    category: "spirits",
    he: {
      name: "יקב תבור",
      description:
        "מארז חגיגי למתנה מותאם לכמה מוצרים שונים. זכה בתחרות עיצוב “כוכב ישראל”. מודפס על קראפט חום.",
      tags: [{ label: "מארז גנארי", tone: "outline" }, { label: "קראפט", tone: "cyan" }],
    },
    en: {
      name: "Tabor Winery",
      description:
        "A festive gift pack fitted to several different products. Winner of the “Star of Israel” design award. Printed on brown kraft.",
      tags: [{ label: "Generic pack", tone: "outline" }, { label: "Kraft", tone: "cyan" }],
    },
  },
  "wine-recanati": {
    category: "spirits",
    he: {
      name: "יקב רקנאטי",
      description:
        "מארז מיוחד לשני בקבוקים ושתי כוסות עם חלון תצוגה פתוחה של המוצרים בחיתוך מיוחד.",
      tags: [{ label: "שני בקבוקים ושתי כוסות", tone: "outline" }, { label: "קראפט חום", tone: "purple" }],
    },
    en: {
      name: "Recanati Winery",
      description:
        "A special pack for two bottles and two glasses, with an open display window revealing the products through a special die-cut.",
      tags: [{ label: "Two bottles + glasses", tone: "outline" }, { label: "Brown kraft", tone: "purple" }],
    },
  },

  "coffee-elite": {
    category: "coffee",
    he: {
      name: "קפה עלית שטראוס",
      description:
        "אריזת קרטון ממותגת לקפסולות קפה, כוללת השבחות עם פתיחה מיוחדת וקלה לצרכן בעלת נוכחות מדף.",
      tags: [{ label: "קפה", tone: "outline" }, { label: "קפסולות", tone: "cyan" }],
    },
    en: {
      name: "Elite Strauss coffee",
      description:
        "A branded carton pack for coffee capsules, with finishes and a special consumer-friendly opening, and strong shelf presence.",
      tags: [{ label: "Coffee", tone: "outline" }, { label: "Capsules", tone: "cyan" }],
    },
  },
  "coffee-aroma": {
    category: "coffee",
    he: {
      name: "קפה ארומה",
      description: "סט מארז לקפסולות כולל דיספליי עם בולטות בנקודת המכירה.",
      tags: [{ label: "קפה", tone: "outline" }, { label: "דיספליי", tone: "magenta" }],
    },
    en: {
      name: "Aroma coffee",
      description:
        "A capsule pack set including a display that stands out at the point of sale.",
      tags: [{ label: "Coffee", tone: "outline" }, { label: "Display", tone: "magenta" }],
    },
  },
  "coffee-joe": {
    category: "coffee",
    he: {
      description:
        "סדרת אריזות לקפסולות קפה כולל השבחות של לכה סלקטיבית והטבעה עם בידול גרפי מותאם ללקוח, בסוגים שונים של טעמי קפה.",
      tags: [{ label: "קפה", tone: "outline" }, { label: "השבחות", tone: "purple" }],
    },
    en: {
      description:
        "A series of coffee-capsule packs with spot-varnish and embossing finishes and client-tailored graphic differentiation, across different coffee flavours.",
      tags: [{ label: "Coffee", tone: "outline" }, { label: "Finishes", tone: "purple" }],
    },
  },
  "coffee-tasters-choice": {
    category: "coffee",
    he: {
      name: "נסטלה / אסם",
      description: "מארז Taster’s Choice וכוס מתנה.",
      tags: [{ label: "מארז קפה", tone: "outline" }, { label: "מארז מתנה", tone: "cyan" }],
    },
    en: {
      name: "Nestlé / Osem",
      description: "A Taster’s Choice pack with a gift mug.",
      tags: [{ label: "Coffee pack", tone: "outline" }, { label: "Gift pack", tone: "cyan" }],
    },
  },

  "beer-malka": {
    category: "beer",
    he: {
      description: "מארז לארבעה בקבוקי בירה וכוס, עם חלונות שמציגים את המוצרים.",
      tags: [{ label: "מארזי בירה", tone: "outline" }],
    },
    en: {
      description: "A pack for four beer bottles and a glass, with windows that display the products.",
      tags: [{ label: "Beer packs", tone: "outline" }],
    },
  },
  "beer-goldstar": {
    category: "beer",
    he: {
      name: "טמפו",
      description: "מאגדת שישיות בירה גולדסטאר.",
      tags: [{ label: "מארזי בירה", tone: "outline" }],
    },
    en: {
      name: "Tempo",
      description: "A six-pack wrap for Goldstar beer.",
      tags: [{ label: "Beer packs", tone: "outline" }],
    },
  },
  "beer-carlsberg": {
    category: "beer",
    he: {
      name: "החברה המרכזית / קרלסברג",
      description: "מאגדת שישיות קרלסברג כולל השבחות. המאגדת חובקת שישה בקבוקי בירה.",
      tags: [{ label: "מאגדות בירה", tone: "outline" }],
    },
    en: {
      name: "Central Bottling Company / Carlsberg",
      description: "A Carlsberg six-pack wrap including finishes. The wrap holds six beer bottles.",
      tags: [{ label: "Beer wraps", tone: "outline" }],
    },
  },
  "beer-tuborg": {
    category: "beer",
    he: {
      name: "החברה המרכזית / קרלסברג",
      description: "מאגדת שישיות טובורג כולל השבחות. המאגדת חובקת שישה בקבוקי בירה.",
      tags: [{ label: "מאגדות בירה", tone: "outline" }],
    },
    en: {
      name: "Central Bottling Company / Carlsberg",
      description: "A Tuborg six-pack wrap including finishes. The wrap holds six beer bottles.",
      tags: [{ label: "Beer wraps", tone: "outline" }],
    },
  },

  "beverage-wissotzky": {
    category: "beverages",
    he: {
      name: "תה ויסוצקי",
      description: "אריזת תה מיוחדת ליצוא הכוללת השבחות מיוחדות המבליטות את האריזה.",
      tags: [{ label: "השבחות", tone: "outline" }],
    },
    en: {
      name: "Wissotzky tea",
      description:
        "A special export tea pack with distinctive finishes that make the packaging stand out.",
      tags: [{ label: "Finishes", tone: "outline" }],
    },
  },
  "beverage-sodastream": {
    category: "beverages",
    he: { tags: [{ label: "חבק לבקבוקים", tone: "outline" }] },
    en: { tags: [{ label: "Bottle wrap", tone: "outline" }] },
  },
};

async function main() {
  for (const lang of ["he", "en"] as const) {
    const id = `catalog-${lang}`;
    const doc = await writeClient.getDocument(id);
    if (!doc) throw new Error(`${id}: document not found`);

    const sets: Record<string, unknown> = {};
    for (const [itemKey, change] of Object.entries(CHANGES)) {
      const fields = change[lang];
      const at = `categories[_key=="${change.category}"].items[_key=="${itemKey}"]`;
      if (fields.name !== undefined) sets[`${at}.name`] = fields.name;
      if (fields.description !== undefined) sets[`${at}.description`] = fields.description;
      if (fields.tags !== undefined) {
        sets[`${at}.tags`] = fields.tags.map((tag, index) => ({
          _type: "catalogTag",
          _key: `tag-${index}`,
          label: tag.label,
          tone: tag.tone,
        }));
      }
    }

    await writeClient.patch(id).set(sets).commit();
    console.log(`${id}: patched ${Object.keys(CHANGES).length} items (${Object.keys(sets).length} fields)`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
