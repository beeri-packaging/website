// app/content/legal.ts
//
// Bilingual legal copy for the Privacy Policy and Terms of Use pages.
// Grounded in Israeli law (Protection of Privacy Law, 5741-1981) and the real
// company facts in `company.ts`. The Hebrew version is the binding one; the
// English version is a courtesy translation (see the "governing language"
// section in each document).
//
// NOTE: This is general informational text, not a substitute for review by a
// qualified Israeli attorney before going live.

import type { Lang } from "@/app/content/home";

export type LegalSection = {
  heading: string;
  /** Free-text paragraphs. */
  body?: string[];
  /** Bullet list rendered under the paragraphs. */
  list?: string[];
};

export type LegalDoc = {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string[];
  sections: LegalSection[];
  contactHeading: string;
  contactIntro: string;
};

export const privacyDoc: Record<Lang, LegalDoc> = {
  he: {
    eyebrow: "מדיניות פרטיות",
    title: "מדיניות פרטיות",
    updated: "עודכן לאחרונה: יוני 2026",
    intro: [
      'בארי אריזות בע״מ (ח״פ 520026113) („בארי אריזות”, „אנחנו” או „החברה”) מכבדת את פרטיות המבקרים באתר זה ופועלת בהתאם להוראות חוק הגנת הפרטיות, התשמ״א–1981, והתקנות שהותקנו מכוחו.',
      "מדיניות זו מסבירה איזה מידע נאסף במסגרת השימוש באתר, כיצד אנו עושים בו שימוש, עם מי הוא עשוי להיות משותף ומהן הזכויות העומדות לך. השימוש באתר מהווה הסכמה לתנאי מדיניות זו.",
    ],
    sections: [
      {
        heading: "המידע שאנו אוספים",
        body: ["אנו אוספים שני סוגי מידע עיקריים:"],
        list: [
          'מידע שנמסר מרצונכם — בעת פנייה אלינו או הגשת מועמדות למשרה דרך הטפסים באתר, ניתן למסור שם מלא, מספר טלפון, כתובת דוא״ל, תוכן ההודעה וקובץ קורות חיים שתבחרו לצרף.',
          "מידע טכני — בעת הגלישה נאסף מידע טכני בסיסי המופק אוטומטית על־ידי שרתי האתר, כגון כתובת IP, סוג הדפדפן והעמודים שנצפו, לצורכי תפעול, אבטחה ושיפור האתר.",
        ],
      },
      {
        heading: "השימוש במידע",
        body: ["אנו עושים שימוש במידע למטרות הבאות:"],
        list: [
          "מענה לפניות ויצירת קשר חוזר איתך.",
          "בחינת מועמדויות למשרות וניהול הליכי גיוס.",
          "תפעול האתר, אבטחתו ושיפור חוויית המשתמש.",
          "עמידה בדרישות חוק ורגולציה.",
        ],
      },
      {
        heading: "מסירת מידע לצדדים שלישיים",
        body: [
          'איננו מוכרים ואיננו משכירים מידע אישי לצדדים שלישיים. מידע עשוי להימסר אך ורק במקרים הבאים: לספקי שירות הפועלים מטעמנו (כגון אירוח האתר ושירותי דוא״ל), המחויבים בשמירת סודיות ובשימוש במידע למטרת מתן השירות בלבד; כאשר הדבר נדרש לפי דין, צו שיפוטי או דרישת רשות מוסמכת; וכן במסגרת קבוצת דפוס בארי, ככל שהדבר נחוץ לטיפול בפנייתכם.',
        ],
      },
      {
        heading: "עוגיות (Cookies)",
        body: [
          "האתר עשוי לעשות שימוש בעוגיות חיוניות הנדרשות לתפעולו התקין בלבד. נכון למועד עדכון מדיניות זו, האתר אינו מציב עוגיות מעקב או פרסום ואינו עושה שימוש בכלי ניתוח (Analytics) של צד שלישי. ניתן להגדיר את הדפדפן כך שיחסום עוגיות, אם כי הדבר עלול להשפיע על חלק מתכונות האתר.",
        ],
      },
      {
        heading: "אבטחת מידע",
        body: [
          "אנו נוקטים באמצעים סבירים לאבטחת המידע מפני גישה, שימוש או חשיפה בלתי מורשים. עם זאת, אין באפשרותנו להבטיח הגנה מוחלטת, ומסירת מידע ברשת האינטרנט נעשית באחריותכם.",
        ],
      },
      {
        heading: "שמירת המידע",
        body: [
          "אנו שומרים את המידע למשך הזמן הנדרש למימוש המטרות שלשמן נאסף, או כפי שמתחייב לפי דין. מידע שנמסר במסגרת מועמדות למשרה עשוי להישמר לצורך בחינת התאמה למשרות עתידיות, אלא אם תוגש בקשה למחיקתו.",
        ],
      },
      {
        heading: "זכויותיך",
        body: [
          'על־פי חוק הגנת הפרטיות, התשמ״א–1981, עומדת לך הזכות לעיין במידע המוחזק אודותיך, לבקש את תיקונו אם אינו מדויק, שלם, ברור או מעודכן, וכן לבקש את מחיקתו. למימוש זכויות אלה ניתן לפנות אלינו בכתובת המפורטת בתחתית עמוד זה.',
        ],
      },
      {
        heading: "קישורים לאתרים חיצוניים",
        body: [
          "האתר עשוי לכלול קישורים לאתרים של צדדים שלישיים. מדיניות פרטיות זו אינה חלה על אתרים אלה, ואיננו אחראים למדיניות הפרטיות או לתכנים שלהם. מומלץ לעיין במדיניות הפרטיות של כל אתר שאליו נכנסים.",
        ],
      },
      {
        heading: "שינויים במדיניות",
        body: [
          "אנו רשאים לעדכן מדיניות זו מעת לעת. הנוסח המעודכן יפורסם בעמוד זה ויחול ממועד פרסומו. מומלץ לעיין במדיניות מעת לעת.",
        ],
      },
      {
        heading: "נוסח מחייב",
        body: [
          "מדיניות זו נוסחה בעברית. בכל מקרה של סתירה בין הנוסח העברי לבין תרגום לשפה אחרת, יגבר הנוסח העברי.",
        ],
      },
    ],
    contactHeading: "יצירת קשר בנושאי פרטיות",
    contactIntro:
      "בכל שאלה, בקשה או פנייה בנוגע למדיניות הפרטיות או למידע המוחזק אודותיכם, ניתן ליצור קשר:",
  },
  en: {
    eyebrow: "Privacy Policy",
    title: "Privacy Policy",
    updated: "Last updated: June 2026",
    intro: [
      'Beeri Packaging Ltd. (Company No. 520026113) ("Beeri Packaging", "we", or "the Company") respects the privacy of visitors to this website and acts in accordance with the Israeli Protection of Privacy Law, 5741-1981, and its regulations.',
      "This policy explains what information is collected through your use of the website, how we use it, with whom it may be shared, and the rights available to you. Using the website constitutes acceptance of this policy.",
    ],
    sections: [
      {
        heading: "Information we collect",
        body: ["We collect two main types of information:"],
        list: [
          "Information you provide voluntarily — when you contact us or apply for a position through the forms on the site, you may provide your full name, phone number, email address, the content of your message, and a CV file you choose to attach.",
          "Technical information — while browsing, basic technical information is generated automatically by the site's servers, such as IP address, browser type and pages viewed, for operation, security and improvement of the site.",
        ],
      },
      {
        heading: "How we use the information",
        body: ["We use the information for the following purposes:"],
        list: [
          "Responding to inquiries and getting back to you.",
          "Reviewing job applications and managing recruitment processes.",
          "Operating and securing the site and improving the user experience.",
          "Complying with legal and regulatory requirements.",
        ],
      },
      {
        heading: "Sharing information with third parties",
        body: [
          "We do not sell or rent personal information. Information may be disclosed only in the following cases: to service providers acting on our behalf (such as website hosting and email services), who are bound by confidentiality and may use the information solely to provide the service; where required by law, a court order or a request from a competent authority; and within the Beeri Print Group, to the extent necessary to handle your inquiry.",
        ],
      },
      {
        heading: "Cookies",
        body: [
          "The site may use essential cookies required for its proper operation only. As of the date of this policy, the site does not set tracking or advertising cookies and does not use third-party analytics tools. You can configure your browser to block cookies, although this may affect some features of the site.",
        ],
      },
      {
        heading: "Data security",
        body: [
          "We take reasonable measures to secure the information against unauthorised access, use or disclosure. However, we cannot guarantee absolute protection, and transmitting information over the internet is at your own risk.",
        ],
      },
      {
        heading: "Data retention",
        body: [
          "We retain information for as long as necessary to fulfil the purposes for which it was collected, or as required by law. Information submitted as part of a job application may be retained to assess suitability for future positions, unless you request its deletion.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "Under the Protection of Privacy Law, 5741-1981, you have the right to review the information held about you, to request its correction if it is inaccurate, incomplete, unclear or outdated, and to request its deletion. To exercise these rights, please contact us at the address listed at the bottom of this page.",
        ],
      },
      {
        heading: "Links to external sites",
        body: [
          "The site may include links to third-party websites. This privacy policy does not apply to those sites, and we are not responsible for their privacy practices or content. We recommend reviewing the privacy policy of any site you visit.",
        ],
      },
      {
        heading: "Changes to this policy",
        body: [
          "We may update this policy from time to time. The updated version will be published on this page and will apply from the date of publication. We recommend reviewing the policy periodically.",
        ],
      },
      {
        heading: "Governing language",
        body: [
          "This policy was drafted in Hebrew. In the event of any conflict between the Hebrew version and any translation, the Hebrew version shall prevail.",
        ],
      },
    ],
    contactHeading: "Privacy contact",
    contactIntro:
      "For any question, request or inquiry regarding this privacy policy or the information held about you, please contact:",
  },
};

export const termsDoc: Record<Lang, LegalDoc> = {
  he: {
    eyebrow: "תנאי שימוש",
    title: "תנאי שימוש",
    updated: "עודכן לאחרונה: יוני 2026",
    intro: [
      'אתר זה מופעל על־ידי בארי אריזות בע״מ (ח״פ 520026113) („בארי אריזות”, „אנחנו” או „החברה”). תנאי שימוש אלה מסדירים את הגישה לאתר ואת השימוש בו.',
      "עצם הגישה לאתר והשימוש בו מהווים הסכמה מלאה לתנאים אלה. במקרה של אי-הסכמה לתנאי כלשהו, אנא הימנעו מהשימוש באתר.",
    ],
    sections: [
      {
        heading: "אופי האתר",
        body: [
          "האתר הוא אתר תדמית ומידע המציג את פעילות החברה, מוצריה ושירותיה בתחום אריזות הקרטון. המידע באתר הוא כללי ואינו מהווה הצעה מחייבת, התחייבות או ייעוץ מקצועי. תנאי כל התקשרות מסחרית ייקבעו בנפרד ובכתב מול החברה.",
        ],
      },
      {
        heading: "קניין רוחני",
        body: [
          "מלוא זכויות הקניין הרוחני באתר ובתכניו — לרבות עיצוב, טקסטים, תמונות, גרפיקה, סימני מסחר, סמלילים (לוגו) וקבצים — שייכות לבארי אריזות או למי מטעמה ומוגנות על־פי דין. אין להעתיק, לשכפל, להפיץ, להציג בפומבי או לעשות כל שימוש מסחרי בתכנים ללא אישור מראש ובכתב מהחברה.",
        ],
      },
      {
        heading: "שימוש מותר ואסור",
        body: ["ניתן לעשות באתר שימוש אישי ולא מסחרי בלבד. בין היתר, אין לעשות את הפעולות הבאות:"],
        list: [
          "לעשות שימוש באתר למטרה בלתי חוקית או בניגוד לתנאים אלה.",
          "לשבש את פעולת האתר, את אבטחתו או את השרתים שעליהם הוא מתארח.",
          "לאסוף מידע מהאתר באמצעים אוטומטיים (כגון סריקה או „גרידה”) ללא היתר מראש ובכתב.",
          "להתחזות לאדם או לגוף, או למסור מידע כוזב או מטעה.",
        ],
      },
      {
        heading: "פניות והגשת מועמדויות",
        body: [
          "בעת פנייה אלינו או הגשת מועמדות למשרה דרך האתר, יש לוודא כי הפרטים שנמסרו נכונים ומדויקים. הגשת מועמדות או פנייה אינה מחייבת את החברה במתן מענה כלשהו או בהתקשרות. הטיפול במידע שנמסר כפוף למדיניות הפרטיות של החברה.",
        ],
      },
      {
        heading: "היעדר אחריות",
        body: [
          "האתר ותכניו מוצעים כפי שהם (\"AS IS\"). החברה אינה מתחייבת כי האתר יפעל ללא תקלות או הפרעות, או כי התכנים יהיו מדויקים, שלמים או עדכניים בכל עת. השימוש באתר נעשה באחריות המשתמש בלבד. בכפוף לכל דין, החברה לא תישא באחריות לכל נזק, ישיר או עקיף, שייגרם משימוש באתר או מהסתמכות על תכניו.",
        ],
      },
      {
        heading: "קישורים לאתרי צד שלישי",
        body: [
          "האתר עשוי לכלול קישורים לאתרים חיצוניים שאינם בשליטת החברה. אין באמור משום אחריות או המלצה ביחס לאתרים אלה או לתכניהם, והשימוש בהם הוא באחריות המשתמש בלבד.",
        ],
      },
      {
        heading: "שינויים בתנאים ובאתר",
        body: [
          "החברה רשאית לעדכן תנאים אלה ולשנות את האתר, תכניו וזמינותו, בכל עת וללא הודעה מוקדמת. הנוסח המעודכן יחול ממועד פרסומו בעמוד זה.",
        ],
      },
      {
        heading: "דין חל וסמכות שיפוט",
        body: [
          "על תנאים אלה ועל השימוש באתר יחולו דיני מדינת ישראל בלבד. סמכות השיפוט הבלעדית בכל עניין הנוגע לתנאים אלה תהא נתונה לבתי המשפט המוסמכים, בהתאם לדין.",
        ],
      },
      {
        heading: "נוסח מחייב",
        body: [
          "תנאים אלה נוסחו בעברית. בכל מקרה של סתירה בין הנוסח העברי לבין תרגום לשפה אחרת, יגבר הנוסח העברי.",
        ],
      },
    ],
    contactHeading: "יצירת קשר",
    contactIntro: "לשאלות בנוגע לתנאי שימוש אלה ניתן ליצור קשר:",
  },
  en: {
    eyebrow: "Terms of Use",
    title: "Terms of Use",
    updated: "Last updated: June 2026",
    intro: [
      'This website is operated by Beeri Packaging Ltd. (Company No. 520026113) ("Beeri Packaging", "we", or "the Company"). These terms of use govern access to and use of the website.',
      "Accessing and using the website constitutes full acceptance of these terms. If you do not agree to any of them, please refrain from using the website.",
    ],
    sections: [
      {
        heading: "Nature of the website",
        body: [
          "The website is an informational and marketing site presenting the Company's activity, products and services in the field of carton packaging. The information on the site is general and does not constitute a binding offer, a commitment, or professional advice. The terms of any commercial engagement will be agreed separately and in writing with the Company.",
        ],
      },
      {
        heading: "Intellectual property",
        body: [
          "All intellectual property rights in the website and its content — including design, text, images, graphics, trademarks, logos and files — are owned by Beeri Packaging or on its behalf and are protected by law. You may not copy, reproduce, distribute, publicly display or make any commercial use of the content without the Company's prior written consent.",
        ],
      },
      {
        heading: "Permitted and prohibited use",
        body: ["You may use the website for personal, non-commercial purposes. In particular, you may not:"],
        list: [
          "Use the website for any unlawful purpose or in breach of these terms.",
          "Disrupt the operation or security of the website or the servers on which it is hosted.",
          "Collect information from the website by automated means (such as scraping or crawling) without prior written permission.",
          "Impersonate any person or entity, or provide false or misleading information.",
        ],
      },
      {
        heading: "Inquiries and job applications",
        body: [
          "When you contact us or apply for a position through the website, you confirm that the details you provide are true and accurate. Submitting an application or inquiry does not obligate the Company to respond or to enter into any engagement. The handling of information you submit is subject to the Company's Privacy Policy.",
        ],
      },
      {
        heading: "Disclaimer of warranties",
        body: [
          'The website and its content are provided "AS IS". The Company does not warrant that the website will operate without faults or interruptions, or that the content will be accurate, complete or up to date at all times. Use of the website is at your sole risk. Subject to any applicable law, the Company shall not be liable for any direct or indirect damage arising from use of the website or reliance on its content.',
        ],
      },
      {
        heading: "Links to third-party sites",
        body: [
          "The website may include links to external sites that are not under the Company's control. This does not constitute any responsibility or recommendation regarding those sites or their content, and use of them is at your own risk.",
        ],
      },
      {
        heading: "Changes to the terms and the website",
        body: [
          "The Company may update these terms and change the website, its content and availability, at any time and without prior notice. The updated version will apply from the date it is published on this page.",
        ],
      },
      {
        heading: "Governing law and jurisdiction",
        body: [
          "These terms and the use of the website are governed solely by the laws of the State of Israel. Exclusive jurisdiction over any matter relating to these terms shall be vested in the competent courts, in accordance with the law.",
        ],
      },
      {
        heading: "Governing language",
        body: [
          "These terms were drafted in Hebrew. In the event of any conflict between the Hebrew version and any translation, the Hebrew version shall prevail.",
        ],
      },
    ],
    contactHeading: "Contact",
    contactIntro: "For questions regarding these terms of use, please contact:",
  },
};
