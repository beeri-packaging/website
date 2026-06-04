import type { Metadata } from "next";
import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { FinishingPageDesign } from "@/app/components/finishing/FinishingPageDesign";

export const metadata: Metadata = {
  title: "השבחות",
  description:
    "טכניקות הדפסה וגימור — פויל, הבלטה, ספוט UV, חיתוך לייזר ועוד. תיעוד מלא בעריכה.",
};

export default function FinishingPage() {
  return (
    <PlaceholderShell>
      <FinishingPageDesign />
    </PlaceholderShell>
  );
}
