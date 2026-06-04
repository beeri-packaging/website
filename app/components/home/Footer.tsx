import Image from "next/image";
import Link from "next/link";
import type { Lang } from "@/app/content/home";
import type { Chrome } from "@/app/content/site";

export function Footer({
  lang,
  chrome,
}: {
  lang: Lang;
  chrome: Chrome;
}) {
  const socialLinks = chrome.footerLinks.slice(0, 2);
  const legalLinks = chrome.footerLinks.slice(2);

  return (
    <footer className="bg-bone border-t border-bone-line">
      <div className="mx-auto w-full max-w-[1280px] px-6 sm:px-10 md:px-12 lg:px-[64px] py-20 sm:py-28 md:py-32 lg:py-[120px] xl:py-[160px] flex flex-col md:flex-row gap-12 md:gap-10 md:items-end md:justify-between">
        <div className="flex flex-col gap-6 md:gap-8 order-2">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {socialLinks.map((l) => (
              <li key={l}>
                <Link
                  href="#"
                  className="font-sans text-clay text-[16px] leading-[25px] uppercase underline underline-offset-4 decoration-from-font hover:text-ink transition-colors duration-300 focus-ring"
                  aria-label={l}
                >
                  {l}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {legalLinks.map((l) => (
              <li key={l}>
                <Link
                  href="#"
                  className="font-sans text-clay text-[16px] leading-[25px] uppercase underline underline-offset-4 decoration-from-font hover:text-ink transition-colors duration-300 focus-ring"
                  aria-label={l}
                >
                  {l}
                </Link>
              </li>
            ))}
          </ul>
          <p className="font-sans font-semibold uppercase text-clay text-[12px] tracking-[0.08em] leading-4 max-w-[260px]">
            {chrome.footerCopy}
          </p>
        </div>

        <div className="flex flex-col gap-6 md:gap-8 order-1 md:items-start">
          <Link
            href="/"
            aria-label={lang === "he" ? "בארי אריזות" : "Beeri Packaging"}
            className="block focus-ring rounded-sm transition-opacity hover:opacity-80"
          >
            <Image
              src={lang === "he" ? chrome.logoHe : chrome.logoEn}
              alt={lang === "he" ? "בארי אריזות" : "Beeri Packaging"}
              width={249}
              height={64}
              className="h-auto w-[200px] sm:w-[249px]"
            />
          </Link>
          <div className="flex flex-col gap-2 max-w-[320px]">
            <span className="font-sans font-semibold uppercase text-teal text-[12px] tracking-[0.08em] leading-4">
              {chrome.footerEyebrow}
            </span>
            <p className="font-sans text-clay text-[16px] leading-[25px]">
              {chrome.footerAddr[0]}
              <br />
              {chrome.footerAddr[1]}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
