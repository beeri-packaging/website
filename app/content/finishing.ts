import type { Lang } from "@/app/content/home";

export type FinishingGridItem = {
  eyebrow: string;
  title: string;
  body: string;
  image?: string;
  sample?: string;
  cta?: string;
};

export type FinishingCopy = {
  step: string;
  title: readonly [string, string];
  intro: string;
  feature: FinishingGridItem;
  deboss: FinishingGridItem;
  texture: FinishingGridItem;
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
    ctaTitle: "Which finish fits your product?",
    ctaPrimary: "Request samples",
    ctaSecondary: "View catalog",
  },
};
