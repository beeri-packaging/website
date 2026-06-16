"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";
import animationData from "./logo-animation.json";

// Hard ceiling so a stalled player can never trap a visitor behind the overlay.
// The Lottie itself is ~2.6s (0→77 @ ~30fps); this is the fallback.
const MAX_VISIBLE_MS = 4000;

/**
 * The "fake loading" intro shown once on a visitor's first contact.
 *
 * The overlay markup is rendered here (server + client), so it's part of the
 * first paint and covers the page immediately — no flash of the site before
 * the intro. A pre-paint script in the layout decides—before this element is
 * even parsed—whether to reveal it (`html[data-intro="on"]`), so repeat
 * visitors and reduced-motion users never see it. This component only drives
 * the Lottie playback and the fade-out once it's actually showing.
 */
export function LogoLoader() {
  const artRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The pre-paint script sets this; if it's not on, the overlay is already
    // CSS-hidden — nothing to play, nothing to tear down.
    const show =
      (window as unknown as { __beeriIntro?: boolean }).__beeriIntro === true;
    if (!show) return;

    const art = artRef.current;
    if (!art) return;
    const overlay = art.closest("#intro-overlay");
    if (!overlay) return;

    let cancelled = false;
    let anim: AnimationItem | null = null;

    const finish = () => overlay.classList.add("is-done");
    const dismiss = () => {
      overlay.addEventListener("transitionend", finish, { once: true });
      overlay.classList.add("is-hiding");
      // Safety net in case `transitionend` never fires (e.g. a zeroed
      // transition): hide shortly after the fade would have completed.
      setTimeout(finish, 700);
    };
    const fallback = setTimeout(dismiss, MAX_VISIBLE_MS);

    // lottie-web touches `window`, so it's imported here (client, post-mount)
    // and lazily, keeping it out of every route's initial bundle.
    import("lottie-web").then(({ default: lottie }) => {
      if (cancelled || !artRef.current) return;
      anim = lottie.loadAnimation({
        container: artRef.current,
        renderer: "svg",
        loop: false,
        autoplay: true,
        animationData,
      });
      anim.addEventListener("complete", dismiss);
    });

    return () => {
      cancelled = true;
      clearTimeout(fallback);
      anim?.destroy();
    };
  }, []);

  return (
    <div id="intro-overlay" aria-hidden="true">
      <div ref={artRef} className="intro-art" />
    </div>
  );
}
