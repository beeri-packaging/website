import Image from "next/image";
import Link from "next/link";
import type { HomeCopy, Lang } from "@/app/content/home";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/eyebrow";
import { buttonVariants } from "@/components/ui/button";
import { ContactLink } from "./ContactLink";
import { HeroVideo } from "./HeroVideo";
import { ArrowGlyph } from "./icons";

export function Hero({
  lang,
  t,
  heroImage,
  heroVideo,
}: {
  lang: Lang;
  t: HomeCopy;
  heroImage: string;
  heroVideo?: string;
}) {
  return (
    <section
      className="relative flex min-h-[100svh] sm:min-h-[680px] md:min-h-[760px] lg:min-h-0 lg:h-[100svh] items-center justify-center overflow-clip pt-[80px] sm:pt-[96px] md:pt-[112px] pb-12 sm:pb-20 md:pb-24"
      aria-label={t.h1.join(" ")}
    >
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src={heroImage}
          alt=""
          fill
          sizes="(max-width: 767px) 80vw, 100vw"
          quality={60}
          className="hidden md:block object-cover scale-[1.04] motion-safe:transition-transform motion-safe:duration-[3000ms] motion-safe:ease-out"
        />
        {/* Background video (desktop only), with its own pause control. The
            Image above stays the LCP + poster; the video fades over it once it
            buffers. Removed entirely under reduced motion (see .hero-video). */}
        {heroVideo ? (
          <HeroVideo lang={lang} src={heroVideo} poster={heroImage} />
        ) : null}
        {/* Legibility scrim — a soft bone glow seated behind the centred
            headline so the dark type always has a light bed over busy footage,
            while the video stays crisp toward the edges. */}
        {heroVideo ? (
          <div
            aria-hidden
            className="hidden md:block absolute inset-0 bg-[radial-gradient(70%_62%_at_50%_43%,rgba(251,249,246,0.88)_0%,rgba(251,249,246,0.55)_38%,rgba(251,249,246,0.24)_72%,rgba(251,249,246,0.24)_100%)]"
          />
        ) : null}
        <div className="hidden md:block absolute inset-x-0 bottom-0 h-[260px] sm:h-[340px] md:h-[420px] bg-gradient-to-t from-bone via-bone/70 to-transparent" />
        <div
          aria-hidden
          className="hidden md:block absolute inset-0 opacity-[0.05] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-8 lg:left-16 hidden lg:block w-px bg-gradient-to-b from-transparent via-ink/10 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-8 lg:right-16 hidden lg:block w-px bg-gradient-to-b from-transparent via-ink/10 to-transparent" />

      <div className="relative flex flex-col items-center gap-4 sm:gap-6 text-center px-5 sm:px-6 max-w-[742px] w-full">
        <Eyebrow>{t.eyebrow}</Eyebrow>

        <h1
          className="font-sans md:font-display font-extrabold md:font-bold text-ink leading-[0.92] sm:leading-[0.82] md:leading-[0.7]"
          style={{
            fontSize: "clamp(42px, 11.5vw, 128px)",
          }}
        >
          <span className="block">{t.h1[0]}</span>
          <span className="block">{t.h1[1]}</span>
        </h1>

        <div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 w-full sm:w-auto"
        >
          <ContactLink
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
          </ContactLink>
          <Link
            href="#excellence"
            prefetch={false}
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
