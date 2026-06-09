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
      title: "השבחה דיגיטלית — MGI",
      body:
        "מכונת MGI מאפשרת פויל והבלטת לכה תלת־ממדית במעבר דיגיטלי אחד — בלי קלישאות ובלי זמני התקנה. מתאימה במיוחד לסדרות קצרות ובינוניות ולמותגים שרוצים גימור מדויק וחוזר על עצמו.",
      image: finishingImages.foil,
      sample: "דיגיטלי",
      cta: "לקטלוג",
    },
    metricsTitle: "יכולות השבחה",
    metrics: [
      { label: "השבחה דיגיטלית", value: "MGI" },
      { label: "פויל", value: "חם / קר" },
      { label: "תקן איכות", value: "ISO 9001" },
      { label: "בטיחות מזון", value: "FSSC 22000" },
    ],
    quote:
      "האריזה היא המפגש הראשון בין המותג ללקוח. כשהגימור מדויק, המוצר מרגיש נכון עוד לפני שפותחים אותו.",
    quoteBy: "בארי אריזות",
    deboss: {
      eyebrow: "הטבעה ודיבוס",
      title: "עומק שמרגישים במגע",
      body:
        "הבלטה ודיבוס מוסיפים ממד מישושי ללוגו, לטיפוגרפיה או לדפוס — נוכחות שמורגשת ביד, בלי להעמיס על העיצוב.",
      image: finishingImages.deboss,
    },
    texture: {
      eyebrow: "פויל והטבעה חמה",
      title: "נקודת אור\nמדויקת",
      body:
        "פויל חם או קר מוסיף ברק מתכתי ממוקד — לוגו, מסגרת או פרט שמושך את העין על המדף ומבדל את המותג.",
      image: finishingImages.texture,
    },
    ctaTitle: "איזו השבחה מתאימה למוצר שלכם?",
    ctaPrimary: "בקשת דוגמאות",
    ctaSecondary: "צפייה בקטלוג",
    sampleCard: { value: "MGI", label: "השבחה דיגיטלית" },
    isoCard: { value: "ISO 9001", label: "מוסמכים גם ל־FSSC 22000" },
  },
  en: {
    step: "Step 02",
    title: ["Finishing", "that adds value"],
    intro:
      "Finishing is the moment a carton stops being a box and starts to sell. Here it's part of one continuous line — from design and pre-press through finishing, die-cutting and distribution — so every detail of foil, embossing or digital enhancement is planned around the brand, the product and its audience.",
    feature: {
      eyebrow: "Premium finishing",
      title: "Digital enhancement — MGI",
      body:
        "Our MGI press applies foil and 3D raised varnish in a single digital pass — no dies, no setup time. Ideal for short-to-medium runs and brands that want a precise, repeatable finish.",
      image: finishingImages.foil,
      sample: "Digital",
      cta: "View catalog",
    },
    metricsTitle: "Finishing capabilities",
    metrics: [
      { label: "Digital enhancement", value: "MGI" },
      { label: "Foil", value: "Hot / cold" },
      { label: "Quality standard", value: "ISO 9001" },
      { label: "Food safety", value: "FSSC 22000" },
    ],
    quote:
      "Packaging is the first meeting between a brand and its customer. When the finish is precise, the product feels right before it is even opened.",
    quoteBy: "Beeri Packaging",
    deboss: {
      eyebrow: "Emboss & deboss",
      title: "Depth you can feel",
      body:
        "Embossing and debossing add a tactile dimension to a logo, typography or print — a presence felt in the hand, without overloading the design.",
      image: finishingImages.deboss,
    },
    texture: {
      eyebrow: "Foil & hot stamping",
      title: "A precise\npoint of light",
      body:
        "Hot or cold foil adds a focused metallic shine — a logo, frame or detail that catches the eye on the shelf and sets the brand apart.",
      image: finishingImages.texture,
    },
    ctaTitle: "Which finish fits your product?",
    ctaPrimary: "Request samples",
    ctaSecondary: "View catalog",
    sampleCard: { value: "MGI", label: "Digital enhancement" },
    isoCard: { value: "ISO 9001", label: "FSSC 22000 certified" },
  },
};
