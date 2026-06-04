import type { Metadata } from "next";
import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { PlaceholderHero } from "@/app/components/placeholder/PlaceholderHero";
import { placeholderContent } from "@/app/content/placeholder";

export const metadata: Metadata = {
  title: "קטלוג · בארי אריזות",
  description:
    "קטלוג מבני אריזה, חומרי גלם, גובהים והשבחות זמינות. מערכת הקטלוג בהקמה.",
};

export default function CatalogPage() {
  return (
    <PlaceholderShell>
      <PlaceholderHero content={placeholderContent.catalog} />
    </PlaceholderShell>
  );
}
