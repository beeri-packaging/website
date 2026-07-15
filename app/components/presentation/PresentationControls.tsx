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

export function PresentationControls({
  slideIds,
  labels,
  exitHref,
  direction,
}: {
  slideIds: readonly string[];
  labels: ControlLabels;
  exitHref: string;
  direction: "rtl" | "ltr";
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      const bounded = Math.max(0, Math.min(slideIds.length - 1, index));
      document.getElementById(slideIds[bounded])?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    [slideIds],
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

      const forwardArrow = direction === "rtl" ? "ArrowLeft" : "ArrowRight";
      const backwardArrow = direction === "rtl" ? "ArrowRight" : "ArrowLeft";
      if (["ArrowDown", "PageDown", " ", forwardArrow].includes(event.key)) {
        event.preventDefault();
        goTo(activeIndex + 1);
      } else if (["ArrowUp", "PageUp", backwardArrow].includes(event.key)) {
        event.preventDefault();
        goTo(activeIndex - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(slideIds.length - 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, direction, goTo, slideIds.length]);

  const progress = ((activeIndex + 1) / slideIds.length) * 100;

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-ink/10" aria-hidden>
        <span
          className="block h-full bg-magenta transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

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
          onClick={() => goTo(activeIndex - 1)}
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
              onClick={() => goTo(index)}
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
            onClick={() => goTo(activeIndex + 1)}
            aria-label={labels.next}
          >
            <span aria-hidden>{direction === "rtl" ? "←" : "→"}</span>
          </Button>
        )}
      </nav>
    </>
  );
}
