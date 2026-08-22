import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { aboutImages, type AboutCopy } from "@/app/content/about";
import type { Lang } from "@/app/content/home";
import { ContactTriggerButton } from "@/app/components/contact/ContactTriggerButton";
import { AboutTimeline } from "./AboutTimeline";

/** Tracked micro-label with a leading rule, matching the site's section eyebrows. */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-3 text-magenta-deep">
      <span className="h-px w-12 bg-magenta" aria-hidden />
      <span className="font-sans text-[12px] font-extrabold uppercase tracking-[0.08em]">
        {children}
      </span>
    </div>
  );
}

function clientLogoBoxClass(logo?: string) {
  if (!logo) return "";

  if (logo.includes("tempo")) return "h-16 w-24 sm:h-[74px] sm:w-28";
  if (logo.includes("leiman")) return "h-16 w-28 sm:h-[74px] sm:w-32";
  if (logo.includes("recanati")) return "h-16 w-28 sm:h-[76px] sm:w-32";
  if (logo.includes("carmel")) return "h-16 w-28 sm:h-[76px] sm:w-32";
  if (logo.includes("altman")) return "h-12 w-40 sm:h-14 sm:w-48";
  if (logo.includes("nestle")) return "h-12 w-40 sm:h-14 sm:w-48";
  if (logo.includes("carlsberg")) return "h-16 w-40 sm:h-[74px] sm:w-48";
  if (logo.includes("cbc")) return "h-16 w-40 sm:h-[72px] sm:w-48";
  if (logo.includes("golan")) return "h-16 w-40 sm:h-[72px] sm:w-48";
  if (logo.includes("wissotzky")) return "h-14 w-40 sm:h-16 sm:w-48";
  if (logo.includes("elite")) return "h-16 w-36 sm:h-[72px] sm:w-40";

  return "h-14 w-40 sm:h-16 sm:w-48";
}

const teamAccentClasses = [
  "bg-cyan",
  "bg-yellow",
  "bg-magenta",
  "bg-purple",
  "bg-teal",
  "bg-cyan",
  "bg-yellow",
] as const;

export function AboutPageDesign({ copy, lang }: { copy: AboutCopy; lang: Lang }) {
  const [introLead, ...introDetails] = copy.intro.split("\n\n");
  const heritageParagraphs = copy.heritageBody.split("\n\n");

  return (
    <div className="bg-bone">
      {/* 1 — HERO */}
      <section className="mx-auto w-full max-w-[1152px] px-5 pb-16 pt-4 sm:px-8 md:pb-24 md:pt-8 lg:px-0">
        <div className="text-start">
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          {/* Sized so each approved line lands on one line — two lines, not three. */}
          <h1 className="font-display text-[44px] leading-[0.88] text-blueprint sm:text-[64px] md:text-[80px] lg:text-[92px]">
            {copy.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          {/* Lead carries the weight; the supporting copy sits quieter beside it. */}
          <div className="mt-8 grid gap-x-12 gap-y-7 font-sans text-clay md:mt-10 lg:grid-cols-12">
            <p className="text-[18px] leading-[1.65] sm:text-[20px] lg:col-span-7">
              {introLead}
            </p>
            <div className="flex flex-col gap-4 border-s-4 border-cyan ps-5 lg:col-span-5">
              {introDetails.map((paragraph) => (
                <p key={paragraph} className="text-[15px] leading-[1.7] sm:text-[16px]">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Sectors served — a chip row scans where a run-on sentence didn't.
              Label sits above, not inline: inline it lands under the sticky
              contact pill at the inline-end edge. */}
          <div className="mt-10 flex flex-col gap-4 border-t border-rule pt-6 md:mt-12">
            <h2 className="font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-magenta-deep">
              {copy.industriesLabel}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {copy.industries.map((industry) => (
                <li
                  key={industry}
                  className="border border-ink bg-sand px-[9px] py-[5px] font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-ink"
                >
                  {industry}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 2 — HERITAGE / PARENT GROUP */}
      <section id="heritage" className="mx-auto w-full max-w-[1152px] px-5 pb-20 sm:px-8 md:pb-28 lg:px-0 scroll-mt-[80px]">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="reveal text-start lg:col-span-7">
            <Eyebrow>{copy.heritageEyebrow}</Eyebrow>
            <h2 className="font-display text-[40px] leading-[0.95] text-blueprint sm:text-[52px] lg:text-[64px]">
              {copy.heritageTitle}
            </h2>
            <div className="mt-5 flex max-w-[620px] flex-col gap-4 font-sans text-[16px] leading-[1.56] text-clay">
              {heritageParagraphs.map((paragraph) => (
                <p key={paragraph} className="text-pretty">
                  {paragraph}
                </p>
              ))}
            </div>
            <a
              href={copy.groupLinkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 font-sans text-[14px] font-bold tracking-[0.04em] text-purple underline underline-offset-4 focus-ring"
            >
              {copy.groupLinkLabel}
              <span aria-hidden>↗</span>
            </a>

            <div className="mt-10 grid gap-px border border-rule bg-rule sm:grid-cols-3">
              {copy.heritageItems.map((it) => (
                <div key={it.year} className="bg-bone p-5 text-start">
                  <p className="font-display text-[28px] leading-none text-teal">{it.year}</p>
                  <p className="mt-2 font-sans text-[13px] font-extrabold uppercase tracking-[0.06em] text-blueprint">
                    {it.name}
                  </p>
                  <p className="mt-1 font-sans text-[14px] leading-[1.5] text-clay">{it.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Black-and-white heritage triptych */}
          <div className="reveal lg:col-span-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative col-span-2 aspect-[16/9] overflow-hidden border border-blueprint bg-sand">
                <Image
                  src={aboutImages.heritage.shop}
                  alt={copy.heritageImageCaption}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover grayscale"
                  style={{ objectPosition: "center 30%" }}
                />
              </div>
              <div className="relative aspect-square overflow-hidden border border-blueprint bg-sand">
                <Image
                  src={aboutImages.heritage.founders}
                  alt={copy.heritageImageCaption}
                  fill
                  sizes="(min-width: 1024px) 20vw, 50vw"
                  className="object-cover grayscale"
                />
              </div>
              <div className="relative aspect-square overflow-hidden border border-blueprint bg-sand">
                <Image
                  src={aboutImages.heritage.press}
                  alt={copy.heritageImageCaption}
                  fill
                  sizes="(min-width: 1024px) 20vw, 50vw"
                  className="object-cover grayscale"
                />
              </div>
            </div>
            <p className="mt-3 font-sans text-[11px] font-extrabold uppercase tracking-[0.08em] text-clay/80">
              {copy.heritageImageCaption}
            </p>
          </div>
        </div>
      </section>

      {/* 3 — MILESTONE TIMELINE (dark band) */}
      <AboutTimeline
        eyebrow={copy.timelineEyebrow}
        title={copy.timelineTitle}
        milestones={copy.milestones}
      />

      {/* 4 — BY THE NUMBERS */}
      <section id="numbers" className="mx-auto w-full max-w-[1152px] px-5 py-20 sm:px-8 md:py-28 lg:px-0 scroll-mt-[80px]">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="reveal text-start">
              <Eyebrow>{copy.statsEyebrow}</Eyebrow>
              <h2 className="font-display text-[44px] leading-[0.92] text-blueprint sm:text-[64px] lg:text-[96px]">
                {copy.statsTitle}
              </h2>
            </div>
            <dl className="mt-8 grid grid-cols-2 gap-4">
              {copy.stats.map((s) => {
                const tone = s.tone ?? "plain";
                const tile =
                  tone === "magenta"
                    ? "bg-magenta-deep"
                    : tone === "yellow"
                      ? "bg-yellow"
                      : "border border-blueprint bg-bone";
                const valueColor = tone === "magenta" ? "text-cyan" : "text-blueprint";
                const labelColor =
                  tone === "magenta"
                    ? "text-bone"
                    : tone === "yellow"
                      ? "text-blueprint/75"
                      : "text-blueprint";
                const subColor = tone === "magenta" ? "text-bone" : "text-clay";
                const valueSize =
                  s.value.length > 5
                    ? "text-[34px] leading-[0.92] sm:text-[42px]"
                    : "text-[52px] leading-none sm:text-[64px]";
                return (
                  <div
                    key={s.label}
                    className={`reveal flex h-[150px] flex-col justify-between p-6 text-start ${tile}`}
                  >
                    <dt className={`font-display ${valueSize} ${valueColor}`}>
                      {s.value}
                    </dt>
                    <dd>
                      <span
                        className={`block font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] ${labelColor}`}
                      >
                        {s.label}
                      </span>
                      {s.sub ? (
                        <span
                          className={`mt-1 block font-sans text-[16px] font-light leading-[1.4] tracking-[-0.01em] ${subColor}`}
                        >
                          {s.sub}
                        </span>
                      ) : null}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
          <div className="reveal relative min-h-[320px] overflow-hidden border border-blueprint bg-sand lg:hidden">
            <Image
              src={aboutImages.production.heritageToModern}
              alt={copy.statsTitle}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="reveal relative hidden aspect-square overflow-hidden border border-blueprint bg-sand lg:col-span-5 lg:block">
            <Image
              src={aboutImages.production.pastToFutureGlossy}
              alt={copy.statsTitle}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 5 — TEAM */}
      <section id="team" className="bg-blueprint text-bone scroll-mt-[80px]">
        <div className="mx-auto w-full max-w-[1152px] px-5 py-16 sm:px-8 md:py-20 lg:px-0">
          <div className="reveal grid gap-6 text-start md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <div className="mb-3 flex items-center gap-3 text-cyan">
                <span className="h-px w-12 bg-cyan" aria-hidden />
                <span className="font-sans text-[12px] font-extrabold uppercase tracking-[0.08em]">
                  {copy.teamEyebrow}
                </span>
              </div>
              <h2 className="font-display text-[44px] leading-[0.9] sm:text-[60px] lg:text-[72px]">
                {copy.teamTitle}
              </h2>
            </div>
            <p className="max-w-[440px] font-sans text-[15px] leading-[1.7] text-bone/72 md:col-span-5 md:justify-self-end md:text-[16px]">
              {copy.teamIntro}
            </p>
          </div>

          <ol className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-4 sm:gap-x-4 lg:mt-12 lg:grid-cols-7">
            {copy.teamMembers.map((member, index) => (
              <li
                key={`${member.name}-${index}`}
                className="team-member reveal group min-w-0"
                style={{ "--team-index": index } as CSSProperties}
              >
                <figure>
                  <div className="relative aspect-[4/5] overflow-hidden border border-bone/25 bg-[#e8e1d2] transition-colors duration-300 group-hover:bg-[#f1eadc]">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="(min-width: 1024px) 150px, (min-width: 640px) 25vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <>
                        <span
                          className={`absolute inset-x-0 top-0 h-1.5 ${teamAccentClasses[index % teamAccentClasses.length]}`}
                          aria-hidden
                        />
                        <span
                          className="absolute start-3 top-4 font-display text-[22px] leading-none text-blueprint/45"
                          aria-hidden
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          className="absolute end-3 top-4 h-3 w-3 border-s border-t border-blueprint/35"
                          aria-hidden
                        />
                        <span
                          className="absolute inset-x-[16%] bottom-[-9%] aspect-square rounded-t-[48%] border-2 border-blueprint bg-bone transition-transform duration-500 ease-out group-hover:-translate-y-1.5"
                          aria-hidden
                        />
                        <span
                          className="absolute bottom-[35%] left-1/2 aspect-square w-[34%] -translate-x-1/2 rounded-full border-2 border-blueprint bg-bone transition-transform duration-500 ease-out group-hover:-translate-x-1/2 group-hover:-translate-y-1.5"
                          aria-hidden
                        />
                      </>
                    )}
                  </div>
                  <figcaption className="border-t border-bone/30 pt-3 text-start">
                    <h3 className="font-sans text-[13px] font-extrabold leading-[1.35] text-bone sm:text-[14px]">
                      {member.name}
                    </h3>
                    <p className="mt-1 font-sans text-[11px] leading-[1.45] text-bone/58 sm:text-[12px]">
                      {member.role}
                    </p>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6 — PARTNERS / CLIENTS */}
      <section id="clients" className="w-full border-y border-rule bg-bone scroll-mt-[80px]">
        <div aria-hidden className="flex h-[3px]">
          <span className="flex-1 bg-cyan" />
          <span className="flex-1 bg-yellow" />
          <span className="flex-1 bg-magenta" />
          <span className="flex-1 bg-purple" />
        </div>

        <div className="mx-auto w-full max-w-[1152px] px-5 py-14 sm:px-8 md:py-20 lg:px-0">
          <div className="reveal flex flex-col items-start gap-2 text-start">
            <span className="font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-magenta-deep">
              {copy.partnersEyebrow}
            </span>
            <h2 className="font-display text-[48px] leading-[0.86] text-blueprint sm:text-[72px] lg:text-[88px]">
              {copy.partnersTitle}
            </h2>
          </div>

          <ul className="mt-9 flex flex-wrap justify-center gap-3 sm:gap-4 md:mt-12">
            {copy.clients.map((client) => (
              <li
                key={client.name}
                className="reveal w-[calc(50%-0.375rem)] max-w-[260px] sm:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]"
              >
                <div className="flex h-[108px] items-center justify-center border border-rule bg-bone px-5 py-4 transition-colors duration-300 hover:border-blueprint hover:bg-sand/55 sm:h-[124px]">
                  {client.logo ? (
                    <span className={`relative block ${clientLogoBoxClass(client.logo)}`}>
                      <Image
                        src={client.logo}
                        alt={client.name}
                        fill
                        sizes="(min-width: 1024px) 180px, (min-width: 640px) 160px, 42vw"
                        className="object-contain mix-blend-multiply"
                      />
                    </span>
                  ) : (
                    <span className="text-center font-sans text-[15px] font-extrabold uppercase tracking-[0.02em] text-ink sm:text-[17px]">
                      {client.name}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7 — CTA */}
      <section className="mx-auto w-full max-w-[1152px] px-5 pb-24 pt-0 sm:px-8 lg:px-0">
        <div className="reveal flex flex-col gap-8 border-t border-rule pt-12 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-[520px] font-display text-[32px] leading-[0.95] text-blueprint sm:text-[40px]">
            {copy.ctaTitle}
          </h2>
          <div className="flex flex-col gap-4 sm:flex-row">
            <ContactTriggerButton className="inline-flex min-h-[56px] items-center justify-center border-2 border-blueprint bg-cyan px-[42px] py-[18px] font-sans text-[14px] font-bold tracking-[0.08em] text-blueprint focus-ring">
              {copy.ctaPrimary}
            </ContactTriggerButton>
            <Link
              href={`/${lang}/catalog`}
              className="inline-flex min-h-[56px] items-center justify-center border border-blueprint px-[41px] py-[18px] font-sans text-[14px] font-bold tracking-[0.08em] text-blueprint focus-ring"
            >
              {copy.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
