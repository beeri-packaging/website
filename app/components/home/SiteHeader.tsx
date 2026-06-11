import Image from "next/image";
import Link from "next/link";
import type { Lang } from "@/app/content/home";
import type { Chrome } from "@/app/content/site";
import { buttonVariants } from "@/components/ui/button";
import { ContactLink } from "./ContactLink";
import { cn } from "@/lib/cn";

function localizedHref(lang: Lang, href: string) {
  return `/${lang}${href === "/" ? "" : href}`;
}

function HeaderLangPill({ lang, compact = false }: { lang: Lang; compact?: boolean }) {
  const inactive = "text-clay/80 hover:text-ink transition-colors duration-200";
  const active = "text-ink";

  return (
    <div
      role="group"
      aria-label="Language"
      className={`relative inline-flex items-center gap-1 rounded-full border border-rule bg-bone/60 backdrop-blur shrink-0 ${
        compact ? "px-1 py-1 text-[11px]" : "px-1.5 py-1 text-[12px]"
      }`}
    >
      <Link
        href="/he"
        prefetch={false}
        aria-current={lang === "he" ? "true" : undefined}
        className={`relative z-10 px-3 py-1 font-sans font-bold tracking-[0.08em] uppercase rounded-full transition-colors duration-300 ${
          lang === "he" ? active : inactive
        }`}
      >
        HE
      </Link>
      <Link
        href="/en"
        prefetch={false}
        aria-current={lang === "en" ? "true" : undefined}
        className={`relative z-10 px-3 py-1 font-sans font-bold tracking-[0.08em] uppercase rounded-full transition-colors duration-300 ${
          lang === "en" ? active : inactive
        }`}
      >
        EN
      </Link>
      <span
        aria-hidden
        className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-yellow transition-all duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
        style={{
          insetInlineStart: lang === "he" ? "4px" : "50%",
        }}
      />
    </div>
  );
}

export function SiteHeader({ lang, chrome }: { lang: Lang; chrome: Chrome }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-bone/85 backdrop-blur-md border-b border-bone-line">
      <nav className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-5 sm:px-8 md:px-12 lg:px-20 py-3 md:py-4">
        <Link
          href={`/${lang}`}
          prefetch={false}
          aria-label={lang === "he" ? "בארי אריזות" : "Beeri Packaging"}
          className="block shrink-0 focus-ring rounded-sm transition-opacity hover:opacity-80"
        >
          <Image
            src={lang === "he" ? chrome.logoHe : chrome.logoEn}
            alt={lang === "he" ? "בארי אריזות" : "Beeri Packaging"}
            width={249}
            height={64}
            className="h-11 sm:h-12 md:h-14 w-auto"
          />
        </Link>

        <ul className="hidden lg:flex items-center gap-10 xl:gap-12">
          {chrome.navLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={localizedHref(lang, l.href)}
                prefetch={false}
                className="link-underline font-sans font-bold text-clay text-[14px] tracking-[0.08em] hover:text-ink transition-colors duration-300 focus-ring"
              >
                {lang === "he" ? l.he : l.en}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <ContactLink
            className={cn(buttonVariants({ variant: "cyan", size: "sm" }), "hidden md:inline-flex lg:px-8")}
          >
            {chrome.contact}
          </ContactLink>

          <details className="relative lg:hidden group">
            <summary
              aria-label={chrome.menu}
              aria-controls="mobile-drawer"
              className="relative inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-md border border-rule bg-bone/60 backdrop-blur text-ink hover:bg-ink hover:text-bone transition-colors duration-300 focus-ring list-none cursor-pointer [&::-webkit-details-marker]:hidden"
            >
              <span className="sr-only">{chrome.menu}</span>
              <span
                aria-hidden
                className="absolute h-px w-5 bg-current transition-transform duration-300 -translate-y-1.5 group-open:translate-y-0 group-open:rotate-45"
              />
              <span
                aria-hidden
                className="absolute h-px w-5 bg-current transition-opacity duration-300 group-open:opacity-0"
              />
              <span
                aria-hidden
                className="absolute h-px w-5 bg-current transition-transform duration-300 translate-y-1.5 group-open:translate-y-0 group-open:-rotate-45"
              />
            </summary>

            <div
              id="mobile-drawer"
              className="fixed inset-x-0 top-[64px] sm:top-[72px] z-40 bg-bone border-y border-bone-line shadow-[0_30px_60px_-25px_rgba(0,0,0,0.35)] animate-drawer-in"
            >
              <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-8 py-8 sm:py-10 flex flex-col gap-8">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-sans uppercase text-clay text-[11px] tracking-[0.08em] leading-4">
                    {chrome.lang}
                  </span>
                  <HeaderLangPill lang={lang} />
                </div>

                <ul className="flex flex-col gap-1 border-t border-rule pt-6">
                  {chrome.navLinks.map((l, i) => (
                    <li key={l.href}>
                      <Link
                        href={localizedHref(lang, l.href)}
                        prefetch={false}
                        className="group/link flex items-center justify-between gap-4 py-4 border-b border-rule/60 transition-colors hover:bg-sand/60 focus-ring"
                      >
                        <span className="font-sans font-bold uppercase text-clay text-[11px] tracking-[0.08em] tabular-nums">
                          0{i + 1}
                        </span>
                        <span className="flex-1 font-display text-ink text-[44px] sm:text-[52px] leading-[0.95] text-start">
                          {lang === "he" ? l.he : l.en}
                        </span>
                        <span
                          aria-hidden
                          className="inline-flex h-9 w-9 items-center justify-center text-ink transition-transform duration-300 group-hover/link:-translate-x-1 rtl:group-hover/link:-translate-x-1 ltr:group-hover/link:translate-x-1"
                        >
                          <svg
                            width="22"
                            height="14"
                            viewBox="0 0 22 14"
                            fill="none"
                            className="ltr:-scale-x-100"
                          >
                            <path
                              d="M21 7H1M7 1L1 7l6 6"
                              stroke="currentColor"
                              strokeWidth="1.25"
                              strokeLinecap="square"
                            />
                          </svg>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col gap-4">
                  <ContactLink className="inline-flex items-center justify-center bg-ink text-bone rounded-none px-8 py-4 text-[14px] font-sans font-bold tracking-[0.08em] hover:bg-clay transition-colors duration-300">
                    {chrome.contact}
                  </ContactLink>
                  <div className="flex items-center justify-between text-clay/80 text-[12px] uppercase tracking-[0.08em]">
                    <span>
                      {chrome.footerAddr[0]} · {chrome.footerAddr[1]}
                    </span>
                    <span>{chrome.footerCopy.split("©")[1]?.split(".")[0] ?? ""}</span>
                  </div>
                </div>
              </div>
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}
