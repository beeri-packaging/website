import Image from "next/image";
import Link from "next/link";
import type { HomeCopy, Lang } from "@/app/content/home";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/eyebrow";
import { buttonVariants } from "@/components/ui/button";
import { ArrowGlyph } from "./icons";

export function Hero({ lang, t, heroImage }: { lang: Lang; t: HomeCopy; heroImage: string }) {
  return (
    <section
      className="relative flex min-h-[560px] sm:min-h-[680px] md:min-h-[760px] lg:min-h-0 lg:h-[100svh] items-center justify-center overflow-clip pt-[80px] sm:pt-[96px] md:pt-[112px] pb-12 sm:pb-20 md:pb-24"
      aria-label={t.h1.join(" ")}
    >
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover scale-[1.04] motion-safe:transition-transform motion-safe:duration-[3000ms] motion-safe:ease-out"
        />
        <div className="absolute inset-x-0 bottom-0 h-[260px] sm:h-[340px] md:h-[420px] bg-gradient-to-t from-bone via-bone/70 to-transparent" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-8 lg:left-16 hidden lg:block w-px bg-gradient-to-b from-transparent via-ink/10 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-8 lg:right-16 hidden lg:block w-px bg-gradient-to-b from-transparent via-ink/10 to-transparent" />

      <div className="relative flex flex-col items-center gap-4 sm:gap-6 text-center px-5 sm:px-6 max-w-[742px] w-full">
        <Eyebrow className="animate-rise">{t.eyebrow}</Eyebrow>

        <h1
          className="font-display font-bold text-ink leading-[0.82] sm:leading-[0.74] md:leading-[0.7] animate-rise"
          style={{
            animationDelay: "120ms",
            fontSize: "clamp(48px, 13.5vw, 128px)",
          }}
        >
          <span className="block">{t.h1[0]}</span>
          <span className="block">{t.h1[1]}</span>
        </h1>

        <div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 w-full sm:w-auto animate-rise"
          style={{ animationDelay: "240ms" }}
        >
          <Link
            href="#cta"
            className={cn(buttonVariants({ variant: "primary", size: "md" }), "group")}
          >
            {t.cta1}
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1"
            >
              <ArrowGlyph
                direction={lang === "he" ? "right-to-left" : "left-to-right"}
              />
            </span>
          </Link>
          <Link
            href="#journey"
            className={cn(buttonVariants({ variant: "secondary", size: "md" }))}
          >
            {t.cta2}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-6 sm:bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-4 opacity-50">
        <span className="font-sans text-ink text-[11px] tracking-[0.08em] uppercase">
          {t.scroll}
        </span>
        <span className="block h-14 w-px bg-gradient-to-b from-ink to-transparent relative overflow-hidden">
          <span className="block h-full w-px bg-ink animate-scroll-hint" />
        </span>
      </div>
    </section>
  );
}
