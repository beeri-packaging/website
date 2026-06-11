"use client";

import { useEffect } from "react";
import { createRevealObserver } from "@/lib/revealObserver";

export function JourneyRevealObserver({ rootId }: { rootId: string }) {
  useEffect(() => {
    // Add `is-visible` to each card once it intersects the viewport.
    // We do this with IntersectionObserver instead of CSS scroll-driven
    // animations because view() timelines freeze when their element gets
    // pinned by position: sticky, leaving cards stuck at opacity 0.
    const root = document.getElementById(rootId);
    if (!root) return;
    const cards = root.querySelectorAll<HTMLElement>(".journey-card-reveal");
    // Wider threshold/margin than the generic .reveal; these cards are large
    // and should be committed before they are fully on screen.
    const observer = createRevealObserver({
      threshold: 0.18,
      rootMargin: "0px 0px -10% 0px",
    });
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [rootId]);

  return null;
}
