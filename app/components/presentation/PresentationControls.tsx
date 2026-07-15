"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type ControlLabels = {
  previous: string;
  next: string;
  chapter: string;
  exit: string;
};

type TourLabels = {
  label: string;
  play: string;
  pause: string;
  resume: string;
  restart: string;
  close: string;
  step: string;
  steps: Record<string, Array<{ title: string; body: string }>>;
};

const STEP_POSITIONS = [0, 0.42, 0.86] as const;
const STEP_DURATION_MS = 4300;

export function PresentationControls({
  slideIds,
  labels,
  tour,
  exitHref,
  direction,
}: {
  slideIds: readonly string[];
  labels: ControlLabels;
  tour: TourLabels;
  exitHref: string;
  direction: "rtl" | "ltr";
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [tourStepIndex, setTourStepIndex] = useState(0);
  const [tourOpen, setTourOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tourComplete, setTourComplete] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      const bounded = Math.max(0, Math.min(slideIds.length - 1, index));
      setActiveIndex(bounded);
      setTourStepIndex(0);
      document.getElementById(slideIds[bounded])?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    [slideIds],
  );

  const stopManualTour = useCallback(() => {
    setIsPlaying(false);
    setTourOpen(false);
    setTourComplete(false);
  }, []);

  const goToManually = useCallback(
    (index: number) => {
      stopManualTour();
      goTo(index);
    },
    [goTo, stopManualTour],
  );

  useEffect(() => {
    const deck = document.querySelector<HTMLElement>("[data-presentation-deck]");
    if (!deck) return;

    deck.classList.add("presentation-ready");
    const slides = slideIds
      .map((id) => document.getElementById(id))
      .filter((slide): slide is HTMLElement => Boolean(slide));

    const activate = (index: number) => {
      setActiveIndex(index);
      slides.forEach((slide, slideIndex) => {
        slide.dataset.active = slideIndex === index ? "true" : "false";
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = slides.indexOf(visible.target as HTMLElement);
        if (index >= 0) activate(index);
      },
      { root: deck, threshold: [0.35, 0.55, 0.75] },
    );

    slides.forEach((slide) => observer.observe(slide));
    activate(0);
    return () => {
      observer.disconnect();
      deck.classList.remove("presentation-ready");
    };
  }, [slideIds]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;

      if (event.key === "Escape" && tourOpen) {
        event.preventDefault();
        stopManualTour();
        return;
      }

      const forwardArrow = direction === "rtl" ? "ArrowLeft" : "ArrowRight";
      const backwardArrow = direction === "rtl" ? "ArrowRight" : "ArrowLeft";
      if (["ArrowDown", "PageDown", " ", forwardArrow].includes(event.key)) {
        event.preventDefault();
        goToManually(activeIndex + 1);
      } else if (["ArrowUp", "PageUp", backwardArrow].includes(event.key)) {
        event.preventDefault();
        goToManually(activeIndex - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goToManually(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goToManually(slideIds.length - 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, direction, goToManually, slideIds.length, stopManualTour, tourOpen]);

  useEffect(() => {
    if (!tourOpen || !isPlaying || tourComplete) return;

    const slideId = slideIds[activeIndex];
    const steps = tour.steps[slideId] ?? [];
    const frame = document.querySelector<HTMLIFrameElement>(`#${slideId} iframe`);
    if (!frame || steps.length === 0) return;

    const scrollPreview = () => {
      try {
        const frameWindow = frame.contentWindow;
        const frameDocument = frame.contentDocument;
        if (!frameWindow || !frameDocument) return;
        const maxScroll = Math.max(
          0,
          frameDocument.documentElement.scrollHeight - frameWindow.innerHeight,
        );
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        frameWindow.scrollTo({
          top: maxScroll * (STEP_POSITIONS[tourStepIndex] ?? 0),
          behavior: reduceMotion ? "auto" : "smooth",
        });
      } catch {
        // The previews are same-origin in production. If browser privacy rules
        // temporarily block access while a frame loads, the next step retries.
      }
    };

    scrollPreview();
    frame.addEventListener("load", scrollPreview, { once: true });

    const timer = window.setTimeout(() => {
      if (tourStepIndex < steps.length - 1) {
        setTourStepIndex((current) => current + 1);
      } else if (activeIndex < slideIds.length - 1) {
        goTo(activeIndex + 1);
      } else {
        setIsPlaying(false);
        setTourComplete(true);
      }
    }, STEP_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
      frame.removeEventListener("load", scrollPreview);
    };
  }, [activeIndex, goTo, isPlaying, slideIds, tour.steps, tourComplete, tourOpen, tourStepIndex]);

  const startTour = () => {
    if (tourComplete) goTo(0);
    setTourComplete(false);
    setTourStepIndex(0);
    setTourOpen(true);
    setIsPlaying(true);
  };

  const currentSteps = tour.steps[slideIds[activeIndex]] ?? [];
  const currentStep = currentSteps[tourStepIndex];
  const progress = ((activeIndex + 1) / slideIds.length) * 100;

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-ink/10" aria-hidden>
        <span
          className="block h-full bg-magenta transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {!tourOpen ? (
        <Button
          type="button"
          variant="cyan"
          size="sm"
          className="fixed bottom-[5.75rem] start-1/2 z-[60] min-h-11 -translate-x-1/2 shadow-[4px_4px_0_0_var(--ink)] sm:bottom-[7.25rem]"
          onClick={startTour}
          data-tour-play
        >
          <span aria-hidden className="text-[15px]">▶</span>
          {tour.play}
        </Button>
      ) : currentStep ? (
        <aside
          data-tour-popup
          data-tour-playing={isPlaying ? "true" : "false"}
          aria-live="polite"
          className="fixed bottom-[5.75rem] start-3 z-[60] w-[min(360px,calc(100vw-1.5rem))] border border-ink bg-bone p-4 text-start text-ink shadow-[7px_7px_0_0_var(--yellow)] sm:bottom-[7.25rem] sm:start-6 sm:p-5"
        >
          <div className="flex items-center justify-between gap-4 border-b border-rule pb-3">
            <div>
              <p className="font-sans text-[10px] font-extrabold uppercase tracking-[0.14em] text-magenta-deep">
                {tour.label}
              </p>
              <p className="mt-1 font-sans text-[10px] font-bold text-clay">
                {tour.step
                  .replace("{current}", String(tourStepIndex + 1))
                  .replace("{total}", String(currentSteps.length))}
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="size-8 min-h-0 shrink-0 px-0 py-0 text-[16px]"
              onClick={stopManualTour}
              aria-label={tour.close}
            >
              <span aria-hidden>×</span>
            </Button>
          </div>

          <h2 className="mt-3 font-display text-[30px] leading-none sm:text-[36px]">
            {currentStep.title}
          </h2>
          <p className="mt-2 font-sans text-[13px] leading-6 text-clay sm:text-[14px]">
            {currentStep.body}
          </p>

          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="flex gap-1.5" aria-hidden>
              {currentSteps.map((step, index) => (
                <span
                  key={step.title}
                  className={cn(
                    "h-1.5 transition-[width,background-color] duration-300",
                    index === tourStepIndex ? "w-8 bg-magenta" : "w-3 bg-ink/20",
                  )}
                />
              ))}
            </div>
            {tourComplete ? (
              <Button type="button" variant="cyan" size="sm" onClick={startTour}>
                <span aria-hidden>↻</span>
                {tour.restart}
              </Button>
            ) : (
              <Button
                type="button"
                variant={isPlaying ? "secondary" : "cyan"}
                size="sm"
                onClick={() => setIsPlaying((playing) => !playing)}
              >
                <span aria-hidden>{isPlaying ? "Ⅱ" : "▶"}</span>
                {isPlaying ? tour.pause : tour.resume}
              </Button>
            )}
          </div>
        </aside>
      ) : null}

      <nav
        aria-label={labels.chapter
          .replace("{current}", String(activeIndex + 1))
          .replace("{total}", String(slideIds.length))}
        className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-[720px] items-center justify-between gap-2 border border-ink/20 bg-bone/95 p-2 shadow-[4px_4px_0_0_var(--ink)] backdrop-blur sm:inset-x-6 sm:bottom-6 sm:p-3"
      >
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="size-11 shrink-0 px-0 text-[20px] disabled:cursor-not-allowed disabled:opacity-35"
          disabled={activeIndex === 0}
          onClick={() => goToManually(activeIndex - 1)}
          aria-label={labels.previous}
        >
          <span aria-hidden>{direction === "rtl" ? "→" : "←"}</span>
        </Button>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 sm:gap-2">
          {slideIds.map((id, index) => (
            <Button
              key={id}
              type="button"
              variant="secondary"
              size="sm"
              className="size-7 min-h-0 rounded-full border-0 bg-transparent p-0 hover:bg-ink/5"
              onClick={() => goToManually(index)}
              aria-label={labels.chapter
                .replace("{current}", String(index + 1))
                .replace("{total}", String(slideIds.length))}
              aria-current={index === activeIndex ? "step" : undefined}
            >
              <span
                className={cn(
                  "size-2.5 rounded-full",
                  index === activeIndex ? "bg-magenta" : "bg-ink/20",
                )}
                aria-hidden
              />
            </Button>
          ))}
          <span className="ms-2 hidden whitespace-nowrap font-sans text-[11px] font-bold tracking-[0.08em] text-clay sm:inline">
            {labels.chapter
              .replace("{current}", String(activeIndex + 1))
              .replace("{total}", String(slideIds.length))}
          </span>
        </div>

        {activeIndex === slideIds.length - 1 ? (
          <Link
            href={exitHref}
            className={cn(buttonVariants({ variant: "cyan", size: "sm" }), "min-h-11 shrink-0")}
          >
            {labels.exit}
          </Link>
        ) : (
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="size-11 shrink-0 px-0 text-[20px]"
            onClick={() => goToManually(activeIndex + 1)}
            aria-label={labels.next}
          >
            <span aria-hidden>{direction === "rtl" ? "←" : "→"}</span>
          </Button>
        )}
      </nav>
    </>
  );
}
