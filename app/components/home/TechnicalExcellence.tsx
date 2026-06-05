import Image from "next/image";
import Link from "next/link";
import type { HomeCopy, Lang } from "@/app/content/home";
import { Badge } from "@/components/ui/badge";
import { ArrowOut, CardCornerArrow, DieCutIcon, LabIcon } from "./icons";

export function TechnicalExcellence({
  t,
  capabilities,
  bentoServiceImage,
}: {
  lang: Lang;
  t: HomeCopy;
  capabilities: readonly { n: string; title: string; body: string }[];
  bentoServiceImage: string;
}) {
  return (
    <section
      id="excellence"
      className="bg-bone pt-16 sm:pt-20 md:pt-24 lg:pt-[88px] xl:pt-[112px] pb-16 sm:pb-20 md:pb-24 lg:pb-[88px] xl:pb-[105px] scroll-mt-[80px]"
    >
      <div className="mx-auto w-full max-w-[1264px] px-6 sm:px-8 md:px-12 lg:ps-[64px] lg:pe-[79px] flex flex-col gap-10 md:gap-12 lg:gap-[46px]">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,452px)] gap-10 lg:gap-[140px] xl:gap-[170px] lg:items-center">
          <div className="flex flex-col gap-6 lg:gap-8 lg:items-start">
            <h2 className="font-display text-logo-dark text-[44px] sm:text-[64px] lg:text-[80px] xl:text-[96px] leading-[1] text-balance max-w-[493px] text-start">
              {t.techTitle}
            </h2>
            <p className="font-sans text-clay text-lead leading-[25px] max-w-[576px] text-start text-pretty">
              {t.techBody}
            </p>
          </div>

          <ul className="flex flex-col w-full max-w-[452px]">
            {capabilities.map((c) => (
                <li
                  key={c.n}
                  className="group flex items-center justify-end gap-8 sm:gap-16 md:gap-[80px] lg:gap-[110px] border-b border-rule pb-px transition-colors duration-300 hover:border-ink"
                >
                  <span className="font-display text-magenta text-[72px] sm:text-[88px] md:text-[96px] leading-[38px] tabular-nums shrink-0 w-[59px] text-end transition-colors duration-300 group-hover:text-ink py-3">
                    {c.n}
                  </span>
                  <div className="flex flex-col gap-1 text-start w-[262px] max-w-full py-3">
                    <h3 className="font-display text-ink text-[22px] sm:text-[24px] leading-[1.05] tracking-[0.04em]">
                      {c.title}
                    </h3>
                    <p className="font-sans text-clay text-[16px] leading-[25px] tracking-[-0.16px]">
                      {c.body}
                    </p>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        {/* Bento grid — 12-col, 800px tall on desktop. */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 md:h-[640px] lg:h-[760px] xl:h-[800px]">
          {/* Stacked cards column — DOM-first so it lands on the RTL start
              (right) side, matching Figma. */}
          <div className="md:col-span-5 grid grid-rows-[402fr_366fr] gap-6 md:gap-8 h-full min-h-[640px] md:min-h-0">
            <Link
              href="/finishing"
              className="group relative overflow-hidden bg-purple border border-bone-line p-8 sm:p-10 md:p-10 lg:p-[40px] xl:p-[49px] flex flex-col items-start justify-between text-start cursor-pointer focus-ring transition-[box-shadow,transform] duration-500 hover:shadow-[0_30px_60px_-20px_rgba(111,80,166,0.5)] hover:-translate-y-0.5"
            >
              <span
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(120%_120%_at_0%_100%,_rgba(255,212,0,0.18)_0%,_transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="relative z-10 text-cyan transition-transform duration-500 group-hover:-translate-y-1">
                <DieCutIcon />
              </div>
              <div className="relative z-10 flex flex-col gap-4 w-full">
                <h3 className="font-display text-bone text-[40px] sm:text-[48px] md:text-[56px] lg:text-[64px] leading-[normal] w-full text-start">
                  {t.bento1Title}
                </h3>
                <p className="font-sans text-yellow-cream text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px] leading-[25px] w-full text-start">
                  {t.bento1Body}
                </p>
              </div>
              <span
                aria-hidden
                className="absolute top-6 end-6 sm:top-8 sm:end-8 inline-flex h-9 w-9 items-center justify-center rounded-full bg-bone/0 text-bone opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:bg-bone/15 group-hover:-translate-y-1 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
              >
                <CardCornerArrow />
              </span>
              <span
                aria-hidden
                className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full bg-[radial-gradient(circle,_rgba(255,212,0,0.18)_0%,_transparent_70%)] transition-transform duration-700 group-hover:scale-150"
              />
            </Link>

            <Link
              href="/finishing"
              className="group relative overflow-hidden bg-ink p-8 sm:p-10 md:p-10 lg:p-[40px] xl:p-[48px] flex flex-col items-start justify-between text-start cursor-pointer focus-ring transition-[box-shadow,transform] duration-500 hover:shadow-[0_30px_60px_-20px_rgba(0,255,255,0.25)] hover:-translate-y-0.5"
            >
              <span
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(120%_120%_at_100%_0%,_rgba(0,255,255,0.18)_0%,_transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="relative z-10 flex items-start justify-between w-full text-bone">
                <div className="transition-transform duration-500 group-hover:rotate-[-6deg]">
                  <LabIcon />
                </div>
                <span className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">
                  <ArrowOut />
                </span>
              </div>
              <div className="relative z-10 flex flex-col gap-4 w-full">
                <h3 className="font-display text-bone text-[40px] sm:text-[48px] md:text-[56px] lg:text-[64px] leading-[normal] w-full text-start">
                  {t.bento2Title}
                </h3>
                <p className="font-sans text-bone/70 text-[16px] sm:text-[17px] md:text-[18px] lg:text-[20px] leading-[25px] max-w-[346px] text-start">
                  {t.bento2Body}
                </p>
              </div>
            </Link>
          </div>

          <Link
            href="/catalog"
            className="md:col-span-7 relative bg-sand overflow-hidden aspect-[4/3] sm:aspect-[16/10] md:aspect-auto md:h-auto group block cursor-pointer focus-ring"
          >
            <Image
              src={bentoServiceImage}
              alt={t.bento1Title}
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover brightness-[0.82] transition-transform duration-[1400ms] ease-out group-hover:scale-105"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-tr from-ink/40 via-ink/0 to-ink/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
            <span
              aria-hidden
              className="absolute bottom-6 start-6 sm:bottom-8 sm:start-8 inline-flex h-10 w-10 items-center justify-center rounded-full bg-bone text-ink opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
            >
              <CardCornerArrow />
            </span>
            <div className="absolute top-4 sm:top-6 md:top-8 inset-x-4 sm:inset-x-6 md:inset-x-auto md:start-auto md:end-[49px] flex flex-wrap gap-[12px] md:gap-[25px] justify-end">
              <Badge variant="yellow">{t.badge1}</Badge>
              <Badge variant="cyan">{t.badge2}</Badge>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
