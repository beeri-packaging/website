import Image from "next/image";
import Link from "next/link";
import type { Lang } from "@/app/content/home";
import type { Chrome } from "@/app/content/site";
import { LinkedInGlyph, FacebookGlyph, MailGlyph, PinGlyph, ArrowOut } from "./icons";
import { LangSwitch } from "./LangSwitch";
import { ContactLink } from "./ContactLink";

const eyebrow =
  "font-sans font-semibold uppercase text-teal text-[12px] tracking-[0.14em] leading-4";
const bodyLink =
  "font-sans text-clay text-[16px] leading-[25px] hover:text-ink transition-colors duration-300 focus-ring rounded-sm";

// The open-roles section lives at the end of the journal page and has no
// header-nav entry — the footer is its one signposted path.
const careersLink = { he: "משרות פתוחות", en: "Open roles", href: "/blog#roles" };

export function Footer({ lang, chrome }: { lang: Lang; chrome: Chrome }) {
  const isHe = lang === "he";
  const brandName = isHe ? "בארי אריזות" : "Beeri Packaging";

  return (
    <footer className="relative isolate overflow-hidden bg-bone text-ink border-t border-rule">
      {/* warm top hairline accent — a nod to the brand palette */}
      <div aria-hidden className="absolute inset-x-0 top-0 flex h-[3px]">
        <span className="flex-1 bg-cyan" />
        <span className="flex-1 bg-yellow" />
        <span className="flex-1 bg-magenta" />
        <span className="flex-1 bg-purple" />
      </div>

      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10 md:px-12 lg:px-[64px] pt-20 sm:pt-24 md:pt-28 lg:pt-32">
        {/* ── Top grid ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-12 md:gap-x-10">
          {/* Brand */}
          <div className="flex flex-col gap-6 md:col-span-5">
            <Link
              href={`/${lang}`}
              aria-label={brandName}
              className="block w-fit focus-ring rounded-sm transition-opacity hover:opacity-80"
            >
              <Image
                src={isHe ? chrome.logoHe : chrome.logoEn}
                alt={brandName}
                // HE is a slim wordmark (sized by width); EN is a taller
                // icon+wordmark lockup (1322×826) — give it its real ratio and
                // size by height so it lands at the same visual height, not a
                // 220px-wide block.
                width={isHe ? 249 : 1322}
                height={isHe ? 64 : 826}
                className={
                  isHe
                    ? "h-auto w-[190px] sm:w-[220px]"
                    : "h-12 sm:h-14 w-auto"
                }
              />
            </Link>
            <span className="-mt-3 font-sans font-semibold uppercase text-teal text-[12px] tracking-[0.14em] leading-4">
              {chrome.byline}
            </span>
            <p className="font-sans text-clay text-[16px] leading-[26px] max-w-[360px] text-balance">
              {chrome.footerTagline}
            </p>
            <span className="inline-flex w-fit items-center gap-2 font-sans font-semibold uppercase text-ink text-[12px] tracking-[0.14em] leading-4">
              <span aria-hidden className="h-2 w-2 rounded-full bg-cyan" />
              {chrome.footerHeritage}
            </span>
          </div>

          {/* Navigation */}
          <nav
            aria-label={chrome.footerNavHeading}
            className="flex flex-col gap-4 md:col-span-3"
          >
            <h2 className={eyebrow}>{chrome.footerNavHeading}</h2>
            <ul className="flex flex-col gap-2.5">
              {[...chrome.navLinks, careersLink].map((l) => (
                <li key={l.href}>
                  <Link href={`/${lang}${l.href}`} className={bodyLink}>
                    {l[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div className="flex flex-col gap-4 md:col-span-4">
            <h2 className={eyebrow}>{chrome.footerConnectHeading}</h2>

            <ContactLink className={`group inline-flex w-fit items-center gap-2.5 ${bodyLink}`}>
              <span className="text-ink/70 transition-colors group-hover:text-ink"><MailGlyph /></span>
              {chrome.email}
            </ContactLink>

            {chrome.social.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group inline-flex w-fit items-center gap-2.5 ${bodyLink}`}
              >
                <span className={s.platform === "facebook" ? "text-[#1877f2]" : "text-[#0a66c2]"}>
                  {s.platform === "facebook" ? <FacebookGlyph /> : <LinkedInGlyph />}
                </span>
                {s.label}
                <span aria-hidden className="text-rule transition-colors group-hover:text-ink">
                  <ArrowOut />
                </span>
              </a>
            ))}

            <a
              href={chrome.mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-2 inline-flex w-fit items-start gap-2.5 focus-ring rounded-sm"
            >
              <span className="mt-0.5 text-ink/70 transition-colors group-hover:text-ink"><PinGlyph /></span>
              <span className="flex flex-col gap-1">
                <span className="font-sans text-clay text-[16px] leading-[24px] transition-colors group-hover:text-ink">
                  {chrome.footerAddressFull}
                </span>
                <span className="font-sans text-clay text-[15px] leading-[22px] transition-colors group-hover:text-ink">
                  {chrome.footerWarehouse}
                </span>
              </span>
            </a>
          </div>
        </div>

        <div className="h-16 sm:h-20 md:h-24" />
      </div>

      {/* ── Bottom bar ───────────────────────────────────────────── */}
      <div className="border-t border-bone-line">
        <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10 md:px-12 lg:px-[64px] py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans uppercase text-clay text-[12px] tracking-[0.08em] leading-4">
            {chrome.footerCopy}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {chrome.legal.map((l) => (
                <li key={l.label}>
                  <Link
                    href={`/${lang}${l.href}`}
                    className="font-sans uppercase text-clay text-[12px] tracking-[0.08em] leading-4 underline underline-offset-4 decoration-rule hover:text-ink hover:decoration-ink transition-colors duration-300 focus-ring rounded-sm"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <span aria-hidden className="hidden sm:block h-4 w-px bg-rule" />
            <LangSwitch lang={lang} />
          </div>
        </div>
      </div>
    </footer>
  );
}
