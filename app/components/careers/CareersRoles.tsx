import type { CareerRole } from "@/app/content/careers";
import type { Lang } from "@/app/content/home";
import { JobApplicationDialog } from "@/app/components/careers/JobApplicationDialog";

function MetaIcon({ type }: { type: "pin" | "clock" }) {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-clay/70" aria-hidden>
      {type === "pin" ? (
        <path
          d="M8 1.5A4.5 4.5 0 0 0 3.5 6c0 3.35 4.5 8.5 4.5 8.5S12.5 9.35 12.5 6A4.5 4.5 0 0 0 8 1.5Zm0 6.2A1.7 1.7 0 1 1 8 4.3a1.7 1.7 0 0 1 0 3.4Z"
          fill="currentColor"
        />
      ) : (
        <path
          d="M8 1.5A6.5 6.5 0 1 0 8 14a6.5 6.5 0 0 0 0-13Zm.8 3.2v3.1l2.4 1.4-.8 1.3-3-1.8V4.7h1.4Z"
          fill="currentColor"
        />
      )}
    </svg>
  );
}

function RoleRow({
  apply,
  lang,
  role,
}: {
  apply: string;
  lang: Lang;
  role: CareerRole;
}) {
  return (
    <article className="reveal flex flex-col gap-6 border border-ink bg-bone p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-yellow px-3 py-1 font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-yellow-deep">
            {role.status}
          </span>
          <span className="font-sans text-[16px] font-light text-clay/80">
            {role.code}
          </span>
        </div>
        <h3 className="mt-3 font-display text-[56px] font-bold leading-none text-ink sm:text-[64px]">
          {role.title}
        </h3>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-sans text-[16px] font-light tracking-[-0.01em] text-clay/80">
          <span className="inline-flex items-center gap-2">
            <MetaIcon type="clock" />
            {role.scope}
          </span>
          <span className="inline-flex items-center gap-2">
            <MetaIcon type="pin" />
            {role.location}
          </span>
        </div>
      </div>

      <JobApplicationDialog
        lang={lang}
        role={role}
        triggerLabel={apply}
        triggerClassName="inline-flex min-h-14 shrink-0 items-center justify-center bg-magenta px-10 py-4 font-sans text-[20px] font-extrabold tracking-[0.02em] text-bone shadow-[2px_2px_0_var(--yellow)] transition-transform hover:-translate-y-0.5 focus-ring sm:text-[24px]"
      />
    </article>
  );
}

export function CareersRoles({
  apply,
  department,
  filters,
  lang,
  noRoles,
  onDepartmentChange,
  roles,
  title,
}: {
  apply: string;
  department: CareerRole["department"];
  filters: readonly { key: CareerRole["department"]; label: string }[];
  lang: Lang;
  noRoles: string;
  onDepartmentChange: (department: CareerRole["department"]) => void;
  roles: readonly CareerRole[];
  title: string;
}) {
  return (
    <section id="roles" className="mx-auto w-full max-w-[1280px] px-5 pb-24 sm:px-8 md:px-12 lg:px-20 scroll-mt-[80px]">
      <div className="reveal flex flex-col gap-6 border-b border-ink pb-6 md:flex-row md:items-end md:justify-between">
        <h2 className="flex items-center gap-4 font-display text-[56px] font-bold leading-none text-ink sm:text-[64px]">
          <span className="h-7 w-7 bg-yellow" aria-hidden />
          {title}
        </h2>
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => {
            const selected = filter.key === department;

            return (
              <button
                key={filter.key}
                type="button"
                aria-pressed={selected}
                aria-controls="careers-roles-list"
                onClick={() => onDepartmentChange(filter.key)}
                className={`border border-ink px-5 py-2.5 font-sans text-[12px] font-bold transition-colors focus-ring ${
                  selected
                    ? "bg-ink text-bone"
                    : "bg-bone text-ink hover:bg-sand"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        id="careers-roles-list"
        aria-live="polite"
        aria-atomic="false"
        className="mt-8 grid gap-5"
      >
        {roles.length > 0 ? (
          roles.map((role) => (
            <RoleRow key={role.code} role={role} apply={apply} lang={lang} />
          ))
        ) : (
          <p className="border border-ink bg-sand p-8 font-sans text-[16px] text-clay">
            {noRoles}
          </p>
        )}
      </div>
    </section>
  );
}
