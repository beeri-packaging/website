import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "בארי אריזות — האתר החדש בדרך",
  description: "האתר החדש של בארי אריזות נמצא בבנייה ויעלה בקרוב.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function UnderConstructionLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
