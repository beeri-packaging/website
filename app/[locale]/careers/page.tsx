import type { Metadata } from "next";
import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { CareersPageDesign } from "@/app/components/careers/CareersPageDesign";

export const metadata: Metadata = {
  title: "קריירה",
  description:
    "המשרות הפתוחות בבארי אריזות יפורסמו כאן. אפשר גם לשלוח קורות חיים יזומים.",
};

export default function CareersPage() {
  return (
    <PlaceholderShell>
      <CareersPageDesign />
    </PlaceholderShell>
  );
}
