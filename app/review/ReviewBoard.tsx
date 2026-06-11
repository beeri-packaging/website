"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReviewImage, ReviewPage, ReviewSection } from "./reviewContent";

/**
 * Client-side review board.
 *
 * Renders the read-only content model and layers interactive approval on top:
 * a status + free-text note per section, and a keep/replace decision, preferred
 * image choice and note per image. All feedback lives in localStorage so the
 * client never loses work, and can be exported to a single text report to send
 * back. No backend — this is a self-contained, shareable approval surface.
 */

const STORAGE_KEY = "beeri-content-review-v1";

type SectionStatus = "approved" | "changes" | "discuss";
type ImageDecision = "keep" | "replace";

type SectionFeedback = { status?: SectionStatus; note?: string };
type ImageFeedback = { decision?: ImageDecision; chosen?: string; note?: string };

type FeedbackState = {
  sections: Record<string, SectionFeedback>;
  images: Record<string, ImageFeedback>;
};

const EMPTY: FeedbackState = { sections: {}, images: {} };

const SECTION_STATUS_LABEL: Record<SectionStatus, string> = {
  approved: "מאושר",
  changes: "צריך תיקון",
  discuss: "לדיון",
};

const IMAGE_DECISION_LABEL: Record<ImageDecision, string> = {
  keep: "להשאיר",
  replace: "להחליף",
};

// ── persistence ─────────────────────────────────────────────────────────

function loadState(): FeedbackState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<FeedbackState>;
    return {
      sections: parsed.sections ?? {},
      images: parsed.images ?? {},
    };
  } catch {
    return EMPTY;
  }
}

// ── small helpers ──────────────────────────────────────────────────────

function fileName(src: string): string {
  return src.split("/").pop() ?? src;
}

function buildReport(pages: readonly ReviewPage[], state: FeedbackState): string {
  const lines: string[] = [];
  lines.push("משוב על תוכן האתר — בארי אריזות");
  lines.push(`נוצר: ${new Date().toLocaleDateString("he-IL")}`);
  lines.push("=".repeat(48));

  for (const page of pages) {
    const pageLines: string[] = [];
    for (const section of page.sections) {
      const sf = state.sections[section.id];
      const sectionLines: string[] = [];
      if (sf?.status) {
        sectionLines.push(`   סטטוס: ${SECTION_STATUS_LABEL[sf.status]}`);
      }
      if (sf?.note?.trim()) {
        sectionLines.push(`   הערה: ${sf.note.trim()}`);
      }
      for (const img of section.images ?? []) {
        const inf = state.images[img.id];
        if (!inf) continue;
        const parts: string[] = [];
        if (inf.decision) parts.push(IMAGE_DECISION_LABEL[inf.decision]);
        if (inf.chosen && inf.chosen !== img.src) {
          parts.push(`תמונה נבחרת: ${fileName(inf.chosen)}`);
        }
        if (inf.note?.trim()) parts.push(`הערה: ${inf.note.trim()}`);
        if (parts.length) {
          sectionLines.push(`   תמונה — ${img.label}: ${parts.join(" · ")}`);
        }
      }
      if (sectionLines.length) {
        pageLines.push(`  ▸ ${section.title}`);
        pageLines.push(...sectionLines);
      }
    }
    if (pageLines.length) {
      lines.push("");
      lines.push(`## ${page.title}  (${page.path})`);
      lines.push(...pageLines);
    }
  }

  if (lines.length <= 3) {
    lines.push("");
    lines.push("(לא נרשמו הערות עדיין.)");
  }
  return lines.join("\n");
}

// ── component ──────────────────────────────────────────────────────────

export function ReviewBoard({ pages }: { pages: readonly ReviewPage[] }) {
  const [state, setState] = useState<FeedbackState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState(false);

  // Hydrate from localStorage after mount. This must run post-mount (not via a
  // lazy initializer) so the server and first client render both start from
  // EMPTY and hydration matches; only then do we swap in the saved feedback.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-time localStorage hydration
    setState(loadState());
    setHydrated(true);
  }, []);

  // Persist on every change once hydrated.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full / blocked — feedback simply isn't persisted */
    }
  }, [state, hydrated]);

  const setSection = (id: string, patch: SectionFeedback) =>
    setState((s) => ({
      ...s,
      sections: { ...s.sections, [id]: { ...s.sections[id], ...patch } },
    }));

  const setImage = (id: string, patch: ImageFeedback) =>
    setState((s) => ({
      ...s,
      images: { ...s.images, [id]: { ...s.images[id], ...patch } },
    }));

  // Progress: how many sections carry any feedback.
  const { reviewed, total } = useMemo(() => {
    let r = 0;
    let t = 0;
    for (const page of pages) {
      for (const section of page.sections) {
        t += 1;
        const sf = state.sections[section.id];
        const hasSection = !!sf?.status || !!sf?.note?.trim();
        const hasImage = (section.images ?? []).some((img) => {
          const inf = state.images[img.id];
          return (
            !!inf &&
            (!!inf.decision ||
              !!inf.note?.trim() ||
              (!!inf.chosen && inf.chosen !== img.src))
          );
        });
        if (hasSection || hasImage) r += 1;
      }
    }
    return { reviewed: r, total: t };
  }, [pages, state]);

  const download = () => {
    const report = buildReport(pages, state);
    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `beeri-content-review-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(buildReport(pages, state));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  // Group pages for the side navigation.
  const groups = useMemo(() => {
    const map = new Map<string, ReviewPage[]>();
    for (const page of pages) {
      const key = page.group ?? "עמודים";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(page);
    }
    return [...map.entries()];
  }, [pages]);

  return (
    <div className="min-h-screen">
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-rule bg-bone/95 backdrop-blur">
        <div className="ds-container flex flex-wrap items-center justify-between gap-3 py-4">
          <div>
            <p className="ds-eyebrow text-magenta-deep">בארי אריזות · אישור תוכן</p>
            <h1 className="font-display text-h4 leading-none">
              סקירת תוכן האתר
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-sans text-[13px] text-clay">
              {reviewed} / {total} סקשנים נסקרו
            </span>
            <button onClick={copy} className="ds-btn ds-btn--outline !px-5 !py-2.5 !text-[13px]">
              {copied ? "הועתק ✓" : "העתקת משוב"}
            </button>
            <button onClick={download} className="ds-btn ds-btn--solid !px-5 !py-2.5 !text-[13px]">
              הורדת משוב
            </button>
          </div>
        </div>
      </header>

      <div className="ds-container grid gap-8 py-8 lg:grid-cols-[220px_1fr]">
        {/* ── Side nav ──────────────────────────────────────────── */}
        <nav className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-4 rounded-[5px] border border-rule bg-sand p-4">
            <p className="font-sans text-[13px] leading-relaxed text-clay">
              עברו עמוד-עמוד. בכל סקשן סמנו סטטוס והוסיפו הערה חופשית, ובחרו את
              התמונה המועדפת. הכול נשמר אוטומטית בדפדפן — בסיום לחצו
              «הורדת משוב» ושלחו את הקובץ.
            </p>
          </div>
          {groups.map(([group, groupPages]) => (
            <div key={group} className="mb-4">
              <p className="ds-eyebrow mb-2 text-clay-soft">{group}</p>
              <ul className="space-y-1">
                {groupPages.map((page) => (
                  <li key={page.id}>
                    <a
                      href={`#${page.id}`}
                      className="link-underline font-sans text-[14px] text-ink"
                    >
                      {page.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* ── Pages ─────────────────────────────────────────────── */}
        <main className="min-w-0 space-y-16">
          {pages.map((page) => (
            <section key={page.id} id={page.id} className="scroll-mt-24">
              <div className="mb-6 border-b-2 border-ink pb-3">
                <p className="ds-eyebrow text-magenta-deep">{page.group}</p>
                <h2 className="font-display text-h2 leading-none">{page.title}</h2>
                <p className="mt-1 font-sans text-[13px] text-clay-soft" dir="ltr">
                  {page.path}
                </p>
                {page.intro && (
                  <p className="mt-2 font-sans text-[15px] text-clay">{page.intro}</p>
                )}
              </div>

              <div className="space-y-6">
                {page.sections.map((section) => (
                  <SectionCard
                    key={section.id}
                    section={section}
                    feedback={state.sections[section.id]}
                    images={state.images}
                    onSection={(patch) => setSection(section.id, patch)}
                    onImage={setImage}
                  />
                ))}
              </div>
            </section>
          ))}

          <footer className="border-t border-rule pt-6 text-center">
            <button onClick={download} className="ds-btn ds-btn--solid">
              הורדת קובץ המשוב
            </button>
            <p className="mt-3 font-sans text-[13px] text-clay-soft">
              הקובץ מסכם את כל הסטטוסים, ההערות ובחירות התמונות — שלחו אותו אלינו.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

// ── Section card ───────────────────────────────────────────────────────

function SectionCard({
  section,
  feedback,
  images,
  onSection,
  onImage,
}: {
  section: ReviewSection;
  feedback: SectionFeedback | undefined;
  images: Record<string, ImageFeedback>;
  onSection: (patch: SectionFeedback) => void;
  onImage: (id: string, patch: ImageFeedback) => void;
}) {
  return (
    <article className="ds-card rounded-[6px] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-h4 leading-tight">{section.title}</h3>
          {section.summary && (
            <p className="mt-1 font-sans text-[14px] text-clay-soft">
              {section.summary}
            </p>
          )}
        </div>
        <StatusToggle
          value={feedback?.status}
          onChange={(status) =>
            onSection({ status: feedback?.status === status ? undefined : status })
          }
        />
      </div>

      <ul className="mt-4 space-y-2">
        {section.bullets.map((b, i) => (
          <li key={i} className="flex gap-2 font-sans text-[15px] leading-relaxed text-ink">
            <span aria-hidden className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-magenta-deep" />
            <span className="min-w-0">{b}</span>
          </li>
        ))}
      </ul>

      {section.images && section.images.length > 0 && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {section.images.map((img) => (
            <ImageCard
              key={img.id}
              image={img}
              feedback={images[img.id]}
              onChange={(patch) => onImage(img.id, patch)}
            />
          ))}
        </div>
      )}

      <div className="mt-4">
        <label className="ds-eyebrow mb-1 block text-clay-soft">
          הערה חופשית לסקשן
        </label>
        <textarea
          className="ds-input min-h-[64px] resize-y"
          placeholder="מה לשנות, להוסיף או לנסח אחרת?"
          value={feedback?.note ?? ""}
          onChange={(e) => onSection({ note: e.target.value })}
        />
      </div>
    </article>
  );
}

// ── Status toggle (section) ────────────────────────────────────────────

function StatusToggle({
  value,
  onChange,
}: {
  value: SectionStatus | undefined;
  onChange: (s: SectionStatus) => void;
}) {
  const opts: { key: SectionStatus; cls: string }[] = [
    { key: "approved", cls: "data-[on=true]:bg-cyan data-[on=true]:text-cyan-deep" },
    { key: "changes", cls: "data-[on=true]:bg-magenta data-[on=true]:text-white" },
    { key: "discuss", cls: "data-[on=true]:bg-yellow data-[on=true]:text-yellow-deep" },
  ];
  return (
    <div className="flex shrink-0 gap-1.5">
      {opts.map((o) => (
        <button
          key={o.key}
          data-on={value === o.key}
          onClick={() => onChange(o.key)}
          className={`ds-tag rounded-full border border-rule !text-[11px] transition ${o.cls} ${
            value === o.key ? "border-transparent" : "bg-bone text-clay hover:border-ink"
          }`}
        >
          {SECTION_STATUS_LABEL[o.key]}
        </button>
      ))}
    </div>
  );
}

// ── Image card ─────────────────────────────────────────────────────────

function ImageCard({
  image,
  feedback,
  onChange,
}: {
  image: ReviewImage;
  feedback: ImageFeedback | undefined;
  onChange: (patch: ImageFeedback) => void;
}) {
  const chosen = feedback?.chosen ?? image.src;
  const hasAlts = !!image.alternatives && image.alternatives.length > 1;

  return (
    <div className="rounded-[5px] border border-rule bg-bone p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-sans text-[13px] font-semibold text-ink">{image.label}</p>
        <div className="flex gap-1">
          {(["keep", "replace"] as ImageDecision[]).map((d) => (
            <button
              key={d}
              onClick={() =>
                onChange({ decision: feedback?.decision === d ? undefined : d })
              }
              className={`ds-tag rounded-full !text-[11px] transition ${
                feedback?.decision === d
                  ? d === "keep"
                    ? "bg-ink text-bone"
                    : "bg-magenta text-white"
                  : "border border-rule bg-bone text-clay hover:border-ink"
              }`}
            >
              {IMAGE_DECISION_LABEL[d]}
            </button>
          ))}
        </div>
      </div>

      {/* Current / chosen preview */}
      <div className="mt-2 overflow-hidden rounded-[4px] bg-sand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={chosen}
          alt={image.label}
          loading="lazy"
          decoding="async"
          className="mx-auto max-h-44 w-auto object-contain"
        />
      </div>

      {hasAlts && (
        <div className="mt-2">
          <p className="ds-eyebrow mb-1 text-clay-soft">בחירת תמונה מועדפת</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {image.alternatives!.map((alt, i) => {
              const isChosen = chosen === alt;
              const isCurrent = alt === image.src;
              return (
                <button
                  key={alt}
                  onClick={() => onChange({ chosen: alt })}
                  title={isCurrent ? "התמונה הנוכחית" : `אפשרות ${i + 1}`}
                  className={`relative shrink-0 overflow-hidden rounded-[4px] border-2 transition ${
                    isChosen ? "border-ink" : "border-transparent hover:border-rule"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={alt}
                    alt={`${image.label} — אפשרות ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="size-16 bg-sand object-contain"
                  />
                  {isCurrent && (
                    <span className="absolute inset-x-0 bottom-0 bg-ink/80 py-0.5 text-center text-[9px] text-bone">
                      נוכחית
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <textarea
        className="ds-input mt-2 min-h-[44px] resize-y !py-2 !text-[14px]"
        placeholder="הערה לתמונה (לא חובה)"
        value={feedback?.note ?? ""}
        onChange={(e) => onChange({ note: e.target.value })}
      />
    </div>
  );
}
