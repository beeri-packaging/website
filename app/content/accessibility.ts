// app/content/accessibility.ts
//
// Copy for the native accessibility menu (the floating נגישות button) and the
// public Accessibility Statement page (הצהרת נגישות). Grounded in the Israeli
// accessibility regulations — תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות
// נגישות לשירות), התשע״ג–2013 — and the Israeli standard ת״י 5568 (≈ WCAG 2.0
// level AA). The Hebrew version is the binding one; English is a courtesy
// translation.
//
// NOTE: A named accessibility coordinator (רכז נגישות) with a direct phone line
// should be confirmed by the client and added to `accessibilityDoc` before this
// is treated as a final legal statement.

import type { Lang } from "@/app/content/home";
import type { LegalDoc } from "@/app/content/legal";

export type A11yMenuCopy = {
  /** aria-label for the floating trigger button. */
  buttonLabel: string;
  /** Panel heading. */
  title: string;
  textSize: string;
  increase: string;
  decrease: string;
  contrast: string;
  links: string;
  readableFont: string;
  reduceMotion: string;
  reset: string;
  /** Link text to the full statement page. */
  statement: string;
  close: string;
};

export const a11yMenu: Record<Lang, A11yMenuCopy> = {
  he: {
    buttonLabel: "תפריט נגישות",
    title: "הגדרות נגישות",
    textSize: "גודל טקסט",
    increase: "הגדלת טקסט",
    decrease: "הקטנת טקסט",
    contrast: "ניגודיות גבוהה",
    links: "הדגשת קישורים",
    readableFont: "גופן קריא",
    reduceMotion: "עצירת אנימציות",
    reset: "איפוס הגדרות",
    statement: "הצהרת נגישות",
    close: "סגירה",
  },
  en: {
    buttonLabel: "Accessibility menu",
    title: "Accessibility settings",
    textSize: "Text size",
    increase: "Increase text",
    decrease: "Decrease text",
    contrast: "High contrast",
    links: "Highlight links",
    readableFont: "Readable font",
    reduceMotion: "Reduce motion",
    reset: "Reset settings",
    statement: "Accessibility statement",
    close: "Close",
  },
};

export const accessibilityDoc: Record<Lang, LegalDoc> = {
  he: {
    eyebrow: "הצהרת נגישות",
    title: "הצהרת נגישות",
    updated: "עודכן לאחרונה: יוני 2026",
    intro: [
      'בארי אריזות בע״מ (ח״פ 520026113) רואה חשיבות רבה במתן שירות שוויוני לכלל הציבור, ופועלת להנגשת אתר האינטרנט שלה כדי לאפשר גם לאנשים עם מוגבלות לגלוש בו בנוחות ובעצמאות.',
      "אתר זה הונגש בהתאם להוראות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג–2013, ובהתאם לתקן הישראלי ת״י 5568 ברמת AA, המבוסס על הנחיות הנגישות לתכני אינטרנט WCAG 2.0.",
    ],
    sections: [
      {
        heading: "רמת ההנגשה באתר",
        body: [
          "האתר נבנה מתוך מחויבות לנגישות: שימוש בתגיות סמנטיות ובמבנה כותרות הגיוני, ניגודיות צבעים מספקת, תמיכה מלאה בניווט באמצעות מקלדת, טקסט חלופי לתמונות משמעותיות, וסימון מצב פוקוס ברור לכל רכיב אינטראקטיבי.",
          "האתר נתמך בדפדפנים המודרניים המקובלים ומותאם לגלישה במחשב, בטאבלט ובטלפון נייד.",
        ],
      },
      {
        heading: "תפריט הנגישות באתר",
        body: ["בכל עמוד באתר מופיע כפתור נגישות קבוע הפותח תפריט המאפשר להתאים אישית את חוויית הגלישה, ובכלל זה:"],
        list: [
          "הגדלה והקטנה של גודל הטקסט באתר.",
          "הפעלת מצב ניגודיות גבוהה.",
          "הדגשת קישורים והבלטתם בתוכן.",
          "מעבר לגופן קריא וברור יותר.",
          "עצירת אנימציות ותנועה באתר.",
          "איפוס מלא של ההגדרות לברירת המחדל.",
        ],
      },
      {
        heading: "החרגות והגבלות",
        body: [
          "אנו עושים מאמץ מתמיד לשמור על רמת נגישות גבוהה בכל חלקי האתר. ייתכן שחלקים מסוימים, ובכללם תכנים שמקורם בצד שלישי, טרם הונגשו במלואם או נמצאים בתהליך תיקון.",
          "אם נתקלתם ברכיב או בעמוד שאינם נגישים, נשמח שתפנו אלינו — נטפל בכך בהקדם האפשרי וניתן מענה חלופי במידת הצורך.",
        ],
      },
    ],
    contactHeading: "פנייה בנושא נגישות",
    contactIntro:
      "נתקלתם בקושי בגלישה או בבעיית נגישות באתר? נשמח לשמוע. ניתן לפנות אלינו בכל אחד מהאמצעים הבאים ונחזור אליכם בהקדם:",
  },
  en: {
    eyebrow: "Accessibility statement",
    title: "Accessibility statement",
    updated: "Last updated: June 2026",
    intro: [
      "Beeri Packaging Ltd. (Company No. 520026113) is committed to providing an equal service to the whole public, and works to make its website accessible so that people with disabilities can browse it comfortably and independently.",
      "This site was made accessible in line with the Israeli Equal Rights for Persons with Disabilities (Service Accessibility Adjustments) Regulations, 5773–2013, and with Israeli Standard SI 5568 at level AA, which is based on the WCAG 2.0 web content accessibility guidelines.",
    ],
    sections: [
      {
        heading: "Level of accessibility",
        body: [
          "The site was built with accessibility in mind: semantic markup and a logical heading structure, sufficient colour contrast, full keyboard navigation, alternative text for meaningful images, and a clear focus state on every interactive element.",
          "The site is supported on the common modern browsers and is adapted for desktop, tablet and mobile browsing.",
        ],
      },
      {
        heading: "The accessibility menu",
        body: ["A persistent accessibility button appears on every page, opening a menu that lets you tailor your browsing experience, including:"],
        list: [
          "Increasing and decreasing the site's text size.",
          "Turning on a high-contrast mode.",
          "Highlighting links within the content.",
          "Switching to a clearer, more readable font.",
          "Stopping animations and motion on the site.",
          "Fully resetting the settings to their defaults.",
        ],
      },
      {
        heading: "Exclusions and limitations",
        body: [
          "We make an ongoing effort to maintain a high level of accessibility across the site. Some parts, including third-party content, may not yet be fully accessible or may be in the process of being fixed.",
          "If you come across an element or page that is not accessible, please let us know — we will address it as soon as possible and provide an alternative where needed.",
        ],
      },
    ],
    contactHeading: "Accessibility enquiries",
    contactIntro:
      "Ran into a difficulty browsing or an accessibility issue on the site? We'd like to hear about it. You can reach us through any of the channels below and we'll get back to you shortly:",
  },
};
