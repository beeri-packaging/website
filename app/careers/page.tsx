import type { Metadata } from "next";
import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { PlaceholderHero } from "@/app/components/placeholder/PlaceholderHero";
import { placeholderContent } from "@/app/content/placeholder";

export const metadata: Metadata = {
  title: "קריירה · בארי אריזות",
  description:
    "המשרות הפתוחות בבארי אריזות יפורסמו כאן. אפשר גם לשלוח קורות חיים יזומים.",
};

export default function CareersPage() {
  return (
    <PlaceholderShell>
      <PlaceholderHero content={placeholderContent.careers} />
    </PlaceholderShell>
  );
}
