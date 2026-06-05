"use client";

import Image from "next/image";
import Link from "next/link";
import type { FinishingCopy, FinishingGridItem } from "@/app/content/finishing";
import type { Lang } from "@/app/content/home";
import { ArrowGlyph } from "@/app/components/home/icons";
import { ContactTriggerButton } from "@/app/components/contact/ContactTriggerButton";

function FinishImage({
  src,
  alt,
  className = "",
  sizes = "(min-width: 1024px) 60vw, 100vw",
  objectPosition = "center",
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  objectPosition?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-sand ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
        style={{ objectPosition }}
      />
    </div>
  );
}

function FeatureCard({
  item,
  arrowDirection,
}: {
  item: FinishingGridItem;
  arrowDirection: "right-to-left" | "left-to-right";
}) {
  return (
    <article className="relative flex h-full flex-col overflow-hidden border border-blueprint bg-bone">
      {item.sample ? (
        <div className="absolute left-px top-px z-10 flex items-start">
          <span className="bg-yellow px-4 py-1 font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-blueprint">
            {item.sample}
          </span>
          <span className="h-0 w-0 border-b-[24px] border-l-[15px] border-b-transparent border-l-yellow" aria-hidden />
        </div>
      ) : null}
      {item.image ? (
        <FinishImage
          src={item.image}
          alt={item.title}
          className="aspect-video"
          sizes="(min-width: 1024px) 58vw, 100vw"
          objectPosition="50% 42%"
        />
      ) : null}
      <div className="flex flex-1 flex-col gap-4 bg-bone p-6 text-right sm:p-8">
        <h2 className="font-display text-[24px] font-bold leading-[0.8] tracking-[0.05em] text-blueprint">
          {item.title}
        </h2>
        <div className="flex flex-1 flex-col gap-6 md:flex-row md:items-end md:justify-between">
          {item.body ? (
            <p className="max-w-[448px] font-sans text-[16px] leading-[1.56] tracking-[-0.01em] text-clay md:order-2">
              {item.body}
            </p>
          ) : null}
        {item.cta ? (
          <Link
            href="/catalog"
              className="inline-flex items-center gap-3 self-start font-sans text-[14px] font-bold tracking-[0.08em] text-purple underline underline-offset-2 focus-ring md:order-1"
          >
            {item.cta}
            <ArrowGlyph direction={arrowDirection} />
          </Link>
        ) : null}
        </div>
      </div>
    </article>
  );
}

export function FinishingPageDesign({ copy, lang }: { copy: FinishingCopy; lang: Lang }) {
  const arrowDirection = lang === "he" ? "right-to-left" : "left-to-right";

  return (
    <div className="bg-bone">
      <section className="mx-auto w-full max-w-[1152px] px-5 pb-[75px] pt-2 sm:px-8 lg:px-0">
        <div className="ml-auto flex w-full max-w-[672px] flex-col items-end text-right">
          <div className="mb-2 flex h-6 w-full items-center justify-end gap-4 text-magenta" dir="ltr">
            <span className="h-px w-24 bg-magenta" aria-hidden />
            <span className="font-sans text-[12px] font-extrabold uppercase leading-4 tracking-[0.08em]" dir={lang === "he" ? "rtl" : "ltr"}>
              {copy.feature.eyebrow}
            </span>
          </div>
          <h1 className="w-full font-display text-[64px] font-normal leading-none text-blueprint sm:text-[82px] md:text-[96px]">
            {copy.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-[672px] whitespace-pre-line font-sans text-[16px] leading-[1.56] tracking-[-0.01em] text-clay">
            {copy.intro}
          </p>
        </div>
      </section>

      <section
        className="mx-auto grid w-full max-w-[1152px] grid-cols-1 gap-6 px-5 pb-20 sm:px-8 md:px-12 lg:grid-cols-12 lg:px-0"
        dir="ltr"
      >
        <div className="lg:col-span-8" dir={lang === "he" ? "rtl" : "ltr"}>
          <FeatureCard item={copy.feature} arrowDirection={arrowDirection} />
        </div>

        <div className="grid gap-6 lg:col-span-4" dir={lang === "he" ? "rtl" : "ltr"}>
          <aside className="relative border border-blueprint bg-blueprint px-8 pb-[113px] pt-8 text-bone">
            <div className="mb-12 flex items-start justify-between gap-5">
              <h2 className="font-display text-[24px] font-bold leading-[0.8] tracking-[0.05em]">
                {copy.metricsTitle}
              </h2>
              <span className="text-cyan" aria-hidden>
                <svg viewBox="0 0 32 32" className="h-5 w-5 fill-current">
                  <path d="M16 2h4v7h7v4h-7v7h-4v-7H9V9h7V2Zm-8 18h4v4H8v-4Zm12 4h-4v-4h4v4Zm4-4h4v4h-4v-4Z" />
                </svg>
              </span>
            </div>
            <dl className="grid gap-6">
              {copy.metrics.map((metric) => (
                <div key={metric.label} className="flex items-start justify-between border-b border-bone/20 pb-[9px]">
                  <dd className="font-sans text-[12px] font-extrabold uppercase leading-4 tracking-[0.08em] text-cyan">
                    {metric.value}
                  </dd>
                  <dt className="font-sans text-[12px] font-extrabold uppercase leading-4 tracking-[0.08em] text-bone/60">
                    {metric.label}
                  </dt>
                </div>
              ))}
            </dl>
          </aside>

          <aside className="border border-blueprint bg-bone p-8">
            <blockquote className="font-sans text-[16px] font-normal leading-[1.56] tracking-[-0.01em] text-blueprint">
              {copy.quote}
            </blockquote>
            <div className="mt-6 flex items-center justify-end gap-2">
              <span className="font-sans text-[12px] font-extrabold uppercase leading-4 tracking-[0.08em] text-blueprint">
                {copy.quoteBy}
              </span>
              <span className="h-0.5 w-[105px] bg-purple" aria-hidden />
            </div>
          </aside>
        </div>

        <article className="overflow-hidden border border-blueprint bg-bone lg:col-span-5" dir={lang === "he" ? "rtl" : "ltr"}>
          {copy.deboss.image ? (
            <FinishImage
              src={copy.deboss.image}
              alt={copy.deboss.title}
              className="h-[360px] sm:h-[477px]"
              sizes="(min-width: 1024px) 37vw, 100vw"
              objectPosition="50% 50%"
            />
          ) : null}
          <div className="p-6 text-right sm:p-8">
            <p className="font-sans text-[12px] font-extrabold uppercase leading-4 tracking-[0.08em] text-purple">
              {copy.deboss.eyebrow}
            </p>
            <h2 className="mt-2 font-display text-[24px] font-bold leading-[0.8] tracking-[0.05em] text-blueprint">
              {copy.deboss.title}
            </h2>
            <p className="mt-4 font-sans text-[16px] leading-[1.56] tracking-[-0.01em] text-clay">
              {copy.deboss.body}
            </p>
          </div>
        </article>

        <article className="flex h-auto flex-col overflow-hidden border border-blueprint bg-[#f0f0f0] lg:col-span-7 lg:h-[535px]" dir={lang === "he" ? "rtl" : "ltr"}>
          <div className="mb-[-31px] p-8 text-right sm:p-12">
            <h2 className="whitespace-pre-line font-display text-[24px] font-bold leading-[0.8] tracking-[0.05em] text-magenta">
              {copy.texture.title}
            </h2>
            <p className="mt-4 max-w-[320px] font-sans text-[16px] font-normal leading-[1.56] tracking-[-0.01em] text-blueprint">
              {copy.texture.body}
            </p>
          </div>
          {copy.texture.image ? (
            <FinishImage
              src={copy.texture.image}
              alt={copy.texture.title}
              className="h-[349px] opacity-80 mix-blend-multiply"
              sizes="(min-width: 1024px) 54vw, 100vw"
              objectPosition="50% 35%"
            />
          ) : null}
        </article>
      </section>

      <section className="mx-auto w-full max-w-[1152px] px-5 pb-20 pt-0 sm:px-8 md:px-12 lg:px-0">
        <div className="flex flex-col gap-10 pt-0 md:flex-row md:items-center md:justify-between">
          <div className="max-w-[576px] text-right">
            <h2 className="font-sans text-[16px] font-normal leading-[1.56] tracking-[-0.01em] text-blueprint">
              {copy.ctaTitle}
            </h2>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <ContactTriggerButton
                className="inline-flex min-h-[56px] items-center justify-center border-2 border-blueprint bg-cyan px-[42px] py-[18px] font-sans text-[14px] font-bold leading-4 tracking-[0.08em] text-blueprint focus-ring"
              >
                {copy.ctaPrimary}
              </ContactTriggerButton>
              <Link
                href="/catalog"
                className="inline-flex min-h-[56px] items-center justify-center border border-blueprint px-[41px] py-[18px] font-sans text-[14px] font-bold leading-4 tracking-[0.08em] text-blueprint focus-ring"
              >
                {copy.ctaSecondary}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid aspect-square w-[129px] place-items-center border border-blueprint text-center">
              <div>
                <p className="font-display text-[24px] font-bold leading-[0.8] tracking-[0.05em] text-blueprint">
                  {copy.sampleCard.value}
                </p>
                <p className="mt-1 font-sans text-[12px] font-extrabold uppercase leading-4 tracking-[0.08em] text-magenta">
                  {copy.sampleCard.label}
                </p>
              </div>
            </div>
            <div className="grid aspect-square w-[129px] place-items-center bg-yellow text-center">
              <div>
                <p className="font-display text-[24px] font-bold leading-[0.8] tracking-[0.05em] text-white">
                  {copy.isoCard.value}
                </p>
                <p className="mt-1 font-sans text-[12px] font-extrabold uppercase leading-4 tracking-[0.08em] text-blueprint">
                  {copy.isoCard.label}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
