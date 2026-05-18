import type { Lang } from "@/app/content/home";

export function LangPill({
  lang,
  setLang,
  compact = false,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  compact?: boolean;
}) {
  const inactive = "text-clay/70 hover:text-ink transition-colors duration-200";
  const active = "text-ink";
  return (
    <div
      role="group"
      aria-label="Language"
      className={`relative inline-flex items-center gap-1 rounded-full border border-rule bg-bone/60 backdrop-blur shrink-0 ${
        compact ? "px-1 py-1 text-[11px]" : "px-1.5 py-1 text-[12px]"
      }`}
    >
      <button
        type="button"
        onClick={() => setLang("he")}
        aria-pressed={lang === "he"}
        className={`relative z-10 px-3 py-1 font-sans font-bold tracking-[0.08em] uppercase rounded-full transition-colors duration-300 ${
          lang === "he" ? active : inactive
        }`}
      >
        HE
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`relative z-10 px-3 py-1 font-sans font-bold tracking-[0.08em] uppercase rounded-full transition-colors duration-300 ${
          lang === "en" ? active : inactive
        }`}
      >
        EN
      </button>
      {/* Active-state pill — pinned by logical inset-inline-start so it
          tracks the active button in both LTR and RTL automatically. */}
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
