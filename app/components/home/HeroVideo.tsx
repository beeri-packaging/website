"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/app/content/home";

/**
 * Hero background video with a subtle pause/play control. Paused → the video
 * fades out and the still poster shows through, satisfying WCAG 2.2.2 (a way to
 * stop auto-playing motion). The whole island is `hidden md:block` and is
 * removed entirely under reduced motion (see `.hero-video` in globals.css), so
 * the parent Hero's still image is what those visitors get.
 *
 * Autoplay is started imperatively (not via the attribute) so we can honour a
 * reduced-motion preference and never even fetch the clip for those users.
 */
export function HeroVideo({
  lang,
  src,
  poster,
}: {
  lang: Lang;
  src: string;
  poster: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  const labels =
    lang === "he"
      ? { pause: "השהיית וידאו הרקע", play: "הפעלת וידאו הרקע" }
      : { pause: "Pause background video", play: "Play background video" };

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.getAttribute("data-a11y-motion") === "1";
    // Under reduced motion the whole island is display:none (globals.css), so
    // we simply never start playback — no state change needed.
    if (reduce) return;
    // Slow it down a touch so the footage's hard cuts read calm, not flashy.
    v.playbackRate = 0.75;
    v.play().catch(() => {
      // Autoplay can still be blocked; reflect the real state in the control.
      setPaused(true);
    });
  }, []);

  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setPaused(false)).catch(() => setPaused(true));
    } else {
      v.pause();
      setPaused(true);
    }
  }

  return (
    <div className="hero-video hidden md:block absolute inset-0 pointer-events-none">
      {/* The Hero's own <Image> sits behind this island; when the video is
          paused/loading (opacity-0) that still shows straight through. */}
      <video
        ref={ref}
        className={`absolute inset-0 h-full w-full scale-[1.04] object-cover saturate-[.72] contrast-[.94] brightness-[1.03] transition-opacity duration-700 ${
          paused ? "opacity-0" : "opacity-100"
        }`}
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        aria-hidden
      >
        <source src={src} type="video/mp4" />
      </video>

      <button
        type="button"
        onClick={toggle}
        aria-label={paused ? labels.play : labels.pause}
        className="pointer-events-auto absolute end-5 top-[88px] z-20 inline-flex size-9 items-center justify-center rounded-full border border-ink/15 bg-bone/55 text-ink/70 opacity-60 backdrop-blur-sm transition-all duration-300 hover:bg-bone/90 hover:text-ink hover:opacity-100 focus-ring sm:top-[104px] sm:end-8 md:top-[120px] md:end-12"
      >
        {paused ? <PlayGlyph /> : <PauseGlyph />}
      </button>
    </div>
  );
}

function PauseGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden>
      <rect x="3" y="2.5" width="3.2" height="11" rx="0.5" />
      <rect x="9.8" y="2.5" width="3.2" height="11" rx="0.5" />
    </svg>
  );
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5 translate-x-[1px]" fill="currentColor" aria-hidden>
      <path d="M4 2.6l9 5.4-9 5.4z" />
    </svg>
  );
}
