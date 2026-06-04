import type { Lang } from "@/app/content/home";

export type JobApplicationPerk = {
  title: string;
  body: string;
};

export type JobApplicationCopy = {
  /** aria-label for the corner close button. */
  closeLabel: string;
  /** Default trigger label when one isn't supplied by the caller. */
  triggerLabel: string;
  aside: {
    eyebrow: string;
    kicker: string;
    lead: string;
    perks: readonly JobApplicationPerk[];
    /** Small label above the role code, mirrors the spec-sheet מק״ט tag. */
    codeLabel: string;
    /** Fallback heading when no specific role is being applied to. */
    fallbackTitle: string;
  };
  form: {
    heading: string;
    /** Short line under the title; also the dialog's accessible description. */
    intro: string;
    roleLabel: string;
    name: { label: string; placeholder: string };
    phone: { label: string; placeholder: string };
    email: { label: string; placeholder: string };
    message: { label: string; placeholder: string; optional: string };
    cv: { label: string; button: string; empty: string; optional: string };
    submit: string;
  };
  errors: {
    name: string;
    phone: string;
    email: string;
  };
  success: {
    title: string;
    body: string;
    close: string;
  };
};

export const jobApplicationCopy: Record<Lang, JobApplicationCopy> = {
  he: {
    closeLabel: "סגירה",
    triggerLabel: "להגשה",
    aside: {
      eyebrow: "קריירה",
      kicker: "● הצטרפות לצוות",
      lead: "בארי אריזות מייצרת אריזות קרטון בהתאמה אישית מאז 1964. מסטודיו ותכנון מבני ועד דפוס וייצור — הכול תחת קורת גג אחת, ועם אנשים טובים שגדלים איתנו.",
      perks: [
        {
          title: "יציבות",
          body: "חברה ותיקה ויציבה, עם דורות של ניסיון בענף האריזה.",
        },
        {
          title: "צוות",
          body: "אנשי מקצוע שעובדים יחד מהאפיון הראשון ועד האספקה.",
        },
        {
          title: "התמקצעות",
          body: "מפעל מתקדם והזדמנות אמיתית ללמוד ולצמוח מקצועית.",
        },
      ],
      codeLabel: 'מק"ט',
      fallbackTitle: "הגשת מועמדות",
    },
    form: {
      heading: "פרטי המועמד/ת",
      intro: "להשאיר פרטים ולצרף קורות חיים — ונחזור אליכם/ן בהקדם.",
      roleLabel: "המשרה",
      name: { label: "שם מלא", placeholder: "שם פרטי ומשפחה" },
      phone: { label: "טלפון", placeholder: "05X-0000000" },
      email: { label: 'דוא"ל', placeholder: "name@example.com" },
      message: {
        label: "כמה מילים",
        placeholder: "מה חשוב שנדע? קצת רקע, ניסיון או למה דווקא בארי.",
        optional: "(לא חובה)",
      },
      cv: {
        label: "קורות חיים",
        button: "בחירת קובץ",
        empty: "לא נבחר קובץ",
        optional: "(לא חובה)",
      },
      submit: "שליחת מועמדות",
    },
    errors: {
      name: "יש להזין שם מלא.",
      phone: "יש להזין מספר טלפון תקין.",
      email: 'יש להזין כתובת דוא"ל תקינה.',
    },
    success: {
      title: "המועמדות נשלחה",
      body: "תודה על הפנייה. צוות הגיוס יעבור על הפרטים ויחזור בהקדם.",
      close: "סגירה",
    },
  },
  en: {
    closeLabel: "Close",
    triggerLabel: "Apply",
    aside: {
      eyebrow: "Careers",
      kicker: "● Join the team",
      lead: "Beeri Packaging has built custom carton packaging since 1964. From studio and structural design to print and production — all under one roof, with good people who grow with us.",
      perks: [
        {
          title: "Stability",
          body: "A long-established, steady company with generations of packaging experience.",
        },
        {
          title: "Team",
          body: "Professionals who work together from the first brief to delivery.",
        },
        {
          title: "Craft",
          body: "An advanced plant and a real chance to learn and grow professionally.",
        },
      ],
      codeLabel: "SKU",
      fallbackTitle: "Apply now",
    },
    form: {
      heading: "Applicant details",
      intro: "Leave your details and attach a resume — we'll be in touch soon.",
      roleLabel: "Role",
      name: { label: "Full name", placeholder: "First and last name" },
      phone: { label: "Phone", placeholder: "05X-0000000" },
      email: { label: "Email", placeholder: "name@example.com" },
      message: {
        label: "A few words",
        placeholder: "What should we know? A little background, experience, or why Beeri.",
        optional: "(optional)",
      },
      cv: {
        label: "Resume",
        button: "Choose file",
        empty: "No file selected",
        optional: "(optional)",
      },
      submit: "Send application",
    },
    errors: {
      name: "Please enter your full name.",
      phone: "Please enter a valid phone number.",
      email: "Please enter a valid email address.",
    },
    success: {
      title: "Application sent",
      body: "Thanks for reaching out. Our hiring team will review your details and get back to you soon.",
      close: "Close",
    },
  },
};
