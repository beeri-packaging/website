import type { HomeCopy, Lang } from "./home";
import type { AboutCopy } from "./about";
import type { Chrome } from "./site";
import type { CatalogCopy } from "./catalog";
import type { FinishingCopy } from "./finishing";
import type { LocalizedPost } from "@/sanity/queries";
import type { CategoryWithProducts } from "@/app/review/catalog-example/CatalogProductConcept";
import assets from "./feedback-assets.json";

// Approved feedback, 8 September 2026. CMS documents are published separately.
// These adapters keep bundled fallback content consistent during CMS outages.
export function reviewPunctuation<T>(value: T): T {
  if (typeof value === "string") {
    return (/^https?:\/\//.test(value) ? value : value.replace(/[—–]/g, "-")) as T;
  }
  if (Array.isArray(value)) return value.map(reviewPunctuation) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, reviewPunctuation(entry)])) as T;
  }
  return value;
}

export function reviewAbout(copy: AboutCopy, lang: Lang): AboutCopy {
  return reviewPunctuation({
    ...copy,
    intro: copy.intro.replace("למעלה ממאה שנה", "200 שנה").replace("over a century", "200 years").replace("more than a century", "200 years"),
    stats: copy.stats.map((stat) => stat.value === "24/6"
      ? { ...stat, label: lang === "he" ? "מפעל חיוני שעובד" : "An essential facility operating", labelFirst: true }
      : stat),
  });
}

export function reviewChrome(copy: Chrome, lang: Lang): Chrome {
  return reviewPunctuation(lang === "en" ? {
    ...copy,
    logoEn: assets.logo.url,
    logoEnDimensions: { width: 471, height: 336 },
    logoEnIncludesByline: true,
  } : copy);
}

export function reviewHomeCopy(copy: HomeCopy, lang: Lang): HomeCopy {
  return reviewPunctuation(lang === "en" ? {
    ...copy,
    bento2Title: "Development lab",
    bento2Body: "We test materials, structures, reinforcements, and the unboxing experience, turning an idea into a scalable package.",
  } : copy);
}

export function reviewCatalog(copy: CatalogCopy, lang: Lang): CatalogCopy {
  const intro = lang === "he"
    ? copy.intro.replace(", טקסטיל", "").replace("קפה, פארמה וטואלטיקה", "קפה ופארמה")
      .replace("הקוסמטיקה והטואלטיקה", "הקוסמטיקה")
      .replace(" ליצרני הטקסטיל נפתח פתרונות אריזה מותאמים.", "")
    : copy.intro.replace(/, textiles/g, "").replace(/coffee, pharma and toiletries/g, "coffee and pharma")
      .replace(/cosmetics and toiletries/gi, "cosmetics")
      .replace(/ For textile manufacturers, we develop tailored packaging solutions\./g, "");
  return reviewPunctuation({ ...copy, intro });
}

export function reviewProducts(categories: readonly CategoryWithProducts[], lang: Lang): readonly CategoryWithProducts[] {
  const next = structuredClone(categories) as CategoryWithProducts[];
  const cosmetics = next.find((category) => category.key === "cosmetics-preview");
  const special = cosmetics?.products.find((product) => product.key === "cosmetics-special");
  const premium = cosmetics?.products.find((product) => product.key === "cosmetics-premium");
  const windows = special?.examples.find((example) => example.key === "sabon-three-windows");
  if (special && premium && windows) {
    special.examples = special.examples.filter((example) => example.key !== windows.key);
    premium.examples = [...premium.examples.filter((example) => example.key !== windows.key), {
      ...windows, image: assets.sabon.url,
    }];
  }
  for (const category of next) for (const product of category.products) {
    product.examples = product.examples.map((example) => {
      if (example.key === "preview-sabon-popup") return {
        ...example, image: "https://cdn.sanity.io/images/4qkb39ql/production/6a02a304a5ba39fdd1272734254e7a4819035541-1672x941.png",
      };
      if (lang === "he" && example.key === "beer-carlsberg") return { ...example, name: "החברה המרכזית - קרלסברג" };
      if (lang === "he" && example.key === "beer-tuborg") return { ...example, name: "החברה המרכזית - טובורג" };
      return example;
    });
  }
  return reviewPunctuation(next);
}

export function reviewPost(post: LocalizedPost, lang: Lang): LocalizedPost {
  const sections = post.sections?.map((section, index) => {
    let body = section.body;
    if (post.slug === "recyclable-stock-2026" && index === 0) {
      return {
        ...section,
        heading: lang === "he" ? "קיימות ואחריות סביבתית" : "Sustainability and environmental responsibility",
        body: lang === "he"
          ? "אנו רואים בקיימות חלק בלתי נפרד מתהליך הייצור ומחויבותנו לסביבה. אנו פועלים לצמצום השימוש במשאבים, להפחתת פסולת ולבחירת חומרי גלם בעלי מאפיינים סביבתיים, תוך שמירה על איכות המוצר ועמידה בדרישות הלקוחות. באמצעות תהליכי ייצור יעילים, שימוש מושכל בחומרים ועידוד מחזור, אנו שואפים ליצור אריזות איכותיות המשלבות בין ביצועים, אחריות סביבתית וחשיבה לטווח ארוך."
          : "We see sustainability as an integral part of our production process and our commitment to the environment. We work to reduce resource use and waste, and to select raw materials with environmental attributes, while maintaining product quality and meeting customer requirements. Through efficient production processes, thoughtful use of materials and encouragement of recycling, we aim to create quality packaging that combines performance, environmental responsibility and long-term thinking.",
      };
    }
    if (post.slug === "aix-israel-star-winner") {
      body = lang === "he"
        ? body.replace("מסמך המוצר מתאר שילוב של מנשא ואריזה", "המוצר משלב מנשא ואריזה")
          .replace(/לפי מסמך המוצר, /g, "")
          .replace("הנתונים המוצגים בו", "הנתונים")
        : body.replace("The product document describes a combined carrier and package", "The product combines a carrier and package")
          .replace(/According to the product document, /g, "")
          .replace("The figures presented in it", "The material and volume savings").replace(/^the pack/, "The pack");
    }
    if (post.slug === "employee-tenure-gift-pack" && index === 2) {
      body = body.replace(/שיצא מה(?:מלאי|מחסן)/g, "שירד מהמדף").replace("pulled from stock", "taken off the shelf");
    }
    if (post.slug === "beeri-israel-star" && index === 2) {
      body = body.replace("ביומן", "בבלוג").replace("in the journal", "on the blog");
      return { ...section, body, links: lang === "he" ? [
        { text: "מארז היין של AIX", slug: "aix-israel-star-winner" },
        { text: "מארז שי הוותק לעובד", slug: "employee-tenure-gift-pack" },
      ] : [
        { text: "the AIX wine pack", slug: "aix-israel-star-winner" },
        { text: "the employee tenure gift box", slug: "employee-tenure-gift-pack" },
      ] };
    }
    return { ...section, body };
  });
  return reviewPunctuation({ ...post, sections });
}

export function reviewFinishing(copy: FinishingCopy, lang: Lang): FinishingCopy {
  const descriptions = lang === "he" ? [
    { title: "מפעל חיוני", body: "בארי אריזות גאה להיות מוכרת כמפעל חיוני במדינת ישראל. מעמד זה מבטא את חשיבות פעילותנו ואת יכולתנו להבטיח רציפות תפעולית, ייצור ואספקה גם בתקופות חירום. אנו מחויבים להמשיך לעמוד לצד לקוחותינו ולספק להם שירות אמין ורציף - בכל עת ובכל מצב." },
    { title: "מפעל קיומי", body: "בארי אריזות גאה להיות מוכרת כמפעל קיומי, המהווה חוליה חיונית ברציפות התפקודית של המשק. מעמד זה משקף את האחריות המוטלת עלינו ואת מחויבותנו להבטיח ייצור ואספקה רציפים גם בתנאים מאתגרים ובשעת חירום - מתוך חוסן, אחריות ומחויבות ללקוחות ולמשק הישראלי." },
  ] : [
    { title: "Essential facility", body: "Beeri Packaging is proud to be recognized as an essential facility in Israel. This status reflects the importance of our operations and our ability to maintain operational continuity, production and supply during emergencies. We remain committed to standing by our customers and providing reliable, continuous service at all times and in every situation." },
    { title: "Facility providing vital services", body: "Beeri Packaging is proud to be recognized as a facility providing vital services, an essential link in the continuity of the economy. This status reflects our responsibility and commitment to maintaining production and supply in challenging conditions and emergencies, with resilience, responsibility and dedication to our customers and the Israeli economy." },
  ];
  return reviewPunctuation({ ...copy, standards: [
    ...copy.standards.filter((standard) => !["24/6", "ESSENTIAL", "VITAL"].includes(standard.code)),
    ...descriptions.map((description, index) => ({
      ...description, code: index === 0 ? "ESSENTIAL" : "VITAL",
      image: index === 0 ? assets.essentialImage.url : assets.vitalImage.url,
      certificateUrl: index === 0 ? assets.essentialPdf.url : assets.vitalPdf.url,
      certificateLabel: lang === "he" ? `לצפייה באישור ${description.title}` : `View certificate: ${description.title}`,
      tone: "plain" as const,
    })),
  ] });
}
