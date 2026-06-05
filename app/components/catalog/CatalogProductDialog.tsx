"use client";

import Image from "next/image";
import type { CatalogItem } from "@/app/content/catalog";
import type { Lang } from "@/app/content/home";
import { useContactDialog } from "@/app/components/contact/ContactDialogProvider";
import {
  Dialog,
  DialogAside,
  DialogContent,
  DialogDescription,
  DialogMain,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tag } from "./Tag";

const UI = {
  he: { sku: 'מק"ט', requestSample: "בקשת דוגמה", specsTitle: "נתוני מבנה", close: "סגירה" },
  en: { sku: "SKU", requestSample: "Request a sample", specsTitle: "Structure data", close: "Close" },
} as const;

/**
 * Product spec-sheet modal (Figma 531-117). Two-panel split: the spec sheet on
 * the inline-start (main) and the product render on the inline-end (aside).
 * Driven entirely by existing CatalogItem fields — sections render only when
 * their data exists, so seeded items never show empty blocks.
 */
export function CatalogProductDialog({
  lang,
  item,
  categoryName,
  open,
  onOpenChange,
}: {
  lang: Lang;
  item: CatalogItem | null;
  categoryName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = UI[lang];
  const { open: openContact } = useContactDialog();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="split" closeLabel={t.close} className="max-w-[1080px]">
        <DialogMain className="px-6 pb-10 pt-16 sm:px-12 sm:pb-12">
          {item ? (
            <div className="flex flex-col gap-9">
              <header className="flex flex-col gap-3 text-start">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-ink px-2 py-[3px] font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-bone">
                    {categoryName}
                  </span>
                  {item.series ? (
                    <span className="font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-purple">
                      ● {item.series}
                    </span>
                  ) : null}
                </div>
                <DialogTitle className="font-display text-[44px] font-normal leading-none text-ink sm:text-[64px]">
                  {item.name}
                </DialogTitle>
                <DialogDescription className="max-w-[420px] font-sans text-[16px] font-light leading-[25px] text-clay">
                  {item.description}
                </DialogDescription>
              </header>

              {item.specs?.length ? (
                <section className="flex flex-col gap-5">
                  <div className="flex items-end justify-between border-b border-ink pb-[9px]">
                    <span className="font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-ink">
                      {t.specsTitle}
                    </span>
                  </div>
                  <dl dir="ltr" className="grid gap-4 sm:grid-cols-2">
                    {item.specs.map((spec, i) => (
                      <div
                        key={spec.label}
                        className={`flex flex-col items-center border-s-2 ps-3 text-center ${
                          i % 2 === 0 ? "border-cyan" : "border-magenta"
                        }`}
                      >
                        <dt dir="auto" className="font-sans text-[16px] font-light text-clay">
                          {spec.label}
                        </dt>
                        <dd dir="auto" className="font-display text-[24px] font-bold tracking-[0.05em] text-ink">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ) : null}

              {item.overlaySpecs?.length ? (
                <ul className="flex flex-col gap-2 text-start">
                  {item.overlaySpecs.map((line) => (
                    <li key={line} className="font-sans text-[16px] font-light leading-[25px] text-clay">
                      {line}
                    </li>
                  ))}
                </ul>
              ) : null}

              {item.tags?.length ? (
                <div dir="ltr" className="flex flex-wrap justify-end gap-2">
                  {item.tags.map((tag) => (
                    <Tag key={tag.label} tag={tag} />
                  ))}
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  // Defer so the closing dialog's focus-restore + body
                  // pointer-events cleanup finish before the contact dialog
                  // mounts (avoids a focus/scroll-lock race between two Radix
                  // roots in the same tick).
                  setTimeout(openContact, 150);
                }}
                className="inline-flex items-center justify-center self-start border border-ink bg-magenta px-12 py-[18px] font-sans text-[14px] font-bold tracking-[0.08em] text-ink shadow-[6px_6px_0_0_var(--cyan)] transition-transform duration-300 hover:-translate-y-0.5 focus-ring"
              >
                {t.requestSample}
              </button>
            </div>
          ) : null}
        </DialogMain>

        <DialogAside className="bg-sand">
          {item?.image ? (
            <div className="relative h-full min-h-[320px]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(min-width: 768px) 44vw, 100vw"
                className="object-cover"
              />
              <span className="absolute start-4 top-4 border border-ink bg-cyan px-[9px] py-1 font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-teal">
                {t.sku} {item.key}
              </span>
            </div>
          ) : null}
        </DialogAside>
      </DialogContent>
    </Dialog>
  );
}
