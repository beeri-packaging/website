import type { CareersCopy } from "@/app/content/careers";

export function CareersNewsletter({ copy }: { copy: CareersCopy }) {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-5 pb-24 sm:px-8 md:px-12 lg:px-20">
      <div className="grid gap-8 border-t-2 border-ink pt-12 md:grid-cols-[minmax(260px,460px)_1fr] md:items-center">
        <div>
          <h2 className="font-display text-[56px] font-bold leading-none text-ink sm:text-[80px] lg:text-[96px]">
            {copy.newsletterTitle.join(" ")}
          </h2>
          <p className="mt-5 max-w-[460px] font-sans text-[18px] leading-[1.5] text-clay sm:text-[20px]">
            {copy.newsletterBody}
          </p>
        </div>

        <form className="grid gap-3 sm:grid-cols-[1fr_144px]" action="/careers">
          <input
            name="email"
            type="email"
            aria-label={copy.emailPlaceholder}
            placeholder={copy.emailPlaceholder}
            className="h-[50px] min-w-0 border border-ink bg-bone px-4 font-sans text-[16px] font-light text-ink outline-none placeholder:text-clay/60 focus:border-purple"
          />
          <button
            type="submit"
            className="h-[50px] bg-purple px-8 font-sans text-[14px] font-bold tracking-[0.08em] text-bone transition-colors hover:bg-purple/90 focus-ring"
          >
            {copy.newsletterCta}
          </button>
        </form>
      </div>
    </section>
  );
}
