"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Fireworks } from "fireworks-js";
import type { CreateTypes } from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { CountdownAudio, LAUNCH_SECONDS, LAUNCH_TAIL_SECONDS, preloadLaunchMusic, type LaunchAudioOptions } from "@/lib/launch-audio";
import type { LaunchConfig } from "@/lib/launch";

export type LaunchCopy = {
  title: string; subtitle: string; start: string; skip: string;
  countdown: string; welcome: string; brand: string;
};
type Phase = "ready" | "countdown" | "opening" | "done";

export function LaunchReveal({ copy, logo, config, video, poster, music, audioOptions }: {
  copy: LaunchCopy; logo: string; config: LaunchConfig; video?: string; poster: string; music: string; audioOptions?: LaunchAudioOptions;
}) {
  const countdownSeconds = audioOptions?.countdownSeconds ?? LAUNCH_SECONDS;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const startRef = useRef<HTMLButtonElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireworksContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<CountdownAudio | null>(null);
  const confettiRef = useRef<CreateTypes | null>(null);
  const [phase, setPhase] = useState<Phase>("ready");
  const [count, setCount] = useState(countdownSeconds);
  const [active, setActive] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const running = useRef(false);
  const startedAt = useRef<number | null>(null);
  const elapsed = useCallback(() => startedAt.current === null ? 0 : (performance.now() - startedAt.current) / 1000, []);

  const finish = useCallback(() => {
    if (!running.current) return;
    const restoreFocus = dialogRef.current?.contains(document.activeElement) || document.activeElement === document.body;
    running.current = false;
    audioRef.current?.close();
    confettiRef.current?.reset();
    videoRef.current?.pause();
    document.documentElement.removeAttribute("data-launch");
    document.documentElement.removeAttribute("data-launch-reveal");
    dialogRef.current?.close();
    setPhase("done");
    const main = restoreFocus ? document.getElementById("main") : null;
    main?.setAttribute("tabindex", "-1");
    main?.focus({ preventScroll: true });
    main?.addEventListener("blur", () => main.removeAttribute("tabindex"), { once: true });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const initial = root.getAttribute("data-launch");
    const dialog = dialogRef.current;
    if (!initial || !dialog) return;
    running.current = true;
    window.clearTimeout(Number(root.getAttribute("data-launch-safety")));
    root.removeAttribute("data-launch-safety");
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduced(media.matches || root.getAttribute("data-a11y-motion") === "1");
    syncMotion();
    media.addEventListener("change", syncMotion);
    const observer = new MutationObserver(syncMotion);
    observer.observe(root, { attributes: true, attributeFilter: ["data-a11y-motion"] });
    setActive(true);
    setPhase(initial === "ready" ? "ready" : "countdown");
    if (initial !== "ready") startedAt.current = performance.now();
    void preloadLaunchMusic(music).catch(() => {});
    // Warm the library during the countdown, not at the celebration's first frame.
    void import("canvas-confetti").catch(() => {});
    void import("fireworks-js").catch(() => {});
    dialog.showModal();
    (initial === "ready" ? startRef : skipRef).current?.focus();
    return () => {
      media.removeEventListener("change", syncMotion);
      observer.disconnect();
      audioRef.current?.close();
      confettiRef.current?.reset();
      root.removeAttribute("data-launch-reveal");
      dialog.close();
    };
  }, [music]);

  useEffect(() => {
    const clip = videoRef.current;
    if (!active || !clip || reduced || videoFailed) return;
    void clip.play().catch(() => setVideoFailed(true));
  }, [active, reduced, videoFailed]);

  useLayoutEffect(() => {
    if (phase !== "opening" || reduced) return;
    const root = document.documentElement;
    // Apply the initial scale before paint; keep the dialog/confetti outside this surface.
    root.setAttribute("data-launch-reveal", "entering");
    const timer = window.setTimeout(() => root.removeAttribute("data-launch-reveal"), 2400);
    return () => { window.clearTimeout(timer); root.removeAttribute("data-launch-reveal"); };
  }, [phase, reduced]);

  useEffect(() => {
    if (!running.current || phase === "ready" || phase === "done") return;
    if (phase === "opening") {
      // Release the real website immediately; only the confetti canvas remains above it.
      document.documentElement.removeAttribute("data-launch");
      dialogRef.current?.close();
      videoRef.current?.pause();
      const main = document.getElementById("main");
      main?.setAttribute("tabindex", "-1");
      main?.focus({ preventScroll: true });
      main?.addEventListener("blur", () => main.removeAttribute("tabindex"), { once: true });
      const audioTimer = window.setTimeout(() => audioRef.current?.close(), LAUNCH_TAIL_SECONDS * 1000);
      const timer = window.setTimeout(finish, LAUNCH_TAIL_SECONDS * 1000);
      return () => { window.clearTimeout(audioTimer); window.clearTimeout(timer); };
    }
    let frame = 0;
    const update = () => {
      // Reading the music clock prevents timer drift from moving the reveal off the beat.
      const seconds = audioRef.current?.elapsed() ?? elapsed();
      if (seconds >= countdownSeconds) { setPhase("opening"); return; }
      setCount(Math.max(1, Math.ceil(countdownSeconds - seconds)));
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [countdownSeconds, elapsed, finish, phase, reduced]);

  useEffect(() => {
    if (soundOn && phase === "countdown") {
      void audioRef.current?.play(elapsed).catch(() => setSoundOn(false));
    }
  }, [elapsed, phase, soundOn]);

  useEffect(() => {
    if (phase !== "opening" || reduced) return;
    let cancelled = false;
    let secondWave: ReturnType<typeof setTimeout> | undefined;
    void import("canvas-confetti").then(({ default: confetti }) => {
      if (cancelled || !canvasRef.current) return;
      const fire = confetti.create(canvasRef.current, { resize: true, disableForReducedMotion: true });
      confettiRef.current = fire;
      const palette = getComputedStyle(document.documentElement);
      const colors = ["cyan", "yellow", "magenta", "purple", "bone"].map(name => palette.getPropertyValue(`--${name}`).trim());
      const mobile = window.innerWidth < 640;
      const burst = () => {
        const options = { particleCount: mobile ? 60 : 110, spread: 78, startVelocity: mobile ? 42 : 62, gravity: .85, decay: .92, ticks: 230, scalar: 1.15, colors };
        void fire({ ...options, angle: 58, origin: { x: .02, y: .85 } });
        void fire({ ...options, angle: 122, origin: { x: .98, y: .85 } });
      };
      burst();
      secondWave = setTimeout(burst, 420);
    }).catch(() => {}); // An animation download must never block entry to the website.
    return () => { cancelled = true; clearTimeout(secondWave); confettiRef.current?.reset(); };
  }, [phase, reduced]);

  useEffect(() => {
    if (phase !== "opening" || reduced) return;
    let cancelled = false;
    let fireworks: Fireworks | undefined;
    let finale: ReturnType<typeof setTimeout> | undefined;
    let settle: ReturnType<typeof setTimeout> | undefined;
    void import("fireworks-js").then(({ Fireworks }) => {
      if (cancelled || !fireworksContainerRef.current) return;
      const mobile = window.innerWidth < 640;
      fireworks = new Fireworks(fireworksContainerRef.current, {
        autoresize: true, opacity: .35, acceleration: 1.04, friction: .97,
        gravity: 1.15, particles: mobile ? 45 : 80, explosion: 6,
        traceLength: 3, traceSpeed: 8, flickering: 0,
        hue: { min: 25, max: 315 }, brightness: { min: 35, max: 60 },
        decay: { min: .015, max: .025 },
        delay: { min: mobile ? 32 : 22, max: mobile ? 48 : 36 },
        rocketsPoint: { min: 10, max: 90 },
        lineWidth: { explosion: { min: 1.5, max: 3 }, trace: { min: 2, max: 3 } },
        mouse: { click: false, move: false }, sound: { enabled: false },
      });
      fireworks.start();
      finale = setTimeout(() => fireworks?.updateOptions({ delay: { min: 12, max: 20 } }), 24000);
      // Stop launching after 30 seconds; let the last sparks settle before cleanup.
      settle = setTimeout(() => fireworks?.updateOptions({ delay: { min: 1e9, max: 1e9 } }), 30000);
    }).catch(() => {});
    return () => { cancelled = true; clearTimeout(finale); clearTimeout(settle); fireworks?.stop(true); };
  }, [phase, reduced]);

  useEffect(() => {
    if (!running.current) return;
    const mode = new URLSearchParams(window.location.search).get("launch");
    if (mode === "presentation" || mode === "preview") return;
    const timer = window.setTimeout(finish, Math.max(0, Math.min(config.endsAt - Date.now(), 2147483647)));
    return () => window.clearTimeout(timer);
  }, [config.endsAt, finish]);

  async function enableSound() {
    try {
      audioRef.current ??= new CountdownAudio(music, audioOptions);
      await audioRef.current.enable();
      if (running.current) setSoundOn(true);
    } catch { setSoundOn(false); }
  }

  function start() {
    startedAt.current = performance.now();
    if (videoRef.current) videoRef.current.currentTime = 0;
    void enableSound(); // The click unlocks the musical countdown in the browser.
    document.documentElement.setAttribute("data-launch", "countdown");
    skipRef.current?.focus();
    setPhase("countdown");
  }

  if (phase === "done") return null;
  return (
    <>
    <dialog ref={dialogRef} id="launch-reveal" className="launch-reveal"
      data-phase={phase} data-breath={phase === "countdown" && count <= 2 ? "true" : undefined} aria-hidden={phase === "opening" ? true : undefined} data-reduced={reduced ? "true" : undefined}
      aria-labelledby="launch-title" aria-describedby="launch-subtitle"
      onCancel={event => { event.preventDefault(); finish(); }}
      onKeyDown={event => {
        if (event.key !== "Tab") return;
        const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button")).filter(button => button.offsetParent !== null);
        const first = buttons[0]; const last = buttons[buttons.length - 1];
        if ((event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
          event.preventDefault(); (event.shiftKey ? last : first)?.focus();
        }
      }}>
      <div className="launch-footage" aria-hidden="true">
        <Image src={poster} alt="" fill sizes="100vw" className="launch-poster" />
        {active && video && !reduced && !videoFailed ? <video ref={videoRef} className="launch-video" src={video}
          muted loop playsInline preload="auto" poster={poster} onError={() => setVideoFailed(true)} /> : null}
        <div className="launch-shade" />
      </div>
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs><filter id="launch-logo-cyan" colorInterpolationFilters="sRGB">
          <feFlood floodColor="var(--cyan)" />
          <feComposite in2="SourceAlpha" operator="in" />
        </filter></defs>
      </svg>
      <div className="launch-brand"><Image src={logo} alt={copy.brand} width={180} height={70} unoptimized /></div>
      <div className="launch-content">
        <p className="launch-eyebrow" id="launch-subtitle">{copy.subtitle}</p>
        <h2 id="launch-title" className={phase === "ready" ? "launch-title" : "sr-only"}>{copy.title}</h2>
        <div className="launch-stage">
          {phase === "ready" ? <Button ref={startRef} size="md" onClick={start} className="launch-start">{copy.start}<span aria-hidden="true">▶</span></Button> : null}
          {phase === "countdown" ? <>
            <span className="sr-only" role="status">{copy.countdown.replace("{count}", String(count))}</span>
            <span key={count} className="launch-number" aria-hidden="true">{count}</span>
          </> : null}
          {phase === "ready" ? <span className="launch-prepaint-number launch-number" aria-hidden="true">{countdownSeconds}</span> : null}
        </div>
      </div>
      <Button ref={skipRef} variant="secondary" size="sm" className="launch-skip launch-control" onClick={finish}>{copy.skip}<span aria-hidden="true">↗</span></Button>
      {phase === "opening" && !reduced ? <div ref={fireworksContainerRef} className="launch-fireworks" aria-hidden="true" /> : null}
      {active && !reduced ? <canvas ref={canvasRef} className="launch-confetti" aria-hidden="true" /> : null}
    </dialog>
    </>
  );
}
