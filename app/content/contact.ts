import type { Lang } from "@/app/content/home";
import type { ContactReasonValue } from "@/lib/contact-inquiry";

export type ContactReasonOption = { value: ContactReasonValue | ""; label: string };

export type ContactCopy = {
  /** aria-label / text for the corner close button. */
  closeLabel: string;
  /** Small label above the headline (the spec-sheet eyebrow). */
  eyebrow: string;
  /** Big display headline. */
  title: string;
  /** sr-only sentence used as the dialog's accessible description. */
  description: string;
  form: {
    fullName: { label: string; placeholder: string };
    phone: { label: string; placeholder: string };
    email: { label: string; placeholder: string };
    company: { label: string; placeholder: string };
    reason: { label: string; options: readonly ContactReasonOption[] };
    details: { label: string; placeholder: string };
    submit: string;
    /** Button label while the inquiry is being sent. */
    sending: string;
    /** Fine print beside the submit button. */
    consent: string;
  };
  errors: {
    fullName: string;
    phone: string;
    reason: string;
    email: string;
    /** Shown near the submit button when the server send fails. */
    submitFailed: string;
  };
  success: {
    title: string;
    body: string;
    close: string;
  };
};

export const contactCopy: Record<Lang, ContactCopy> = {
  he: {
    closeLabel: "סגירה",
    eyebrow: "פנייה לפרויקט",
    title: "נדבר על האריזה שלכם.",
    description: "טופס יצירת קשר — השאירו פרטים ונחזור אליכם בהקדם.",
    form: {
      fullName: { label: "שם מלא", placeholder: "דנה כהן" },
      phone: { label: "טלפון", placeholder: "050-1234567" },
      email: { label: "אימייל (לא חובה)", placeholder: "dana@studio.co.il" },
      company: { label: "חברה (לא חובה)", placeholder: "סטודיו לוקס" },
      reason: {
        label: "סיבת הפנייה",
        options: [
          { value: "", label: "בחירת סיבה…" },
          { value: "quote", label: "הצעת מחיר" },
          { value: "meeting", label: 'תיאום פגישה עם מת״ל' },
          { value: "other", label: "נושא אחר" },
        ],
      },
      details: {
        label: "פרטים נוספים (לא חובה)",
        placeholder: "כמה מילים על המוצר והפרויקט…",
      },
      submit: "שליחת פנייה",
      sending: "שולח…",
      consent:
        "בשליחת הטופס אתם מאשרים את תנאי השימוש ואת מדיניות הפרטיות של האתר.",
    },
    errors: {
      fullName: "יש להזין שם מלא.",
      phone: "יש להזין מספר טלפון תקין.",
      reason: "יש לבחור סיבת פנייה.",
      email: "כתובת האימייל אינה תקינה.",
      submitFailed: "שליחת הפנייה נכשלה. ניתן לנסות שוב או להתקשר אלינו.",
    },
    success: {
      title: "הפנייה נשלחה",
      body: "תודה! קיבלנו את הפרטים ונחזור אליכם בהקדם.",
      close: "סגירה",
    },
  },
  en: {
    closeLabel: "Close",
    eyebrow: "Project inquiry",
    title: "Let's talk about your packaging.",
    description: "Contact form — leave your details and we'll get back to you soon.",
    form: {
      fullName: { label: "Full name", placeholder: "Dana Cohen" },
      phone: { label: "Phone", placeholder: "+972 50-123-4567" },
      email: { label: "Email (optional)", placeholder: "dana@studio.co.il" },
      company: { label: "Company (optional)", placeholder: "Studio Lux" },
      reason: {
        label: "Reason for inquiry",
        options: [
          { value: "", label: "Select a reason…" },
          { value: "quote", label: "Request a quote" },
          { value: "meeting", label: "Meet with an account manager" },
          { value: "other", label: "Something else" },
        ],
      },
      details: {
        label: "Further details (optional)",
        placeholder: "A few words about the product and the project…",
      },
      submit: "Send inquiry",
      sending: "Sending…",
      consent:
        "By submitting, you agree to our terms of use and privacy policy.",
    },
    errors: {
      fullName: "Please enter your full name.",
      phone: "Please enter a valid phone number.",
      reason: "Please choose a reason for your inquiry.",
      email: "That email address doesn't look valid.",
      submitFailed: "We couldn't send your inquiry. Please try again or call us.",
    },
    success: {
      title: "Inquiry sent",
      body: "Thanks! We've got your details and will get back to you shortly.",
      close: "Close",
    },
  },
};
