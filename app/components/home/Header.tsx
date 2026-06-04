import Image from "next/image";
import Link from "next/link";
import type { Lang } from "@/app/content/home";
import type { Chrome } from "@/app/content/site";
import { cn } from "@/lib/cn";
import { buttonVariants } from "@/components/ui/button";

export function Header({
  lang,
  menuOpen,
  setMenuOpen,
  chrome,
}: {
  lang: Lang;
  menuOpen: boolean;
  setMenuOpen: (b: boolean) => void;
  chrome: Chrome;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-bone/85 backdrop-blur-md border-b border-bone-line">
      <nav className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-5 sm:px-8 md:px-12 lg:px-20 py-3 md:py-4">
        <Link
          href="/"
          aria-label={lang === "he" ? "בארי אריזות" : "Beeri Packaging"}
          className="block shrink-0 focus-ring rounded-sm transition-opacity hover:opacity-80"
        >
          <Image
            src={lang === "he" ? chrome.logoHe : chrome.logoEn}
            alt={lang === "he" ? "בארי אריזות" : "Beeri Packaging"}
            width={249}
            height={64}
            preload
            className="h-11 sm:h-12 md:h-14 w-auto"
          />
        </Link>

        <ul className="hidden lg:flex items-center gap-10 xl:gap-12">
          {chrome.navLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="link-underline font-sans font-bold text-clay text-[14px] tracking-[0.08em] hover:text-ink transition-colors duration-300 focus-ring"
              >
                {lang === "he" ? l.he : l.en}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/#cta"
            className={cn(buttonVariants({ variant: "solid", size: "sm" }), "hidden md:inline-flex lg:px-8")}
          >
            {chrome.contact}
          </Link>

          <button
            type="button"
            aria-label={menuOpen ? chrome.close : chrome.menu}
            aria-expanded={menuOpen}
            aria-controls="mobile-drawer"
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden relative inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-md border border-rule bg-bone/60 backdrop-blur text-ink hover:bg-ink hover:text-bone transition-colors duration-300 focus-ring"
          >
            <span className="sr-only">{menuOpen ? chrome.close : chrome.menu}</span>
            <span
              aria-hidden
              className={`absolute h-px w-5 bg-current transition-transform duration-300 ${
                menuOpen ? "rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              aria-hidden
              className={`absolute h-px w-5 bg-current transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              aria-hidden
              className={`absolute h-px w-5 bg-current transition-transform duration-300 ${
                menuOpen ? "-rotate-45" : "translate-y-1.5"
              }`}
            />
          </button>
        </div>
      </nav>
    </header>
  );
}
