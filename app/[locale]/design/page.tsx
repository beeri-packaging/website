import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "מערכת העיצוב · בארי אריזות",
  description:
    "ערכת המיתוג של בארי אריזות — צבעים, טיפוגרפיה, מרווחים ורכיבי יסוד. מקור אמת אחד לכל הדפים.",
  // Dev-only style guide — never index it, even if it's reachable.
  robots: { index: false, follow: false },
};

/* ──────────────────────────────────────────────────────────────
 * Design tokens, mirrored from app/globals.css so the style guide
 * documents the exact values the rest of the site consumes.
 * ────────────────────────────────────────────────────────────── */

type Swatch = {
  token: string;
  he: string;
  hex: string;
  className: string;
  fg: string;
  note?: string;
};

const ACCENTS: Swatch[] = [
  { token: "cyan", he: "ציאן", hex: "#00FFFF", className: "bg-cyan", fg: "text-cyan-deep", note: "מספרים, תגיות, אייקונים" },
  { token: "yellow", he: "צהוב", hex: "#FFD400", className: "bg-yellow", fg: "text-yellow-deep", note: "תגית גיבור, הדגשות" },
  { token: "magenta", he: "מג׳נטה", hex: "#C846A3", className: "bg-magenta", fg: "text-white", note: "כותרות־על, CTA" },
  { token: "purple", he: "סגול", hex: "#6F50A6", className: "bg-purple", fg: "text-white", note: "מסלול לקוח" },
  { token: "gold", he: "זהב", hex: "#FFE177", className: "bg-gold", fg: "text-gold-deep", note: "רקע אזור CTA" },
];

const SURFACES: Swatch[] = [
  { token: "bone", he: "עצם", hex: "#FBF9F6", className: "bg-bone", fg: "text-ink", note: "משטח הדף" },
  { token: "sand", he: "חול", hex: "#F5F3F0", className: "bg-sand", fg: "text-ink", note: "כרטיסים" },
  { token: "ink", he: "דיו", hex: "#1B1C1A", className: "bg-ink", fg: "text-bone", note: "טקסט וכפתורים" },
  { token: "clay", he: "חמר", hex: "#4D4632", className: "bg-clay", fg: "text-bone", note: "גוף הטקסט" },
  { token: "rule", he: "קו", hex: "#D0C6AB", className: "bg-rule", fg: "text-ink", note: "קווי הפרדה" },
];

type TypeRow = {
  token: string;
  role: string;
  family: "display" | "sans";
  familyLabel: string;
  size: string;
  className: string;
  sample: string;
  sampleLatin?: string;
};

const TYPE_SCALE: TypeRow[] = [
  { token: "text-display", role: "T/Main — גיבור", family: "display", familyLabel: "Karantina 700", size: "128 / 0.72", className: "text-display font-display font-bold", sample: "אריזה", sampleLatin: "Beeri" },
  { token: "text-h1", role: "T/Big — כותרת ראשית", family: "display", familyLabel: "Karantina 700", size: "96 / 1.0", className: "text-h1 font-display font-bold", sample: "מורשת ועכשיו", sampleLatin: "The Journal" },
  { token: "text-h2", role: "T/Secondary — כותרת מקטע", family: "display", familyLabel: "Karantina 400", size: "64 / 1.04", className: "text-h2 font-display", sample: "כשהמבנה פוגש את המותג", sampleLatin: "Structural Poetry" },
  { token: "text-h3", role: "כותרת כרטיס", family: "display", familyLabel: "Karantina 700", size: "50 / 1.05", className: "text-h3 font-display font-bold", sample: "שטנץ מדויק", sampleLatin: "Bio-Laminate" },
  { token: "text-kicker", role: "T/Mini", family: "display", familyLabel: "Karantina 700", size: "24 / 1.1", className: "text-kicker font-display font-bold", sample: "מעבדת פיתוח", sampleLatin: "Open Roles" },
  { token: "text-question", role: "Style/Questions", family: "sans", familyLabel: "Open Sans 800", size: "24 / 1.08", className: "text-question font-sans font-extrabold", sample: "כמה זמן לוקח תהליך?", sampleLatin: "How long does it take?" },
  { token: "text-lead", role: "Body/Medium — פסקת מוביל", family: "sans", familyLabel: "Open Sans 400", size: "20 / 1.5", className: "text-lead font-sans", sample: "בארי אריזות מחברת תכנון מבני, חומרי גלם, דפוס והשבחות.", sampleLatin: "" },
  { token: "text-base", role: "Body/Small — גוף", family: "sans", familyLabel: "Open Sans 400", size: "16 / 1.5", className: "text-base font-sans leading-relaxed", sample: "חיתוך צורני שמייצר את מבנה הקופסה, הפתחים והקיפולים בדיוק הנדרש.", sampleLatin: "" },
];

const SPACING = [
  { n: "1", px: 4 },
  { n: "2", px: 8 },
  { n: "3", px: 12 },
  { n: "4", px: 16 },
  { n: "6", px: 24 },
  { n: "8", px: 32 },
  { n: "12", px: 48 },
  { n: "16", px: 64 },
  { n: "24", px: 96 },
  { n: "32", px: 128 },
];

const PAGES = [
  { href: "/", he: "דף הבית", en: "Home", figma: "252-723", note: "גיבור, מסלול כפול, מצוינות טכנית, FAQ" },
  { href: "/careers", he: "קריירה / The Journal", en: "Careers", figma: "337-239", note: "בנטו עריכה, משרות פתוחות, ניוזלטר" },
  { href: "/blog/finishing-language", he: "כתבת בלוג", en: "Article", figma: "531-530", note: "עריכה ארוכה, ציטוט, מקטעים ממוספרים" },
];

const FAQ_SAMPLE = [
  "כמה זמן לוקח תהליך תכנון אריזה?",
  "האם אפשר להזמין כמויות קטנות?",
  "אילו השבחות דפוס זמינות?",
];

function SectionHead({
  index,
  eyebrow,
  title,
}: {
  index: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-12 flex flex-col gap-3">
      <span className="ds-eyebrow text-magenta">
        {index} — {eyebrow}
      </span>
      <h2 className="text-h2 font-display text-ink">{title}</h2>
    </div>
  );
}

export default function DesignSystemPage() {
  // Dev-only playground — 404 in production so it never ships to the public site.
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="bg-bone text-ink">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-20 border-b border-rule bg-bone/85 backdrop-blur">
        <div className="ds-container flex items-center justify-between py-4">
          <Image
            src="/images/logo-he.svg"
            alt="בארי אריזות"
            width={249}
            height={64}
            className="h-8 w-auto"
            priority
          />
          <span className="ds-eyebrow hidden text-clay-soft sm:inline">
            Design System · v1.0
          </span>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="border-b border-rule">
        <div className="ds-container grid gap-10 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-8">
            <span className="ds-eyebrow text-magenta">00 — מערכת העיצוב</span>
            <h1 className="mt-6 text-display font-display font-bold leading-[0.72] text-ink">
              ערכת מיתוג
              <br />
              <span className="text-magenta">אחת.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lead font-sans text-clay">
              צבעים, טיפוגרפיה, מרווחים ורכיבי יסוד של בארי אריזות — מקור אמת
              יחיד שמזין את דף הבית, הקריירה והבלוג. כל הערכים כאן תואמים אחד־לאחד
              לספריית ה־Figma ולקבצי הטוקנים ב־<code className="font-sans text-[0.9em] text-ink">globals.css</code>.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#color" className="ds-btn ds-btn--solid">צבעים</a>
              <a href="#type" className="ds-btn ds-btn--outline">טיפוגרפיה</a>
              <a href="#components" className="ds-btn ds-btn--outline">רכיבים</a>
            </div>
          </div>
          <div className="md:col-span-4">
            <div className="relative flex aspect-square items-center justify-center overflow-hidden border border-rule bg-sand">
              <div
                aria-hidden
                className="absolute inset-0 opacity-70"
                style={{
                  background:
                    "radial-gradient(120% 120% at 0% 100%, rgba(0,255,255,0.35) 0%, transparent 55%), radial-gradient(120% 120% at 100% 0%, rgba(200,70,163,0.30) 0%, transparent 55%)",
                }}
              />
              <Image
                src="/images/logo-en.svg"
                alt="Beeri Packaging"
                width={249}
                height={64}
                className="relative w-2/3"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Color ── */}
      <section id="color" className="scroll-mt-24 border-b border-rule">
        <div className="ds-container py-20 md:py-24">
          <SectionHead index="01" eyebrow="Color" title="פלטה אחת, חמישה דגשים" />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {ACCENTS.map((c) => (
              <ColorCard key={c.token} {...c} />
            ))}
          </div>

          <h3 className="mt-16 mb-6 text-kicker font-display font-bold text-ink">
            משטחים ונייטרלים
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {SURFACES.map((c) => (
              <ColorCard key={c.token} {...c} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Typography ── */}
      <section id="type" className="scroll-mt-24 border-b border-rule">
        <div className="ds-container py-20 md:py-24">
          <SectionHead
            index="02"
            eyebrow="Typography"
            title="שתי משפחות, תפקידים ברורים"
          />

          <div className="mb-12 grid gap-4 sm:grid-cols-2">
            <FamilyCard
              name="Karantina"
              role="תצוגה — כותרות"
              className="font-display font-bold"
              sample="אריזה Aa"
            />
            <FamilyCard
              name="Open Sans"
              role="גוף — טקסט וממשק"
              className="font-sans"
              sample="טקסט Aa"
            />
          </div>

          <div className="divide-y divide-rule border-y border-rule">
            {TYPE_SCALE.map((row) => (
              <div
                key={row.token}
                className="grid items-baseline gap-4 py-7 md:grid-cols-[200px_1fr]"
              >
                <div className="flex flex-col gap-1">
                  <code className="text-[13px] font-sans text-ink">{row.token}</code>
                  <span className="text-[12px] font-sans text-clay-soft">
                    {row.role}
                  </span>
                  <span className="text-[12px] font-sans text-clay-soft">
                    {row.familyLabel} · {row.size}
                  </span>
                </div>
                <div className="min-w-0">
                  <span className={`block truncate text-ink ${row.className}`}>
                    {row.sample}
                  </span>
                  {row.sampleLatin ? (
                    <span
                      dir="ltr"
                      className={`block truncate text-clay ${row.className}`}
                    >
                      {row.sampleLatin}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Spacing ── */}
      <section id="spacing" className="scroll-mt-24 border-b border-rule">
        <div className="ds-container py-20 md:py-24">
          <SectionHead index="03" eyebrow="Spacing" title="רשת 8 פיקסל" />
          <p className="mb-10 max-w-xl text-lead font-sans text-clay">
            כל המרווחים נשענים על סקאלת ה־spacing של Tailwind (יחידת בסיס 4px),
            כשהקצב המוביל הוא כפולות של 8. אלה הצעדים שחוזרים לאורך הדפים.
          </p>
          <div className="flex flex-col gap-3">
            {SPACING.map((s) => (
              <div key={s.n} className="flex items-center gap-4">
                <code className="w-24 shrink-0 text-[13px] font-sans text-clay-soft">
                  gap-{s.n}
                </code>
                <span
                  className="h-5 bg-magenta"
                  style={{ width: s.px }}
                  aria-hidden
                />
                <span className="text-[13px] font-sans tabular-nums text-clay-soft">
                  {s.px}px
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Components ── */}
      <section id="components" className="scroll-mt-24 border-b border-rule">
        <div className="ds-container py-20 md:py-24">
          <SectionHead index="04" eyebrow="Components" title="רכיבי יסוד" />

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Buttons */}
            <Specimen label="Buttons · .ds-btn">
              <div className="flex flex-wrap items-center gap-3">
                <span className="ds-btn ds-btn--solid">התחלת תהליך</span>
                <span className="ds-btn ds-btn--outline">למה בארי</span>
              </div>
            </Specimen>

            {/* Tags */}
            <Specimen label="Tags · .ds-tag">
              <div className="flex flex-wrap items-center gap-3">
                <span className="ds-tag ds-tag--yellow">350 גרם</span>
                <span className="ds-tag ds-tag--cyan">ניתן למחזור</span>
                <span className="ds-tag ds-tag--magenta">Case study</span>
                <span className="ds-tag ds-tag--purple">פיתוח</span>
                <span className="ds-tag ds-tag--ink">Print spec</span>
              </div>
            </Specimen>

            {/* Eyebrow */}
            <Specimen label="Eyebrow · .ds-eyebrow">
              <div className="flex flex-col gap-2">
                <span className="ds-eyebrow text-magenta">שני מסלולים</span>
                <span className="ds-eyebrow text-cyan-deep">Archives &amp; excerpts</span>
              </div>
            </Specimen>

            {/* Input */}
            <Specimen label="Input · .ds-input">
              <div className="flex items-center gap-3">
                <input className="ds-input" placeholder="כתובת מייל" aria-label="כתובת מייל" />
                <span className="ds-btn ds-btn--solid shrink-0">הרשמה</span>
              </div>
            </Specimen>

            {/* Card */}
            <Specimen label="Card · .ds-card">
              <div className="ds-card flex flex-col gap-3 p-7">
                <span className="ds-tag ds-tag--cyan self-start">New tech</span>
                <h4 className="text-kicker font-display font-bold text-ink">
                  ביו־למינציה
                </h4>
                <p className="text-base font-sans leading-relaxed text-clay">
                  שכבות מבניות ניתנות להרקבה לתחום הקוסמטיקה היוקרתי.
                </p>
              </div>
            </Specimen>

            {/* Divider */}
            <Specimen label="Divider · .ds-rule">
              <div className="flex flex-col gap-4 pt-2">
                <span className="text-base font-sans text-clay">קו הפרדה אופקי</span>
                <hr className="ds-rule" />
                <span className="text-base font-sans text-clay">בין מקטעים</span>
              </div>
            </Specimen>
          </div>

          {/* Patterns — FAQ rows + role rows, the two list patterns the site reuses */}
          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <div>
              <span className="ds-eyebrow text-clay-soft">Pattern · FAQ row</span>
              <ul className="mt-5 border-t border-rule">
                {FAQ_SAMPLE.map((q, i) => (
                  <li
                    key={q}
                    className="flex items-center justify-between gap-6 border-b border-rule py-6"
                  >
                    <span className="text-question font-sans font-extrabold text-ink">
                      {q}
                    </span>
                    <span className="text-kicker font-display font-bold tabular-nums text-cyan-deep">
                      0{i + 1}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="ds-eyebrow text-clay-soft">Pattern · Open role</span>
              <ul className="mt-5 flex flex-col gap-4">
                {[
                  { code: "#BR-402", title: "רכז/ת איכות", scope: "יבנה · משרה מלאה" },
                  { code: "#BR-409", title: "מבקר/ת איכות ייצור", scope: "יבנה · משרה מלאה" },
                ].map((r) => (
                  <li
                    key={r.code}
                    className="flex flex-wrap items-center justify-between gap-4 border border-rule p-5"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <span className="ds-tag ds-tag--yellow">{r.code}</span>
                      </div>
                      <span className="text-kicker font-display font-bold text-ink">
                        {r.title}
                      </span>
                      <span className="text-[13px] font-sans text-clay-soft">
                        {r.scope}
                      </span>
                    </div>
                    <span className="ds-tag ds-tag--magenta">להגשה</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pages ── */}
      <section id="pages" className="scroll-mt-24 border-b border-rule">
        <div className="ds-container py-20 md:py-24">
          <SectionHead
            index="05"
            eyebrow="In production"
            title="שלושה דפים, ערכה אחת"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {PAGES.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="group flex flex-col gap-4 border border-rule bg-sand p-7 transition-colors duration-300 hover:border-ink"
              >
                <span className="ds-eyebrow text-clay-soft">Figma {p.figma}</span>
                <h3 className="text-h3 font-display font-bold leading-[1.0] text-ink">
                  {p.he}
                </h3>
                <p className="text-base font-sans leading-relaxed text-clay">
                  {p.note}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 text-[13px] font-sans font-bold tracking-[0.08em] text-magenta">
                  {p.en}
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:-translate-x-1"
                  >
                    ←
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-ink text-bone">
        <div className="ds-container flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-end">
          <div>
            <span className="ds-eyebrow text-cyan">Tagline</span>
            <p className="mt-4 text-h2 font-display leading-[1.0]">
              אריזה שעובדת בשביל המוצר.
            </p>
          </div>
          <span className="ds-eyebrow text-bone/50">/design · בארי אריזות 2026</span>
        </div>
      </footer>
    </main>
  );
}

function ColorCard({ token, he, hex, className, fg, note }: Swatch) {
  return (
    <div className="flex flex-col overflow-hidden border border-rule">
      <div
        className={`flex aspect-[4/3] flex-col justify-between p-4 ${className} ${fg}`}
      >
        <span className="text-[13px] font-display font-bold">{he}</span>
        <span className="text-[12px] font-sans tabular-nums opacity-80" dir="ltr">
          {hex}
        </span>
      </div>
      <div className="flex flex-col gap-0.5 bg-bone px-4 py-3">
        <code className="text-[13px] font-sans text-ink">{token}</code>
        {note ? (
          <span className="text-[12px] font-sans text-clay-soft">{note}</span>
        ) : null}
      </div>
    </div>
  );
}

function FamilyCard({
  name,
  role,
  className,
  sample,
}: {
  name: string;
  role: string;
  className: string;
  sample: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border border-rule bg-sand p-6">
      <div className="flex flex-col gap-1">
        <span className="text-kicker font-display font-bold text-ink" dir="ltr">
          {name}
        </span>
        <span className="text-[13px] font-sans text-clay-soft">{role}</span>
      </div>
      <span className={`text-[44px] leading-none text-ink ${className}`}>
        {sample}
      </span>
    </div>
  );
}

function Specimen({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border border-rule bg-bone p-7">
      <span className="ds-eyebrow text-clay-soft">{label}</span>
      <div className="flex grow items-center">{children}</div>
    </div>
  );
}
