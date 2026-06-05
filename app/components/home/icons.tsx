/**
 * Inline SVGs used across the home page. Every icon strokes/fills with
 * `currentColor` so callers control the color via a parent `text-*` class.
 */

export function ArrowGlyph({
  direction,
}: {
  direction: "right-to-left" | "left-to-right";
}) {
  // 'right-to-left' arrow visually points LEFT (forward in RTL).
  const flip = direction === "left-to-right";
  return (
    <svg
      width="16"
      height="12"
      viewBox="0 0 16 12"
      fill="none"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      <path
        d="M16 6H2M7 1L2 6l5 5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function ArrowRtl({
  color,
  lang,
}: {
  color: "bone" | "ink";
  lang: "he" | "en";
}) {
  const flip = lang === "en";
  const colorClass = color === "bone" ? "text-bone" : "text-ink";
  return (
    <span className={colorClass}>
      <svg
        width="16"
        height="12"
        viewBox="0 0 16 12"
        fill="none"
        className="transition-transform duration-500 group-hover:-translate-x-1 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1"
        style={{ transform: flip ? "scaleX(-1)" : undefined }}
      >
        <path
          d="M16 6H2M7 1L2 6l5 5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="square"
        />
      </svg>
    </span>
  );
}

export function ArrowOut() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M3 12L12 3M12 3H5M12 3v7"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function CardCornerArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 12L12 4M12 4H6M12 4v6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function LinkedInGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3.2 9h3.6v11.5H3.2zm5.9 0h3.45v1.57h.05c.48-.86 1.65-1.77 3.4-1.77 3.64 0 4.3 2.24 4.3 5.16v6.54h-3.6v-5.8c0-1.38-.03-3.16-1.98-3.16-1.98 0-2.28 1.5-2.28 3.06v5.9H9.1z" />
    </svg>
  );
}

export function MailGlyph() {
  return (
    <svg width="18" height="14" viewBox="0 0 20 16" fill="none" aria-hidden>
      <path
        d="M1 2.5h18v11H1zM1 3l9 6 9-6"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PinGlyph() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 20" fill="none" aria-hidden>
      <path
        d="M8 19c4-4.2 6-7.6 6-11A6 6 0 002 8c0 3.4 2 6.8 6 11z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="2.25" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

/** Articulated precision / robotic arm — finishing "נתוני גימור" metrics window. */
export function PrecisionArmIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <g
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 20h6" />
        <path d="M7 20v-4.5" />
        <path d="M7 15.5 13.5 13" />
        <path d="M13.5 13 17 15.5" />
        <path d="M17 13.5v4l3.2-1.2" />
      </g>
      <circle cx="7" cy="15.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

/** Wide measurement-ruler strip — careers "דיוק בדפוס וגימור" card. */
export function PrintRulerGlyph() {
  return (
    <svg
      viewBox="0 0 220 40"
      className="h-[44px] w-full"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden
    >
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="2" y="13" width="216" height="14" rx="1" />
        <line x1="24" y1="13" x2="24" y2="21" />
        <line x1="46" y1="13" x2="46" y2="24" />
        <line x1="68" y1="13" x2="68" y2="21" />
        <line x1="90" y1="13" x2="90" y2="24" />
        <line x1="112" y1="13" x2="112" y2="21" />
        <line x1="134" y1="13" x2="134" y2="24" />
        <line x1="156" y1="13" x2="156" y2="21" />
        <line x1="178" y1="13" x2="178" y2="24" />
        <line x1="200" y1="13" x2="200" y2="21" />
      </g>
    </svg>
  );
}

export function DieCutIcon() {
  return (
    <svg width="22" height="36" viewBox="0 0 16.5 27" fill="none" aria-hidden>
      <path
        d="M0.375 27L0 23.7L4.275 11.925C4.65 12.275 5.05625 12.5687 5.49375 12.8062C5.93125 13.0437 6.4 13.225 6.9 13.35L2.775 24.675L0.375 27V27M16.125 27L13.725 24.675L9.6 13.35C10.1 13.225 10.5688 13.0437 11.0063 12.8062C11.4438 12.5687 11.85 12.275 12.225 11.925L16.5 23.7L16.125 27V27M8.25 12C7 12 5.9375 11.5625 5.0625 10.6875C4.1875 9.8125 3.75 8.75 3.75 7.5C3.75 6.525 4.03125 5.65625 4.59375 4.89375C5.15625 4.13125 5.875 3.6 6.75 3.3V0H9.75V3.3C10.625 3.6 11.3438 4.13125 11.9062 4.89375C12.4688 5.65625 12.75 6.525 12.75 7.5C12.75 8.75 12.3125 9.8125 11.4375 10.6875C10.5625 11.5625 9.5 12 8.25 12V12M8.25 9C8.675 9 9.03125 8.85625 9.31875 8.56875C9.60625 8.28125 9.75 7.925 9.75 7.5C9.75 7.075 9.60625 6.71875 9.31875 6.43125C9.03125 6.14375 8.675 6 8.25 6C7.825 6 7.46875 6.14375 7.18125 6.43125C6.89375 6.71875 6.75 7.075 6.75 7.5C6.75 7.925 6.89375 8.28125 7.18125 8.56875C7.46875 8.85625 7.825 9 8.25 9V9"
        fill="currentColor"
      />
    </svg>
  );
}

export function LabIcon() {
  // The accent dot uses the cyan token directly so it stays brand-cyan
  // regardless of the icon's text color.
  return (
    <svg width="27" height="27" viewBox="0 0 28 28" fill="none">
      <path
        d="M9 4v9l-4 6a3 3 0 002.5 4.5h13a3 3 0 002.5-4.5l-4-6V4M7 4h14"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
      />
      <circle cx="14" cy="18" r="1.5" fill="var(--cyan)" />
    </svg>
  );
}
