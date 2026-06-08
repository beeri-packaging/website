"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createRevealObserver } from "@/lib/revealObserver";

/**
 * Global scroll-entrance observer. Adds `.is-visible` to each `.reveal`
 * element once it scrolls into view, triggering the fade + rise defined in
 * globals.css.
 *
 * We use IntersectionObserver rather than a CSS `view()` scroll timeline
 * because anonymous view() timelines freeze or mis-resolve under
 * `position: sticky` / `overflow: clip` ancestors (notably Safari) — the
 * same reason DualJourney observes its cards in JS.
 *
 * Re-scans on every client navigation: the locale layout stays mounted, so
 * a freshly-rendered page's `.reveal` nodes need a new observer pass.
 */
export function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Reduced motion is handled entirely by the CSS `@media (prefers-reduced-
    // motion: reduce)` rule in globals.css, which shows every `.reveal` at
    // rest — JS-independent and automatically covering late-mounted nodes.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = createRevealObserver({
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
    });

    // observe() is idempotent, so re-scanning only ever adds new nodes.
    const scan = () =>
      document
        .querySelectorAll<HTMLElement>(".reveal:not(.is-visible)")
        .forEach((el) => observer.observe(el));

    scan();

    // `.reveal` nodes can mount after this pass without a route change — e.g.
    // the client-filtered roles list on /careers. Without this they'd keep the
    // CSS opacity:0 forever, never observed. Re-scan when DOM nodes are added.
    const mutations = new MutationObserver((records) => {
      if (records.some((record) => record.addedNodes.length > 0)) scan();
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [pathname]);

  return null;
}
