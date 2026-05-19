import type { Metadata } from "next";
import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { PlaceholderHero } from "@/app/components/placeholder/PlaceholderHero";
import { placeholderContent } from "@/app/content/placeholder";

export const metadata: Metadata = {
  title: "השבחות · בארי אריזות",
  description:
    "טכניקות הדפסה וגימור — פויל, הבלטה, ספוט UV, חיתוך לייזר ועוד. תיעוד מלא בעריכה.",
};

export default function FinishingPage() {
  return (
    <PlaceholderShell>
      <PlaceholderHero content={placeholderContent.finishing} />
    </PlaceholderShell>
  );
}
