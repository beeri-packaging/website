import type { AboutMilestone } from "@/app/content/about";

/**
 * Dark "blueprint" milestone band (Figma node 582:110). Five dotted columns
 * on desktop, a stacked list on mobile. The sequence inherits the page
 * direction, so it reads right→left in Hebrew and left→right in English
 * without extra logic.
 */
export function AboutTimeline({
  eyebrow,
  title,
  milestones,
}: {
  eyebrow: string;
  title: string;
  milestones: readonly AboutMilestone[];
}) {
  return (
    <section className="bg-blueprint text-bone">
      <div className="mx-auto w-full max-w-[1152px] px-5 py-20 sm:px-8 md:py-28 lg:px-0">
        <div className="reveal max-w-[640px] text-start">
          <div className="mb-3 flex items-center gap-3 text-cyan">
            <span className="h-px w-12 bg-cyan" aria-hidden />
            <span className="font-sans text-[12px] font-extrabold uppercase tracking-[0.08em]">
              {eyebrow}
            </span>
          </div>
          <h2 className="font-display text-[40px] leading-[0.95] sm:text-[52px] lg:text-[64px]">{title}</h2>
        </div>

        <div className="relative mt-14">
          {/* Soft track running behind the dots (desktop only) — a straight
              hairline that fades out toward both ends. */}
          <span
            className="absolute inset-x-0 top-[5px] hidden h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent md:block"
            aria-hidden
          />
          <ol className="grid gap-10 md:grid-cols-5 md:gap-x-6">
            {milestones.map((m) => (
              <li key={m.year} className="reveal relative text-start">
                <span
                  className="block h-[11px] w-[11px] rounded-full bg-yellow ring-4 ring-blueprint"
                  aria-hidden
                />
                <p className="mt-2.5 font-sans text-[12px] font-extrabold uppercase leading-[16px] tracking-[0.08em] text-yellow">
                  {m.year}
                </p>
                <h3 className="mt-2.5 font-display text-[24px] font-bold leading-[0.8] tracking-[0.05em] text-bone">
                  {m.title}
                </h3>
                <p className="mt-2.5 font-sans text-[16px] font-light leading-[1.56] tracking-[-0.01em] text-bone/70">
                  {m.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
