import type { Lang } from "@/app/content/home";
import type { LegalDoc } from "@/app/content/legal";
import { COMPANY, EMAIL_HREF, MAPS_HREF, companyLegalName, companyAddress } from "@/app/content/company";

/**
 * Editorial renderer for a legal document (Privacy / Terms). Reads its copy
 * from `app/content/legal.ts` and the company facts from `app/content/company.ts`,
 * so the two pages stay in lockstep. Server component — uses only logical CSS
 * so it reads correctly in both RTL (he) and LTR (en).
 */
export function LegalDocument({ doc, lang }: { doc: LegalDoc; lang: Lang }) {
  const addr = companyAddress(lang);
  const regLabel = lang === "he" ? "ח.פ." : "Company No.";

  return (
    <div className="bg-bone">
      <article className="mx-auto w-full max-w-[820px] px-5 pb-20 pt-6 sm:px-8 sm:pb-28 lg:px-0">
        {/* Header */}
        <header>
          <div className="bg-yellow inline-flex items-start px-3 py-1">
            <span className="font-sans text-[10.5px] uppercase leading-4 tracking-[0.08em] text-cyan-deep sm:text-[12px]">
              {doc.eyebrow}
            </span>
          </div>
          <h1 className="mt-6 font-display text-[44px] font-bold leading-[0.9] text-ink sm:text-[60px] md:text-[72px]">
            {doc.title}
          </h1>
          <p className="mt-4 font-sans text-[12px] uppercase tracking-[0.08em] text-clay">
            {doc.updated}
          </p>
          <div className="mt-8 flex flex-col gap-4">
            {doc.intro.map((p, i) => (
              <p key={i} className="font-sans text-[16px] leading-[1.7] text-clay">
                {p}
              </p>
            ))}
          </div>
        </header>

        {/* Sections */}
        <div className="mt-12 flex flex-col gap-10">
          {doc.sections.map((section, i) => (
            <section key={i} className="border-t border-rule pt-8">
              <h2 className="flex items-baseline gap-3 font-display text-[24px] font-bold leading-[1] text-ink sm:text-[28px]">
                <span className="font-sans text-[14px] font-extrabold tracking-[0.08em] text-magenta">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{section.heading}</span>
              </h2>
              {section.body ? (
                <div className="mt-4 flex flex-col gap-3">
                  {section.body.map((p, j) => (
                    <p key={j} className="font-sans text-[16px] leading-[1.7] text-clay">
                      {p}
                    </p>
                  ))}
                </div>
              ) : null}
              {section.list ? (
                <ul className="mt-4 flex list-disc flex-col gap-2 ps-5 marker:text-magenta">
                  {section.list.map((item, j) => (
                    <li key={j} className="font-sans text-[16px] leading-[1.7] text-clay">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        {/* Contact block */}
        <section className="mt-12 border border-ink bg-sand/60 p-6 sm:p-8">
          <h2 className="font-display text-[22px] font-bold leading-[1] text-ink sm:text-[24px]">
            {doc.contactHeading}
          </h2>
          <p className="mt-3 font-sans text-[15px] leading-[1.7] text-clay">{doc.contactIntro}</p>
          <div className="mt-5 font-sans text-[15px] leading-[1.85] text-clay">
            <p className="font-bold text-ink">{companyLegalName(lang)}</p>
            <p>{`${regLabel} ${COMPANY.registrationNumber}`}</p>
            <p>
              <a
                href={MAPS_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-ink focus-ring"
              >
                {`${addr.street}, ${addr.city}, ${addr.country}`}
              </a>
            </p>
            <p>
              <a
                href={EMAIL_HREF}
                className="underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-ink focus-ring"
              >
                {COMPANY.email}
              </a>
            </p>
          </div>
        </section>
      </article>
    </div>
  );
}
