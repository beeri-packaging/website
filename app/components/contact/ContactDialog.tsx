"use client";

import {
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  useTransition,
} from "react";
import type { Lang } from "@/app/content/home";
import { contactCopy, type ContactReasonOption } from "@/app/content/contact";
import {
  validateContactInquiry,
  type ContactFieldErrors,
  type ContactInquiryInput,
  type ContactReasonValue,
} from "@/lib/contact-inquiry";
import { submitContactInquiry } from "@/app/actions/contact";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogMain,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowGlyph } from "@/app/components/home/icons";

type ContactDialogProps = {
  lang: Lang;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Underline-style field shared by every text input/textarea (Figma spec). */
const FIELD_CLASS =
  "w-full border-b-2 border-ink/20 bg-transparent px-3 pb-2.5 pt-[9px] font-sans text-[17px] leading-[24px] text-ink text-start outline-none transition-colors placeholder:text-clay-soft/55 focus:border-ink aria-[invalid=true]:border-magenta sm:pb-3 sm:text-[20px] sm:leading-[25px]";

const LABEL_CLASS =
  "font-sans text-[14px] font-light leading-[22px] tracking-[-0.16px] text-clay text-start sm:text-[16px] sm:leading-[25px]";

export function ContactDialog({ lang, open, onOpenChange }: ContactDialogProps) {
  const copy = contactCopy[lang];
  const formId = useId();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  // Lets the dialog veto its own Escape-close while the reason menu is open.
  const reasonMenuRef = useRef<{ isOpen: () => boolean; close: () => void } | null>(
    null,
  );

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    // Reset once the close animation can't show stale state on reopen.
    if (!next) {
      setSubmitted(false);
      setErrors({});
      setSubmitError(null);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const input: ContactInquiryInput & { company_url: string } = {
      fullName: String(data.get("fullName") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      reason: String(data.get("reason") ?? "") as ContactReasonValue | "",
      details: String(data.get("details") ?? "").trim(),
      company_url: String(data.get("company_url") ?? ""),
    };

    const nextErrors = validateContactInquiry(input);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setSubmitError(null);

    startTransition(async () => {
      const result = await submitContactInquiry(input);
      if (result.ok) {
        setSubmitted(true);
      } else if (result.error === "validation" && result.fieldErrors) {
        setErrors(result.fieldErrors);
      } else {
        setSubmitError(copy.errors.submitFailed);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        size="lg"
        closeLabel={copy.closeLabel}
        showClose={false}
        className="max-w-[920px] border border-ink shadow-[8px_8px_0_var(--yellow),0_25px_50px_-12px_rgba(0,0,0,0.25)]"
        onEscapeKeyDown={(event) => {
          // When the reason menu is open, Escape closes the menu, not the dialog.
          if (reasonMenuRef.current?.isOpen()) {
            event.preventDefault();
            reasonMenuRef.current.close();
          }
        }}
      >
        {/* Custom close cluster (X + label), inline-end / top — mirrors the Figma. */}
        <DialogClose
          aria-label={copy.closeLabel}
          className="absolute end-5 top-5 z-10 inline-flex items-center gap-2 opacity-40 transition-opacity duration-300 hover:opacity-100 focus-ring"
        >
          <CloseGlyph />
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.5px] text-ink">
            {copy.closeLabel}
          </span>
        </DialogClose>

        <DialogMain className="px-5 pb-6 pt-12 sm:px-12 sm:pb-10 sm:pt-14 md:px-16 md:pt-11 md:pb-8">
          {submitted ? (
            <SuccessPanel copy={copy} />
          ) : (
            <div className="flex flex-col gap-6 sm:gap-9 md:gap-10">
              {/* Header — yellow accent rule on the inline-start edge. */}
              <header className="flex w-full flex-col gap-2 border-s-4 border-magenta ps-5 text-start sm:ps-7">
                <span className="font-sans text-[12px] font-extrabold uppercase tracking-[0.96px] text-clay">
                  {copy.eyebrow}
                </span>
                <DialogTitle className="text-logo-dark text-[36px] leading-[0.85] sm:text-[48px] md:text-[56px] lg:text-[64px]">
                  {copy.title}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  {copy.description}
                </DialogDescription>
              </header>

              <form
                className="grid w-full grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 sm:gap-y-7 md:gap-x-12 md:gap-y-8"
                onSubmit={handleSubmit}
                noValidate
              >
                {/* Legend for the asterisk — must precede the fields it explains. */}
                <p className="font-sans text-[12px] leading-[16px] text-clay-soft text-start sm:col-span-2">
                  <RequiredMark />
                  {copy.form.requiredNote}
                </p>

                <Field
                  id={`${formId}-fullName`}
                  name="fullName"
                  required
                  label={copy.form.fullName.label}
                  placeholder={copy.form.fullName.placeholder}
                  autoComplete="name"
                  error={errors.fullName ? copy.errors.fullName : undefined}
                />
                <Field
                  id={`${formId}-phone`}
                  name="phone"
                  type="tel"
                  dir="ltr"
                  required
                  label={copy.form.phone.label}
                  placeholder={copy.form.phone.placeholder}
                  autoComplete="tel"
                  error={errors.phone ? copy.errors.phone : undefined}
                />
                <Field
                  id={`${formId}-email`}
                  name="email"
                  type="email"
                  dir="ltr"
                  required
                  label={copy.form.email.label}
                  placeholder={copy.form.email.placeholder}
                  autoComplete="email"
                  error={errors.email ? copy.errors.email : undefined}
                />
                <Field
                  id={`${formId}-company`}
                  name="company"
                  label={copy.form.company.label}
                  placeholder={copy.form.company.placeholder}
                  autoComplete="organization"
                />

                {/* Reason — required custom dropdown styled as an underline field. */}
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label
                    id={`${formId}-reason-label`}
                    htmlFor={`${formId}-reason`}
                    className={LABEL_CLASS}
                  >
                    {copy.form.reason.label}
                    <RequiredMark trailing />
                  </label>
                  <ReasonSelect
                    controlRef={reasonMenuRef}
                    id={`${formId}-reason`}
                    labelId={`${formId}-reason-label`}
                    options={copy.form.reason.options}
                    placeholder={
                      copy.form.reason.options.find((o) => !o.value)?.label ?? ""
                    }
                    invalid={Boolean(errors.reason)}
                    errorId={
                      errors.reason ? `${formId}-reason-error` : undefined
                    }
                    onSelect={() =>
                      setErrors((prev) =>
                        prev.reason ? { ...prev, reason: undefined } : prev,
                      )
                    }
                  />
                  {errors.reason ? (
                    <span
                      id={`${formId}-reason-error`}
                      className="font-sans text-[12px] text-magenta-deep"
                    >
                      {copy.errors.reason}
                    </span>
                  ) : null}
                </div>

                {/* Further details — full width textarea. */}
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor={`${formId}-details`} className={LABEL_CLASS}>
                    {copy.form.details.label}
                  </label>
                  <textarea
                    id={`${formId}-details`}
                    name="details"
                    rows={3}
                    placeholder={copy.form.details.placeholder}
                    className={`${FIELD_CLASS} h-[76px] resize-none pb-3 sm:h-auto sm:pb-4`}
                  />
                </div>

                {/* Honeypot — hidden from humans; bots fill it and we drop the send. */}
                <div aria-hidden className="sr-only">
                  <label htmlFor={`${formId}-company_url`}>
                    Leave this field empty
                  </label>
                  <input
                    id={`${formId}-company_url`}
                    name="company_url"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Submit row — button on the inline-end, consent on the inline-start. */}
                <div className="flex flex-col-reverse items-stretch justify-between gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:gap-6">
                  <div className="flex flex-col gap-2">
                    <p className="max-w-[320px] font-sans text-[12px] font-extrabold uppercase leading-[16px] tracking-[0.08em] text-clay text-start">
                      {copy.form.consent}
                    </p>
                    {submitError ? (
                      <p
                        role="alert"
                        className="font-sans text-[12px] text-magenta-deep text-start"
                      >
                        {submitError}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="submit"
                    disabled={isPending}
                    aria-busy={isPending}
                    className="group inline-flex shrink-0 items-center justify-center gap-3 border border-ink bg-cyan px-8 py-4 font-sans text-[14px] font-bold tracking-[0.08em] text-yellow-deep shadow-[8px_8px_0_var(--yellow)] transition-transform duration-300 hover:-translate-y-0.5 focus-ring disabled:cursor-not-allowed disabled:opacity-70 sm:px-12 sm:py-5"
                  >
                    {isPending ? copy.form.sending : copy.form.submit}
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1"
                    >
                      <ArrowGlyph
                        direction={lang === "he" ? "right-to-left" : "left-to-right"}
                      />
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </DialogMain>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Asterisk marker for required fields. Hidden from assistive tech — the input's
 * own `required` carries the same meaning there, so announcing both is noise.
 */
function RequiredMark({ trailing }: { trailing?: boolean }) {
  return (
    <span aria-hidden className="text-magenta-deep">
      {trailing ? " *" : "* "}
    </span>
  );
}

function Field({
  id,
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
  dir,
  error,
  required,
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  dir?: "ltr" | "rtl";
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
        {required ? <RequiredMark trailing /> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        dir={dir}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={FIELD_CLASS}
      />
      {error ? (
        <span id={`${id}-error`} className="font-sans text-[12px] text-magenta-deep">
          {error}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Accessible single-select dropdown (combobox + listbox) styled as the same
 * underline field as the text inputs. Feeds the form via a hidden `reason`
 * input so the existing FormData submit path is unchanged.
 */
function ReasonSelect({
  id,
  labelId,
  options,
  placeholder,
  invalid,
  errorId,
  onSelect,
  controlRef,
}: {
  id: string;
  labelId: string;
  options: readonly ContactReasonOption[];
  placeholder: string;
  invalid?: boolean;
  errorId?: string;
  onSelect?: () => void;
  controlRef?: React.RefObject<{
    isOpen: () => boolean;
    close: () => void;
  } | null>;
}) {
  const items = options.filter((o) => o.value);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<ContactReasonValue | "">("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef(false);
  const selected = items.find((o) => o.value === value);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // The parent Dialog owns the document-level Escape listener (capture phase,
  // registered first), so it must be the one to veto its own close. Expose the
  // menu's open-state + a close() so the dialog's onEscapeKeyDown can do that.
  useImperativeHandle(
    controlRef,
    () => ({
      isOpen: () => openRef.current,
      close: () => {
        setOpen(false);
        buttonRef.current?.focus();
      },
    }),
    [],
  );

  function openMenu(index?: number) {
    const sel = items.findIndex((o) => o.value === value);
    setActive(index ?? (sel >= 0 ? sel : 0));
    setOpen(true);
  }

  function close(focus = true) {
    setOpen(false);
    if (focus) buttonRef.current?.focus();
  }

  function choose(index: number) {
    const opt = items[index];
    if (!opt) return;
    setValue(opt.value);
    onSelect?.();
    close();
  }

  // Dismiss on outside pointer. (Escape is handled by the parent Dialog via
  // controlRef, since its Escape listener wins the capture phase.)
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) openMenu();
        else setActive((a) => Math.min(items.length - 1, a + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) openMenu(items.length - 1);
        else setActive((a) => Math.max(0, a - 1));
        break;
      case "Home":
        if (open) {
          event.preventDefault();
          setActive(0);
        }
        break;
      case "End":
        if (open) {
          event.preventDefault();
          setActive(items.length - 1);
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) choose(active);
        else openMenu();
        break;
      // Escape is handled by a capture-phase listener while open (see effect).
      case "Tab":
        if (open) close(false);
        break;
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name="reason" value={value} />
      <button
        ref={buttonRef}
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={`${labelId} ${id}`}
        aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
        aria-required="true"
        aria-invalid={invalid || undefined}
        aria-describedby={errorId}
        data-open={open}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={handleKeyDown}
        className="flex w-full items-center justify-between gap-2 border-b-2 border-ink/20 bg-transparent px-3 pb-2.5 pt-[9px] font-sans text-[17px] leading-[24px] text-start outline-none transition-colors focus-visible:border-ink data-[open=true]:border-ink aria-[invalid=true]:border-magenta sm:pb-3 sm:text-[20px] sm:leading-[25px]"
      >
        <span className={selected ? "text-ink" : "text-clay-soft/55"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronGlyph
          className={`size-5 shrink-0 text-ink transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-labelledby={labelId}
          tabIndex={-1}
          className="absolute inset-x-0 top-[calc(100%+8px)] z-20 border border-ink bg-bone py-1 shadow-[6px_6px_0_rgba(27,28,26,0.12)]"
        >
          {items.map((option, index) => {
            const isActive = index === active;
            const isSelected = value === option.value;
            return (
              <li
                key={option.value}
                id={`${id}-opt-${index}`}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(index)}
                className={`cursor-pointer px-3 py-2.5 font-sans text-[16px] leading-[22px] text-start transition-colors sm:text-[18px] sm:leading-[24px] ${
                  isActive ? "bg-sand" : ""
                } ${isSelected ? "font-semibold text-magenta-deep" : "text-ink"}`}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function SuccessPanel({ copy }: { copy: (typeof contactCopy)[Lang] }) {
  return (
    <div className="flex min-h-[280px] flex-col items-start justify-center gap-5 border-s-4 border-yellow ps-5 text-start sm:min-h-[320px] sm:ps-7">
      <span
        className="inline-flex size-12 items-center justify-center border border-ink bg-yellow text-yellow-deep shadow-[6px_6px_0_var(--yellow)] sm:size-14"
        aria-hidden
      >
        <CheckGlyph />
      </span>
      <DialogTitle className="text-[38px] leading-[0.96] sm:text-[56px]">
        {copy.success.title}
      </DialogTitle>
      <DialogDescription className="max-w-[44ch] font-sans text-[16px] leading-[1.6] text-clay">
        {copy.success.body}
      </DialogDescription>
      <DialogClose className="mt-2 inline-flex items-center justify-center border border-ink bg-ink px-10 py-4 font-sans text-[13px] font-bold uppercase tracking-[0.08em] text-bone transition-colors duration-300 hover:bg-clay focus-ring">
        {copy.success.close}
      </DialogClose>
    </div>
  );
}

function CloseGlyph() {
  return (
    <svg
      viewBox="0 0 14 14"
      className="size-2.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="square"
      aria-hidden
    >
      <path d="M1 1l12 12M13 1L1 13" />
    </svg>
  );
}

function ChevronGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className ?? "size-5"}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6l5 5 5-5" />
    </svg>
  );
}

function CheckGlyph() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="size-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  );
}
