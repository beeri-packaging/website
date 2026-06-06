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

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY.nameEn,
    alternateName: COMPANY.nameHe,
    legalName: COMPANY.legalNameEn,
    url: SITE_URL,
    logo: LOGO_URL,
    foundingDate: String(COMPANY.foundingYear),
    email: COMPANY.email,
    description:
      "Custom folding-carton packaging manufacturer — structural design, offset & digital print, and finishing for cosmetics, pharma, food and wine brands.",
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY.address.en.street,
      addressLocality: COMPANY.address.en.city,
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
