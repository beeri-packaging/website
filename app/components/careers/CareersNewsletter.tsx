"use client";

import { useState, useTransition, type FormEvent } from "react";
import type { CareersCopy } from "@/app/content/careers";
import { submitNewsletterSignup } from "@/app/actions/newsletter";

export function CareersNewsletter({ copy }: { copy: CareersCopy }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // preventDefault so the form never does a cross-locale GET to "/careers"
  // (which redirected /en users to /he and dropped the value); deliver the
  // signup to the company inbox via a Server Action instead.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError(null);
    startTransition(async () => {
      const res = await submitNewsletterSignup(data);
      if (res.ok) setSubmitted(true);
      else setError(copy.newsletterError);
    });
  }

  return (
    <section className="mx-auto w-full max-w-[1280px] px-5 pb-24 sm:px-8 md:px-12 lg:px-20">
      <div className="reveal grid gap-8 border-t-2 border-ink pt-12 md:grid-cols-[minmax(260px,460px)_1fr] md:items-center">
        <div>
          <h2 className="font-display text-[56px] font-bold leading-none text-ink sm:text-[80px] lg:text-[96px]">
            {copy.newsletterTitle.join(" ")}
          </h2>
          <p className="mt-5 max-w-[460px] font-sans text-[18px] leading-[1.5] text-clay sm:text-[20px]">
            {copy.newsletterBody}
          </p>
        </div>

        <div>
          <form className="grid gap-3 sm:grid-cols-[1fr_144px]" onSubmit={handleSubmit} noValidate>
            {/* Honeypot — off-screen; bots that fill it are dropped server-side. */}
            <input
              type="text"
              name="company_url"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="absolute h-0 w-0 overflow-hidden opacity-0"
              style={{ insetInlineStart: "-9999px" }}
            />
            <input
              name="email"
              type="email"
              required
              disabled={submitted || isPending}
              aria-label={copy.emailPlaceholder}
              placeholder={copy.emailPlaceholder}
              className="h-[50px] min-w-0 border border-ink bg-bone px-4 font-sans text-[16px] font-light text-ink outline-none placeholder:text-clay/60 focus:border-purple disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={submitted || isPending}
              aria-busy={isPending}
              className="h-[50px] bg-purple px-8 font-sans text-[14px] font-bold tracking-[0.08em] text-bone transition-colors hover:bg-purple/90 focus-ring disabled:bg-ink disabled:opacity-90"
            >
              {submitted ? "✓" : isPending ? "…" : copy.newsletterCta}
            </button>
          </form>
          <p
            aria-live="polite"
            className={`mt-3 min-h-[1.25rem] font-sans text-[14px] ${error ? "text-magenta-deep" : "text-clay"}`}
          >
            {submitted ? copy.newsletterSuccess : error ?? ""}
          </p>
        </div>
      </div>
    </section>
  );
}
