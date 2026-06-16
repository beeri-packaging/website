"use client";

import { useEffect, useRef, useState } from "react";
import type { AnimationItem } from "lottie-web";
import animationData from "./logo-animation.json";

// Once per browser session: the intro plays on a visitor's first contact, not
// on every client navigation (the locale layout stays mounted) nor on repeat
// visits within the same tab.
const SEEN_KEY = "beeri:intro-seen";
// Hard ceiling so a stalled player can never trap the visitor behind the
// overlay. The Lottie itself is ~2.6s (0→77 @ ~30fps); this is the fallback.
const MAX_VISIBLE_MS = 4000;

/**
 * Full-screen "fake loading" intro shown once on a visitor's first contact.
 * Plays the brand logo Lottie over a bone backdrop, then fades out to reveal
 * the site. Skipped for repeat visits (same session) and when the visitor
 * prefers reduced motion. Renders nothing on the server / after it's done, so
 * it never blocks interaction once gone.
 */
export function LogoLoader() {
  // Start hidden: SSR and the hydrating client agree on "render nothing", which
  // avoids a hydration mismatch and a flash for repeat visitors. The effect
  // decides—synchronously, before paint—whether this first contact gets the
  // intro.
  const [show, setShow] = useState(false);
  const [hiding, setHiding] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // sessionStorage can throw (private mode / blocked storage); treat as
      // unseen and just let the intro play.
    }
    if (reduceMotion || seen) return;

    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Non-fatal: at worst the intro replays on a later visit.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-time client-only decision (sessionStorage + reduced-motion)
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    const node = containerRef.current;
    if (!node) return;

    let cancelled = false;
    let anim: AnimationItem | null = null;

    // Start the fade-out: when the Lottie reports "complete", or—as a safety
    // net—when the hard ceiling elapses first.
    const dismiss = () => setHiding(true);
    const fallback = setTimeout(dismiss, MAX_VISIBLE_MS);

    // lottie-web touches `window`, so it's imported here (client, post-mount)
    // rather than at module scope to keep it out of any server render.
    import("lottie-web").then(({ default: lottie }) => {
      if (cancelled || !containerRef.current) return;
      anim = lottie.loadAnimation({
        container: containerRef.current,
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
  }, [show]);

  if (!show) return null;

  return (
    <div
      aria-hidden="true"
      onTransitionEnd={() => hiding && setShow(false)}
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-bone transition-opacity duration-500 ease-out motion-reduce:transition-none ${
        hiding ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div ref={containerRef} className="w-[min(80vw,640px)]" />
    </div>
  );
}
