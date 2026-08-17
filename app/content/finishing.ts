import type { Lang } from "@/app/content/home";

export type FinishingGridItem = {
  eyebrow: string;
  title: string;
  body: string;
  image?: string;
  sample?: string;
  cta?: string;
};

export type FinishingStandard = {
  code: string;
  title: string;
  body: string;
  certificateLabel: string;
  certificateUrl?: string;
  image?: string;
  tone?: "plain" | "essential";
};

export type FinishingCopy = {
  step: string;
  title: readonly [string, string];
  intro: string;
  feature: FinishingGridItem;
  deboss: FinishingGridItem;
  texture: FinishingGridItem;
  standardsEyebrow: string;
  standardsTitle: string;
  standardsBody: string;
  standards: readonly FinishingStandard[];
  ctaTitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

export const finishingImages = {
  foil: "/images/generated/finishing-hero/finishing-hero-v9-dalton.png",
  deboss: "/images/generated/finishing-hero/finishing-hero-v1.png",
  texture: "/images/generated/finishing-hero/finishing-hero-v6-beer.png",
} as const;

export const finishingCopy: Record<Lang, FinishingCopy> = {
  he: {
    step: "שלב 02",
    title: ["השבחות", "שמוסיפות ערך"],
    intro:
      "ההשבחה היא השלב שבו האריזה מפסיקה להיות קרטון ומתחילה למכור. אצלנו היא חלק מקו שלם — מתכנון וקדם־דפוס ועד גימור, חיתוך והפצה — כך שכל פרט של פויל, הבלטה או השבחה דיגיטלית מתוכנן סביב המותג, המוצר וקהל היעד.",
    feature: {
      eyebrow: "גימור פרימיום",
      title: "השבחה דיגיטלית",
      body: "מכונת השבחה דיגיטלית מאפשרת פויל והבלטת לכה גבוהה או שטוחה.",
      image: finishingImages.foil,
      sample: "דיגיטלי",
      cta: "לקטלוג",
    },
    deboss: {
      eyebrow: "הטבעה",
      title: "דיוק שיוצר צל, נפח ואופי",
      body:
        "הבלטה ושיקוע מוסיפים ללוגו, לגופן או לדפוס נגיעה קטנה שמורגשת מיד, נוכחות שמעניקה לעיצוב אופי בלי להכביד עליו.",
      image: finishingImages.deboss,
    },
    texture: {
      eyebrow: "פויל והטבעה חמה",
      title: "ניצוץ שמדבר בשם המותג",
      body:
        "פויל חם או קר מוסיף זוהר ממוקד על לוגו, מסגרת או פרט נבחר, נגיעה שקולטת את העין על המדף ומייחדת את המותג במבט ראשון.",
      image: finishingImages.texture,
    },
    standardsEyebrow: "איכות מוכחת",
    standardsTitle: "איכות ללא פשרות.",
    standardsBody:
      "בבארי אריזות, איכות היא הרבה מעבר לעמידה בדרישות — היא תפיסת עולם שמלווה כל מוצר, כל תהליך וכל החלטה.\n\nמערכת האיכות שלנו משלבת בקרה וניטור לאורך כל שלבי הייצור: מבחירת חומרי הגלם, דרך ההדפסה, ההשבחה, החיתוך וההדבקה ועד לבדיקת המוצר המוגמר. כך אנחנו מבטיחים איכות גבוהה, מדויקת ועקבית ופועלים לשיפור מתמיד.",
    standards: [
      {
        code: "ISO 9001:2015",
        title: "ניהול איכות",
        body: "מערכת ניהול איכות שמגדירה בקרה, עקביות ושיפור מתמשך בתהליכי הייצור והשירות.",
        certificateLabel: "לצפייה בתעודת ISO 9001",
        certificateUrl:
          "https://cdn.sanity.io/files/4qkb39ql/production/3260a30a73dec6e4df4eb292c0e0a21e9e945d67.pdf",
        image:
          "https://cdn.sanity.io/images/4qkb39ql/production/409ecdaec9f4750291ef04fd4121ff4e3b9fa700-1241x1755.png",
      },
      {
        code: "FSSC 22000",
        title: "בטיחות מזון",
        body: "מערכת לניהול בטיחות מזון התומכת בייצור אריזות עבור תעשיות המזון והמשקאות.",
        certificateLabel: "לצפייה בתעודת FSSC 22000",
        certificateUrl:
          "https://cdn.sanity.io/files/4qkb39ql/production/7a056360827f98a329a0e9847124a43910e6db54.pdf",
        image:
          "https://cdn.sanity.io/images/4qkb39ql/production/faeec416a67ca925a40af2d9289e849ce24c87d3-1241x1754.png",
      },
    ],
    ctaTitle: "איזו השבחה מתאימה למוצר שלכם?",
    ctaPrimary: "בקשת דוגמאות",
    ctaSecondary: "צפייה בקטלוג",
  },
  en: {
    step: "Step 02",
    title: ["Finishing", "that adds value"],
    intro:
      "Finishing is the moment a carton stops being a box and starts to sell. Here it's part of one continuous line — from design and pre-press through finishing, die-cutting and distribution — so every detail of foil, embossing or digital enhancement is planned around the brand, the product and its audience.",
    feature: {
      eyebrow: "Premium finishing",
      title: "Digital enhancement",
      body: "A digital enhancement press applies foil and raised or flat varnish.",
      image: finishingImages.foil,
      sample: "Digital",
      cta: "View catalog",
    },
    deboss: {
      eyebrow: "Embossing",
      title: "Precision that creates shadow, depth and character",
      body:
        "Embossing and recessing add a small, immediately noticeable touch to a logo, typeface or print — a presence that gives the design character without weighing it down.",
      image: finishingImages.deboss,
    },
    texture: {
      eyebrow: "Foil & hot stamping",
      title: "A sparkle that speaks for the brand",
      body:
        "Hot or cold foil adds a focused glow to a logo, frame or chosen detail — a touch that catches the eye on the shelf and sets the brand apart at first glance.",
      image: finishingImages.texture,
    },
    standardsEyebrow: "Proven quality",
    standardsTitle: "Quality without compromise.",
    standardsBody:
      "At Beeri Packaging, quality is more than meeting requirements — it guides every product, process and decision.\n\nOur quality system combines control and monitoring throughout production: from raw-material selection through printing, finishing, cutting and gluing to final-product inspection. This is how we deliver consistent, precise quality and keep improving.",
    standards: [
      {
        code: "ISO 9001:2015",
        title: "Quality management",
        body: "A quality-management system built around control, consistency and continuous improvement in production and service.",
        certificateLabel: "View the ISO 9001 certificate",
        certificateUrl:
          "https://cdn.sanity.io/files/4qkb39ql/production/3260a30a73dec6e4df4eb292c0e0a21e9e945d67.pdf",
        image:
          "https://cdn.sanity.io/images/4qkb39ql/production/409ecdaec9f4750291ef04fd4121ff4e3b9fa700-1241x1755.png",
      },
      {
        code: "FSSC 22000",
        title: "Food safety",
        body: "A food-safety management system supporting packaging production for the food and beverage industries.",
        certificateLabel: "View the FSSC 22000 certificate",
        certificateUrl:
          "https://cdn.sanity.io/files/4qkb39ql/production/7a056360827f98a329a0e9847124a43910e6db54.pdf",
        image:
          "https://cdn.sanity.io/images/4qkb39ql/production/faeec416a67ca925a40af2d9289e849ce24c87d3-1241x1754.png",
      },
    ],
    ctaTitle: "Which finish fits your product?",
    ctaPrimary: "Request samples",
    ctaSecondary: "View catalog",
  },
};
