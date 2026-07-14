"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Lang } from "@/app/content/home";
import { a11yMenu } from "@/app/content/accessibility";

type A11yState = {
  /** Text-size step, 0 (default) … 3. */
  text: number;
  contrast: boolean;
  links: boolean;
  font: boolean;
  motion: boolean;
};

const STORAGE_KEY = "beeri:a11y";
const MAX_TEXT = 3;
const DEFAULT_STATE: A11yState = {
  text: 0,
  contrast: false,
  links: false,
  font: false,
  motion: false,
};

function readState(): A11yState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const p = JSON.parse(raw) as Partial<A11yState>;
    return {
      text: Math.min(MAX_TEXT, Math.max(0, Number(p.text) || 0)),
      contrast: Boolean(p.contrast),
      links: Boolean(p.links),
      font: Boolean(p.font),
      motion: Boolean(p.motion),
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function setAttr(el: HTMLElement, name: string, on: boolean) {
  if (on) el.setAttribute(name, "1");
  else el.removeAttribute(name);
}

/** Mirror state onto <html> data-attributes; globals.css does the styling. */
function applyState(s: A11yState) {
  const el = document.documentElement;
  if (s.text > 0) el.setAttribute("data-a11y-text", String(s.text));
  else el.removeAttribute("data-a11y-text");
  setAttr(el, "data-a11y-contrast", s.contrast);
  setAttr(el, "data-a11y-links", s.links);
  setAttr(el, "data-a11y-font", s.font);
  setAttr(el, "data-a11y-motion", s.motion);
}

export function AccessibilityMenu({
  lang,
  statementHref,
}: {
  lang: Lang;
  statementHref: string;
}) {
  const t = a11yMenu[lang];
  const [open, setOpen] = useState(false);
  // Lazy init from storage. SSR-safe (readState returns defaults when there's
  // no window), and the panel is closed on first paint, so the only thing this
  // affects — the controls inside the panel — never renders before hydration.
  const [state, setState] = useState<A11yState>(readState);
  const rootRef = useRef<HTMLDivElement>(null);

  function update(next: A11yState) {
    setState(next);
    applyState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage blocked (private mode) — settings just won't persist */
    }
  }

  const setText = (delta: number) =>
    update({ ...state, text: Math.min(MAX_TEXT, Math.max(0, state.text + delta)) });
  const toggle = (key: "contrast" | "links" | "font" | "motion") =>
    update({ ...state, [key]: !state[key] });

  // Close on Escape + outside pointer while the panel is open.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      data-accessibility-menu
      className="fixed bottom-3 left-3 sm:bottom-6 sm:left-6 md:bottom-12 md:left-12 z-40"
    >
      {open ? (
        <div
          role="dialog"
          aria-label={t.title}
          className="absolute bottom-full left-0 mb-3 w-[280px] border border-ink bg-bone p-4 shadow-[8px_8px_0_var(--yellow),0_25px_50px_-12px_rgba(0,0,0,0.25)]"
        >
          <div className="mb-3 flex items-center justify-between gap-3 border-b border-rule pb-3">
            <h2 className="font-display text-[22px] leading-none text-ink">{t.title}</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.close}
              className="inline-flex size-7 items-center justify-center text-clay hover:text-ink transition-colors focus-ring"
            >
              <svg viewBox="0 0 14 14" className="size-3" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square" aria-hidden>
                <path d="M1 1l12 12M13 1L1 13" />
              </svg>
            </button>
          </div>

          {/* Text size */}
          <div className="flex items-center justify-between gap-3 py-2">
            <span className="font-sans text-[14px] font-semibold text-ink">{t.textSize}</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setText(-1)}
                disabled={state.text === 0}
                aria-label={t.decrease}
                className="inline-flex size-8 items-center justify-center border border-ink bg-bone font-sans text-[16px] font-bold text-ink transition-colors hover:bg-sand disabled:opacity-30 disabled:cursor-not-allowed focus-ring"
              >
                A−
              </button>
              <span aria-hidden className="w-5 text-center font-sans text-[13px] tabular-nums text-clay">
                {state.text}
              </span>
              <button
                type="button"
                onClick={() => setText(1)}
                disabled={state.text === MAX_TEXT}
                aria-label={t.increase}
                className="inline-flex size-8 items-center justify-center border border-ink bg-bone font-sans text-[18px] font-bold text-ink transition-colors hover:bg-sand disabled:opacity-30 disabled:cursor-not-allowed focus-ring"
              >
                A+
              </button>
            </div>
          </div>

          {/* Toggles */}
          <ul className="flex flex-col">
            {(
              [
                ["contrast", t.contrast],
                ["links", t.links],
                ["font", t.readableFont],
                ["motion", t.reduceMotion],
              ] as const
            ).map(([key, label]) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  aria-pressed={state[key]}
                  className="flex w-full items-center justify-between gap-3 py-2 text-start focus-ring"
                >
                  <span className="font-sans text-[14px] font-semibold text-ink">{label}</span>
                  <span
                    aria-hidden
                    className={`relative h-5 w-9 shrink-0 rounded-full border border-ink transition-colors ${
                      state[key] ? "bg-cyan" : "bg-bone"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 size-3.5 rounded-full bg-ink transition-all ${
                        state[key] ? "start-[18px]" : "start-0.5"
                      }`}
                    />
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex flex-col gap-2 border-t border-rule pt-3">
            <button
              type="button"
              onClick={() => update(DEFAULT_STATE)}
              className="w-full border border-ink bg-ink px-4 py-2.5 font-sans text-[13px] font-bold uppercase tracking-[0.08em] text-bone transition-colors hover:bg-clay focus-ring"
            >
              {t.reset}
            </button>
            <Link
              href={statementHref}
              onClick={() => setOpen(false)}
              className="text-center font-sans text-[13px] text-clay underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-ink focus-ring"
            >
              {t.statement}
            </Link>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t.buttonLabel}
        aria-expanded={open}
        className="group inline-flex size-12 items-center justify-center rounded-full border border-ink bg-cyan text-ink shadow-[0_10px_30px_-8px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:scale-105 focus-ring"
      >
        <AccessibilityGlyph />
      </button>
    </div>
  );
}

/**
 * Universal accessibility symbol — Material Symbols "accessibility_new"
 * (Apache-2.0, github.com/google/material-design-icons), used verbatim.
 */
function AccessibilityGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden>
      <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
    </svg>
  );
}
