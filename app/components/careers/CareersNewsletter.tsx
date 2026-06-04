import type { CareersCopy } from "@/app/content/careers";

export function CareersNewsletter({ copy }: { copy: CareersCopy }) {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-5 pb-24 sm:px-8 md:px-12 lg:px-20">
      <div className="grid gap-8 border-t-2 border-ink pt-12 md:grid-cols-[minmax(260px,460px)_1fr] md:items-center">
        <div>
          <h2 className="font-display text-[56px] font-bold leading-[0.86] text-ink sm:text-[64px]">
            {copy.newsletterTitle.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-5 max-w-[430px] font-sans text-[15px] leading-[1.7] text-clay sm:text-[16px]">
            {copy.newsletterBody}
          </p>
        </div>

        <form className="grid gap-3 sm:grid-cols-[1fr_144px]" action="/careers">
          <input
            name="email"
            type="email"
            aria-label={copy.emailPlaceholder}
            placeholder={copy.emailPlaceholder}
            className="h-[50px] min-w-0 border border-ink bg-bone px-4 font-sans text-[13px] text-ink outline-none placeholder:text-clay/70 focus:border-purple"
          />
          <button
            type="submit"
            className="h-[50px] bg-ink px-8 font-sans text-[13px] font-bold text-bone transition-colors hover:bg-clay focus-ring"
          >
            {copy.newsletterCta}
          </button>
        </form>
      </div>
    </section>
  );
}
