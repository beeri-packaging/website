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
    standardsTitle: "עומדים בסטנדרט. בכל שלב.",
    standardsBody:
      "מערכות האיכות והבטיחות שלנו מלוות את העבודה משלב קבלת חומרי הגלם ועד למסירת האריזה המוגמרת. כך אנחנו שומרים על בקרה, עקביות ורציפות תפעולית לאורך כל תהליך הייצור.",
    standards: [
      {
        code: "ISO 9001:2015",
        title: "ניהול איכות",
        body: "מערכת ניהול איכות שמגדירה בקרה, עקביות ושיפור מתמשך בתהליכי הייצור והשירות.",
        certificateLabel: "תעודת התקן תתווסף בקרוב",
      },
      {
        code: "FSSC 22000",
        title: "בטיחות מזון",
        body: "מערכת לניהול בטיחות מזון התומכת בייצור אריזות עבור תעשיות המזון והמשקאות.",
        certificateLabel: "תעודת התקן תתווסף בקרוב",
      },
      {
        code: "24/6",
        title: "מפעל חיוני",
        body: "הכרה המבטאת את היכולת שלנו לשמור על רציפות תפעולית ועל שירות גם בשעת חירום.",
        certificateLabel: "אישור מפעל חיוני יתווסף בקרוב",
        tone: "essential",
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
    standardsTitle: "Meeting the standard. At every stage.",
    standardsBody:
      "Our quality and safety systems support the work from incoming materials to delivery of the finished package—maintaining control, consistency and operational continuity throughout production.",
    standards: [
      {
        code: "ISO 9001:2015",
        title: "Quality management",
        body: "A quality-management system built around control, consistency and continuous improvement in production and service.",
        certificateLabel: "Certificate coming soon",
      },
      {
        code: "FSSC 22000",
        title: "Food safety",
        body: "A food-safety management system supporting packaging production for the food and beverage industries.",
        certificateLabel: "Certificate coming soon",
      },
      {
        code: "24/6",
        title: "Essential facility",
        body: "Recognition of our ability to maintain operational continuity and service during emergencies.",
        certificateLabel: "Essential-facility certificate coming soon",
        tone: "essential",
      },
    ],
    ctaTitle: "Which finish fits your product?",
    ctaPrimary: "Request samples",
    ctaSecondary: "View catalog",
  },
};
