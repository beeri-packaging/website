import type { Metadata } from "next";
import { Karantina, Open_Sans } from "next/font/google";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { routing } from "@/i18n/routing";
import { SanityLive } from "@/sanity/live";
import { SITE_URL, alternatesFor } from "@/lib/site";
import { OrganizationJsonLd } from "@/app/components/seo/JsonLd";
import { ContactDialogProvider } from "@/app/components/contact/ContactDialogProvider";
import { LogoLoader } from "@/app/components/system/LogoLoader";
import type { Lang } from "@/app/content/home";
import "../globals.css";

const karantina = Karantina({
  variable: "--font-display",
  subsets: ["hebrew", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-sans",
  subsets: ["hebrew", "latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  // Body/label face — never the LCP element (all headings ride on Karantina),
  // so we skip preloading it to free the initial connection for the hero.
  preload: false,
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: `%s · ${t("siteName")}` },
    description: t("description"),
    alternates: alternatesFor(locale, ""),
    openGraph: {
      title: t("title"),
      description: t("description"),
      siteName: t("siteName"),
      locale,
      type: "website",
      // Explicit openGraph objects replace the parent's resolved one, which
      // drops the app/opengraph-image.png file convention — re-attach it.
      images: ["/opengraph-image.png"],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// ISR: statically prerender, then re-fetch from Sanity at most once per minute
// so editors' add/remove/edit changes reach the live site without a redeploy.
// Applies to every page nested under this locale layout.
export const revalidate = 60;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const dir = locale === "he" ? "rtl" : "ltr";
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${karantina.variable} ${openSans.variable} antialiased`}
    >
      <body className="flex flex-col bg-bone text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[100] focus:bg-ink focus:text-bone focus:px-4 focus:py-2 focus:rounded-[5px] focus:font-sans focus:text-[14px]"
        >
          {locale === "he" ? "דלג לתוכן" : "Skip to content"}
        </a>
        <OrganizationJsonLd locale={locale as Lang} />
        {/* First-contact "fake loading" intro: plays the brand logo Lottie
            over the page once per session, then fades out. Self-removes and is
            skipped for repeat visits / reduced-motion. */}
        <LogoLoader />
        {/* One app-wide contact dialog for every "contact us" trigger — kept
            outside any page-level Radix dialog so opening it from inside the
            catalog/job modals doesn't unmount it when that modal closes. */}
        <ContactDialogProvider lang={locale as Lang}>{children}</ContactDialogProvider>
        {/* Live + Visual editing only in draft mode (Studio preview). For
            normal visitors they're inert and only emit a CORS console warning,
            so gating them keeps the production console clean and the page light. */}
        {isDraftMode && <SanityLive />}
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  );
}
