import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Portfolio", href: "#portfolio" },
  { label: "Enhancements", href: "#enhancements" },
  { label: "Careers", href: "#careers" },
  { label: "Catalog", href: "#catalog" },
];

const capabilities = [
  {
    n: "01",
    title: "Material Curation",
    body: "Global sourcing of sustainable premium fibers.",
  },
  {
    n: "02",
    title: "Structural Lab",
    body: "Precision stress-testing and architecture.",
  },
  {
    n: "03",
    title: "Digital Integration",
    body: "NFC and AR embedded structural components.",
  },
];

export default function Home() {
  return (
    <div className="relative flex flex-col bg-bone text-ink overflow-x-clip">
      <Header />
      <main className="flex flex-col">
        <Hero />
        <DualJourney />
        <TechnicalExcellence />
        <CallToAction />
      </main>
      <Footer />
      <StickyContact />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md bg-bone/80 border-b border-bone-line">
      <nav className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 md:px-16 py-6 md:py-8">
        <Link
          href="/"
          className="font-display text-2xl md:text-[32px] tracking-[-0.05em] leading-none text-ink"
        >
          BEERI
        </Link>
        <ul className="hidden md:flex items-center gap-12">
          {navLinks.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                className="text-[16px] tracking-[0.1em] uppercase text-clay hover:text-ink transition-colors duration-300"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="#contact"
          className="hidden md:inline-flex items-center justify-center bg-ink text-bone px-8 py-3 text-[12px] font-semibold tracking-[0.1em] uppercase hover:bg-ink/90 transition-colors duration-300"
        >
          Contact Us
        </Link>
      </nav>
    </header>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative flex h-[939px] items-center justify-center overflow-clip pt-20">
      {/* Backdrop image — desaturated, low opacity */}
      <div className="absolute inset-x-16 inset-y-10 opacity-20 pointer-events-none">
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src="/images/home/hero-bg.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover hero-desaturate"
          />
        </div>
      </div>

      {/* Vertical decorative rules */}
      <div className="pointer-events-none absolute inset-y-0 left-16 hidden lg:block w-px bg-gradient-to-b from-transparent via-ink/10 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-16 hidden lg:block w-px bg-gradient-to-b from-transparent via-ink/10 to-transparent" />

      {/* Content */}
      <div className="relative flex max-w-[896px] flex-col items-center gap-6 px-8 md:px-16 text-center">
        <div className="inline-flex items-start justify-center bg-cyan px-3 py-1 animate-rise">
          <span className="font-sans font-semibold uppercase text-cyan-deep text-[12px] tracking-[0.2em] leading-4">
            Est. 1924 — Architectural Packaging
          </span>
        </div>

        <h1
          className="font-display font-bold text-ink text-[56px] md:text-[84px] leading-[0.95] tracking-[-0.02em] animate-rise"
          style={{ animationDelay: "120ms" }}
        >
          <span className="block">Precision Meets</span>
          <span className="block italic font-medium">Heritage</span>
        </h1>

        <div
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-6 animate-rise"
          style={{ animationDelay: "240ms" }}
        >
          <Link
            href="#start"
            className="group inline-flex items-center justify-center bg-ink border border-ink text-bone px-10 py-5 text-[12px] font-semibold tracking-[0.1em] uppercase hover:bg-bone hover:text-ink transition-colors duration-300"
          >
            Start Your Journey
          </Link>
          <Link
            href="#philosophy"
            className="inline-flex items-center justify-center border border-ink text-ink px-10 py-5 text-[12px] font-semibold tracking-[0.1em] uppercase hover:bg-ink hover:text-bone transition-colors duration-300"
          >
            View Philosophy
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50">
        <span className="font-sans font-semibold uppercase text-ink text-[12px] tracking-[0.3em]">
          Scroll to Explore
        </span>
        <span className="block h-16 w-px bg-gradient-to-b from-ink to-transparent">
          <span className="block h-full w-px bg-ink animate-scroll-hint" />
        </span>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */

function DualJourney() {
  return (
    <section className="bg-bone py-32 md:py-40 overflow-clip">
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8 flex flex-col gap-4">
            <span className="font-sans font-semibold uppercase text-teal text-[12px] tracking-[0.1em] leading-4">
              The Dual Journey
            </span>
            <h2 className="font-display font-medium text-ink text-[40px] md:text-[48px] leading-[1.15] tracking-[-0.01em]">
              <span className="block">A Parallel Vision of</span>
              <span className="block italic">Excellence</span>
            </h2>
          </div>
          <p className="md:col-span-4 max-w-sm md:ml-auto md:text-right font-serif text-clay text-[16px] leading-6">
            Tracing our century-old legacy alongside the modern evolution
            of our clients&apos; visions.
          </p>
        </div>
      </div>

      {/* Two-card split */}
      <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-2 gap-2 px-2">
        <JourneyCard
          src="/images/home/heritage.png"
          tag="1924 — Legacy"
          tagColor="text-gold"
          title="Beeri Heritage"
          theme="dark"
          body="Four generations of structural mastery. We don't just fold paper; we engineer lasting monuments to your brand's physical presence."
          link="Explore Archive"
        />
        <JourneyCard
          src="/images/home/customer-path.png"
          tag="2024 — Innovation"
          tagColor="text-teal"
          title="Customer Path"
          theme="light"
          body="From digital prototype to physical masterpiece. Your vision, translated through our precision-engineered structural ecosystem."
          link="Start Designing"
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
}: {
  src: string;
  tag: string;
  tagColor: string;
  title: string;
  theme: "dark" | "light";
  body: string;
  link: string;
}) {
  const isDark = theme === "dark";
  return (
    <article className="group relative h-[600px] md:h-[820px] overflow-hidden">
      <Image
        src={src}
        alt={title}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
      />
      {isDark && <div className="absolute inset-0 bg-ink/10" />}
      {!isDark && <div className="absolute inset-0 bg-cyan/5" />}
      <div
        className={`absolute inset-0 flex flex-col justify-end p-8 md:p-16 ${
          isDark
            ? "bg-gradient-to-t from-ink/70 via-ink/20 to-transparent"
            : "bg-gradient-to-t from-bone/70 via-bone/20 to-transparent"
        }`}
      >
        <div className="flex max-w-md flex-col gap-4">
          <span
            className={`font-sans font-semibold uppercase text-[12px] tracking-[0.1em] leading-4 ${tagColor}`}
          >
            {tag}
          </span>
          <h3
            className={`font-display text-[32px] leading-10 ${
              isDark ? "text-bone" : "text-ink"
            }`}
          >
            {title}
          </h3>
          <p
            className={`font-serif text-[16px] leading-6 pt-1 ${
              isDark ? "text-bone/80" : "text-clay"
            }`}
          >
            {body}
          </p>
          <div className="pt-4 flex items-center gap-4">
            <span
              className={`font-sans uppercase text-[16px] tracking-[0.1em] ${
                isDark ? "text-bone" : "text-ink"
              }`}
            >
              {link}
            </span>
            <ArrowRight color={isDark ? "bone" : "ink"} />
          </div>
        </div>
      </div>
    </article>
  );
}

function ArrowRight({ color }: { color: "bone" | "ink" }) {
  const stroke = color === "bone" ? "#fbf9f6" : "#1b1c1a";
  return (
    <svg
      width="24"
      height="12"
      viewBox="0 0 16 12"
      fill="none"
      className="transition-transform duration-300 group-hover:translate-x-1"
    >
      <path
        d="M0 6h14M9 1l5 5-5 5"
        stroke={stroke}
        strokeWidth="1.25"
        strokeLinecap="square"
      />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */

function TechnicalExcellence() {
  return (
    <section className="bg-bone py-32 md:py-40">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-16 flex flex-col gap-24">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
          <div className="max-w-xl flex flex-col gap-8">
            <h2 className="font-display italic font-medium text-ink text-[40px] md:text-[48px] leading-[1.15] tracking-[-0.01em]">
              <span className="block">Where logic meets</span>
              <span className="block">aesthetics.</span>
            </h2>
            <p className="font-serif text-clay text-[16px] leading-[1.625]">
              Our studio operates at the intersection of industrial
              engineering and high-fashion sensibility. Every score, every
              bleed, and every grain direction is meticulously calculated to
              ensure the structural integrity of your luxury narrative.
            </p>
          </div>

          <ul className="w-full max-w-md flex flex-col gap-8">
            {capabilities.map((c) => (
              <li
                key={c.n}
                className="flex items-center gap-6 pb-6 border-b border-rule"
              >
                <span className="font-sans text-cyan text-[32px] leading-none tabular-nums">
                  {c.n}
                </span>
                <div className="flex flex-col gap-1">
                  <h4 className="font-sans uppercase text-ink text-[16px] tracking-[0.1em] leading-6">
                    {c.title}
                  </h4>
                  <p className="font-serif text-clay text-[14px] leading-5">
                    {c.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:h-[800px]">
          {/* Large left card */}
          <div className="md:col-span-7 relative bg-sand overflow-hidden h-[480px] md:h-auto">
            <Image
              src="/images/home/service-1.png"
              alt="Structural Engineering"
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover"
            />
            {/* Material badges */}
            <div className="absolute top-8 right-8 flex gap-2">
              <Badge variant="gold">350 GSM</Badge>
              <Badge variant="cyan">100% Recyclable</Badge>
            </div>
            <div className="absolute bottom-10 left-10">
              <div className="bg-bone/95 px-6 py-4">
                <h3 className="font-display text-ink text-[28px] md:text-[32px] leading-10">
                  Structural Engineering
                </h3>
              </div>
            </div>
          </div>

          {/* Right column: two stacked cards */}
          <div className="md:col-span-5 grid grid-rows-2 gap-8">
            <BentoCard
              theme="light"
              icon={
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect
                    x="4"
                    y="4"
                    width="20"
                    height="20"
                    stroke="#1b1c1a"
                    strokeWidth="1"
                  />
                  <path
                    d="M4 14h20M14 4v20"
                    stroke="#1b1c1a"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                  />
                  <circle cx="14" cy="14" r="2" fill="#1b1c1a" />
                </svg>
              }
              title="Precision Die-Cutting"
              body="Micron-level accuracy for complex luxury closures and sensory unboxing experiences."
            />
            <BentoCard
              theme="dark"
              icon={
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path
                    d="M9 4v9l-4 6a3 3 0 002.5 4.5h13a3 3 0 002.5-4.5l-4-6V4M7 4h14"
                    stroke="#fbf9f6"
                    strokeWidth="1"
                    strokeLinecap="square"
                  />
                  <circle cx="14" cy="18" r="1.5" fill="#00fbfb" />
                </svg>
              }
              cornerIcon={
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path
                    d="M3 12L12 3M12 3H5M12 3v7"
                    stroke="#fbf9f6"
                    strokeWidth="1"
                    strokeLinecap="square"
                  />
                </svg>
              }
              title="R&D Lab"
              body="Exploring the future of tactile luxury through innovative fiber science and sustainable coatings."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "gold" | "cyan";
}) {
  const styles =
    variant === "gold"
      ? "bg-gold text-gold-deep"
      : "bg-cyan text-cyan-deep";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-[10px] uppercase font-sans tracking-[0.08em] leading-[15px] ${styles}`}
    >
      {children}
    </span>
  );
}

function BentoCard({
  theme,
  icon,
  cornerIcon,
  title,
  body,
}: {
  theme: "light" | "dark";
  icon: React.ReactNode;
  cornerIcon?: React.ReactNode;
  title: string;
  body: string;
}) {
  const isDark = theme === "dark";
  return (
    <div
      className={`relative flex flex-col items-start justify-between p-10 md:p-12 ${
        isDark
          ? "bg-ink text-bone"
          : "bg-white text-ink border border-bone-line"
      }`}
    >
      <div className="flex w-full items-start justify-between">
        <div>{icon}</div>
        {cornerIcon && <div>{cornerIcon}</div>}
      </div>
      <div className="flex flex-col gap-4 mt-8">
        <h4 className="font-display text-[28px] md:text-[32px] leading-10">
          {title}
        </h4>
        <p
          className={`font-serif text-[16px] leading-6 ${
            isDark ? "text-bone/70" : "text-clay"
          }`}
        >
          {body}
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */

function CallToAction() {
  return (
    <section className="bg-gold py-24">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-16 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
        <h2 className="max-w-xl font-display font-medium text-gold-deep text-[40px] md:text-[48px] leading-[1.15] tracking-[-0.01em]">
          <span className="block">Ready to redefine your</span>
          <span className="block italic">physical presence?</span>
        </h2>
        <Link
          href="#start"
          className="inline-flex items-center justify-center bg-ink border border-ink text-bone px-16 py-8 text-[12px] font-semibold tracking-[0.2em] uppercase hover:bg-gold-deep transition-colors duration-300 self-start md:self-auto"
        >
          Start Your Journey
        </Link>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="bg-bone border-t border-bone-line">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-16 py-32 md:py-40 grid grid-cols-1 md:grid-cols-2 gap-16 md:items-end">
        <div className="flex flex-col gap-8">
          <span className="font-display font-medium text-ink text-[40px] md:text-[48px] leading-none tracking-[-0.01em]">
            BEERI
          </span>
          <ul className="grid grid-cols-2 gap-x-12 gap-y-4 max-w-xs">
            {["Instagram", "LinkedIn", "Terms", "Privacy"].map((l) => (
              <li key={l}>
                <Link
                  href="#"
                  className="font-sans uppercase text-clay text-[16px] underline underline-offset-4 hover:text-ink transition-colors"
                >
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-8 md:items-end">
          <div className="flex flex-col gap-2 md:items-end max-w-xs">
            <span className="font-sans font-semibold uppercase text-teal text-[12px] tracking-[0.1em] leading-4">
              HQ Studio
            </span>
            <p className="font-serif text-clay text-[16px] leading-6 md:text-right">
              The Printing District, Level 4
              <br />
              Tel Aviv, 6721301
            </p>
          </div>
          <p className="font-sans font-semibold uppercase text-clay text-[12px] tracking-[0.1em] md:text-right">
            © 2024 Beeri Structural Packaging. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ──────────────────────────────────────────────────────────────────────── */

function StickyContact() {
  return (
    <Link
      href="#contact"
      className="fixed bottom-6 right-6 md:bottom-12 md:right-12 z-40 inline-flex items-center gap-4 bg-[#dbd7d5] hover:bg-ink hover:text-bone text-[#5f5d5c] px-8 py-4 shadow-2xl transition-colors duration-300"
    >
      <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
        <rect x="1" y="1" width="18" height="14" stroke="currentColor" strokeWidth="1.25" />
        <path d="M1 1l9 7 9-7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" />
      </svg>
      <span className="font-sans font-semibold uppercase text-[12px] tracking-[0.1em] leading-4">
        Contact Us
      </span>
    </Link>
  );
}
