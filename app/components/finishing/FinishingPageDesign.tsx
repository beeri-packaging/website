import Image from "next/image";
import Link from "next/link";
import type { FinishingCopy, FinishingGridItem } from "@/app/content/finishing";
import type { Lang } from "@/app/content/home";
import { PrecisionArmIcon } from "@/app/components/home/icons";
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

function FeatureCard({ item, lang }: { item: FinishingGridItem; lang: Lang }) {
  return (
    <article className="relative flex h-full flex-col overflow-hidden border border-blueprint bg-bone">
      {item.sample ? (
        <div className="absolute left-px top-px z-10 flex items-start">
          <span className="bg-yellow px-4 py-1 font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-blueprint">
            {item.sample}
          </span>
          <span className="h-0 w-0 border-y-[12px] border-l-[15px] border-y-transparent border-l-yellow" aria-hidden />
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
      <div className="flex flex-1 flex-col gap-4 bg-bone p-6 text-start sm:p-8">
        <h2 className="font-display text-[24px] font-bold leading-[0.8] tracking-[0.05em] text-blueprint">
          {item.title}
        </h2>
        <div className="flex flex-1 flex-col gap-6 md:flex-row md:items-end md:justify-between">
          {item.body ? (
            <p className="max-w-[448px] font-sans text-[16px] leading-[1.56] tracking-[-0.01em] text-clay md:order-1">
              {item.body}
            </p>
          ) : null}
        {item.cta ? (
          <Link
            href={`/${lang}/catalog`}
              className="inline-flex items-center self-start font-sans text-[14px] font-bold tracking-[0.08em] text-purple underline underline-offset-2 focus-ring md:order-2 md:self-end"
          >
            {item.cta}
          </Link>
        ) : null}
        </div>
      </div>
    </article>
  );
}

export function FinishingPageDesign({ copy, lang }: { copy: FinishingCopy; lang: Lang }) {
  return (
    <div className="bg-bone">
      <section className="mx-auto w-full max-w-[1152px] px-5 pb-[75px] pt-2 sm:px-8 lg:px-0">
        <div className="me-auto flex w-full max-w-[672px] flex-col items-end text-start">
          <div className="mb-2 flex h-6 w-full items-center justify-end gap-4 text-magenta-deep" dir="ltr">
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
        id="capabilities"
        className="mx-auto grid w-full max-w-[1152px] grid-cols-1 gap-6 px-5 pb-20 sm:px-8 md:px-12 lg:grid-cols-12 lg:px-0 scroll-mt-[80px]"
        dir="ltr"
      >
        <div className="reveal lg:col-span-8" dir={lang === "he" ? "rtl" : "ltr"}>
          <FeatureCard item={copy.feature} lang={lang} />
        </div>

        <div className="reveal grid gap-6 lg:col-span-4" dir={lang === "he" ? "rtl" : "ltr"}>
          <aside className="relative border border-blueprint bg-blueprint px-8 pb-[113px] pt-8 text-start text-bone" dir="ltr">
            <div className="mb-12 flex items-start justify-between gap-5">
              <h2 className="font-display text-[24px] font-bold leading-[0.8] tracking-[0.05em]">
                {copy.metricsTitle}
              </h2>
              <span className="text-cyan" aria-hidden>
                <PrecisionArmIcon />
              </span>
            </div>
            <dl className="grid gap-6" dir={lang === "he" ? "rtl" : "ltr"}>
              {copy.metrics.map((metric) => (
                <div key={metric.label} className="flex items-start justify-between gap-4 border-b border-bone/20 pb-[9px]">
                  <dt className="font-sans text-[12px] font-extrabold uppercase leading-4 tracking-[0.08em] text-bone/60">
                    {metric.label}
                  </dt>
                  <dd className="font-sans text-[12px] font-extrabold uppercase leading-4 tracking-[0.08em] text-cyan">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>

          <aside className="border border-blueprint bg-bone p-[33px]">
            <blockquote className="me-auto max-w-[274px] font-sans text-[16px] font-normal leading-[1.56] tracking-[-0.01em] text-blueprint">
              {copy.quote}
            </blockquote>
            <div className="mt-6 flex items-center justify-start gap-2">
              <span className="font-sans text-[12px] font-extrabold uppercase leading-4 tracking-[0.08em] text-blueprint">
                {copy.quoteBy}
              </span>
              <span className="h-0.5 w-[105px] bg-purple" aria-hidden />
            </div>
          </aside>
        </div>

        <article className="reveal flex flex-col overflow-hidden border border-blueprint bg-bone lg:col-span-5 lg:h-[535px]" dir={lang === "he" ? "rtl" : "ltr"}>
          {copy.deboss.image ? (
            <FinishImage
              src={copy.deboss.image}
              alt={copy.deboss.title}
              className="h-[360px] sm:h-[477px] lg:h-auto lg:min-h-0 lg:flex-1"
              sizes="(min-width: 1024px) 37vw, 100vw"
              objectPosition="62% 47%"
            />
          ) : null}
          <div className="p-8 text-start">
            <p className="font-sans text-[12px] font-extrabold uppercase leading-4 tracking-[0.08em] text-purple">
              {copy.deboss.eyebrow}
            </p>
            <h2 className="mt-2 font-display text-[24px] font-bold leading-[0.9] tracking-[0.05em] text-blueprint">
              {copy.deboss.title}
            </h2>
            <p className="mt-4 whitespace-pre-line font-sans text-[16px] leading-[1.56] tracking-[-0.01em] text-clay">
              {copy.deboss.body}
            </p>
          </div>
        </article>

        <article className="reveal flex h-auto flex-col overflow-hidden border border-blueprint bg-[#f0f0f0] lg:col-span-7 lg:h-[535px]" dir={lang === "he" ? "rtl" : "ltr"}>
          <div className="mb-[-31px] p-8 text-start sm:p-12">
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
              objectPosition="52% 65%"
            />
          ) : null}
        </article>
      </section>

      <section className="mx-auto w-full max-w-[1152px] px-5 pb-20 pt-0 sm:px-8 md:px-12 lg:px-0">
        <div className="flex flex-col gap-10 pt-0 md:flex-row md:items-center md:justify-between">
          <div className="reveal max-w-[576px] text-start">
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

          <div className="reveal grid grid-cols-2 gap-4">
            <div className="grid aspect-square w-[129px] place-items-center border border-blueprint text-center">
              <div>
                <p className="font-display text-[24px] font-bold leading-[0.8] tracking-[0.05em] text-blueprint">
                  {copy.sampleCard.value}
                </p>
                <p className="mt-1 font-sans text-[12px] font-extrabold uppercase leading-4 tracking-[0.08em] text-magenta-deep">
                  {copy.sampleCard.label}
                </p>
              </div>
            </div>
            <div className="grid aspect-square w-[129px] place-items-center bg-yellow text-center">
              <div>
                <p className="font-display text-[24px] font-bold leading-[0.8] tracking-[0.05em] text-blueprint">
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
