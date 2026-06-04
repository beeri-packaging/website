import { SITE_URL } from "@/lib/site";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Beeri Packaging",
    alternateName: "בארי אריזות",
    url: SITE_URL,
    foundingDate: "1964",
    description:
      "Custom carton-packaging manufacturer — structural design, print and finishing.",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
