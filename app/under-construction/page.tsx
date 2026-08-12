import Image from "next/image";
import { Karantina, Open_Sans } from "next/font/google";
import { headers } from "next/headers";
import { COMPANY } from "@/app/content/company";
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
  weight: ["400", "600", "700"],
  display: "swap",
});

const copy = {
  he: {
    lang: "he",
    dir: "rtl",
    logo: "/images/logo-he.svg",
    logoAlt: "בארי אריזות",
    eyebrow: "משהו חדש נארז כאן",
    title: "האתר החדש שלנו בדרך",
    body: "אנחנו עובדים על אתר חדש. בינתיים, אנחנו כאן לכל שאלה, רעיון או פרויקט אריזה.",
    contact: "דברו איתנו",
    emailLabel: `שליחת מייל אל ${COMPANY.email}`,
    progress: "בקרוב באוויר",
    imageAlt: "חלל עבודה מואר עם דגמי אריזות על שולחן",
  },
  en: {
    lang: "en",
    dir: "ltr",
    logo: "/images/logo-en.svg",
    logoAlt: "Beeri Packaging",
    eyebrow: "Something new is taking shape",
    title: "Our new website is on its way",
    body: "We’re building a new online home. Until then, we’re here for every packaging idea, question and project.",
    contact: "Get in touch",
    emailLabel: `Email ${COMPANY.email}`,
    progress: "Launching soon",
    imageAlt: "A sunlit workspace with packaging models on a table",
  },
} as const;

export default async function UnderConstructionPage() {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-maintenance-locale") === "en" ? "en" : "he";
  const t = copy[locale];

  return (
    <html
      lang={t.lang}
      dir={t.dir}
      className={`${karantina.variable} ${openSans.variable} antialiased`}
    >
      <body className="bg-bone text-ink">
        <main className="relative isolate min-h-[100svh] overflow-hidden bg-ink">
          <Image
            src="/images/home/hero-bg.png"
            alt={t.imageAlt}
            fill
            priority
            sizes="100vw"
            quality={75}
            className="object-cover opacity-75 motion-safe:animate-[maintenanceScale_18s_ease-out_both]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(27,28,26,0.9)_0%,rgba(27,28,26,0.68)_48%,rgba(27,28,26,0.22)_100%)] rtl:bg-[linear-gradient(270deg,rgba(27,28,26,0.9)_0%,rgba(27,28,26,0.68)_48%,rgba(27,28,26,0.22)_100%)]" />
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.08] mix-blend-soft-light"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            }}
          />

          <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1440px] flex-col px-6 py-7 sm:px-10 sm:py-10 lg:px-16 lg:py-12">
            <header className="animate-fade">
              <Image
                src={t.logo}
                alt={t.logoAlt}
                width={249}
                height={64}
                className="h-auto w-[178px] brightness-0 invert sm:w-[218px]"
              />
            </header>

            <section className="my-auto max-w-[720px] py-14 text-bone animate-rise">
              <p className="mb-5 font-sans text-[12px] font-bold uppercase tracking-[0.16em] text-cyan sm:text-[13px]">
                {t.eyebrow}
              </p>
              <h1 className="max-w-[680px] font-display text-[clamp(64px,9vw,126px)] font-bold leading-[0.78] text-bone">
                {t.title}
              </h1>
              <p className="mt-8 max-w-[580px] font-sans text-[17px] leading-8 text-bone/85 sm:text-[20px] sm:leading-9">
                {t.body}
              </p>
              <a
                href={`mailto:${COMPANY.email}`}
                aria-label={t.emailLabel}
                className="group mt-9 inline-flex min-h-12 items-center gap-4 border-b border-bone/60 pb-2 font-sans text-[15px] font-bold tracking-[0.08em] text-bone transition-colors duration-300 hover:border-cyan hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
              >
                {t.contact}
                <span
                  aria-hidden
                  className="inline-block text-xl transition-transform duration-300 ltr:group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                >
                  →
                </span>
              </a>
            </section>

            <footer className="flex items-end justify-between gap-6 border-t border-bone/25 pt-5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-bone/70 sm:text-[12px]">
              <span>{t.progress}</span>
              <a
                href={`mailto:${COMPANY.email}`}
                className="normal-case tracking-normal transition-colors hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
              >
                {COMPANY.email}
              </a>
            </footer>
          </div>
        </main>
      </body>
    </html>
  );
}
