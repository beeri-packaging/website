"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sendReviewFeedback } from "@/app/actions/reviewFeedback";
import type { ReviewImage, ReviewPage, ReviewSection } from "./reviewContent";

/**
 * Client-side review board.
 *
 * Renders the read-only content model and layers interactive approval on top:
 * a status + free-text note per section, and a keep/replace decision, preferred
 * image choice and note per image. All feedback lives in localStorage so the
 * client never loses work, and can be exported to a single text report to send
 * back. No backend — this is a self-contained, shareable approval surface.
 *
 * Presentation follows the brand's print language: pages are numbered like
 * proof sheets, overall progress is a thin ink bar under the header, and a
 * section's chosen status colors its start edge so a scan of the page shows
 * the state at a glance.
 *
 * Each page can be previewed live in a modal — a same-origin iframe of the real
 * route — so the client sees exactly what they're approving without leaving the
 * board. The preview is always the live page, never a stale screenshot.
 */

const STORAGE_KEY = "beeri-content-review-v1";

type SectionStatus = "approved" | "changes";
type ImageDecision = "keep" | "replace";

type SectionFeedback = { status?: SectionStatus; note?: string };
type ImageFeedback = { decision?: ImageDecision; chosen?: string; note?: string };

type FeedbackState = {
  /** Who is giving the feedback — shown on the sent report. */
  name?: string;
  sections: Record<string, SectionFeedback>;
  images: Record<string, ImageFeedback>;
};

/** A page the client can preview live in the modal. */
type PreviewTarget = {
  path: string;
  title: string;
  group?: string;
  /** Literal text snippets (longest first) used to scroll-to + highlight the
   *  matching section inside the live iframe. Empty → show the page top. */
  find?: readonly string[];
  /** Label of the section being focused, for the modal's chrome. */
  focusLabel?: string;
};

type SendStatus = "idle" | "sending" | "sent" | "error";

const EMPTY: FeedbackState = { sections: {}, images: {} };

const SECTION_STATUS_LABEL: Record<SectionStatus, string> = {
  approved: "מאושר",
  changes: "צריך תיקון",
};

const IMAGE_DECISION_LABEL: Record<ImageDecision, string> = {
  keep: "להשאיר",
  replace: "להחליף",
};

/** Status → start-edge accent on the section card. */
const SECTION_STATUS_EDGE: Record<SectionStatus, string> = {
  approved: "border-s-[#3f7d54]",
  changes: "border-s-[#c25733]",
};

// ── persistence ─────────────────────────────────────────────────────────

function loadState(): FeedbackState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<FeedbackState>;
    return {
      name: parsed.name,
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

/**
 * Build the list of literal text snippets used to locate a section inside the
 * live page. The bullets quote real on-page copy (e.g. 'כותרת: "…"'), so we pull
 * every quoted run — straight or curly quotes — and try the longest (most
 * specific) first. An explicit `previewText` always takes priority.
 */
function previewQueries(section: ReviewSection): string[] {
  const found: string[] = [];
  const sources = [section.summary, ...section.bullets].filter(
    (s): s is string => !!s,
  );
  const quote = /[“"„]([^“”"„]{3,})[”"]|'([^']{3,})'/g;
  for (const src of sources) {
    let m: RegExpExecArray | null;
    while ((m = quote.exec(src)) !== null) {
      const text = (m[1] ?? m[2] ?? "").trim();
      if (text.length >= 3 && !found.includes(text)) found.push(text);
    }
  }
  found.sort((a, b) => b.length - a.length);
  return section.previewText ? [section.previewText, ...found] : found;
}

function sectionHasFeedback(
  section: ReviewSection,
  state: FeedbackState,
): boolean {
  const sf = state.sections[section.id];
  if (sf?.status || sf?.note?.trim()) return true;
  return (section.images ?? []).some((img) => {
    const inf = state.images[img.id];
    return (
      !!inf &&
      (!!inf.decision || !!inf.note?.trim() || (!!inf.chosen && inf.chosen !== img.src))
    );
  });
}

function buildReport(pages: readonly ReviewPage[], state: FeedbackState): string {
  const lines: string[] = [];
  lines.push("משוב על תוכן האתר — בארי אריזות");
  if (state.name?.trim()) lines.push(`מאת: ${state.name.trim()}`);
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
  const [activePage, setActivePage] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewTarget | null>(null);
  const [sendStatus, setSendStatus] = useState<SendStatus>("idle");

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

  // Scrollspy: highlight the page currently in view in both navigations.
  useEffect(() => {
    const targets = pages
      .map((p) => document.getElementById(p.id))
      .filter((el): el is HTMLElement => !!el);
    if (!targets.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActivePage(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pages]);

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

  const setName = (name: string) => setState((s) => ({ ...s, name }));

  // Progress per page + overall, and the status breakdown for the footer.
  const progress = useMemo(() => {
    const perPage = new Map<string, { reviewed: number; total: number }>();
    let reviewed = 0;
    let total = 0;
    const byStatus: Record<SectionStatus, number> = {
      approved: 0,
      changes: 0,
    };
    for (const page of pages) {
      let r = 0;
      for (const section of page.sections) {
        if (sectionHasFeedback(section, state)) r += 1;
        const status = state.sections[section.id]?.status;
        if (status) byStatus[status] += 1;
      }
      perPage.set(page.id, { reviewed: r, total: page.sections.length });
      reviewed += r;
      total += page.sections.length;
    }
    return { perPage, reviewed, total, byStatus };
  }, [pages, state]);

  const send = useCallback(async () => {
    setSendStatus("sending");
    const report = buildReport(pages, state);
    const who = state.name?.trim() ? `${state.name.trim()} · ` : "";
    const summary = `${who}${progress.reviewed}/${progress.total} נסקרו · ${progress.byStatus.approved} מאושר · ${progress.byStatus.changes} צריך תיקון`;
    try {
      const res = await sendReviewFeedback({ report, summary });
      setSendStatus(res.ok ? "sent" : "error");
    } catch {
      setSendStatus("error");
    }
  }, [pages, state, progress]);

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

  const pct = progress.total ? Math.round((progress.reviewed / progress.total) * 100) : 0;
  const allDone = progress.total > 0 && progress.reviewed >= progress.total;

  return (
    <div className="min-h-screen">
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-rule bg-bone/95 backdrop-blur">
        <div className="ds-container flex items-center justify-between gap-3 py-3">
          <div className="min-w-0">
            <p className="ds-eyebrow text-magenta-deep">בארי אריזות · אישור תוכן</p>
            <h1 className="truncate font-display text-h4 leading-none">
              סקירת תוכן האתר
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden text-end sm:block">
              <p className="font-sans text-[13px] font-semibold tabular-nums text-ink leading-none">
                {pct}%
              </p>
              <p className="mt-1 font-sans text-[11px] tabular-nums text-clay-soft leading-none">
                {progress.reviewed}/{progress.total} נסקרו
              </p>
            </div>
            <SendButton status={sendStatus} onSend={send} />
          </div>
        </div>

        {/* Overall progress — a thin ink bar, like a press sheet filling up. */}
        <div className="h-[3px] w-full bg-rule/60" aria-hidden>
          <div
            className="h-full bg-ink transition-[width] duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Mobile wayfinder: page chips, sticky with the header. */}
        <nav className="border-t border-rule/60 lg:hidden" aria-label="עמודים לסקירה">
          <div className="flex gap-1.5 overflow-x-auto px-4 py-2">
            {pages.map((page, i) => {
              const p = progress.perPage.get(page.id);
              const done = !!p && p.total > 0 && p.reviewed >= p.total;
              const active = activePage === page.id;
              return (
                <a
                  key={page.id}
                  href={`#${page.id}`}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 font-sans text-[12px] transition-colors ${
                    active
                      ? "border-ink bg-ink text-bone"
                      : "border-rule bg-bone text-clay"
                  }`}
                >
                  <span className="tabular-nums opacity-60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {page.title}
                  {done && <span aria-label="הושלם">✓</span>}
                </a>
              );
            })}
          </div>
        </nav>
      </header>

      <div className="ds-container grid gap-8 py-8 lg:grid-cols-[240px_1fr] lg:gap-12">
        {/* ── Side rail (desktop) ───────────────────────────────── */}
        <nav className="hidden lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">
          <HowItWorks />
          {groups.map(([group, groupPages]) => (
            <div key={group} className="mb-5">
              <p className="ds-eyebrow mb-2 text-clay-soft">{group}</p>
              <ul>
                {groupPages.map((page) => {
                  const p = progress.perPage.get(page.id);
                  const done = !!p && p.total > 0 && p.reviewed >= p.total;
                  const started = !!p && p.reviewed > 0;
                  const active = activePage === page.id;
                  return (
                    <li key={page.id}>
                      <a
                        href={`#${page.id}`}
                        aria-current={active ? "true" : undefined}
                        className={`-ms-px flex items-center justify-between gap-2 border-s-2 py-1.5 pe-1 ps-3 font-sans text-[14px] transition-colors ${
                          active
                            ? "border-magenta text-ink"
                            : "border-transparent text-clay hover:border-rule hover:text-ink"
                        }`}
                      >
                        <span className={`min-w-0 truncate ${active ? "font-semibold" : ""}`}>
                          {page.title}
                        </span>
                        <span
                          className={`shrink-0 font-sans text-[11px] tabular-nums ${
                            done ? "text-cyan-deep" : started ? "text-clay" : "text-clay-soft/70"
                          }`}
                        >
                          {done ? "✓" : `${p?.reviewed ?? 0}/${p?.total ?? 0}`}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* ── Pages ─────────────────────────────────────────────── */}
        <main className="min-w-0">
          {/* Name — captured once, at the top, persisted with the feedback. */}
          <NameField value={state.name} onChange={setName} />

          {/* Mobile how-it-works — once, not sticky. */}
          <div className="mb-8 lg:hidden">
            <HowItWorks />
          </div>

          <div className="space-y-16">
          {pages.map((page, i) => {
            const p = progress.perPage.get(page.id);
            const openPreview = (find?: readonly string[], focusLabel?: string) =>
              setPreview({
                path: page.path,
                title: page.title,
                group: page.group,
                find,
                focusLabel,
              });
            return (
              <section key={page.id} id={page.id} className="scroll-mt-36 lg:scroll-mt-28">
                <div className="mb-6 border-b-2 border-ink pb-3">
                  <div className="flex items-end justify-between gap-4">
                    <div className="min-w-0">
                      <p className="ds-eyebrow text-magenta-deep">{page.group}</p>
                      <h2 className="font-display text-h2 leading-none">
                        <span className="me-2 text-clay-soft/60">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {page.title}
                      </h2>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2 pb-1">
                      <button
                        onClick={() => openPreview()}
                        className="ds-btn ds-btn--outline !gap-2 !px-4 !py-2 !text-[12px]"
                      >
                        <EyeIcon />
                        צפייה בעמוד
                      </button>
                      <p className="font-sans text-[12px] tabular-nums text-clay-soft">
                        {p?.reviewed ?? 0}/{p?.total ?? 0} סקשנים נסקרו
                      </p>
                    </div>
                  </div>
                  {page.intro && (
                    <p className="mt-3 font-sans text-[15px] text-clay">{page.intro}</p>
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
                      onPreview={openPreview}
                    />
                  ))}
                </div>
              </section>
            );
          })}

          <Footer
            byStatus={progress.byStatus}
            allDone={allDone}
            sendStatus={sendStatus}
            onSend={send}
          />
          </div>
        </main>
      </div>

      {preview && (
        <PreviewModal target={preview} onClose={() => setPreview(null)} />
      )}
    </div>
  );
}

// ── How it works (the 1-2-3 the client reads first) ────────────────────

function NameField({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (name: string) => void;
}) {
  return (
    <div className="mb-8 rounded-[6px] border border-rule bg-sand p-4 sm:p-5">
      <label htmlFor="reviewer-name" className="ds-eyebrow mb-2 block text-magenta-deep">
        השם שלך
      </label>
      <input
        id="reviewer-name"
        type="text"
        autoComplete="name"
        className="ds-input"
        placeholder="איך קוראים לך? יופיע במשוב שיישלח אלינו"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function HowItWorks() {
  return (
    <p className="mb-6 font-sans text-[13px] leading-relaxed text-clay-soft">
      סמני סטטוס והערה לכל סקשן, ובסיום לחצי «שליחת המשוב». הכול נשמר אוטומטית.
    </p>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────

function Footer({
  byStatus,
  allDone,
  sendStatus,
  onSend,
}: {
  byStatus: Record<SectionStatus, number>;
  allDone: boolean;
  sendStatus: SendStatus;
  onSend: () => void;
}) {
  return (
    <footer className="border-t-2 border-ink pt-8 text-center">
      {allDone && (
        <p className="ds-eyebrow mb-2 text-cyan-deep">סקרת את כל הסקשנים ✓</p>
      )}
      <h2 className="font-display text-h3 leading-none">
        {allDone ? "סיימת — אפשר לשלוח" : "סיום ושליחה"}
      </h2>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
        <StatusChip numClass="text-[#347a4d]" dot="bg-[#3f7d54]" label="מאושר" n={byStatus.approved} />
        <StatusChip numClass="text-[#b1502c]" dot="bg-[#c25733]" label="צריך תיקון" n={byStatus.changes} />
      </div>

      <div className="mt-6 flex justify-center">
        <SendButton status={sendStatus} onSend={onSend} size="lg" />
      </div>
      <p className="mt-3 font-sans text-[13px] text-clay-soft">
        אפשר לשלוח בכל שלב — גם אם לא כל הסקשנים סומנו.
      </p>
    </footer>
  );
}

// ── Send button (shared by header + footer) ────────────────────────────

function SendButton({
  status,
  onSend,
  size = "sm",
}: {
  status: SendStatus;
  onSend: () => void;
  size?: "sm" | "lg";
}) {
  const sizeCls =
    size === "lg" ? "" : "!px-5 !py-2.5 !text-[13px]";
  const label: Record<SendStatus, string> = {
    idle: "שליחת המשוב",
    sending: "שולח…",
    sent: "נשלח ✓",
    error: "שגיאה — שליחה חוזרת",
  };
  const tone =
    status === "sent"
      ? "border-cyan-deep bg-cyan text-cyan-deep"
      : "ds-btn--solid";
  return (
    <button
      onClick={onSend}
      disabled={status === "sending"}
      aria-live="polite"
      className={`ds-btn !gap-2 ${tone} ${sizeCls} disabled:opacity-70`}
    >
      {status === "sending" ? <SpinnerIcon /> : status === "sent" ? null : <SendIcon />}
      {label[status]}
    </button>
  );
}

function StatusChip({
  numClass,
  dot,
  label,
  n,
}: {
  numClass: string;
  dot: string;
  label: string;
  n: number;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-rule bg-bone px-3.5 py-1.5 font-sans text-[13px] text-clay">
      <span aria-hidden className={`size-2 rounded-full ${dot}`} />
      <span className={`font-semibold tabular-nums ${numClass}`}>{n}</span>
      {label}
    </span>
  );
}

// ── Section card ───────────────────────────────────────────────────────

function SectionCard({
  section,
  feedback,
  images,
  onSection,
  onImage,
  onPreview,
}: {
  section: ReviewSection;
  feedback: SectionFeedback | undefined;
  images: Record<string, ImageFeedback>;
  onSection: (patch: SectionFeedback) => void;
  onImage: (id: string, patch: ImageFeedback) => void;
  onPreview: (find?: readonly string[], focusLabel?: string) => void;
}) {
  const edge = feedback?.status
    ? SECTION_STATUS_EDGE[feedback.status]
    : "border-s-transparent";
  return (
    <article
      className={`group/card ds-card rounded-[8px] border-s-[3px] p-5 transition-colors sm:p-6 ${edge}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-h4 leading-tight">{section.title}</h3>
          {section.summary && (
            <p className="mt-1.5 font-sans text-[14px] leading-relaxed text-clay-soft">
              {section.summary}
            </p>
          )}
        </div>
        <button
          onClick={() => onPreview(previewQueries(section), section.title)}
          aria-label={`צפייה ומיקוד בסקשן — ${section.title}`}
          title="צפייה בסקשן באתר"
          className="inline-grid size-7 shrink-0 place-items-center rounded-full border border-rule bg-bone text-clay-soft opacity-0 transition hover:border-ink hover:text-ink focus-visible:opacity-100 group-hover/card:opacity-100 max-sm:opacity-100"
        >
          <EyeIcon />
        </button>
      </div>

      {/* Bullets as a quiet spec list — a hairline tick instead of bright dots,
          softened body text, so a long page of cards stays calm. */}
      <ul className="mt-4 space-y-2.5">
        {section.bullets.map((b, i) => (
          <li key={i} className="flex gap-3 font-sans text-[14.5px] leading-relaxed text-clay">
            <span aria-hidden className="mt-[11px] h-px w-2.5 shrink-0 bg-clay-soft/60" />
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

      <DecisionBar
        value={feedback?.status}
        onChange={(status) =>
          onSection({ status: feedback?.status === status ? undefined : status })
        }
      />

      <NoteField
        value={feedback?.note}
        onChange={(note) => onSection({ note })}
        forceOpen={feedback?.status === "changes"}
      />
    </article>
  );
}

// ── Collapsible note (kept out of sight until needed, to stay uncluttered) ──

function NoteField({
  value,
  onChange,
  forceOpen = false,
}: {
  value: string | undefined;
  onChange: (note: string) => void;
  /** When true (status = "צריך תיקון"), the comment opens automatically. */
  forceOpen?: boolean;
}) {
  const [open, setOpen] = useState(false);
  // Auto-expand once a saved note arrives (after hydration) or when the
  // section is marked "needs correction" — the client should explain what.
  const expanded = open || forceOpen || !!value?.trim();

  if (!expanded) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex items-center gap-1.5 font-sans text-[13px] font-semibold text-clay-soft transition hover:text-ink"
      >
        <span aria-hidden className="text-[16px] leading-none">＋</span>
        הוספת הערה
      </button>
    );
  }
  return (
    <div className="mt-4">
      <label className="ds-eyebrow mb-1 block text-clay-soft">הערה</label>
      <textarea
        autoFocus={open}
        className="ds-input min-h-[64px] resize-y"
        placeholder="מה לשנות, להוסיף או לנסח אחרת?"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// ── Decision bar (section status) ──────────────────────────────────────
// Moved out of the cramped card header into its own row at the foot of the
// card — bigger, icon-led targets, read-content-then-decide flow.

function DecisionBar({
  value,
  onChange,
}: {
  value: SectionStatus | undefined;
  onChange: (s: SectionStatus) => void;
}) {
  // Subtle, non-brand status colours: approved = green, changes = orange-red.
  // Soft tinted fill when active; a faint icon tint even when inactive.
  const opts: {
    key: SectionStatus;
    Icon: () => React.ReactElement;
    on: string;
    tint: string;
  }[] = [
    {
      key: "approved",
      Icon: CheckIcon,
      on: "border-[#3f7d54] bg-[#e7f2ea] text-[#347a4d]",
      tint: "text-[#3f7d54]",
    },
    {
      key: "changes",
      Icon: EditIcon,
      on: "border-[#c25733] bg-[#fbe8df] text-[#b1502c]",
      tint: "text-[#c25733]",
    },
  ];
  return (
    <div className="mt-5 border-t border-rule/40 pt-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <span className="ds-eyebrow shrink-0 text-clay-soft/80">ההחלטה שלי</span>
        <div
          className="grid grid-cols-2 gap-2 sm:flex sm:flex-1"
          role="group"
          aria-label="סטטוס הסקשן"
        >
          {opts.map((o) => {
            const active = value === o.key;
            return (
              <button
                key={o.key}
                aria-pressed={active}
                onClick={() => onChange(o.key)}
                className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 font-sans text-[13px] font-medium transition sm:flex-1 ${
                  active
                    ? `${o.on} font-semibold`
                    : "border-rule bg-bone text-clay hover:border-ink hover:text-ink"
                }`}
              >
                <span className={active ? "" : o.tint}>
                  <o.Icon />
                </span>
                {SECTION_STATUS_LABEL[o.key]}
              </button>
            );
          })}
        </div>
      </div>
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
  // Alternatives are progressively disclosed: they only appear once the client
  // decides to replace the image, so the default view stays calm and uncluttered.
  const showAlts = hasAlts && feedback?.decision === "replace";

  return (
    <div className="rounded-[5px] border border-rule bg-bone p-3">
      <p className="font-sans text-[13px] font-semibold text-ink">{image.label}</p>

      {/* Current / chosen preview — optimised, never the raw full-res source. */}
      <div className="relative mt-2 h-40 overflow-hidden rounded-[4px] bg-sand">
        <Image
          src={chosen}
          alt={image.label}
          fill
          sizes="(max-width: 640px) 90vw, 340px"
          className="object-contain"
        />
      </div>

      {/* Decision — bigger, icon-led, sitting under the image it refers to. */}
      <div className="mt-2.5 grid grid-cols-2 gap-2">
        {(["keep", "replace"] as ImageDecision[]).map((d) => {
          const active = feedback?.decision === d;
          const Icon = d === "keep" ? CheckIcon : SwapIcon;
          // Subtle, non-brand semantics: keep = green (good), replace =
          // orange-red (change). Soft tinted fill when active; a faint icon
          // tint even when inactive so the colour reads at a glance.
          const activeCls =
            d === "keep"
              ? "border-[#3f7d54] bg-[#e7f2ea] text-[#347a4d]"
              : "border-[#c25733] bg-[#fbe8df] text-[#b1502c]";
          const iconTint = d === "keep" ? "text-[#3f7d54]" : "text-[#c25733]";
          return (
            <button
              key={d}
              aria-pressed={active}
              onClick={() =>
                onChange({ decision: active ? undefined : d })
              }
              className={`inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2 font-sans text-[13px] font-semibold transition ${
                active
                  ? activeCls
                  : "border-rule bg-bone text-clay hover:border-ink hover:text-ink"
              }`}
            >
              <span className={active ? "" : iconTint}>
                <Icon />
              </span>
              {IMAGE_DECISION_LABEL[d]}
            </button>
          );
        })}
      </div>

      {showAlts && (
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
                  aria-pressed={isChosen}
                  title={isCurrent ? "התמונה הנוכחית" : `אפשרות ${i + 1}`}
                  className={`relative size-20 shrink-0 overflow-hidden rounded-[4px] border-2 bg-sand transition ${
                    isChosen ? "border-ink" : "border-transparent hover:border-rule"
                  }`}
                >
                  <Image
                    src={alt}
                    alt={`${image.label} — אפשרות ${i + 1}`}
                    fill
                    sizes="80px"
                    className="object-contain"
                  />
                  {isChosen && (
                    <span
                      aria-hidden
                      className="absolute end-1 top-1 grid size-4 place-items-center rounded-full bg-ink text-[10px] leading-none text-bone"
                    >
                      ✓
                    </span>
                  )}
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
    </div>
  );
}

// ── Live preview modal ─────────────────────────────────────────────────

/** Find the smallest element in `doc` whose text contains `needle`. */
function findElementWithText(
  doc: Document,
  needle: string,
): HTMLElement | null {
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      const tag = parent.tagName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") {
        return NodeFilter.FILTER_REJECT;
      }
      return node.nodeValue && node.nodeValue.includes(needle)
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP;
    },
  });
  const hit = walker.nextNode();
  return (hit?.parentElement as HTMLElement | null) ?? null;
}

type FocusState = "idle" | "searching" | "hit" | "miss";

function PreviewModal({
  target,
  onClose,
}: {
  target: PreviewTarget;
  onClose: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [focusState, setFocusState] = useState<FocusState>(
    target.find && target.find.length > 0 ? "searching" : "idle",
  );
  const closeRef = useRef<HTMLButtonElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const highlightedRef = useRef(false);

  // Close on Escape, lock body scroll, and move focus to the close button.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // Scroll the same-origin iframe to the section, optionally highlighting it.
  // Scrolling is safe at any time; the inline-style highlight is deferred until
  // after the iframe's own React has hydrated, so we don't trip a hydration
  // mismatch by mutating the DOM mid-hydration.
  const focusSection = useCallback(
    (withHighlight: boolean) => {
      const queries = target.find;
      if (!queries || queries.length === 0) return;
      try {
        const doc = iframeRef.current?.contentDocument;
        if (!doc?.body) return;
        let el: HTMLElement | null = null;
        for (const q of queries) {
          el = findElementWithText(doc, q);
          if (el) break;
        }
        if (!el) {
          if (!highlightedRef.current) setFocusState("miss");
          return;
        }
        const node = el;
        node.scrollIntoView({ behavior: "smooth", block: "center" });
        setFocusState("hit");
        if (withHighlight && !highlightedRef.current) {
          highlightedRef.current = true;
          node.style.transition = "box-shadow .35s ease";
          node.style.borderRadius = node.style.borderRadius || "4px";
          node.style.boxShadow =
            "0 0 0 3px #c846a3, 0 0 0 10px rgba(200,70,163,.22)";
          window.setTimeout(() => {
            node.style.boxShadow = "";
          }, 2800);
        }
      } catch {
        /* cross-origin or DOM not ready — leave the page at its top */
      }
    },
    [target.find],
  );

  const onIframeLoad = useCallback(() => {
    setLoaded(true);
    focusSection(false); // scroll only — safe during hydration
    window.setTimeout(() => focusSection(true), 900); // highlight post-hydration
  }, [focusSection]);

  const stop = useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`תצוגה מקדימה — ${target.title}`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink/70 p-3 backdrop-blur-sm animate-drawer-bg sm:p-6"
    >
      <div
        onClick={stop}
        className="flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-[8px] border border-rule bg-bone shadow-2xl animate-drawer-in"
      >
        {/* Browser-frame chrome */}
        <div className="flex items-center justify-between gap-3 border-b border-rule bg-sand px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-3">
            <span aria-hidden className="hidden gap-1.5 sm:flex">
              <span className="size-3 rounded-full bg-magenta/70" />
              <span className="size-3 rounded-full bg-yellow/80" />
              <span className="size-3 rounded-full bg-cyan/70" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-sans text-[13px] font-semibold text-ink leading-tight">
                {target.title}
                {target.group && (
                  <span className="ms-2 font-normal text-clay-soft">· {target.group}</span>
                )}
              </p>
              {target.focusLabel && focusState !== "idle" ? (
                <p className="truncate font-sans text-[11px] leading-tight text-magenta-deep">
                  {focusState === "miss"
                    ? "מוצג ראש העמוד · הסקשן לא אותר אוטומטית"
                    : `ממוקד על: ${target.focusLabel}`}
                </p>
              ) : (
                <p dir="ltr" className="truncate text-start font-sans text-[11px] text-clay-soft leading-tight">
                  {target.path}
                </p>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={target.path}
              target="_blank"
              rel="noreferrer"
              className="ds-tag rounded-full border border-rule bg-bone !px-3 !py-1.5 !text-[11px] text-clay transition hover:border-ink hover:text-ink"
            >
              פתיחה בכרטיסייה ↗
            </a>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="סגירה"
              className="inline-grid size-8 place-items-center rounded-full border border-rule bg-bone text-ink transition hover:bg-ink hover:text-bone"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Live page */}
        <div className="relative flex-1 bg-sand">
          {!loaded && (
            <div className="absolute inset-0 grid place-items-center">
              <div className="flex flex-col items-center gap-3">
                <span
                  aria-hidden
                  className="size-7 animate-spin rounded-full border-2 border-rule border-t-ink"
                />
                <p className="font-sans text-[13px] text-clay-soft">טוען תצוגה חיה של העמוד…</p>
              </div>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={target.path}
            title={`תצוגה חיה — ${target.title}`}
            loading="lazy"
            onLoad={onIframeLoad}
            className={`size-full transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
          />
        </div>
      </div>
      <p className="mt-3 hidden font-sans text-[12px] text-bone/70 sm:block">
        זו תצוגה חיה של העמוד באתר · לחצי מחוץ למסגרת או Esc לסגירה
      </p>
    </div>
  );
}

// ── Icons (inline, currentColor) ───────────────────────────────────────

function EyeIcon() {
  return (
    <svg aria-hidden width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg aria-hidden width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 1l4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 23l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg aria-hidden width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7z" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg aria-hidden width="15" height="15" viewBox="0 0 24 24" fill="none" className="animate-spin">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

