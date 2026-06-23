import Link from "next/link";
import type { Lang } from "@/app/content/home";

/**
 * The site's single language switcher: a quiet inline "HE / EN" toggle — the
 * active locale in ink, the other muted, a hairline slash between. Used in the
 * header (desktop + mobile drawer) and the footer. Pure links, so it stays a
 * server component.
 */
export function LangSwitch({ lang }: { lang: Lang }) {
  const active = "text-ink";
  const inactive = "text-clay hover:text-ink transition-colors duration-200";
  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center gap-2 font-sans text-[13px] font-bold uppercase tracking-[0.08em]"
    >
      <Link
        href="/he"
        prefetch={false}
        aria-current={lang === "he" ? "true" : undefined}
        className={lang === "he" ? active : inactive}
      >
        HE
      </Link>
      <span aria-hidden className="text-rule">
        /
      </span>
      <Link
        href="/en"
        prefetch={false}
        aria-current={lang === "en" ? "true" : undefined}
        className={lang === "en" ? active : inactive}
      >
        EN
      </Link>
    </div>
  );
}
