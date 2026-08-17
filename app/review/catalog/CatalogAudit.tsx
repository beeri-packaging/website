"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { sendReviewFeedback } from "@/app/actions/reviewFeedback";
import type { CatalogCategory, CatalogItem } from "@/app/content/catalog";

/**
 * Catalog audit board.
 *
 * A narrower sibling of [[app/review/ReviewBoard]]: instead of every page on the
 * site, this reviews the catalog item by item — the photo, the name and the
 * description that actually ship. The client marks each item, and when something
 * is wrong says *which* part is wrong, so the note doesn't have to spell it out.
 *
 * The items are the live catalog content (Sanity, falling back to the bundled
 * copy), passed in from the server component — nothing is re-authored here, so
 * this board can never drift from the real page.
 *
 * Feedback lives in localStorage under its own key, so this and the full site
 * review never overwrite each other, and is exported as one plain-text report
 * through the same email path as the main board.
 */

const STORAGE_KEY = "beeri-catalog-audit-v1";

type ItemStatus = "approved" | "changes";
/** Which part of an item the client wants changed. */
type FieldKey = "image" | "name" | "description" | "tags" | "specs";

type ItemFeedback = {
  status?: ItemStatus;
  /** Only meaningful when status = "changes". */
  fields?: readonly FieldKey[];
  note?: string;
};

type AuditState = {
  /** Who is giving the feedback — shown on the sent report. */
  name?: string;
  items: Record<string, ItemFeedback>;
};

type SendStatus = "idle" | "sending" | "sent" | "error";

const EMPTY: AuditState = { items: {} };

const STATUS_LABEL: Record<ItemStatus, string> = {
  approved: "מאושר",
  changes: "צריך תיקון",
};

const FIELD_LABEL: Record<FieldKey, string> = {
  image: "תמונה",
  name: "שם",
  description: "תיאור",
  tags: "תגיות",
  specs: "מפרט",
};

/** Status → start-edge accent on the item card. */
const STATUS_EDGE: Record<ItemStatus, string> = {
  approved: "border-s-[#3f7d54]",
  changes: "border-s-[#c25733]",
};

// ── helpers ────────────────────────────────────────────────────────────

/** Stable id for an item across categories (item keys repeat between them). */
function itemId(category: CatalogCategory, item: CatalogItem): string {
  return `${category.key}/${item.key}`;
}

/**
 * The parts of an item that are worth flagging. Image is always offered — a
 * missing photo is itself a finding — while tags and specs only appear when the
 * item actually has them, so the chips stay honest per card.
 */
function fieldsOf(item: CatalogItem): readonly FieldKey[] {
  const keys: FieldKey[] = ["image", "name", "description"];
  if (item.tags?.length) keys.push("tags");
  if (item.specs?.length) keys.push("specs");
  return keys;
}

function loadState(): AuditState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<AuditState>;
    return { name: parsed.name, items: parsed.items ?? {} };
  } catch {
    return EMPTY;
  }
}

function hasFeedback(fb: ItemFeedback | undefined): boolean {
  return !!fb && (!!fb.status || !!fb.note?.trim() || !!fb.fields?.length);
}

function buildReport(
  categories: readonly CatalogCategory[],
  state: AuditState,
): string {
  const lines: string[] = [];
  lines.push("ביקורת פריטי הקטלוג — בארי אריזות");
  if (state.name?.trim()) lines.push(`מאת: ${state.name.trim()}`);
  lines.push(`נוצר: ${new Date().toLocaleDateString("he-IL")}`);
  lines.push("=".repeat(48));

  for (const category of categories) {
    const catLines: string[] = [];
    for (const item of category.items) {
      const fb = state.items[itemId(category, item)];
      if (!hasFeedback(fb)) continue;
      catLines.push(`  • ${item.name}`);
      if (fb?.status) catLines.push(`      סטטוס: ${STATUS_LABEL[fb.status]}`);
      if (fb?.fields?.length) {
        catLines.push(
          `      לתיקון: ${fb.fields.map((f) => FIELD_LABEL[f]).join(" · ")}`,
        );
      }
      if (fb?.note?.trim()) catLines.push(`      הערה: ${fb.note.trim()}`);
      if (!item.image) catLines.push("      (לפריט זה אין תמונה באתר)");
    }
    if (!catLines.length) continue;
    lines.push("");
    lines.push(`[${category.number}] ${category.name}`);
    lines.push(...catLines);
  }

  if (lines.length === 4) lines.push("", "(לא נרשמו הערות.)");
  return lines.join("\n");
}

// ── board ──────────────────────────────────────────────────────────────

export function CatalogAudit({
  categories,
}: {
  categories: readonly CatalogCategory[];
}) {
  const [state, setState] = useState<AuditState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [sendStatus, setSendStatus] = useState<SendStatus>("idle");

  // Hydrate after mount so the server and first client render agree, then swap
  // in the saved feedback (same approach as the main review board).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-time localStorage hydration
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full / blocked — feedback simply isn't persisted */
    }
  }, [state, hydrated]);

  const setItem = (id: string, patch: ItemFeedback) =>
    setState((s) => ({
      ...s,
      items: { ...s.items, [id]: { ...s.items[id], ...patch } },
    }));

  const setName = (name: string) => setState((s) => ({ ...s, name }));

  const progress = useMemo(() => {
    let reviewed = 0;
    let total = 0;
    const byStatus: Record<ItemStatus, number> = { approved: 0, changes: 0 };
    for (const category of categories) {
      for (const item of category.items) {
        total += 1;
        const fb = state.items[itemId(category, item)];
        if (hasFeedback(fb)) reviewed += 1;
        if (fb?.status) byStatus[fb.status] += 1;
      }
    }
    return { reviewed, total, byStatus };
  }, [categories, state]);

  const send = useCallback(async () => {
    setSendStatus("sending");
    const report = buildReport(categories, state);
    const who = state.name?.trim() ? `${state.name.trim()} · ` : "";
    const summary = `קטלוג · ${who}${progress.reviewed}/${progress.total} נסקרו · ${progress.byStatus.approved} מאושר · ${progress.byStatus.changes} צריך תיקון`;
    try {
      const res = await sendReviewFeedback({ report, summary });
      setSendStatus(res.ok ? "sent" : "error");
    } catch {
      setSendStatus("error");
    }
  }, [categories, state, progress]);

  const pct = progress.total
    ? Math.round((progress.reviewed / progress.total) * 100)
    : 0;
  const allDone = progress.total > 0 && progress.reviewed >= progress.total;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-rule bg-bone/95 backdrop-blur">
        <div className="ds-container flex items-center justify-between gap-3 py-3">
          <div className="min-w-0">
            <p className="ds-eyebrow text-magenta-deep">בארי אריזות · ביקורת קטלוג</p>
            <h1 className="truncate font-display text-h4 leading-none">
              פריטי הקטלוג
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden text-end sm:block">
              <p className="font-sans text-[13px] font-semibold tabular-nums leading-none text-ink">
                {pct}%
              </p>
              <p className="mt-1 font-sans text-[11px] tabular-nums leading-none text-clay-soft">
                {progress.reviewed}/{progress.total} נסקרו
              </p>
            </div>
            <SendButton status={sendStatus} onSend={send} />
          </div>
        </div>

        <div className="h-[3px] w-full bg-rule/60" aria-hidden>
          <div
            className="h-full bg-ink transition-[width] duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Category wayfinder — the list is short, so it fits on every size. */}
        <nav className="border-t border-rule/60" aria-label="קטגוריות">
          <div className="flex gap-1.5 overflow-x-auto px-4 py-2">
            {categories.map((c) => (
              <a
                key={c.key}
                href={`#${c.key}`}
                className="shrink-0 rounded-full border border-rule bg-bone px-3 py-1 font-sans text-[12px] text-clay transition hover:border-ink hover:text-ink"
              >
                {c.number} · {c.name}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <main className="ds-container py-8">
        <NameField value={state.name} onChange={setName} />

        <p className="mb-6 font-sans text-[13px] leading-relaxed text-clay-soft">
          לכל פריט בקטלוג — סמני «מאושר» או «צריך תיקון». כשמסמנים «צריך תיקון»,
          בחרי מה בדיוק לא מדויק (תמונה · שם · תיאור) והוסיפי הערה. הכול נשמר
          אוטומטית, ואפשר לשלוח בכל שלב.{" "}
          <a
            href="/he/catalog"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-ink underline underline-offset-2"
          >
            לצפייה בקטלוג באתר
          </a>
        </p>

        {categories.map((category) => (
          <section key={category.key} id={category.key} className="mb-12 scroll-mt-32">
            <div className="mb-4 flex flex-wrap items-center gap-3 border-b border-rule pb-3">
              <span className="rounded-full bg-yellow px-3 py-1 font-sans text-[12px] font-semibold text-ink">
                {category.number} · {category.name}
              </span>
              <span className="font-sans text-[13px] text-clay-soft">
                {category.count}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {category.items.map((item) => {
                const id = itemId(category, item);
                return (
                  <ItemCard
                    key={id}
                    item={item}
                    feedback={state.items[id]}
                    onChange={(patch) => setItem(id, patch)}
                  />
                );
              })}
            </div>
          </section>
        ))}

        <Footer
          byStatus={progress.byStatus}
          allDone={allDone}
          sendStatus={sendStatus}
          onSend={send}
        />
      </main>
    </div>
  );
}

// ── item card ──────────────────────────────────────────────────────────

function ItemCard({
  item,
  feedback,
  onChange,
}: {
  item: CatalogItem;
  feedback: ItemFeedback | undefined;
  onChange: (patch: ItemFeedback) => void;
}) {
  const edge = feedback?.status
    ? STATUS_EDGE[feedback.status]
    : "border-s-transparent";
  const needsFix = feedback?.status === "changes";
  const selected = feedback?.fields ?? [];

  const toggleField = (key: FieldKey) =>
    onChange({
      fields: selected.includes(key)
        ? selected.filter((k) => k !== key)
        : [...selected, key],
    });

  return (
    <article
      className={`ds-card rounded-[8px] border-s-[3px] p-5 transition-colors ${edge}`}
    >
      <div className="flex gap-4">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-[4px] bg-sand">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <span className="grid size-full place-items-center px-1 text-center font-sans text-[11px] leading-tight text-clay-soft">
              אין תמונה
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {item.series && (
            <p className="ds-eyebrow mb-1 text-clay-soft">{item.series}</p>
          )}
          <h3 className="font-display text-h4 leading-tight">{item.name}</h3>
          <p className="mt-1.5 font-sans text-[14px] leading-relaxed text-clay">
            {item.description}
          </p>

          {!!item.tags?.length && (
            <ul className="mt-2.5 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <li
                  key={tag.label}
                  className="rounded-full border border-rule bg-bone px-2.5 py-0.5 font-sans text-[11px] text-clay-soft"
                >
                  {tag.label}
                </li>
              ))}
            </ul>
          )}

          {!!item.specs?.length && (
            <dl className="mt-2.5 space-y-1">
              {item.specs.map((spec) => (
                <div key={spec.label} className="flex gap-2 font-sans text-[12px]">
                  <dt className="text-clay-soft">{spec.label}:</dt>
                  <dd className="min-w-0 text-clay">{spec.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      <DecisionBar
        value={feedback?.status}
        onChange={(status) =>
          onChange({ status: feedback?.status === status ? undefined : status })
        }
      />

      {needsFix && (
        <div className="mt-4">
          <p className="ds-eyebrow mb-2 text-clay-soft">מה צריך תיקון?</p>
          <div className="flex flex-wrap gap-2">
            {fieldsOf(item).map((key) => {
              const active = selected.includes(key);
              return (
                <button
                  key={key}
                  aria-pressed={active}
                  onClick={() => toggleField(key)}
                  className={`rounded-full border px-3 py-1.5 font-sans text-[12.5px] transition ${
                    active
                      ? "border-[#c25733] bg-[#fbe8df] font-semibold text-[#b1502c]"
                      : "border-rule bg-bone text-clay hover:border-ink hover:text-ink"
                  }`}
                >
                  {FIELD_LABEL[key]}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <NoteField
        value={feedback?.note}
        onChange={(note) => onChange({ note })}
        forceOpen={needsFix}
      />
    </article>
  );
}

// ── shared controls (mirrors the main board's language) ────────────────

function DecisionBar({
  value,
  onChange,
}: {
  value: ItemStatus | undefined;
  onChange: (s: ItemStatus) => void;
}) {
  const opts: {
    key: ItemStatus;
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
          aria-label="סטטוס הפריט"
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
                {STATUS_LABEL[o.key]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NoteField({
  value,
  onChange,
  forceOpen = false,
}: {
  value: string | undefined;
  onChange: (note: string) => void;
  forceOpen?: boolean;
}) {
  const [open, setOpen] = useState(false);
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
        placeholder="מה לשנות בפריט הזה?"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function NameField({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (name: string) => void;
}) {
  return (
    <div className="mb-8 rounded-[6px] border border-rule bg-sand p-4 sm:p-5">
      <label htmlFor="auditor-name" className="ds-eyebrow mb-2 block text-magenta-deep">
        השם שלך
      </label>
      <input
        id="auditor-name"
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

function Footer({
  byStatus,
  allDone,
  sendStatus,
  onSend,
}: {
  byStatus: Record<ItemStatus, number>;
  allDone: boolean;
  sendStatus: SendStatus;
  onSend: () => void;
}) {
  return (
    <footer className="border-t-2 border-ink pt-8 text-center">
      {allDone && (
        <p className="ds-eyebrow mb-2 text-cyan-deep">סקרת את כל הפריטים ✓</p>
      )}
      <h2 className="font-display text-h3 leading-none">
        {allDone ? "סיימת — אפשר לשלוח" : "סיום ושליחה"}
      </h2>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
        <StatusChip
          numClass="text-[#347a4d]"
          dot="bg-[#3f7d54]"
          label="מאושר"
          n={byStatus.approved}
        />
        <StatusChip
          numClass="text-[#b1502c]"
          dot="bg-[#c25733]"
          label="צריך תיקון"
          n={byStatus.changes}
        />
      </div>

      <div className="mt-6 flex justify-center">
        <SendButton status={sendStatus} onSend={onSend} size="lg" />
      </div>
      <p className="mt-3 font-sans text-[13px] text-clay-soft">
        אפשר לשלוח בכל שלב — גם אם לא כל הפריטים סומנו.
      </p>
    </footer>
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

function SendButton({
  status,
  onSend,
  size = "sm",
}: {
  status: SendStatus;
  onSend: () => void;
  size?: "sm" | "lg";
}) {
  const sizeCls = size === "lg" ? "" : "!px-5 !py-2.5 !text-[13px]";
  const label: Record<SendStatus, string> = {
    idle: "שליחת המשוב",
    sending: "שולח…",
    sent: "נשלח ✓",
    error: "שגיאה — שליחה חוזרת",
  };
  const tone =
    status === "sent" ? "border-cyan-deep bg-cyan text-cyan-deep" : "ds-btn--solid";
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

// ── icons ──────────────────────────────────────────────────────────────

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
