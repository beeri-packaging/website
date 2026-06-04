import type { Metadata } from "next";
import { PlaceholderShell } from "@/app/components/placeholder/PlaceholderShell";
import { BlogIndex } from "@/app/components/placeholder/BlogIndex";

export const metadata: Metadata = {
  title: "בלוג · בארי אריזות",
  description:
    "יומן הסטודיו: טורים, מדריכים ופרויקטים מקבוצת בארי אריזות. הפוסטים הראשונים בעריכה.",
};

export default function BlogIndexPage() {
  return (
    <PlaceholderShell>
      <BlogIndex />
    </PlaceholderShell>
  );
}
