"use client";

import { useId, useState, useTransition } from "react";
import type { Lang } from "@/app/content/home";
import { contactCopy } from "@/app/content/contact";
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
  "w-full border-b-2 border-ink/20 bg-transparent px-3 pb-3 pt-2 font-sans text-[16px] text-ink text-start outline-none transition-colors placeholder:text-clay-soft/55 focus:border-ink aria-[invalid=true]:border-magenta";

const LABEL_CLASS =
  "font-sans text-[11px] font-semibold uppercase tracking-[0.5px] text-clay text-start";

export function ContactDialog({ lang, open, onOpenChange }: ContactDialogProps) {
  const copy = contactCopy[lang];
  const formId = useId();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
        className="max-w-[920px] shadow-[8px_8px_0_var(--yellow),0_25px_50px_-12px_rgba(0,0,0,0.25)]"
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

        <DialogMain className="px-6 pb-12 pt-16 sm:px-12 sm:pb-16 md:px-16 md:pt-[68px]">
          {submitted ? (
            <SuccessPanel copy={copy} />
          ) : (
            <div className="flex flex-col gap-10 md:gap-12">
              {/* Header — yellow accent rule on the inline-start edge. */}
              <header className="flex w-full flex-col gap-2 border-s-4 border-yellow ps-7 text-start">
                <span className="font-sans text-[16px] font-semibold uppercase tracking-[0.5px] text-clay">
                  {copy.eyebrow}
                </span>
                <DialogTitle className="text-[52px] leading-[0.92] sm:text-[64px] md:text-[80px]">
                  {copy.title}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  {copy.description}
                </DialogDescription>
              </header>

              <form
                className="grid w-full grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2"
                onSubmit={handleSubmit}
                noValidate
              >
                <Field
                  id={`${formId}-fullName`}
                  name="fullName"
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

                {/* Reason — required native select styled as an underline field. */}
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor={`${formId}-reason`} className={LABEL_CLASS}>
                    {copy.form.reason.label}
                  </label>
                  <div className="relative">
                    <select
                      id={`${formId}-reason`}
                      name="reason"
                      defaultValue=""
                      aria-invalid={errors.reason ? true : undefined}
                      aria-describedby={
                        errors.reason ? `${formId}-reason-error` : undefined
                      }
                      className={`${FIELD_CLASS} cursor-pointer appearance-none pe-10`}
                    >
                      {copy.form.reason.options.map((option) => (
                        <option
                          key={option.value || "placeholder"}
                          value={option.value}
                          disabled={option.value === ""}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronGlyph className="pointer-events-none absolute end-2 top-1/2 -translate-y-1/2 text-ink" />
                  </div>
                  {errors.reason ? (
                    <span
                      id={`${formId}-reason-error`}
                      className="font-sans text-[12px] text-magenta"
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
                    className={`${FIELD_CLASS} resize-none pb-4`}
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
                <div className="mt-2 flex flex-col-reverse items-stretch justify-between gap-6 sm:col-span-2 sm:flex-row sm:items-center">
                  <div className="flex flex-col gap-2">
                    <p className="max-w-[320px] font-sans text-[10px] uppercase leading-[1.6] tracking-[0.04em] text-clay text-start">
                      {copy.form.consent}
                    </p>
                    {submitError ? (
                      <p
                        role="alert"
                        className="font-sans text-[12px] text-magenta text-start"
                      >
                        {submitError}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="submit"
                    disabled={isPending}
                    aria-busy={isPending}
                    className="group inline-flex shrink-0 items-center justify-center gap-3 border border-ink bg-cyan px-12 py-5 font-sans text-[14px] font-bold tracking-[0.08em] text-yellow-deep shadow-[8px_8px_0_var(--yellow)] transition-transform duration-300 hover:-translate-y-0.5 focus-ring disabled:cursor-not-allowed disabled:opacity-70"
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

function Field({
  id,
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
  dir,
  error,
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  dir?: "ltr" | "rtl";
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        dir={dir}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={FIELD_CLASS}
      />
      {error ? (
        <span id={`${id}-error`} className="font-sans text-[12px] text-magenta">
          {error}
        </span>
      ) : null}
    </div>
  );
}

function SuccessPanel({ copy }: { copy: (typeof contactCopy)[Lang] }) {
  return (
    <div className="flex min-h-[320px] flex-col items-start justify-center gap-5 border-s-4 border-yellow ps-7 text-start">
      <span
        className="inline-flex size-14 items-center justify-center border border-ink bg-yellow text-yellow-deep shadow-[6px_6px_0_var(--yellow)]"
        aria-hidden
      >
        <CheckGlyph />
      </span>
      <DialogTitle className="text-[44px] leading-[0.96] sm:text-[56px]">
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
      className={`size-4 ${className ?? ""}`}
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
