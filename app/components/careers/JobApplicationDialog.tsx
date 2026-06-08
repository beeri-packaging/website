"use client";

import { useId, useRef, useState, useTransition } from "react";
import type { Lang } from "@/app/content/home";
import type { CareerRole } from "@/app/content/careers";
import { jobApplicationCopy } from "@/app/content/jobApplication";
import { submitJobApplication } from "@/app/actions/jobApplication";
import { useContactDialog } from "@/app/components/contact/ContactDialogProvider";
import {
  Dialog,
  DialogAside,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogMain,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type JobApplicationDialogProps = {
  lang: Lang;
  /** Role being applied to — drives the title, the aside code tag and the read-only role field. */
  role?: Pick<CareerRole, "code" | "title">;
  /** Trigger button label (defaults to the localized "Apply"). */
  triggerLabel?: string;
  /** Override the trigger button styling. */
  triggerClassName?: string;
};

type FieldErrors = Partial<Record<"name" | "phone" | "email", string>>;

const DEFAULT_TRIGGER_CLASS =
  "inline-flex min-h-14 shrink-0 items-center justify-center bg-magenta px-10 py-4 font-sans text-[13px] font-bold tracking-[0.08em] text-bone shadow-[4px_4px_0_var(--yellow)] transition-transform hover:-translate-y-0.5 focus-ring";

const FIELD_CLASS =
  "w-full border border-ink bg-bone px-4 py-3 font-sans text-[15px] text-ink transition-colors placeholder:text-clay/45 focus-ring aria-[invalid=true]:border-magenta";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidPhone(value: string): boolean {
  return value.replace(/\D/g, "").length >= 7;
}

export function JobApplicationDialog({
  lang,
  role,
  triggerLabel,
  triggerClassName,
}: JobApplicationDialogProps) {
  const copy = jobApplicationCopy[lang];
  const formId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { open: openContact } = useContactDialog();

  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [fileName, setFileName] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function resetForm() {
    setSubmitted(false);
    setErrors({});
    setFileName(null);
    setSubmitError(null);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) resetForm();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();

    const nextErrors: FieldErrors = {};
    if (!name) nextErrors.name = copy.errors.name;
    if (!isValidPhone(phone)) nextErrors.phone = copy.errors.phone;
    if (!isValidEmail(email)) nextErrors.email = copy.errors.email;

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitError(null);
    // Carry the role context (the form has no visible role inputs).
    data.set("roleCode", role?.code ?? "");
    data.set("roleTitle", role?.title ?? "");

    startTransition(async () => {
      const res = await submitJobApplication(data);
      if (res.ok) {
        setSubmitted(true);
        return;
      }
      setSubmitError(
        res.error === "file_too_large"
          ? copy.errors.fileTooLarge
          : copy.errors.submitFailed,
      );
    });
  }

  const title = role?.title ?? copy.aside.fallbackTitle;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className={triggerClassName ?? DEFAULT_TRIGGER_CLASS}>
        {triggerLabel ?? copy.triggerLabel}
      </DialogTrigger>

      <DialogContent size="split" closeLabel={copy.closeLabel}>
        {/* MAIN — first in the DOM so it lands on the inline-start side
            (right in RTL, matching the Figma spec sheet). */}
        <DialogMain className="px-6 pb-8 pt-16 sm:px-12 sm:pb-12 sm:pt-16">
          {submitted ? (
            <SuccessPanel copy={copy} />
          ) : (
            <div className="flex flex-col gap-7">
              <header className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-yellow px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.08em] text-yellow-deep">
                    {copy.aside.eyebrow}
                  </span>
                  {role?.code ? (
                    <span className="font-sans text-[12px] font-bold text-clay/80">
                      {role.code}
                    </span>
                  ) : null}
                </div>
                <DialogTitle className="text-[40px] leading-[1.02] sm:text-[48px]">
                  {title}
                </DialogTitle>
                <DialogDescription className="max-w-[42ch] text-[16px] leading-[1.6]">
                  {copy.form.intro}
                </DialogDescription>
              </header>

              <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
                {/* Honeypot — off-screen; bots that fill it are dropped server-side. */}
                <input
                  type="text"
                  name="company_url"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  className="absolute h-0 w-0 overflow-hidden opacity-0"
                  style={{ insetInlineStart: "-9999px" }}
                />
                {role ? (
                  <div className="flex flex-col gap-2">
                    <span className="font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-clay/80">
                      {copy.form.roleLabel}
                    </span>
                    <div className="flex items-center gap-2 border border-ink bg-sand px-4 py-3 font-sans text-[15px] font-semibold text-ink">
                      {role.title}
                      <span className="text-clay/60">{role.code}</span>
                    </div>
                  </div>
                ) : null}

                <Field
                  id={`${formId}-name`}
                  name="name"
                  label={copy.form.name.label}
                  placeholder={copy.form.name.placeholder}
                  autoComplete="name"
                  error={errors.name}
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    id={`${formId}-phone`}
                    name="phone"
                    type="tel"
                    label={copy.form.phone.label}
                    placeholder={copy.form.phone.placeholder}
                    autoComplete="tel"
                    dir="ltr"
                    error={errors.phone}
                  />
                  <Field
                    id={`${formId}-email`}
                    name="email"
                    type="email"
                    label={copy.form.email.label}
                    placeholder={copy.form.email.placeholder}
                    autoComplete="email"
                    dir="ltr"
                    error={errors.email}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={`${formId}-message`}
                    className="flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-clay/80"
                  >
                    {copy.form.message.label}
                    <span className="font-normal normal-case text-clay/50">
                      {copy.form.message.optional}
                    </span>
                  </label>
                  <textarea
                    id={`${formId}-message`}
                    name="message"
                    rows={3}
                    placeholder={copy.form.message.placeholder}
                    className={`${FIELD_CLASS} resize-none`}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-clay/80">
                    {copy.form.cv.label}
                    <span className="font-normal normal-case text-clay/50">
                      {copy.form.cv.optional}
                    </span>
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex shrink-0 items-center gap-2 border border-ink bg-bone px-4 py-3 font-sans text-[13px] font-bold text-ink transition-colors hover:bg-ink hover:text-bone focus-ring"
                    >
                      <PaperclipIcon />
                      {copy.form.cv.button}
                    </button>
                    <span className="min-w-0 truncate font-sans text-[13px] text-clay/80">
                      {fileName ?? copy.form.cv.empty}
                    </span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="cv"
                    accept=".pdf,.doc,.docx"
                    className="sr-only"
                    onChange={(event) =>
                      setFileName(event.target.files?.[0]?.name ?? null)
                    }
                  />
                </div>

                {submitError ? (
                  <p
                    role="alert"
                    className="font-sans text-[13px] font-semibold text-magenta-deep"
                  >
                    {submitError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isPending}
                  aria-busy={isPending}
                  className="mt-1 inline-flex items-center justify-center border border-ink bg-teal px-6 py-5 font-sans text-[13px] font-bold uppercase tracking-[0.08em] text-bone shadow-[6px_6px_0_var(--cyan)] transition-transform hover:-translate-y-0.5 focus-ring disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isPending ? copy.form.sending : copy.form.submit}
                </button>
              </form>
            </div>
          )}
        </DialogMain>

        {/* ASIDE — the cinematic brand/pitch panel (replaces the 3D render). */}
        <DialogAside className="bg-ink text-bone">
          <div className="flex h-full flex-col justify-between p-10 lg:p-12">
            <div className="flex flex-col gap-8">
              <div className="inline-flex w-fit items-center gap-2 border border-cyan bg-cyan px-2.5 py-1 font-sans text-[10px] font-bold tracking-[0.04em] text-cyan-deep">
                <span className="opacity-70">{copy.aside.codeLabel}:</span>
                <span>{role?.code ?? "—"}</span>
              </div>

              <div className="flex flex-col gap-4">
                <span className="font-sans text-[11px] font-bold tracking-[0.08em] text-purple">
                  {copy.aside.kicker}
                </span>
                <p className="text-balance font-sans text-[17px] leading-[1.6] text-bone/85">
                  {copy.aside.lead}
                </p>
              </div>

              <span className="h-px w-full border-t border-dashed border-cyan/60" />

              <ul className="flex flex-col gap-5">
                {copy.aside.perks.map((perk) => (
                  <li
                    key={perk.title}
                    className="flex flex-col gap-1 border-s-2 border-cyan ps-4"
                  >
                    <span className="font-sans text-[13px] font-bold text-bone">
                      {perk.title}
                    </span>
                    <span className="font-sans text-[13px] leading-[1.5] text-bone/65">
                      {perk.body}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => {
                  // Close the application dialog first, then open the global
                  // contact dialog. Defer the open so the closing dialog's
                  // focus-restore + scroll-lock cleanup land first — otherwise
                  // the two Radix roots race over focus/body pointer-events.
                  handleOpenChange(false);
                  setTimeout(openContact, 150);
                }}
                className="inline-flex w-fit items-center justify-center border border-cyan px-6 py-3 font-sans text-[13px] font-bold tracking-[0.08em] text-cyan transition-colors duration-300 hover:bg-cyan hover:text-cyan-deep focus-ring"
              >
                {copy.aside.inquire}
              </button>
            </div>

            <span
              className="pointer-events-none select-none font-display text-[80px] font-bold leading-none text-bone/10 lg:text-[104px]"
              aria-hidden
            >
              1964
            </span>
          </div>
        </DialogAside>
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
      <label
        htmlFor={id}
        className="font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-clay/80"
      >
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
        <span id={`${id}-error`} className="font-sans text-[12px] text-magenta-deep">
          {error}
        </span>
      ) : null}
    </div>
  );
}

function SuccessPanel({
  copy,
}: {
  copy: (typeof jobApplicationCopy)[Lang];
}) {
  return (
    <div className="flex flex-1 flex-col items-start justify-center gap-5 py-10">
      <span
        className="inline-flex size-14 items-center justify-center border border-ink bg-teal text-bone shadow-[5px_5px_0_var(--cyan)]"
        aria-hidden
      >
        <CheckIcon />
      </span>
      <DialogTitle className="text-[40px] leading-[1.02] sm:text-[48px]">
        {copy.success.title}
      </DialogTitle>
      <DialogDescription className="max-w-[44ch] font-sans text-[16px] leading-[1.6] text-clay">
        {copy.success.body}
      </DialogDescription>
      <DialogClose className="mt-2 inline-flex items-center justify-center border border-ink bg-ink px-8 py-4 font-sans text-[13px] font-bold uppercase tracking-[0.08em] text-bone transition-colors hover:bg-clay focus-ring">
        {copy.success.close}
      </DialogClose>
    </div>
  );
}

function PaperclipIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M13 7l-5.5 5.5a3 3 0 01-4.2-4.2L8.5 3a2 2 0 012.8 2.8l-5.4 5.4a1 1 0 01-1.4-1.4L9.5 5" />
    </svg>
  );
}

function CheckIcon() {
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
