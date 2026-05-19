import type { Metadata } from "next";
import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { PlaceholderHero } from "@/app/components/placeholder/PlaceholderHero";
import { placeholderContent } from "@/app/content/placeholder";

export const metadata: Metadata = {
  title: "פורטפוליו · בארי אריזות",
  description:
    "פרויקטי אריזה נבחרים מקבוצת בארי אריזות — תצוגה ייעודית בעריכה.",
};

export default function PortfolioPage() {
  return (
    <PlaceholderShell>
      <PlaceholderHero content={placeholderContent.portfolio} />
    </PlaceholderShell>
  );
}
