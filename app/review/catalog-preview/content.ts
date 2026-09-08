import type {
  CategoryConcept,
  ProductConcept,
} from "@/app/review/catalog-example/content";
import { categoryConcepts } from "@/app/review/catalog-example/content";

export const catalogPreviewCopy = {
  wordmark: "בארי אריזות",
  headerLabel: "תצוגה לאישור · משוב מ־7.9.2026",
  emptyExamplesLabel: "ממתין לתמונת דוגמה מאושרת",
  eyebrow: "קטלוג מוצרים · תצוגה",
  title: ["בוחרים פתרון", "רואים דוגמאות"] as const,
  intro:
    "הקטלוג מסודר לפי תחום ולפי סוג האריזה. בכל סוג מוצר מופיעים תיאור, מאפיינים וגלריית עבודות רלוונטיות.",
  service:
    "שמות המותגים מופיעים כדוגמאות ביצוע בתוך סוג האריזה המתאים — ולא כפריטי הניווט של הקטלוג.",
} as const;

const wineCategory = categoryConcepts.find(
  (category) => category.key === "wine-gifts",
);

if (!wineCategory) {
  throw new Error("Catalog preview requires the approved wine category.");
}

const cosmeticsProducts: readonly ProductConcept[] = [
  {
    key: "cosmetics-branded",
    name: "אריזות ממותגות",
    shortDescription: "אריזה למספר מוצרי טיפוח, להשקה, מתנה או סדרה.",
    details:
      "פתרון ממותג שמאגד מוצר אחד או סדרת מוצרים תחת שפה חזותית ברורה. המבנה והגימורים מותאמים למוצר ולזהות המותג.",
    characteristics: ["מיתוג", "יוקרה"],
    exampleKeys: [
      "preview-christina",
      "preview-gigi-glow-up",
      "preview-gigi-mesopro",
      "preview-fre",
    ],
  },
  {
    key: "cosmetics-special",
    name: "אריזות מיוחדות",
    shortDescription: "פתרון מותאם ללקוח, בעיצוב מיוחד.",
    details:
      "מבנה אריזה שמתוכנן סביב המוצר וחוויית הפתיחה, עם אפשרות לתושבות, חיתוכים ופתרונות פונקציונליים מותאמים.",
    characteristics: ["השבחות", "תכנון מיוחד", "פונקציונליות"],
    exampleKeys: [
      "preview-sabon-trio",
      "preview-sabon-popup",
      "preview-moroccanoil-heart",
    ],
  },
  {
    key: "cosmetics-premium",
    name: "אריזות פרימיום",
    shortDescription: "קיט מוצרי קוסמטיקה כולל השבחות שונות.",
    details:
      "אריזות למוצרי טיפוח שבהן חומרי הגלם וההשבחות יוצרים נראות יוקרתית ומדויקת, בהתאם לשפת המותג.",
    characteristics: ["למינציה", "השבחה"],
    exampleKeys: ["preview-moroccanoil-eurovision", "preview-ahava"],
  },
];

// Apply this review only to the product-based preview; keep the original concept intact.
const wineProducts: readonly ProductConcept[] = wineCategory.products
  .filter((product) => product.key !== "wine-and-glasses")
  .map((product) => {
    if (product.key === "single-bottle") {
      return {
        ...product,
        name: "מארז לבקבוק בודד",
        shortDescription: "אריזה לבקבוק בודד.",
        details:
          "אריזות מהודרות לבקבוקים בודדים בשילוב חומרי גלם מיוחדים למראה יוקרתי.",
        characteristics: ["חומרי גלם מיוחדים", "השבחות"],
        exampleKeys: ["wine-dalton"],
      };
    }
    if (product.key === "multi-product-gifts") {
      return {
        ...product,
        shortDescription: "מארזי יין",
        details: "מארזי יינות בעיצוב אלגנטי בשילוב מתנות שונות.",
        exampleKeys: ["preview-wine-handle", "wine-golan"],
      };
    }
    return product;
  });

const coffeeProducts: readonly ProductConcept[] = [
  {
    "key": "coffee-retail-cartons",
    "name": "מארזי קפסולות",
    "shortDescription": "מארזי קפסולות ממותגות בתכנון מיוחד לפתיחה נוחה.",
    "details": "אריזות קפה ממותגות בעיצוב אלגנטי עם השבחות שונות המעניקות למוצר מראה יוקרתי וייחודי על המדף.",
    "characteristics": [
      "פתיחה נוחה",
      "התאמה לסדרה",
      "נוכחות מדף",
      "ייחודיות"
    ],
    "exampleKeys": [
      "coffee-elite",
      "coffee-joe",
      "preview-coffee-burgundy",
      "preview-coffee-guatemala"
    ]
  },
  {
    "key": "coffee-displays",
    "name": "מארזי תצוגה ומתנה",
    "shortDescription": "פתרון תצוגה ואריזה מעוצב למארזי קפה, קפסולות ומתנות.",
    "details": "מעמד קרטון ייעודי להצגה ואריזה של קופסאות קפסולות, מארזי קפה ומארזי מתנה, המאפשר סידור נוח, נגיש ואסתטי של המוצרים.",
    "characteristics": [
      "תצוגה במדף",
      "איגוד מספר אריזות",
      "חומרי גלם ייחודיים"
    ],
    "exampleKeys": [
      "coffee-aroma",
      "coffee-tasters-choice"
    ]
  }
];

const beverageProducts: readonly ProductConcept[] = [
  {
    "key": "beverage-packs",
    "name": "מארזי משקאות",
    "shortDescription": "אריזות ממותגות למשקאות.",
    "details": "אריזות מיוחדות ממגוון חומרי גלם שונים המיועדים גם למיכון אוטומטי.",
    "characteristics": [
      "מספר מוצרים",
      "תצוגת מוצר",
      "נשיאה נוחה"
    ],
    "exampleKeys": [
      "preview-milk-honey",
      "preview-wissotzky-israel"
    ]
  },
  {
    "key": "bottle-carriers",
    "name": "מאגדות לבקבוקי בירה",
    "shortDescription": "חבק קרטון ממותג מחומר גלם מיוחד האוגד מספר בקבוקים.",
    "details": "חבק קרטון מחומר גלם עמיד ללחות ומותאם לנשיאה המשמש למיתוג בולט בנקודת המכירה.",
    "characteristics": [
      "איגוד בקבוקים",
      "ידית נשיאה",
      "חבק ממותג"
    ],
    "exampleKeys": [
      "beer-carlsberg",
      "beer-tuborg"
    ]
  }
];

const foodProducts: readonly ProductConcept[] = [
  {
    "key": "food-cartons",
    "name": "אריזות למוצרי מזון",
    "shortDescription": "אריזות קרטון למוצרי מזון, המותאמות למוצר ומשלבות פונקציונליות, נראות ומיתוג.",
    "details": "מגוון פתרונות אריזה מקרטון למוצרי מזון, המפותחים בהתאמה למאפייני המוצר, למידותיו ולצרכי המותג. האריזות משלבות תכנון מוקפד, נוחות שימוש ונראות איכותית, תוך התאמה למגוון רחב של מוצרים וסדרות.",
    "characteristics": [
      "התאמה לסדרה",
      "נוכחות מדף",
      "מיתוג",
      "אריזות למזון",
      "פונקציונליות"
    ],
    "exampleKeys": [
      "preview-tofu",
      "preview-energy",
      "preview-max-brenner",
      "preview-roy",
      "preview-halloumi"
    ]
  }
];

const pharmaProducts: readonly ProductConcept[] = [
  {
    "key": "pharma-ampoules",
    "name": "אריזות פארמה",
    "shortDescription": "אריזות קרטון מודפסות לתחום הפארמה ותוספי התזונה בגימור נקי ומקצועי.",
    "details": "אריזות קרטון מודפסות לתחום הפארמה ותוספי התזונה, המשלבות איכות הדפסה גבוהה, דיוק וגימור מוקפד. כל אריזה מותאמת למוצר ולשפה המותגית, ליצירת מראה נקי, אמין ומקצועי.",
    "characteristics": [
      "מיתוג",
      "דיוק",
      "תקן",
      "פארמה",
      "תוספי תזונה",
      "איכותי"
    ],
    "exampleKeys": [
      "preview-altman",
      "preview-life",
      "preview-tree-of-life"
    ]
  }
];

export const catalogPreviewCategories: readonly CategoryConcept[] = [
  {
    key: "cosmetics-preview",
    number: "01",
    name: "קוסמטיקה וטיפוח",
    intro: "שלושה סוגי פתרונות לאריזות טיפוח: ממותגות, מיוחדות ופרימיום.",
    products: cosmeticsProducts,
  },
  {
    ...wineCategory,
    key: "wine-preview",
    number: "02",
    name: "יינות",
    intro: "מארזים לבקבוק בודד, למתנות משולבות ולנשיאה נוחה.",
    products: wineProducts,
  },
  {
    key: "beverages-preview",
    number: "03",
    name: "משקאות",
    intro: "מאגדות בקבוקים, מארזי נשיאה ופתרונות תצוגה למספר משקאות.",
    products: beverageProducts,
  },
  {
    key: "coffee-preview",
    number: "04",
    name: "קפה",
    intro: "קופסאות מדף, דיספליי ומארזי מתנה למוצרי קפה ולקפסולות.",
    products: coffeeProducts,
  },
  {
    key: "food-preview",
    number: "05",
    name: "מזון",
    intro:
      "אריזות מזון צריכות לשלב נראות, נוחות ושמירה על המוצר. בתכנון בודקים אם מדובר באריזה חיצונית או במגע ישיר עם מזון, אילו תנאי אחסון נדרשים ואיך המוצר יוצג או יישלח.",
    products: foodProducts,
  },
  {
    key: "pharma-preview",
    number: "06",
    name: "פארמה",
    intro:
      "בפארמה אין מקום לאי-דיוקים. האריזה צריכה להיות ברורה, נקייה, יציבה ומתוכננת סביב מידע מודפס, סדרות מוצרים, סימון, ברקודים, הנחיות שימוש ודרישות תהליך.",
    products: pharmaProducts,
  },
];
