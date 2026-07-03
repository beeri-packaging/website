import Image from "next/image";
import Link from "next/link";
import type { Lang } from "@/app/content/home";
import type { Chrome } from "@/app/content/site";
import { buttonVariants } from "@/components/ui/button";
import { ContactLink } from "./ContactLink";
import { LangSwitch } from "./LangSwitch";
import { ArrowOut } from "./icons";
import { cn } from "@/lib/cn";

function localizedHref(lang: Lang, href: string) {
  return `/${lang}${href === "/" ? "" : href}`;
}

export function SiteHeader({ lang, chrome }: { lang: Lang; chrome: Chrome }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-bone/85 backdrop-blur-md border-b border-bone-line">
      <nav className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-5 sm:px-8 md:px-12 lg:px-20 py-3 md:py-4">
        <Link
          href={`/${lang}`}
          prefetch={false}
          aria-label={lang === "he" ? "בארי אריזות" : "Beeri Packaging"}
          className="flex shrink-0 flex-col items-start gap-0.5 focus-ring rounded-sm transition-opacity hover:opacity-80"
        >
          <Image
            src={lang === "he" ? chrome.logoHe : chrome.logoEn}
            alt={lang === "he" ? "בארי אריזות" : "Beeri Packaging"}
            // The two logos differ: HE is a slim wordmark (249×64), EN is an
            // icon+wordmark lockup (1322×826). Give each its real intrinsic
            // ratio so EN isn't letterboxed in a HE-shaped box; both render at
            // the same height. EN is capped a touch shorter so the squarer
            // lockup doesn't overpower the row.
            width={lang === "he" ? 249 : 1322}
            height={lang === "he" ? 64 : 826}
            className={
              lang === "he"
                ? "h-11 sm:h-12 md:h-14 w-auto"
                : "h-9 sm:h-10 md:h-11 w-auto"
            }
          />
          {lang === "he" ? (
            <span className="-mt-0.5 self-end font-sans text-logo-dark text-[10px] sm:text-[11px] md:text-[12px] tracking-normal leading-none">
              {chrome.byline}
            </span>
          ) : (
            <span className="ps-0.5 font-sans font-semibold uppercase text-teal text-[9px] sm:text-[10px] tracking-[0.14em] leading-3">
              {chrome.byline}
            </span>
          )}
        </Link>

        <ul className="hidden lg:flex items-center gap-10 xl:gap-12">
          {chrome.navLinks.map((l) => {
            const label = lang === "he" ? l.he : l.en;

            // "About" is a group entry: it links to our About page on click, and
            // on hover/focus reveals the sister brands (דפוס בארי, PIX).
            if (l.href === "/about") {
              return (
                <li key={l.href} className="relative group">
                  <Link
                    href={localizedHref(lang, l.href)}
                    prefetch={false}
                    aria-haspopup="true"
                    className="link-underline inline-flex items-center gap-1.5 font-sans font-bold text-clay text-[14px] tracking-[0.08em] hover:text-ink group-hover:text-ink transition-colors duration-300 focus-ring"
                  >
                    {label}
                    <svg
                      aria-hidden
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      className="transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180"
                    >
                      <path
                        d="M1 1l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>

                  {/* Dropdown — the pt-3 wrapper bridges the gap so the pointer
                      can travel from trigger to panel without it closing. */}
                  <div className="invisible absolute start-0 top-full z-50 pt-3 opacity-0 translate-y-1 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0">
                    <ul className="min-w-[210px] border border-rule bg-bone py-2 shadow-[6px_6px_0_rgba(27,28,26,0.10)]">
                      {chrome.brandLinks.map((b) =>
                        b.external ? (
                          <li key={b.href}>
                            <a
                              href={b.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/item flex items-center justify-between gap-3 px-4 py-2.5 font-sans text-[15px] text-clay hover:bg-sand hover:text-ink transition-colors duration-200 focus-ring"
                            >
                              {b.label}
                              <span className="text-rule transition-colors group-hover/item:text-ink">
                                <ArrowOut />
                              </span>
                            </a>
                          </li>
                        ) : (
                          <li key={b.href}>
                            <Link
                              href={localizedHref(lang, b.href)}
                              prefetch={false}
                              className="block px-4 py-2.5 font-sans text-[15px] font-semibold text-ink hover:bg-sand transition-colors duration-200 focus-ring"
                            >
                              {b.label}
                            </Link>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </li>
              );
            }

            return (
              <li key={l.href}>
                <Link
                  href={localizedHref(lang, l.href)}
                  prefetch={false}
                  className="link-underline font-sans font-bold text-clay text-[14px] tracking-[0.08em] hover:text-ink transition-colors duration-300 focus-ring"
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Language switcher — desktop only; mobile gets it inside the drawer. */}
          <div className="hidden lg:block">
            <LangSwitch lang={lang} />
          </div>

          {/* Hairline divider between the language toggle and the CTA. */}
          <span aria-hidden className="hidden lg:block h-5 w-px bg-rule" />

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
                  <LangSwitch lang={lang} />
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

                      {/* Sister brands surface under About (no hover on touch). */}
                      {l.href === "/about" && (
                        <ul className="flex flex-col ps-9 sm:ps-12 pb-1">
                          {chrome.brandLinks
                            .filter((b) => b.external)
                            .map((b) => (
                              <li key={b.href}>
                                <a
                                  href={b.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 py-3 border-b border-rule/40 font-sans font-bold uppercase text-clay text-[13px] tracking-[0.08em] hover:text-ink transition-colors duration-200 focus-ring"
                                >
                                  {b.label}
                                  <span className="text-rule">
                                    <ArrowOut />
                                  </span>
                                </a>
                              </li>
                            ))}
                        </ul>
                      )}
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
