import Image from "next/image";
import { homeImages } from "@/app/content/home";
import type { HomeCopy, Lang } from "@/app/content/home";
import { ArrowRtl } from "./icons";

export function DualJourney({ lang, t }: { lang: Lang; t: HomeCopy }) {
  return (
    <section
      id="journey"
      className="bg-bone overflow-clip scroll-mt-[80px] flex flex-col pt-16 sm:pt-20 md:pt-24 lg:pt-10 xl:pt-12 pb-12 sm:pb-16 md:pb-20 lg:pb-10 xl:pb-12 lg:h-[calc(100svh-72px)] lg:min-h-[640px]"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-2 px-6 sm:px-8 md:px-2 items-end pb-8 sm:pb-10 lg:pb-6 xl:pb-8">
        <div className="flex flex-col gap-3 md:px-6 lg:px-[72px]">
          <span className="font-sans uppercase text-magenta text-[11px] sm:text-[12px] tracking-[0.08em] leading-4">
            {t.journeyEyebrow}
          </span>
          <h2 className="font-display text-ink text-[40px] sm:text-[44px] md:text-[48px] lg:text-[44px] xl:text-[50px] leading-[1.02] max-w-[535px]">
            {t.journeyTitle}
          </h2>
        </div>
        <p className="max-w-[535px] font-sans text-clay text-[16px] sm:text-[18px] md:text-[19px] lg:text-[18px] xl:text-[20px] leading-[1.5] md:px-6 lg:px-[72px]">
          {t.journeyDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 px-2 lg:flex-1 lg:min-h-0">
        <JourneyCard
          src={homeImages.journeyCustomer}
          tag={t.customerTag}
          tagColor="text-purple"
          title={t.customerTitle}
          theme="light"
          body={t.customerBody}
          link={t.customerLink}
          lang={lang}
          accent="purple"
        />
        <JourneyCard
          src={homeImages.journeyHeritage}
          tag={t.heritageTag}
          tagColor="text-yellow"
          title={t.heritageTitle}
          theme="dark"
          body={t.heritageBody}
          link={t.heritageLink}
          lang={lang}
          accent="yellow"
        />
      </div>
    </section>
  );
}

function JourneyCard({
  src,
  tag,
  tagColor,
  title,
  theme,
  body,
  link,
  lang,
  accent,
}: {
  src: string;
  tag: string;
  tagColor: string;
  title: string;
  theme: "dark" | "light";
  body: string;
  link: string;
  lang: Lang;
  accent: "purple" | "yellow";
}) {
  const isDark = theme === "dark";
  const accentBg = accent === "purple" ? "bg-purple" : "bg-yellow";
  return (
    <article className="group relative h-[440px] sm:h-[560px] md:h-[720px] lg:h-full lg:min-h-0 overflow-hidden cursor-pointer">
      <Image
        src={src}
        alt={title}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
      />
      <div
        className={`absolute inset-0 ${
          isDark ? "bg-ink/10" : "bg-[rgba(8,28,107,0.10)]"
        } transition-colors duration-700 group-hover:bg-transparent`}
      />
      <div
        className={`absolute inset-0 flex flex-col justify-end px-6 sm:px-10 md:px-12 lg:px-[72px] pb-12 sm:pb-16 md:pb-[80px] lg:pb-[100px] ${
          isDark
            ? "bg-gradient-to-t from-ink/90 via-ink/30 to-transparent"
            : "bg-gradient-to-t from-bone/96 via-bone/40 to-transparent"
        }`}
      >
        <div className="flex max-w-[456px] flex-col gap-2 text-start">
          <span
            className={`inline-flex items-center gap-2 font-sans uppercase text-[11px] sm:text-[12px] tracking-[0.08em] leading-4 ${tagColor}`}
          >
            <span
              aria-hidden
              className={`inline-block h-2 w-2 rounded-full ${accentBg} transition-transform duration-500 group-hover:scale-150`}
            />
            {tag}
          </span>
          <h3
            className={`font-display text-[36px] sm:text-[42px] md:text-[50px] leading-[1.05] pt-2 ${
              isDark ? "text-bone" : "text-ink"
            }`}
          >
            {title}
          </h3>
          <p
            className={`font-sans text-[14px] sm:text-[15px] md:text-[16px] leading-[1.6] tracking-[-0.16px] pt-3 sm:pt-4 ${
              isDark ? "text-bone/85" : "text-clay"
            }`}
          >
            {body}
          </p>
          <div className="pt-4 sm:pt-5 flex items-center gap-4">
            <span
              className={`relative font-sans font-bold uppercase text-[13px] sm:text-[14px] tracking-[0.08em] ${
                isDark ? "text-bone" : "text-ink"
              }`}
            >
              {link}
              <span
                aria-hidden
                className={`absolute left-0 right-0 -bottom-1 h-px transform origin-right scale-x-0 transition-transform duration-500 group-hover:scale-x-100 ${
                  isDark ? "bg-bone" : "bg-ink"
                }`}
              />
            </span>
            <ArrowRtl color={isDark ? "bone" : "ink"} lang={lang} />
          </div>
        </div>
      </div>
    </article>
  );
}
