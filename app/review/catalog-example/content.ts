import type { CatalogItem } from "@/app/content/catalog";

export type CatalogExample = Pick<
  CatalogItem,
  "key" | "name" | "description" | "image"
>;

export type ProductConcept = {
  key: string;
  name: string;
  shortDescription: string;
  details: string;
  characteristics: readonly string[];
  exampleKeys?: readonly string[];
};

export type CategoryConcept = {
  key: string;
  number: string;
  name: string;
  intro: string;
  products: readonly ProductConcept[];
};

export const catalogExampleCopy = {
  eyebrow: "קטלוג",
  title: ["כשהמבנה", "פוגש מוצר"],
  intro:
    "אינדקס האריזות שלנו מסודר לפי תחום ולפי סוג האריזה, כדי להציג במהירות את הפתרונות המתאימים לכל מוצר.",
  service:
    "בחירה בסוג אריזה פותחת תיאור קצר, מאפיינים וגלריית עבודות רלוונטיות ממספר מותגים.",
  openLabel: "לפתיחת המוצר",
  productTypeSingular: "סוג",
  productTypePlural: "סוגים",
  examplesLabel: "דוגמאות ביצוע",
  characteristicsLabel: "מאפיינים אפשריים",
  examplePrefix: "דוגמה",
  closeLabel: "סגירת פירוט המוצר",
} as const;

export const categoryConcepts: readonly CategoryConcept[] = [
  {
    key: "cosmetics",
    number: "01",
    name: "קוסמטיקה וטיפוח",
    intro: "אריזות למוצר בודד, לסדרת טיפוח, לצנצנות ולמארזי מתנה.",
    products: [
      {
        key: "cosmetics-gift-kits",
        name: "מארזי מתנה וקיטים",
        shortDescription: "אריזה אחת למספר מוצרי טיפוח, להשקה, מתנה או סדרה.",
        details:
          "מארזים המאגדים כמה מוצרי טיפוח לחוויה אחת ברורה ומרשימה. המבנה, התושבת והפתיחה מותאמים למידות המוצרים ולשפה של המותג.",
        characteristics: ["תושבת פנימית מותאמת", "חלוקה למספר מוצרים", "גימורי פרימיום"],
        exampleKeys: ["serum", "moroccanoil", "ampoule"],
      },
      {
        key: "cosmetics-windows",
        name: "מארזים עם חלון",
        shortDescription: "פתחים וחיתוכים שמציגים את המוצר כחלק מעיצוב האריזה.",
        details:
          "חלון תצוגה מאפשר לזהות את המוצר בלי לפתוח את האריזה. צורת החלון, מיקומו והתושבת מתוכננים יחד כדי לשמור על המוצר וליצור נוכחות חזקה בנקודת המכירה.",
        characteristics: ["חלון צורני", "חיתוך מדויק", "נראות מוצר מיידית"],
        exampleKeys: ["moroccanoil", "ampoule"],
      },
      {
        key: "cosmetics-jars",
        name: "מארזים לצנצנות",
        shortDescription: "מבנה מדויק שמגן על הצנצנת ומעניק לה נוכחות על המדף.",
        details:
          "אריזה לצנצנת בודדת או לסדרת צנצנות, עם התאמה למידות המוצר ואפשרות לתושבת פנימית. ניתן לשלב הדפסה והשבחות במראה נקי או יוקרתי.",
        characteristics: ["לצנצנת אחת או לסדרה", "קיבוע פנימי", "הדפסה והשבחות"],
        exampleKeys: ["ampoule", "cream", "serum"],
      },
      {
        key: "cosmetics-premium",
        name: "אריזות פרימיום",
        shortDescription: "חומרי גלם וגימורים שמחזקים את חוויית המותג.",
        details:
          "אריזות למוצרי טיפוח המבקשים נוכחות יוקרתית במיוחד. ניתן לשלב ניירות מיוחדים, למינציה, פויל, הבלטה ולכה סלקטיבית.",
        characteristics: ["ניירות מיוחדים", "פויל ולכה", "הבלטה ולמינציה"],
        exampleKeys: ["cream", "serum", "moroccanoil"],
      },
    ],
  },
  {
    key: "wine-gifts",
    number: "02",
    name: "יין ומארזי שי",
    intro: "מארזים לבקבוק יחיד, לשילובי בקבוקים וכוסות ולמתנות חגיגיות.",
    products: [
      {
        key: "single-bottle",
        name: "מארז לבקבוק יחיד",
        shortDescription: "אריזה מדויקת לבקבוק אחד, עם הגנה ונוכחות מתאימה למתנה.",
        details:
          "מארז לבקבוק יחיד המותאם למידות הבקבוק ולסיפור המותג. אפשר לבחור במבנה קלאסי, במכסה ותחתית או בפתיחה מיוחדת.",
        characteristics: ["התאמה לבקבוק", "מכסה ותחתית", "פויל והבלטה"],
        exampleKeys: ["wine-mony", "wine-barkan"],
      },
      {
        key: "wine-and-glasses",
        name: "מארז לבקבוק וכוסות",
        shortDescription: "מארז שמציג ומקבע בקבוק יין לצד כוס אחת או יותר.",
        details:
          "מבנה משולב לבקבוק ולכוסות, עם תושבות וחלונות שמחזיקים כל פריט במקום ומציגים את תכולת המארז כבר במבט הראשון.",
        characteristics: ["תושבות נפרדות", "חלונות תצוגה", "פתיחה חגיגית"],
        exampleKeys: ["wine-golan", "wine-recanati", "wine-yatir"],
      },
      {
        key: "multi-product-gifts",
        name: "מארזי שי משולבים",
        shortDescription: "פתרון גמיש לבקבוק, מזון ופריטי מתנה במבנה אחד.",
        details:
          "מארז רב-תכליתי שמתוכנן סביב תמהיל המוצרים. החלוקה הפנימית, הידית והפתיחה מותאמות לחוויית נשיאה והענקה נוחה ומרשימה.",
        characteristics: ["חלוקה פנימית", "מבנה רב-תכליתי", "התאמה למתנה"],
        exampleKeys: ["wine-carmel", "wine-tabor", "wine-recanati"],
      },
      {
        key: "carry-handle",
        name: "מארזים עם ידית נשיאה",
        shortDescription: "מבנה שימושי ונוח לנשיאה, עם נראות ממותגת.",
        details:
          "מארזים עם ידית משולבת או פטנט נשיאה ייעודי. המבנה נבדק מול משקל התכולה ומתאים למארזי חג, למתנות ולמספר מוצרים.",
        characteristics: ["ידית משולבת", "חיזוק למשקל", "פתיחה קלה"],
        exampleKeys: ["wine-carmel", "wine-tabor"],
      },
    ],
  },
  {
    key: "coffee-tea",
    number: "03",
    name: "קפה, תה ומזון יבש",
    intro: "קופסאות מדף, דיספליי ומארזי מתנה למוצרים יבשים ולקפסולות.",
    products: [
      {
        key: "retail-cartons",
        name: "קופסאות מוצר",
        shortDescription: "אריזות מדף למוצר בודד או לסדרה, עם פתיחה נוחה ונראות ברורה.",
        details:
          "קופסאות מתקפלות למוצרים יבשים, לקפסולות ולתה. המבנה מתוכנן לנוחות שימוש, להגנה על המוצר ולבולטות ברורה על המדף.",
        characteristics: ["פתיחה נוחה", "התאמה לסדרה", "נוכחות מדף"],
        exampleKeys: ["coffee-elite", "coffee-joe", "beverage-wissotzky"],
      },
      {
        key: "counter-displays",
        name: "מארזי תצוגה ודיספליי",
        shortDescription: "אריזה שהופכת למתקן תצוגה מסודר בנקודת המכירה.",
        details:
          "דיספליי מקרטון מאגד מספר יחידות ומציג אותן בצורה נגישה. המבנה מתאים לדלפק, למדף או לקידום סדרת מוצרים.",
        characteristics: ["תצוגה על הדלפק", "איגוד מספר יחידות", "פתיחה מהירה"],
        exampleKeys: ["coffee-aroma", "coffee-joe"],
      },
      {
        key: "coffee-gifts",
        name: "מארזי מתנה",
        shortDescription: "שילוב מוצר וכוס או אביזר נוסף באריזה אחת.",
        details:
          "מארזי מתנה למוצרי קפה ותה, עם חלוקה פנימית שמקבעת את המוצר ואת האביזר הנלווה ומציגה אותם יחד.",
        characteristics: ["מוצר ואביזר", "חלוקה פנימית", "חלון או חזית פתוחה"],
        exampleKeys: ["coffee-tasters-choice", "beverage-wissotzky"],
      },
    ],
  },
  {
    key: "beer-beverages",
    number: "04",
    name: "בירה ומשקאות",
    intro: "מאגדות בקבוקים, מארזי נשיאה ופתרונות תצוגה למספר משקאות.",
    products: [
      {
        key: "six-pack-carriers",
        name: "מאגדות לשישיית בקבוקים",
        shortDescription: "חבק קרטון שמאגד שישה בקבוקים ומאפשר נשיאה נוחה.",
        details:
          "מאגדת בקבוקים עוטפת ומייצבת את השישייה, משאירה את המוצר גלוי ומשמשת משטח מיתוג בולט בנקודת המכירה.",
        characteristics: ["לשישה בקבוקים", "ידית נשיאה", "חבק ממותג"],
        exampleKeys: ["beer-goldstar", "beer-carlsberg", "beer-tuborg"],
      },
      {
        key: "bottle-display-packs",
        name: "מארזי בקבוקים ותצוגה",
        shortDescription: "מבנה שמקבע מספר בקבוקים ומשאיר אותם גלויים.",
        details:
          "אריזה למספר בקבוקים עם פתחים, חלונות או מעטפת שקופה. המבנה משלב הגנה, אחיזה ונראות ברורה של המוצרים.",
        characteristics: ["מספר בקבוקים", "חלונות תצוגה", "נשיאה נוחה"],
        exampleKeys: ["beer-malka", "beverage-sodastream"],
      },
    ],
  },
];
