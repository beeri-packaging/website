import type { Lang } from "@/app/content/home";

export type FinishingMetric = {
  label: string;
  value: string;
};

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
  metricsTitle: string;
  metrics: readonly FinishingMetric[];
  quote: string;
  quoteBy: string;
  deboss: FinishingGridItem;
  texture: FinishingGridItem;
  ctaTitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  sampleCard: { value: string; label: string };
  isoCard: { value: string; label: string };
};

export const finishingImages = {
  foil: "/images/generated/finishing-hero/finishing-hero-v9-dalton.png",
  deboss: "/images/generated/finishing-hero/finishing-hero-v10-raziel.png",
  texture: "/images/generated/finishing-hero/finishing-hero-v6-beer.png",
} as const;

export const finishingCopy: Record<Lang, FinishingCopy> = {
  he: {
    step: "שלב 02",
    title: ["השבחות", "שמוסיפות ערך"],
    intro:
      "השבחות דפוס הופכות משטח קרטון לחוויה מלאה. מגע, ברק, עומק ופתיחה מתוכננים סביב המוצר, המותג, הכמות ותהליך הייצור.",
    feature: {
      eyebrow: "דיוק מתכתי",
      title: "דיוק מתכתי",
      body:
        "פויל חם או קר מוסיף נקודת אור מדויקת: לוגו, סימון סדרה או פרט שמושך את העין.",
      image: finishingImages.foil,
      sample: "דוגמה: F-902",
      cta: "לכל ההשבחות",
    },
    metricsTitle: "נתוני גימור",
    metrics: [
      { label: "עומק הבלטה", value: "0.85MM" },
      { label: "עובי פויל", value: "12µm" },
      { label: "סוג לכה", value: "SPOT" },
      { label: "סטייה", value: "±0.01MM" },
    ],
    quote:
      "״האריזה היא המפגש הראשון בין המותג ללקוח. כשהגימור מדויק, המוצר מרגיש נכון עוד לפני השימוש.״",
    quoteBy: "סטודיו",
    deboss: {
      eyebrow: "מבנה וחומר",
      title: "הבלטה שמוסיפה עומק",
      body:
        "הבלטה ודיבוס מוסיפים עומק ומגע,\nבלי להעמיס על העיצוב.",
      image: finishingImages.deboss,
    },
    texture: {
      eyebrow: "מרקם עדין",
      title: "מרקם על\nחומר עדין",
      body:
        "מרקם, לכה והדפסה פנימית משנים את חוויית הפתיחה בלי לשנות את מבנה האריזה.",
      image: finishingImages.texture,
    },
    ctaTitle: "איזו השבחה מתאימה למוצר שלכם?",
    ctaPrimary: "בקשת דוגמאות",
    ctaSecondary: "צפייה בקטלוג",
    sampleCard: { value: "24h", label: "ליצירת דוגמה" },
    isoCard: { value: "ISO", label: "עיטור איכות" },
  },
  en: {
    step: "Step 02",
    title: ["Finishing", "that adds value"],
    intro:
      "Print finishing turns a board surface into a complete product experience. Touch, shine, depth and opening are planned around the product, brand, quantity and production path.",
    feature: {
      eyebrow: "Metallic precision",
      title: "Metallic precision",
      body:
        "Hot or cold foil adds a precise point of light: a logo, series mark or detail that catches the eye.",
      image: finishingImages.foil,
      sample: "Sample: F-902",
      cta: "All finishes",
    },
    metricsTitle: "Finish data",
    metrics: [
      { label: "Emboss depth", value: "0.85MM" },
      { label: "Foil thickness", value: "12µm" },
      { label: "Varnish type", value: "SPOT" },
      { label: "Tolerance", value: "±0.01MM" },
    ],
    quote:
      "Packaging is the first meeting between brand and customer. When the finish is precise, the product feels right before it is even used.",
    quoteBy: "Studio",
    deboss: {
      eyebrow: "Structure & stock",
      title: "Embossing with depth",
      body:
        "Embossing and debossing add depth and touch\nwithout overloading the design.",
      image: finishingImages.deboss,
    },
    texture: {
      eyebrow: "Soft texture",
      title: "Texture on\nfine stock",
      body:
        "Texture, varnish and interior print change the opening experience without changing the package structure.",
      image: finishingImages.texture,
    },
    ctaTitle: "Which finish fits your product?",
    ctaPrimary: "Request samples",
    ctaSecondary: "View catalog",
    sampleCard: { value: "24h", label: "Sample timing" },
    isoCard: { value: "ISO", label: "Quality mark" },
  },
};
