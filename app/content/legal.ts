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
  "he": {
    "eyebrow": "מדיניות פרטיות",
    "title": "מדיניות פרטיות",
    "updated": "עודכן לאחרונה: ספטמבר 2026",
    "intro": [
      "בארי אריזות בע״מ (ח״פ 520026113) (\"בארי אריזות”, \"אנחנו” או \"החברה”) מכבדת את פרטיות המבקרים והמשתמשים באתר זה ופועלת בהתאם להוראות הדין החל, ובכלל זה חוק הגנת הפרטיות, התשמ״א-1981, והתקנות שהותקנו מכוחו.",
      "מדיניות זו מסבירה איזה מידע נאסף במסגרת השימוש באתר, פנייה אלינו או הגשת מועמדות למשרה באמצעותו, כיצד אנו עושים בו שימוש, עם מי הוא עשוי להיות משותף ומהן הזכויות העומדות לך. מסירת מידע באמצעות האתר נעשית מרצונך החופשי, אולם ללא מסירת פרטים מסוימים ייתכן שלא נוכל לטפל בפנייתך או במועמדותך."
    ],
    "sections": [
      {
        "heading": "המידע שאנו אוספים",
        "body": [
          "אנו אוספים את סוגי המידע הבאים:"
        ],
        "list": [
          "מידע שנמסר מרצונכם - בעת פנייה אלינו באמצעות טופס הפנייה הכללית באתר, ייתכן כי תתבקשו למסור שם מלא, מספר טלפון, כתובת דוא\"ל, שם חברה, סיבת הפנייה ופרטים נוספים שתבחרו למסור. בעת הגשת מועמדות למשרה, ייתכן כי תתבקשו למסור שם מלא, מספר טלפון, כתובת דוא״ל, שם המשרה וקוד המשרה, וכן קובץ קורות חיים, אשר צירופו הוא אופציונלי. אם תמסרו לנו מידע הנוגע לצדדים שלישיים, עליכם לוודא כי אתם רשאים לעשות כן.",
          "מידע טכני - בעת הגלישה באתר עשוי להיאסף מידע טכני מסוים באופן אוטומטי על-ידי שרתי האתר, ספקי השירות או מערכות תפעול ואבטחה, כגון כתובת IP, סוג הדפדפן, סוג המכשיר, מערכת ההפעלה, זמני גישה, העמודים שנצפו, כתובת ההפניה לאתר, נתוני שימוש בסיסיים, לוגים טכניים ונתוני שגיאה, והכול לצורכי תפעול, אבטחה, תחזוקה ושיפור האתר.",
          "מידע בקשר להרשמה לעדכוני הבלוג - בעת הרשמה לעדכוני הבלוג נאספת כתובת הדוא\"ל בלבד. שדה החיפוש בבלוג פועל מקומית בדפדפן ואינו שולח אלינו או שומר את מונחי החיפוש."
        ]
      },
      {
        "heading": "השימוש במידע",
        "body": [
          "אנו עושים שימוש במידע למטרות הבאות, לפי העניין:"
        ],
        "list": [
          "מענה לפניות, יצירת קשר חוזר איתך, טיפול בבקשות, תיאום המשך טיפול ותיעוד הפניות שהתקבלו. פניות כלליות והרשמות לעדכוני הבלוג נשלחות לכתובת office@beeripacks.co.il.",
          "בחינת מועמדויות למשרות, ניהול הליכי גיוס, יצירת קשר עם מועמדים ובחינת התאמה למשרה מסוימת. מועמדויות וקורות חיים נשלחים לכתובת jobs@beeripacks.co.il.",
          "תפעול האתר, תחזוקתו, ניטור פעילותו, אבטחתו, מניעת שימוש לרעה בו ושיפור חוויית המשתמש.",
          "עמידה בדרישות חוק, רגולציה, צווים והנחיות של רשויות מוסמכות, וכן ביסוס, מימוש והגנה על זכויותינו המשפטיות."
        ]
      },
      {
        "heading": "מסירת מידע לצדדים שלישיים",
        "body": [
          "איננו מוכרים ואיננו משכירים מידע אישי לצדדים שלישיים. עם זאת, מידע אישי עשוי להיות מועבר או להיות נגיש לספקי שירות הפועלים מטעמנו ולצורך תפעול האתר ומתן שירותים לחברה, לרבות Vercel לצורך אירוח והפעלת האתר, Resend לצורך העברת הודעות דוא\"ל, Microsoft 365 לצורך תיבות הדוא\"ל של החברה, Sanity לצורך ניהול והפצת תוכן ותמונות, ו-Google בקשר למפה המוטמעת באתר. ספקים אלה עשויים לעבד מידע רק ככל הנדרש לצורך מתן השירותים הרלוונטיים ובכפוף להתחייבויות מתאימות של סודיות ואבטחת מידע. מידע עשוי להימסר גם כאשר הדבר נדרש לפי דין, צו שיפוטי או דרישת רשות מוסמכת, או לצורך ביסוס, מימוש או הגנה על זכויות משפטיות. מידע עשוי להימסר גם במסגרת קבוצת דפוס בארי, ככל שהדבר נחוץ לטיפול בפנייתכם.",
          "האתר וספקי השירות שבהם אנו עושים שימוש מבוססים, כולם או חלקם, על שירותי ענן בינלאומיים. לפיכך, מידע טכני והודעות דוא\"ל עשויים להישמר, להיות מעובדים או להיות נגישים מחוץ לישראל, בהתאם לתשתיות ולהסכמים של Vercel, Resend, Microsoft, Sanity ו-Google. במקרים כאמור, אנו נפעל בהתאם לדרישות הדין החל וננקוט אמצעים סבירים ומקובלים לשמירה על המידע."
        ]
      },
      {
        "heading": "עוגיות (Cookies)",
        "body": [
          "האתר אינו עושה שימוש ב-Google Analytics, בפיקסלים של Facebook או LinkedIn, ב-Hotjar, ב-Microsoft Clarity, ב-reCAPTCHA או בכלי פרסום ומעקב אחרים. מנגנון מניעת הספאם בטפסים מבוסס על שדה נסתר בלבד ואינו כרוך בשימוש בשירות צד שלישי. האתר כולל מפה מוטמעת של Google Maps, אשר בעת טעינתה עשויה לקבל מידע טכני ולהשתמש בעוגיות או בטכנולוגיות דומות בהתאם למדיניות Google. בנוסף, האתר עשוי לעשות שימוש בעוגיות חיוניות ובטכנולוגיות דומות הנדרשות לצורכי תפעולו התקין, אבטחתו ותחזוקתו. ניתן להגדיר את הדפדפן כך שיחסום או ימחק עוגיות, כולן או חלקן, אולם פעולה כזו עלולה להשפיע על תפקוד האתר או על חלק מתכונותיו."
        ]
      },
      {
        "heading": "אבטחת מידע",
        "body": [
          "אנו נוקטים אמצעים סבירים ומקובלים, לרבות אמצעים ארגוניים, טכניים ופיזיים, לצורך הגנה על המידע שבידינו מפני גישה, שימוש, שינוי, גילוי או מחיקה בלתי מורשים. בין היתר, הגישה למידע מוגבלת לגורמים הזקוקים לו לצורך מילוי תפקידם או מתן שירותים לחברה. עם זאת, אין באפשרותנו להבטיח הגנה מוחלטת, ומסירת מידע ברשת האינטרנט נעשית באחריות המשתמש."
        ]
      },
      {
        "heading": "שמירת המידע",
        "body": [
          "המידע הנמסר באמצעות טפסי האתר אינו נשמר במסד נתונים או במערכת CRM של האתר, אלא מועבר בדוא״ל בלבד. מידע זה עשוי להישמר בתיבות הדוא״ל של החברה ובמערכות ספקי השירות הרלוונטיים, בהתאם למדיניות השמירה שלהם.",
          "פניות וקורות חיים נשמרים למשך עד שישה חודשים, אלא אם נדרשת שמירה נוספת לפי דין, לצורך טיפול במחלוקות או לשם מימוש זכויות משפטיות והגנה עליהן. מידע טכני ולוגים נשמרים למשך התקופה הנדרשת באופן סביר למימוש המטרות שלשמן נאספו, לצורך עמידה בחובות דין, ניהול רשומות, טיפול במחלוקות, אכיפת זכויותינו והגנה עליהן, ובהתחשב באופי המידע וברגישותו.",
          "מידע שנמסר במסגרת מועמדות למשרה עשוי להישמר לצורך בחינת התאמה למשרות עתידיות, אלא אם תוגש בקשה למחיקתו, ובכפוף לתקופת השמירה האמורה."
        ]
      },
      {
        "heading": "זכויותיך",
        "body": [
          "על-פי חוק הגנת הפרטיות, התשמ״א-1981, ובכפוף להוראות הדין החל, עומדת לך הזכות לעיין במידע המוחזק אודותיך, לבקש את תיקונו אם הוא אינו מדויק, שלם, ברור או מעודכן, וכן לבקש את מחיקתו במקרים המתאימים. לצורך טיפול בבקשה, אנו עשויים לבקש ממך פרטים או מסמכים סבירים לצורך אימות זהותך. למימוש זכויות אלה ניתן לפנות אלינו בפרטי ההתקשרות המפורטים בתחתית עמוד זה."
        ]
      },
      {
        "heading": "קישורים לאתרים חיצוניים",
        "body": [
          "האתר עשוי לכלול קישורים לאתרים, עמודים או שירותים של צדדים שלישיים, לרבות מפה מוטמעת של Google Maps. מדיניות פרטיות זו אינה חלה על אתרים או שירותים אלה, ואיננו אחראים למדיניות הפרטיות, לאופן עיבוד המידע או לתכנים שלהם. השימוש במפה המוטמעת ובכל רכיב או שירות אחר של צד שלישי עשוי להיות כפוף גם לתנאים ולמדיניות של אותו צד שלישי. מומלץ לעיין במדיניות הפרטיות של כל אתר או שירות שאליו ניגשים."
        ]
      },
      {
        "heading": "שינויים במדיניות",
        "body": [
          "אנו רשאים לעדכן מדיניות זו מעת לעת, לפי שיקול דעתנו ובהתאם לשינויים בדין, בפעילות החברה, בשירותים הניתנים באמצעות האתר או באופן עיבוד המידע. הנוסח המעודכן יפורסם בעמוד זה ויחול ממועד פרסומו, אלא אם ייקבע אחרת לפי דין. אנו ממליצים לעיין במדיניות מעת לעת."
        ]
      },
      {
        "heading": "נוסח מחייב",
        "body": [
          "מדיניות זו נוסחה בעברית. בכל מקרה של סתירה בין הנוסח העברי לבין תרגום לשפה אחרת, יגבר הנוסח העברי."
        ]
      }
    ],
    "contactHeading": "יצירת קשר בנושאי פרטיות",
    "contactIntro": "בכל שאלה, בקשה או פנייה בנוגע למדיניות הפרטיות או למידע המוחזק אודותיך, ניתן ליצור עמנו קשר בפרטי ההתקשרות שלהלן."
  },
  "en": {
    "eyebrow": "Privacy Policy",
    "title": "Privacy Policy",
    "updated": "Last updated: September 2026",
    "intro": [
      "Beeri Packaging Ltd. (Company No. 520026113) (\"Beeri Packaging\", \"we\" or \"the Company\") respects the privacy of visitors and users of this website and acts in accordance with applicable law, including the Israeli Protection of Privacy Law, 5741-1981, and the regulations made under it.",
      "This policy explains what information is collected when you use the website, contact us or apply for a position through it, how we use that information, with whom it may be shared and the rights available to you. Providing information through the website is voluntary; however, without certain details, we may be unable to handle your inquiry or application."
    ],
    "sections": [
      {
        "heading": "Information we collect",
        "body": [
          "We collect the following types of information:"
        ],
        "list": [
          "Information you provide voluntarily - when contacting us through the general inquiry form, you may be asked to provide your full name, phone number, email address, company name, reason for contacting us and any additional details you choose to provide. When applying for a position, you may be asked to provide your full name, phone number, email address, position title and position code, as well as an optional CV attachment. If you provide information relating to third parties, you must ensure that you are entitled to do so.",
          "Technical information - when you browse the website, certain technical information may be collected automatically by website servers, service providers or operational and security systems. This may include your IP address, browser type, device type, operating system, access times, pages viewed, referring address, basic usage data, technical logs and error data, for website operation, security, maintenance and improvement.",
          "Blog update subscriptions - only your email address is collected when you subscribe to blog updates. The blog search field operates locally in your browser and does not send us or store your search terms."
        ]
      },
      {
        "heading": "How we use the information",
        "body": [
          "We use the information for the following purposes, as applicable:"
        ],
        "list": [
          "Responding to inquiries, contacting you, handling requests, coordinating follow-up and documenting inquiries received. General inquiries and blog update subscriptions are sent to office@beeripacks.co.il.",
          "Reviewing job applications, managing recruitment processes, contacting candidates and assessing suitability for a particular position. Applications and CVs are sent to jobs@beeripacks.co.il.",
          "Operating, maintaining, monitoring and securing the website, preventing misuse and improving the user experience.",
          "Complying with legal and regulatory requirements, orders and instructions from competent authorities, and establishing, exercising and defending our legal rights."
        ]
      },
      {
        "heading": "Sharing information with third parties",
        "body": [
          "We do not sell or rent personal information to third parties. However, personal information may be transferred to or accessed by service providers acting on our behalf to operate the website and provide services to the Company. These include Vercel for hosting and operating the website, Resend for delivering email messages, Microsoft 365 for Company email accounts, Sanity for managing and distributing content and images, and Google in connection with the map embedded on the website. These providers may process information only as needed to provide the relevant services and subject to appropriate confidentiality and data security commitments. Information may also be disclosed where required by law, a court order or a request from a competent authority, or to establish, exercise or defend legal rights. Information may also be shared within the Beeri Print Group, to the extent necessary to handle your inquiry.",
          "The website and the service providers we use are based, wholly or partly, on international cloud services. Technical information and email messages may therefore be stored, processed or accessed outside Israel, depending on the infrastructure and agreements of Vercel, Resend, Microsoft, Sanity and Google. In such cases, we will comply with applicable law and take reasonable and customary measures to protect the information."
        ]
      },
      {
        "heading": "Cookies",
        "body": [
          "The website does not use Google Analytics, Facebook or LinkedIn pixels, Hotjar, Microsoft Clarity, reCAPTCHA or other advertising or tracking tools. Spam prevention in the forms uses a hidden field only and does not involve a third-party service. The website includes an embedded Google Maps map, which may receive technical information and use cookies or similar technologies when loaded, in accordance with Google's policy. The website may also use essential cookies and similar technologies required for its proper operation, security and maintenance. You can configure your browser to block or delete all or some cookies, although this may affect the website's operation or some of its features."
        ]
      },
      {
        "heading": "Data security",
        "body": [
          "We take reasonable and customary measures, including organisational, technical and physical measures, to protect the information we hold against unauthorised access, use, alteration, disclosure or deletion. Access to information is limited to those who need it to carry out their duties or provide services to the Company. However, we cannot guarantee absolute protection, and transmitting information over the internet is at the user's own risk."
        ]
      },
      {
        "heading": "Data retention",
        "body": [
          "Information submitted through the website forms is not stored in a website database or CRM system, but is transmitted by email only. It may be retained in Company email accounts and in the systems of the relevant service providers, in accordance with their retention policies.",
          "Inquiries and CVs are retained for up to six months, unless further retention is required by law, to handle disputes or to exercise or defend legal rights. Technical information and logs are retained for a period reasonably necessary to fulfil the purposes for which they were collected, comply with legal obligations, maintain records, handle disputes and enforce or defend our rights, taking into account the nature and sensitivity of the information.",
          "Information submitted as part of a job application may be retained to assess suitability for future positions, unless you request its deletion, and subject to the retention period stated above."
        ]
      },
      {
        "heading": "Your rights",
        "body": [
          "Under the Protection of Privacy Law, 5741-1981, and subject to applicable law, you have the right to review information held about you, request its correction if it is inaccurate, incomplete, unclear or outdated, and request its deletion where appropriate. To handle a request, we may ask for reasonable details or documents to verify your identity. To exercise these rights, please use the contact details at the bottom of this page."
        ]
      },
      {
        "heading": "Links to external sites",
        "body": [
          "The website may include links to third-party websites, pages or services, including an embedded Google Maps map. This privacy policy does not apply to those websites or services, and we are not responsible for their privacy policies, data processing or content. Use of the embedded map or any other third-party component or service may also be subject to that third party's terms and policies. We recommend reviewing the privacy policy of any website or service you access."
        ]
      },
      {
        "heading": "Changes to this policy",
        "body": [
          "We may update this policy from time to time at our discretion and in response to changes in law, Company activities, services provided through the website or how information is processed. The updated version will be published on this page and will apply from its publication date, unless otherwise required by law. We recommend reviewing the policy periodically."
        ]
      },
      {
        "heading": "Governing language",
        "body": [
          "This policy was drafted in Hebrew. In the event of any conflict between the Hebrew version and any translation, the Hebrew version shall prevail."
        ]
      }
    ],
    "contactHeading": "Privacy contact",
    "contactIntro": "For any question, request or inquiry regarding this privacy policy or information held about you, please use the following contact details."
  }
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
