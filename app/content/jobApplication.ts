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
    /** Heading above the role-specific description (replaces the generic pitch). */
    detailsTitle: string;
    lead: string;
    perks: readonly JobApplicationPerk[];
    /** Fallback heading when no specific role is being applied to. */
    fallbackTitle: string;
    /** Secondary action — opens the global contact dialog for a general question. */
    inquire: string;
  };
  form: {
    heading: string;
    /** Short line under the title; also the dialog's accessible description. */
    intro: string;
    name: { label: string; placeholder: string };
    phone: { label: string; placeholder: string };
    email: { label: string; placeholder: string };
    cv: { label: string; button: string; empty: string; optional: string };
    submit: string;
    /** Button label while the application is being sent. */
    sending: string;
  };
  errors: {
    name: string;
    phone: string;
    email: string;
    /** Shown when delivery fails (network/provider/misconfig). */
    submitFailed: string;
    /** Shown when the chosen CV exceeds the size limit. */
    fileTooLarge: string;
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
      detailsTitle: "על התפקיד",
      lead: "בארי אריזות מייצרת אריזות קרטון מתקפל בהתאמה אישית מאז 1964. מתכנון מבני ודייליין ועד דפוס, השבחות וייצור — הכול תחת קורת גג אחת, עם צוות שמלווה כל פרויקט מהתחלה ועד הסוף.",
      perks: [
        {
          title: "יציבות",
          body: "חברה ותיקה ויציבה, חלק מקבוצת דפוס בארי, עם דורות של ניסיון בענף האריזה.",
        },
        {
          title: "צוות",
          body: "אנשי מקצוע שעובדים יחד — מהאפיון הראשון ועד האספקה ללקוח.",
        },
        {
          title: "התמקצעות",
          body: "מפעל מתקדם והזדמנות אמיתית ללמוד את כל שרשרת הייצור ולצמוח מקצועית.",
        },
      ],
      fallbackTitle: "הגשת מועמדות",
      inquire: "יש לי שאלה — לפנייה כללית",
    },
    form: {
      heading: "פרטי המועמד/ת",
      intro: "משאירים פרטים ומצרפים קורות חיים — ונחזור אליכם בהקדם.",
      name: { label: "שם מלא", placeholder: "שם פרטי ושם משפחה" },
      phone: { label: "טלפון", placeholder: "05X-0000000" },
      email: { label: "דוא״ל", placeholder: "name@example.com" },
      cv: {
        label: "קורות חיים",
        button: "בחירת קובץ",
        empty: "לא נבחר קובץ",
        optional: "(לא חובה)",
      },
      submit: "שליחת מועמדות",
      sending: "שולח…",
    },
    errors: {
      name: "יש להזין שם מלא.",
      phone: "יש להזין מספר טלפון תקין.",
      email: "יש להזין כתובת דוא״ל תקינה.",
      submitFailed: "השליחה נכשלה. ניתן לנסות שוב או לכתוב לנו במייל.",
      fileTooLarge: "הקובץ גדול מדי (עד 5MB).",
    },
    success: {
      title: "המועמדות נשלחה",
      body: "תודה שפניתם. צוות הגיוס יעבור על הפרטים ויחזור אליכם בהקדם.",
      close: "סגירה",
    },
  },
  en: {
    closeLabel: "Close",
    triggerLabel: "Apply",
    aside: {
      eyebrow: "Careers",
      kicker: "● Join the team",
      detailsTitle: "About the role",
      lead: "Beeri Packaging has built custom folding-carton packaging since 1964. From structural design and dielines to print, finishing, and production — all under one roof, with a team that sees every project through.",
      perks: [
        {
          title: "Stability",
          body: "A long-established, steady company, part of the Beeri Print Group, with generations of packaging experience.",
        },
        {
          title: "Team",
          body: "Professionals who work together — from the first brief to delivery.",
        },
        {
          title: "Craft",
          body: "An advanced plant and a real chance to learn the full production chain and grow professionally.",
        },
      ],
      fallbackTitle: "Apply now",
      inquire: "Have a question — general inquiry",
    },
    form: {
      heading: "Applicant details",
      intro: "Leave your details and attach a resume — and we'll be in touch soon.",
      name: { label: "Full name", placeholder: "First and last name" },
      phone: { label: "Phone", placeholder: "05X-0000000" },
      email: { label: "Email", placeholder: "name@example.com" },
      cv: {
        label: "Resume",
        button: "Choose file",
        empty: "No file selected",
        optional: "(optional)",
      },
      submit: "Send application",
      sending: "Sending…",
    },
    errors: {
      name: "Please enter your full name.",
      phone: "Please enter a valid phone number.",
      email: "Please enter a valid email address.",
      submitFailed: "Something went wrong. Please try again or email us.",
      fileTooLarge: "That file is too large (up to 5MB).",
    },
    success: {
      title: "Application sent",
      body: "Thanks for reaching out. Our hiring team will review your details and get back to you soon.",
      close: "Close",
    },
  },
};
