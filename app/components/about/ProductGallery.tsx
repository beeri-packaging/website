import Image from "next/image";
import type { AboutProduct } from "@/app/content/about";

/**
 * Product gallery used as the "trusted by" proof. Each tile shows a real
 * packaging photo (contained on a light tile so the product's own background
 * blends in) with a brand/sector caption. Works for both locales as-is.
 */
export function ProductGallery({
  eyebrow,
  title,
  body,
  items,
}: {
  eyebrow: string;
  title: string;
  body: string;
  items: readonly AboutProduct[];
}) {
  return (
    <section className="mx-auto w-full max-w-[1152px] px-5 py-20 sm:px-8 md:py-28 lg:px-0">
      <div className="max-w-[640px] text-start">
        <div className="mb-3 flex items-center gap-3 text-magenta">
          <span className="h-px w-12 bg-magenta" aria-hidden />
          <span className="font-sans text-[12px] font-extrabold uppercase tracking-[0.08em]">
            {eyebrow}
          </span>
        </div>
        <h2 className="font-display text-[40px] leading-[0.9] text-blueprint sm:text-[52px]">
          {title}
        </h2>
        <p className="mt-5 font-sans text-[16px] leading-[1.56] text-clay">{body}</p>
      </div>

      <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items.map((p) => (
          <li
            key={p.src}
            className="group flex flex-col overflow-hidden border border-rule bg-bone transition-colors hover:border-blueprint"
          >
            <div className="relative aspect-square bg-white">
              <Image
                src={p.src}
                alt={`${p.caption} — ${p.sector}`}
                fill
                sizes="(min-width: 640px) 30vw, 50vw"
                className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-rule px-4 py-3">
              <span className="font-sans text-[14px] font-bold text-blueprint">{p.caption}</span>
              <span className="font-sans text-[11px] font-extrabold uppercase tracking-[0.08em] text-magenta-deep">
                {p.sector}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
