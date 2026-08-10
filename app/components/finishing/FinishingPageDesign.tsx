import Image from "next/image";
import Link from "next/link";
import type { FinishingCopy, FinishingGridItem } from "@/app/content/finishing";
import type { Lang } from "@/app/content/home";
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
        <div className="absolute start-0 top-0 z-10 flex items-start">
          <span className="bg-yellow px-4 py-1 font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-blueprint">
            {item.sample}
          </span>
          {/* Pennant tail. The colour sits on the inline-start border so the apex
              points away from the label in both directions — right in LTR, left in RTL.
              border-y is half the label's 26px so the tail is flush top and bottom. */}
          <span className="h-0 w-0 border-y-[13px] border-s-[15px] border-y-transparent border-s-yellow" aria-hidden />
        </div>
      ) : null}
      {item.image ? (
        <FinishImage
          src={item.image}
          alt={item.title}
          // Full-bleed since the capabilities/quote column was removed — the wider
          // ratio on lg keeps the image at its previous height instead of 16:9 of 1152px.
          className="aspect-video lg:aspect-[11/4]"
          sizes="(min-width: 1152px) 1152px, 100vw"
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
        <div className="reveal lg:col-span-12" dir={lang === "he" ? "rtl" : "ltr"}>
          <FeatureCard item={copy.feature} lang={lang} />
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

      <section id="standards" className="border-y border-blueprint bg-sand scroll-mt-[80px]">
        <div className="mx-auto grid w-full max-w-[1152px] gap-10 px-5 py-16 sm:px-8 md:px-12 md:py-20 lg:grid-cols-12 lg:gap-12 lg:px-0">
          <div className="reveal text-start lg:col-span-4">
            <div className="mb-3 flex items-center gap-3 text-magenta-deep">
              <span className="h-px w-12 bg-magenta" aria-hidden />
              <span className="font-sans text-[12px] font-extrabold uppercase tracking-[0.08em]">
                {copy.standardsEyebrow}
              </span>
            </div>
            <h2 className="font-display text-[40px] leading-[0.92] text-blueprint sm:text-[52px] lg:text-[60px]">
              {copy.standardsTitle}
            </h2>
            <p className="mt-5 max-w-[420px] font-sans text-[15px] leading-[1.7] text-clay sm:text-[16px]">
              {copy.standardsBody}
            </p>
          </div>

          <ol className="grid gap-5 sm:grid-cols-3 lg:col-span-8">
            {copy.standards.map((standard) => {
              const essential = standard.tone === "essential";
              return (
                <li key={standard.code} className="compliance-item reveal group min-w-0">
                  <article className="flex h-full flex-col">
                    <div
                      className={`certificate-sheet relative aspect-[3/4] overflow-hidden border border-blueprint transition-transform duration-500 ease-out group-hover:-translate-y-1.5 ${
                        essential ? "bg-yellow" : "bg-bone"
                      }`}
                    >
                      {standard.image ? (
                        <Image
                          src={standard.image}
                          alt={`${standard.code} — ${standard.title}`}
                          fill
                          sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 100vw"
                          className="object-contain p-3"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col p-5" aria-hidden>
                          <div className="flex items-start justify-between border-b border-blueprint/35 pb-3">
                            <span className="font-sans text-[9px] font-extrabold uppercase tracking-[0.12em] text-blueprint/65">
                              Beeri Packaging
                            </span>
                            <span className="h-4 w-4 border-e border-t border-blueprint/50" />
                          </div>
                          <div className="flex flex-1 flex-col items-center justify-center text-center">
                            <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-blueprint text-[28px] font-bold text-blueprint transition-transform duration-500 group-hover:rotate-[-6deg]">
                              ✓
                            </span>
                            <span className="mt-5 font-display text-[22px] leading-[0.9] text-blueprint">
                              {standard.code}
                            </span>
                            <span className="mt-3 h-px w-16 bg-blueprint/35" />
                          </div>
                          <div className="space-y-1.5 border-t border-blueprint/35 pt-3">
                            <span className="block h-px w-full bg-blueprint/25" />
                            <span className="block h-px w-3/4 bg-blueprint/25" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col border-t-2 border-blueprint pt-4 text-start">
                      <p className={`font-sans text-[11px] font-extrabold uppercase tracking-[0.08em] ${essential ? "text-magenta-deep" : "text-teal"}`}>
                        {standard.code}
                      </p>
                      <h3 className="mt-2 font-display text-[24px] leading-[0.9] text-blueprint">
                        {standard.title}
                      </h3>
                      <p className="mt-3 font-sans text-[14px] leading-[1.55] text-clay">
                        {standard.body}
                      </p>
                      {!standard.image ? (
                        <p className="mt-4 border-t border-rule pt-3 font-sans text-[10px] font-bold uppercase tracking-[0.06em] text-clay/65">
                          {standard.certificateLabel}
                        </p>
                      ) : null}
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1152px] px-5 pb-20 pt-0 sm:px-8 md:px-12 lg:px-0">
        <div className="flex flex-col gap-10 pt-16 md:pt-20">
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
        </div>
      </section>
    </div>
  );
}
