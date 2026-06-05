import type { Metadata } from "next";
import { Karantina, Open_Sans } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { routing } from "@/i18n/routing";
import { SanityLive } from "@/sanity/live";
import { SITE_URL } from "@/lib/site";
import { OrganizationJsonLd } from "@/app/components/seo/JsonLd";
import { ContactDialogProvider } from "@/app/components/contact/ContactDialogProvider";
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
    alternates: {
      canonical: `/${locale}`,
      languages: { he: "/he", en: "/en", "x-default": "/he" },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      siteName: t("siteName"),
      locale,
      type: "website",
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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
        <OrganizationJsonLd />
        <NextIntlClientProvider>
          <ContactDialogProvider lang={locale as Lang}>
            {children}
          </ContactDialogProvider>
        </NextIntlClientProvider>
        <SanityLive />
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  );
}
