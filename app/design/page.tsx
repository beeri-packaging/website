import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand System · בארי אריזות",
  description: "Temporary preview of the Beeri Packaging brand system.",
};

const BRAND_COLORS = [
  { he: "ציאן", en: "Cyan", hex: "#00FFFF", bg: "bg-brand-cyan", fg: "text-neutral-800" },
  { he: "צהוב סייבר", en: "Cyber Yellow", hex: "#FFD400", bg: "bg-brand-yellow", fg: "text-neutral-800" },
  { he: "מג'נטה", en: "Lustful Wishes", hex: "#C846A3", bg: "bg-brand-magenta", fg: "text-white" },
  { he: "סגול מלכותי", en: "Royal Lavender", hex: "#6F50A6", bg: "bg-brand-purple", fg: "text-white" },
  { he: "כחול אחרי-עבודה", en: "After Work Blue", hex: "#24296A", bg: "bg-brand-blue", fg: "text-white" },
];

const NEUTRALS = [
  { he: "שחור עשיר", en: "Rich Black", hex: "#000000", bg: "bg-black", fg: "text-white" },
  { he: "נֵרוֹ", en: "Nero", hex: "#252525", bg: "bg-neutral-nero", fg: "text-white" },
  { he: "אפור 50", en: "Fiftieth Shade", hex: "#505050", bg: "bg-neutral-grey-50", fg: "text-white" },
  { he: "לבן", en: "White", hex: "#FFFFFF", bg: "bg-white", fg: "text-neutral-800" },
];

const HEBREW_ALEF = "א ב ג ד ה ו ז ח ט י כ ל מ נ ס ע פ צ ק ר ש ת";
const LATIN = "Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz";
const DIGITS = "0 1 2 3 4 5 6 7 8 9";

const KRAFT_BG =
  "radial-gradient(at 10% 20%, #d9c39a 0%, transparent 45%), radial-gradient(at 80% 75%, #b89a6a 0%, transparent 55%), linear-gradient(135deg, #c8aa7a 0%, #b89770 100%)";

export default function DesignSystemPage() {
  return (
    <div className="bg-white text-neutral-800 selection:bg-brand-yellow selection:text-neutral-800">
      {/* Top metadata bar */}
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-8 py-5">
          <img src="/images/logo-he.svg" alt="בארי אריזות" className="h-9 w-auto" />
          <div
            className="hidden items-center gap-6 text-[11px] uppercase tracking-[0.18em] text-neutral-500 md:flex"
            style={{ fontFamily: "var(--font-roboto)" }}
          >
            <span>Brand System</span>
            <span aria-hidden>·</span>
            <span>v0.1 — Preview</span>
            <span aria-hidden>·</span>
            <span>RTL · Hebrew · 2026</span>
          </div>
        </div>
      </header>

      {/* Hero — oversized type meets the icon */}
      <section className="relative overflow-hidden border-b border-neutral-200">
        <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-8 px-8 pb-32 pt-24 md:pt-32">
          <div className="col-span-12 md:col-span-7">
            <p
              className="mb-10 text-[11px] uppercase tracking-[0.32em] text-brand-magenta"
              style={{ fontFamily: "var(--font-roboto)" }}
            >
              01 — The Brand at a Glance
            </p>
            <h1 className="text-balance text-[clamp(56px,11vw,180px)] font-extrabold leading-[0.85] tracking-[-0.03em] text-brand-blue">
              חושבים
              <br />
              <span className="text-brand-magenta">מחוץ</span>
              <br />
              לקופסא.
            </h1>
            <p className="mt-12 max-w-xl text-lg leading-relaxed text-neutral-600">
              מערכת המיתוג של בארי אריזות — לוגו, פלטה, טיפוגרפיה ושפה ויזואלית.
              דף תצוגה זמני, לא לפרודקשן.
            </p>
          </div>

          <div className="col-span-12 flex items-end justify-end md:col-span-5">
            <div className="relative aspect-square w-full max-w-md">
              <div
                aria-hidden
                className="absolute inset-0 rounded-full bg-brand-cyan/40 blur-3xl"
              />
              <img
                src="/images/logo-en.svg"
                alt="Beeri Packaging"
                className="relative h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Brand color palette — vertical columns echoing the Figma slide */}
      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-[1400px] px-8 pt-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p
                className="text-[11px] uppercase tracking-[0.32em] text-neutral-500"
                style={{ fontFamily: "var(--font-roboto)" }}
              >
                02 — Logo Color Palette
              </p>
              <h2 className="mt-3 text-4xl font-bold text-neutral-800 md:text-5xl">
                חמישה צבעים. שפה אחת.
              </h2>
            </div>
            <span
              className="hidden text-sm text-neutral-500 md:inline"
              style={{ fontFamily: "var(--font-roboto)" }}
            >
              5 / Primary
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5">
          {BRAND_COLORS.map((c) => (
            <div
              key={c.hex}
              className={`${c.bg} ${c.fg} relative flex aspect-[3/5] flex-col justify-between overflow-hidden p-6 transition-[flex-grow] md:aspect-auto md:h-[480px]`}
            >
              <span
                className="text-[11px] uppercase tracking-[0.24em] opacity-80"
                style={{ fontFamily: "var(--font-roboto)" }}
              >
                {c.en}
              </span>

              {/* Vertical rotated wordmark in the center, like the Figma slides */}
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                aria-hidden
              >
                <span
                  className="select-none whitespace-nowrap text-5xl font-extrabold tracking-tight md:text-6xl"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                  {c.he}
                </span>
              </div>

              <span
                className="z-10 self-end text-sm tabular-nums opacity-90"
                style={{ fontFamily: "var(--font-roboto)" }}
              >
                {c.hex}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Neutrals row */}
      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-[1400px] px-8 pt-20">
          <div className="mb-10">
            <p
              className="text-[11px] uppercase tracking-[0.32em] text-neutral-500"
              style={{ fontFamily: "var(--font-roboto)" }}
            >
              03 — Graphics Colors
            </p>
            <h2 className="mt-3 text-4xl font-bold text-neutral-800 md:text-5xl">
              נייטרלים שבונים נוכחות.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4">
          {NEUTRALS.map((c) => (
            <div
              key={c.hex}
              className={`${c.bg} ${c.fg} relative flex aspect-[4/3] flex-col justify-between p-6 ${
                c.hex === "#FFFFFF" ? "border-r border-neutral-200" : ""
              }`}
            >
              <span
                className="text-[11px] uppercase tracking-[0.24em] opacity-80"
                style={{ fontFamily: "var(--font-roboto)" }}
              >
                {c.en}
              </span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold tracking-tight md:text-4xl">
                  {c.he}
                </span>
                <span
                  className="text-sm tabular-nums opacity-90"
                  style={{ fontFamily: "var(--font-roboto)" }}
                >
                  {c.hex}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography specimen */}
      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-[1400px] px-8 py-24">
          <div className="mb-16">
            <p
              className="text-[11px] uppercase tracking-[0.32em] text-neutral-500"
              style={{ fontFamily: "var(--font-roboto)" }}
            >
              04 — Typography
            </p>
            <h2 className="mt-3 text-4xl font-bold text-neutral-800 md:text-5xl">
              שתי משפחות. תפקידים ברורים.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Hebrew — Assistant */}
            <article className="flex flex-col gap-6 border-t-2 border-brand-blue pt-6">
              <div className="flex items-baseline justify-between">
                <h3 className="text-3xl font-bold text-brand-blue">אסיסטנט</h3>
                <span
                  className="text-xs uppercase tracking-[0.2em] text-neutral-500"
                  style={{ fontFamily: "var(--font-roboto)" }}
                >
                  Hebrew · Display + UI
                </span>
              </div>
              <p className="text-[88px] font-extrabold leading-none tracking-tight text-neutral-800">
                Aa אא 1
              </p>
              <p className="text-2xl leading-relaxed text-neutral-800" dir="rtl">
                {HEBREW_ALEF}
              </p>
              <p className="text-base leading-relaxed text-neutral-600" dir="rtl">
                בארי אריזות — חושבים מחוץ לקופסא. אריזות קרטון ממותגות בהתאמה
                אישית לתעשיות מובילות.
              </p>
            </article>

            {/* Latin — Roboto */}
            <article
              className="flex flex-col gap-6 border-t-2 border-brand-magenta pt-6"
              style={{ fontFamily: "var(--font-roboto)" }}
              dir="ltr"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-3xl font-bold text-brand-magenta">Roboto</h3>
                <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                  Latin · System
                </span>
              </div>
              <p className="text-[88px] font-bold leading-none tracking-tight text-neutral-800">
                Aa Bb 1
              </p>
              <p className="break-words text-xl leading-relaxed text-neutral-800">
                {LATIN}
              </p>
              <p className="text-lg leading-relaxed tabular-nums text-neutral-600">
                {DIGITS} &nbsp; · ! ? &amp; @ # %
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Logo lockups across surfaces */}
      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-[1400px] px-8 pt-20">
          <div className="mb-10">
            <p
              className="text-[11px] uppercase tracking-[0.32em] text-neutral-500"
              style={{ fontFamily: "var(--font-roboto)" }}
            >
              05 — Logo Lockups
            </p>
            <h2 className="mt-3 text-4xl font-bold text-neutral-800 md:text-5xl">
              לוגו על שלושה משטחים.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Light */}
          <div className="flex aspect-[4/5] items-center justify-center border-t border-neutral-200 bg-white p-12 md:border-t-0">
            <img
              src="/images/logo-he.svg"
              alt="בארי אריזות — light surface"
              className="max-h-32 w-auto"
            />
          </div>

          {/* Dark — colored shapes stay legible, wordmark inverts via filter */}
          <div className="flex aspect-[4/5] items-center justify-center bg-neutral-nero p-12">
            <img
              src="/images/logo-he.svg"
              alt="בארי אריזות — dark surface"
              className="max-h-32 w-auto"
              style={{ filter: "invert(0.92) hue-rotate(180deg) saturate(1.1)" }}
            />
          </div>

          {/* Kraft */}
          <div
            className="flex aspect-[4/5] items-center justify-center p-12"
            style={{ background: KRAFT_BG }}
          >
            <img
              src="/images/logo-en.svg"
              alt="Beeri Packaging — kraft surface"
              className="max-h-44 w-auto"
            />
          </div>
        </div>
      </section>

      {/* Footer tagline */}
      <footer className="bg-brand-blue text-white">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 px-8 py-16 md:flex-row md:items-end">
          <div>
            <p
              className="text-[11px] uppercase tracking-[0.32em] text-brand-cyan"
              style={{ fontFamily: "var(--font-roboto)" }}
            >
              Tagline
            </p>
            <p className="mt-4 text-5xl font-bold leading-tight md:text-7xl">
              חושבים מחוץ לקופסא.
            </p>
            <p
              className="mt-2 text-lg text-white/70"
              style={{ fontFamily: "var(--font-roboto)" }}
              dir="ltr"
            >
              Think outside the box.
            </p>
          </div>
          <div
            className="text-xs uppercase tracking-[0.2em] text-white/60"
            style={{ fontFamily: "var(--font-roboto)" }}
          >
            /design · preview only
          </div>
        </div>
      </footer>
    </div>
  );
}
