import type { ReactNode } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { aboutImages, type AboutCopy } from "@/app/content/about";
import { ContactTriggerButton } from "@/app/components/contact/ContactTriggerButton";
import { AboutTimeline } from "./AboutTimeline";

/** Tracked micro-label with a leading rule, matching the site's section eyebrows. */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-3 text-magenta">
      <span className="h-px w-12 bg-magenta" aria-hidden />
      <span className="font-sans text-[12px] font-extrabold uppercase tracking-[0.08em]">
        {children}
      </span>
    </div>
  );
}

export function AboutPageDesign({ copy }: { copy: AboutCopy }) {
  return (
    <div className="bg-bone">
      {/* 1 — HERO */}
      <section className="mx-auto w-full max-w-[1152px] px-5 pb-16 pt-4 sm:px-8 md:pb-24 md:pt-8 lg:px-0">
        <div className="max-w-[760px] text-start">
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <h1 className="font-display text-[64px] leading-[0.92] text-blueprint sm:text-[82px] md:text-[96px]">
            {copy.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-[620px] font-sans text-[18px] leading-[1.55] text-clay">
            {copy.intro}
          </p>
        </div>
      </section>

      {/* 2 — HERITAGE / PARENT GROUP */}
      <section className="mx-auto w-full max-w-[1152px] px-5 pb-20 sm:px-8 md:pb-28 lg:px-0">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="text-start lg:col-span-7">
            <Eyebrow>{copy.heritageEyebrow}</Eyebrow>
            <h2 className="font-display text-[40px] leading-[0.9] text-blueprint sm:text-[52px]">
              {copy.heritageTitle}
            </h2>
            <p className="mt-5 max-w-[560px] font-sans text-[16px] leading-[1.56] text-clay">
              {copy.heritageBody}
            </p>
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
                  <p className="font-display text-[28px] leading-none text-cyan">{it.year}</p>
                  <p className="mt-2 font-sans text-[13px] font-extrabold uppercase tracking-[0.06em] text-blueprint">
                    {it.name}
                  </p>
                  <p className="mt-1 font-sans text-[14px] leading-[1.5] text-clay">{it.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Black-and-white heritage triptych */}
          <div className="lg:col-span-5">
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
            <p className="mt-3 font-sans text-[11px] font-extrabold uppercase tracking-[0.08em] text-clay/70">
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
      <section className="mx-auto w-full max-w-[1152px] px-5 py-20 sm:px-8 md:py-28 lg:px-0">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="text-start">
              <Eyebrow>{copy.statsEyebrow}</Eyebrow>
              <h2 className="font-display text-[40px] leading-[0.9] text-blueprint sm:text-[52px]">
                {copy.statsTitle}
              </h2>
            </div>
            <dl className="mt-8 grid grid-cols-2 gap-4">
              {copy.stats.map((s, i) => {
                const variant =
                  i === 0
                    ? "bg-blueprint text-bone"
                    : i === 3
                      ? "bg-yellow text-blueprint"
                      : "border border-blueprint bg-bone text-blueprint";
                const valueColor = i === 0 ? "text-cyan" : "text-blueprint";
                const subColor =
                  i === 0 ? "text-bone/70" : i === 3 ? "text-blueprint/70" : "text-clay";
                return (
                  <div key={s.label} className={`flex flex-col justify-between p-6 ${variant}`}>
                    <dt className={`font-display text-[44px] leading-[0.85] sm:text-[52px] ${valueColor}`}>
                      {s.value}
                    </dt>
                    <dd className="mt-6">
                      <span className="block font-sans text-[13px] font-extrabold uppercase tracking-[0.06em]">
                        {s.label}
                      </span>
                      {s.sub ? (
                        <span className={`mt-1 block font-sans text-[12px] ${subColor}`}>
                          {s.sub}
                        </span>
                      ) : null}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
          <div className="relative min-h-[320px] overflow-hidden border border-blueprint bg-sand lg:col-span-5">
            <Image
              src={aboutImages.production.floor}
              alt={copy.statsTitle}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 5 — CAPABILITIES */}
      <section className="mx-auto w-full max-w-[1152px] px-5 pb-20 sm:px-8 md:pb-28 lg:px-0">
        <div className="max-w-[640px] text-start">
          <Eyebrow>{copy.capsEyebrow}</Eyebrow>
          <h2 className="font-display text-[40px] leading-[0.9] text-blueprint sm:text-[52px]">
            {copy.capsTitle}
          </h2>
          <p className="mt-5 font-sans text-[16px] leading-[1.56] text-clay">{copy.capsBody}</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/finishing"
              className="inline-flex items-center font-sans text-[14px] font-bold tracking-[0.04em] text-purple underline underline-offset-4 focus-ring"
            >
              {copy.capsFinishingCta}
            </Link>
            <Link
              href="/catalog"
              className="inline-flex items-center font-sans text-[14px] font-bold tracking-[0.04em] text-purple underline underline-offset-4 focus-ring"
            >
              {copy.capsCatalogCta}
            </Link>
          </div>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {copy.capabilities.map((c) => (
            <li key={c.step} className="flex flex-col overflow-hidden border border-blueprint bg-bone">
              {c.image ? (
                <div className="relative aspect-[4/3] bg-sand">
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-contain p-4"
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col p-5 text-start">
                <span className="font-display text-[22px] leading-none text-magenta">{c.step}</span>
                <h3 className="mt-2 font-display text-[22px] leading-[0.95] tracking-[0.03em] text-blueprint">
                  {c.title}
                </h3>
                <p className="mt-2 font-sans text-[14px] leading-[1.5] text-clay">{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 6 — QUALITY */}
      <section className="mx-auto w-full max-w-[1152px] px-5 pb-20 sm:px-8 md:pb-28 lg:px-0">
        <div className="max-w-[640px] text-start">
          <Eyebrow>{copy.qualityEyebrow}</Eyebrow>
          <h2 className="font-display text-[40px] leading-[0.9] text-blueprint sm:text-[52px]">
            {copy.qualityTitle}
          </h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {copy.standards.map((s) => (
            <article
              key={s.code}
              className="flex flex-col border border-blueprint bg-bone p-8 text-start"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-display text-[32px] leading-none text-blueprint">{s.code}</span>
                <span className="h-px flex-1 bg-rule" aria-hidden />
              </div>
              <h3 className="mt-4 font-sans text-[14px] font-extrabold uppercase tracking-[0.06em] text-teal">
                {s.title}
              </h3>
              <p className="mt-2 font-sans text-[15px] leading-[1.56] text-clay">{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 7 — CTA */}
      <section className="mx-auto w-full max-w-[1152px] px-5 pb-24 pt-0 sm:px-8 lg:px-0">
        <div className="flex flex-col gap-8 border-t border-rule pt-12 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-[520px] font-display text-[32px] leading-[0.95] text-blueprint sm:text-[40px]">
            {copy.ctaTitle}
          </h2>
          <div className="flex flex-col gap-4 sm:flex-row">
            <ContactTriggerButton className="inline-flex min-h-[56px] items-center justify-center border-2 border-blueprint bg-cyan px-[42px] py-[18px] font-sans text-[14px] font-bold tracking-[0.08em] text-blueprint focus-ring">
              {copy.ctaPrimary}
            </ContactTriggerButton>
            <Link
              href="/catalog"
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
