import { SITE_URL } from "@/lib/site";
import { COMPANY } from "@/app/content/company";
import type { Lang } from "@/app/content/home";
import type { LocalizedPost } from "@/sanity/queries";

/** Absolute-ize a possibly-relative asset path for structured data. */
function abs(url?: string): string | undefined {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${SITE_URL}${url}`;
}

const LOGO_URL = `${SITE_URL}/images/logo-en.svg`;

const PUBLISHER = {
  "@type": "Organization",
  name: COMPANY.nameEn,
  logo: { "@type": "ImageObject", url: LOGO_URL },
} as const;

const ORG_DESCRIPTION: Record<Lang, string> = {
  he: "יצרנית אריזות קרטון ממותגות בהתאמה אישית משנת 1964 — תכנון מבני, דפוס דיגיטלי ואופסט, שטנץ, הדבקה והשבחות לתעשיות הפארמה, המזון, הקוסמטיקה והיין.",
  en: "Custom folding-carton packaging manufacturer since 1964 — structural design, offset & digital print, and finishing for cosmetics, pharma, food and wine brands.",
};

export function OrganizationJsonLd({ locale = "he" }: { locale?: Lang }) {
  const addr = COMPANY.address[locale];
  const data = {
    "@context": "https://schema.org",
    // Organization + ProfessionalService (a LocalBusiness subtype) on one
    // node so the real Yavne address is attached to the business entity.
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${SITE_URL}/#organization`,
    name: locale === "he" ? COMPANY.nameHe : COMPANY.nameEn,
    alternateName: locale === "he" ? COMPANY.nameEn : COMPANY.nameHe,
    legalName: locale === "he" ? COMPANY.legalNameHe : COMPANY.legalNameEn,
    url: SITE_URL,
    logo: LOGO_URL,
    image: LOGO_URL,
    foundingDate: String(COMPANY.foundingYear),
    email: COMPANY.email,
    inLanguage: locale,
    description: ORG_DESCRIPTION[locale],
    address: {
      "@type": "PostalAddress",
      streetAddress: addr.street,
      addressLocality: addr.city,
      addressCountry: "IL",
    },
    sameAs: [COMPANY.linkedin],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Article/BlogPosting structured data for a single blog post. */
export function BlogPostingJsonLd({
  post,
  locale,
}: {
  post: LocalizedPost;
  locale: Lang;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    inLanguage: locale,
    ...(post.date ? { datePublished: post.date } : {}),
    ...(abs(post.image) ? { image: [abs(post.image)] } : {}),
    author: post.author
      ? { "@type": "Person", name: post.author }
      : PUBLISHER,
    publisher: PUBLISHER,
    mainEntityOfPage: `${SITE_URL}/${locale}/blog/${post.slug}`,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
