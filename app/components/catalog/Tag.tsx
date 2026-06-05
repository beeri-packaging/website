import type { CatalogTag } from "@/app/content/catalog";

/** Accent tag pill shared by catalog cards and the product detail modal. */
export function Tag({ tag }: { tag: CatalogTag }) {
  const tone = {
    outline: "border-ink text-ink",
    cyan: "border-ink bg-cyan text-ink",
    purple: "border-ink bg-purple text-bone",
    magenta: "border-ink bg-magenta text-bone",
  }[tag.tone];
  return (
    <span
      className={`${tone} inline-flex items-center border px-[9px] py-[5px] font-sans text-[12px] font-extrabold uppercase tracking-[0.08em]`}
    >
      {tag.label}
    </span>
  );
}
