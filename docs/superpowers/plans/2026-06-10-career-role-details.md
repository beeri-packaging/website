# Career Role Details Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic company pitch in the job-application dialog with role-specific details (description + highlights) authored as two simple Sanity fields, and slim the application form.

**Architecture:** The `careerRole` Sanity object gains two optional plain-text fields. They flow through the existing GROQ query → `CareerRole` type → `CareersRoles` → `JobApplicationDialog` chain. The dialog's dark aside renders the role details when present (generic pitch as fallback); a `md:hidden` copy renders above the form for phones. The form loses the read-only role box and the message textarea. A one-off patch script writes real copy for the three live roles into `careers-he`/`careers-en`.

**Tech Stack:** Next.js 16 App Router, Sanity (GROQ + write client via `npx tsx` scripts), Vitest + Testing Library, Tailwind v4 logical properties.

**Spec:** `docs/superpowers/specs/2026-06-10-career-role-details-design.md`

**Branch:** `feat/career-role-details` (already created; spec committed). The working tree has unrelated uncommitted catalog PNGs — never `git add` them; stage files explicitly by path.

---

### Task 1: `CareerRole` type + fallback copy

**Files:**
- Modify: `app/content/careers.ts`

- [ ] **Step 1: Extend the type**

In `app/content/careers.ts`, replace the `CareerRole` type:

```ts
export type CareerRole = {
  code: string;
  status: string;
  title: string;
  scope: string;
  location: string;
  department: "all" | "production" | "studio";
  /** על התפקיד — 2–4 plain sentences shown in the application dialog. */
  description?: string;
  /** Up to 5 short bullet lines (what you'll do / what's needed). */
  highlights?: readonly string[];
};
```

- [ ] **Step 2: Add the Hebrew copy to the three `he` roles**

In the `he.roles` array (around line 105), replace the three role objects:

```ts
    roles: [
      {
        code: "#BR-402",
        status: "פתוח",
        title: "רכז/ת איכות",
        scope: "משרה מלאה",
        location: "יבנה",
        department: "production",
        description:
          "ניהול מערך האיכות של המפעל ביבנה — מליווי תהליכי הייצור השוטפים ועד שמירה על תקני ISO 9001:2015 ו־FSSC 22000. התפקיד משלב עבודה מול רצפת הייצור, הספקים והלקוחות, עם אחריות מלאה על תיעוד, בקרה ושיפור מתמיד.",
        highlights: [
          "הובלת תהליכי בקרת איכות לאורך כל שרשרת הייצור",
          "אחזקת הסמכות ISO 9001:2015 ו־FSSC 22000 והכנה למבדקים",
          "טיפול באי-התאמות ובתלונות לקוח, כולל הפקת לקחים",
          "ניסיון בתפקיד איכות בתעשייה — יתרון לדפוס או אריזות",
        ],
      },
      {
        code: "#BR-409",
        status: "פתוח",
        title: "מבקר/ת איכות בייצור",
        scope: "משרה מלאה",
        location: "יבנה",
        department: "production",
        description:
          "בקרת איכות שוטפת על רצפת הייצור: בדיקת גיליונות, צבע, חיתוך והדבקה מול דרישות ההזמנה, לפני שהאריזה יוצאת ללקוח. עבודה בצמוד למפעילי המכונות ולרכז/ת האיכות, בסביבה תעשייתית מתקדמת.",
        highlights: [
          "בדיקות איכות בקבלת חומר גלם, במהלך הייצור ובמוצר המוגמר",
          "עצירה ודיווח על אי-התאמות בזמן אמת",
          "עבודה לפי נוהלי ISO ותיעוד מסודר של הבדיקות",
          "דיוק, ירידה לפרטים ונכונות לעבודה במשמרות",
        ],
      },
      {
        code: "#BR-312",
        status: "פתוח",
        title: "מנהל/ת פרויקטים בייצור",
        scope: "משרה מלאה",
        location: "יבנה",
        department: "studio",
        description:
          "הובלת פרויקטים של אריזות מהאפיון הראשון ועד האספקה: תיאום בין הסטודיו, התכנון המבני, הדפוס והייצור, מול לוחות זמנים ותקציב. התפקיד מתאים למי שאוהב/ת לראות מוצר נולד — משרטוט דייליין ועד מדף החנות.",
        highlights: [
          "ניהול לוחות זמנים, עדיפויות ותקשורת מול הלקוח לאורך הפרויקט",
          "תיאום בין צוותי הסטודיו, קדם-הדפוס והייצור",
          "מעקב אחר עלויות, חומרי גלם וזמינות מכונות",
          "ניסיון בניהול פרויקטים בתעשייה או בדפוס — יתרון משמעותי",
        ],
      },
    ],
```

- [ ] **Step 3: Add the English copy to the three `en` roles**

In the `en.roles` array (around line 194), replace the three role objects:

```ts
    roles: [
      {
        code: "#BR-402",
        status: "Open",
        title: "Quality coordinator",
        scope: "Full time",
        location: "Yavne",
        department: "production",
        description:
          "Own the plant's quality system in Yavne — from supporting day-to-day production to maintaining our ISO 9001:2015 and FSSC 22000 certifications. The role combines floor work with suppliers and customers, with full ownership of documentation, control and continuous improvement.",
        highlights: [
          "Lead quality-control processes across the entire production chain",
          "Maintain ISO 9001:2015 and FSSC 22000 certifications and audit readiness",
          "Handle non-conformities and customer complaints, including lessons learned",
          "Industry quality experience — print or packaging an advantage",
        ],
      },
      {
        code: "#BR-409",
        status: "Open",
        title: "Quality inspector, production",
        scope: "Full time",
        location: "Yavne",
        department: "production",
        description:
          "Hands-on quality control on the production floor: checking sheets, color, cutting and gluing against order specs before packaging ships to the customer. You'll work alongside machine operators and the quality coordinator in an advanced industrial environment.",
        highlights: [
          "Quality checks at raw-material intake, during production and on finished goods",
          "Stop and report non-conformities in real time",
          "Work to ISO procedures with orderly inspection records",
          "Precision, attention to detail and willingness to work shifts",
        ],
      },
      {
        code: "#BR-312",
        status: "Open",
        title: "Production project manager",
        scope: "Full time",
        location: "Yavne",
        department: "studio",
        description:
          "Lead packaging projects from first brief to delivery: coordinating studio, structural design, print and production against timelines and budget. A fit for someone who loves seeing a product come to life — from dieline sketch to store shelf.",
        highlights: [
          "Manage timelines, priorities and client communication across each project",
          "Coordinate studio, prepress and production teams",
          "Track costs, raw materials and machine availability",
          "Project-management experience in industry or print — a real advantage",
        ],
      },
    ],
```

- [ ] **Step 4: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add app/content/careers.ts
git commit -m "feat(careers): role description + highlights in CareerRole type and fallbacks"
```

---

### Task 2: Sanity schema + GROQ query

**Files:**
- Modify: `sanity/schemaTypes/careerRole.ts`
- Modify: `sanity/queries.ts:264`

- [ ] **Step 1: Add the two fields to the schema**

In `sanity/schemaTypes/careerRole.ts`, after the `department` field (before the closing `]`), add:

```ts
    defineField({
      name: "description",
      title: "על התפקיד",
      description: "2–4 משפטים קצרים על המשרה. מוצג בחלון הגשת המועמדות.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "highlights",
      title: "נקודות עיקריות",
      description: "עד 5 שורות קצרות — מה עושים בתפקיד ומה נדרש.",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.max(5),
    }),
```

Both fields are intentionally optional (no `required()`): roles without them fall back to the generic pitch.

- [ ] **Step 2: Select the fields in the careers query**

In `sanity/queries.ts` line 264, replace:

```ts
  roles[]{ code, status, title, scope, location, department }
```

with:

```ts
  roles[]{ code, status, title, scope, location, department, description, highlights }
```

No mapping change is needed: `toCareers` uses `doc.roles?.length ? doc.roles : fb.roles` wholesale.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm run test`
Expected: 0 errors; all Vitest suites pass (including `sanity/queries.test.ts`).

- [ ] **Step 4: Commit**

```bash
git add sanity/schemaTypes/careerRole.ts sanity/queries.ts
git commit -m "feat(sanity): description + highlights fields on careerRole, selected in careers query"
```

---

### Task 3: Dialog — details panel, mobile block, slimmer form (TDD)

**Files:**
- Modify: `app/components/careers/JobApplicationDialog.test.tsx`
- Modify: `app/content/jobApplication.ts`
- Modify: `app/components/careers/JobApplicationDialog.tsx`

- [ ] **Step 1: Write the failing tests**

In `JobApplicationDialog.test.tsx`, replace the `role` fixture (line 15) with:

```tsx
const role = { code: "#BR-402", title: "רכז/ת איכות" };
const roleWithDetails = {
  ...role,
  scope: "משרה מלאה",
  location: "יבנה",
  description: "ניהול מערך האיכות של המפעל ביבנה.",
  highlights: ["הובלת תהליכי בקרת איכות", "הכנה למבדקים"],
};
```

Update `renderDialog` so tests can override the role:

```tsx
function renderDialog(
  lang: Lang,
  props: { triggerLabel?: string; role?: typeof roleWithDetails } = {}
) {
  return render(
    <ContactDialogProvider lang={lang}>
      <JobApplicationDialog lang={lang} role={props.role ?? role} triggerLabel={props.triggerLabel} />
    </ContactDialogProvider>
  );
}
```

Append these tests inside the `describe` block:

```tsx
  it("shows role-specific details when the role has a description", () => {
    renderDialog("he", { role: roleWithDetails, triggerLabel: "להגשה" });
    fireEvent.click(screen.getByRole("button", { name: "להגשה" }));
    // Rendered twice (desktop aside + mobile block); CSS hides one per viewport.
    expect(
      screen.getAllByText(roleWithDetails.description).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(roleWithDetails.highlights[0]).length
    ).toBeGreaterThan(0);
    // The generic pitch is replaced.
    expect(screen.queryByText(he.aside.lead)).not.toBeInTheDocument();
  });

  it("falls back to the generic pitch when the role has no description", () => {
    open();
    expect(screen.getByText(he.aside.lead)).toBeInTheDocument();
    expect(screen.getByText(he.aside.perks[0].title)).toBeInTheDocument();
  });

  it("no longer renders the message textarea or the read-only role box", () => {
    open();
    expect(screen.queryByText("כמה מילים")).not.toBeInTheDocument();
    expect(screen.queryByText("המשרה")).not.toBeInTheDocument();
  });
```

(The last test uses string literals on purpose: the `roleLabel` and `message`
copy keys are deleted in Step 3, so they can't be referenced via `he.form`.)

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run app/components/careers/JobApplicationDialog.test.tsx`
Expected: FAIL — the details tests can't find the description text; the message textarea is still rendered.

- [ ] **Step 3: Update the copy file**

In `app/content/jobApplication.ts`:

1. In `JobApplicationCopy["aside"]`, add one key after `kicker`:

```ts
    /** Heading above the role-specific description (replaces the generic pitch). */
    detailsTitle: string;
```

2. In `JobApplicationCopy["form"]`, delete the `roleLabel` and `message` keys.

3. In the `he` object: add `detailsTitle: "על התפקיד",` after `kicker`; delete the
   `roleLabel: "המשרה",` line and the whole `message: {...}` block.

4. In the `en` object: add `detailsTitle: "About the role",` after `kicker`; delete
   `roleLabel: "Role",` and the `message: {...}` block.

- [ ] **Step 4: Update the dialog component**

In `app/components/careers/JobApplicationDialog.tsx`:

1. Widen the role prop (line 23):

```ts
  role?: Pick<
    CareerRole,
    "code" | "title" | "scope" | "location" | "description" | "highlights"
  >;
```

2. Delete the read-only role box (the `{role ? (...) : null}` block wrapping
   `copy.form.roleLabel`, lines 159–169) and the whole message `<div>` (the
   `flex flex-col gap-2` block containing the `textarea`, lines 203–220).
   `handleSubmit` keeps setting `roleCode`/`roleTitle` on FormData — unchanged.

3. Add a `RoleDetails` component at module level (after the `Field` component):

```tsx
function RoleDetails({
  role,
  copy,
  dark,
}: {
  role: NonNullable<JobApplicationDialogProps["role"]>;
  copy: (typeof jobApplicationCopy)[Lang];
  dark?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <span
        className={`font-sans text-[11px] font-bold tracking-[0.08em] ${
          dark ? "text-purple" : "text-clay/80"
        }`}
      >
        {copy.aside.detailsTitle}
      </span>
      {role.scope || role.location ? (
        <span
          className={`font-sans text-[13px] font-semibold ${
            dark ? "text-bone/70" : "text-clay/80"
          }`}
        >
          {[role.scope, role.location].filter(Boolean).join(" · ")}
        </span>
      ) : null}
      <p
        className={`text-balance font-sans text-[16px] leading-[1.6] ${
          dark ? "text-bone/85" : "text-clay"
        }`}
      >
        {role.description}
      </p>
      {role.highlights?.length ? (
        <ul className="flex flex-col gap-3 pt-1">
          {role.highlights.map((line) => (
            <li
              key={line}
              className={`border-s-2 border-cyan ps-4 font-sans text-[13px] leading-[1.5] ${
                dark ? "text-bone/75" : "text-clay"
              }`}
            >
              {line}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
```

4. In the aside, replace the generic kicker/lead block AND the perks `<ul>`
   (keep the code tag above and the dashed divider + inquire button below) with:

```tsx
              {role?.description ? (
                <>
                  <RoleDetails role={role} copy={copy} dark />
                  <span className="h-px w-full border-t border-dashed border-cyan/60" />
                </>
              ) : (
                <>
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
                </>
              )}
```

(When details render, the dashed divider between them and the inquire button
stays — keep the second `<span className="h-px ...">` if present, or add one
divider before the button so both branches read the same.)

5. In `DialogMain`, directly after the closing `</header>` and before `<form`,
   add the mobile-only block (renders only when a description exists):

```tsx
              {role?.description ? (
                <div className="border border-ink bg-sand p-5 md:hidden">
                  <RoleDetails role={role} copy={copy} />
                </div>
              ) : null}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run app/components/careers/JobApplicationDialog.test.tsx`
Expected: PASS — all tests, including the four pre-existing ones.

- [ ] **Step 6: Full unit suite + types**

Run: `npx tsc --noEmit && npm run test`
Expected: 0 type errors, all suites green. If `app/[locale]/design/page.tsx`
references the dialog with a role object, optional fields keep it compiling.

- [ ] **Step 7: Commit**

```bash
git add app/components/careers/JobApplicationDialog.tsx app/components/careers/JobApplicationDialog.test.tsx app/content/jobApplication.ts
git commit -m "feat(careers): role-specific details in the application dialog, slimmer form"
```

---

### Task 4: Patch the live Sanity documents

**Files:**
- Create: `scripts/update-career-roles.ts`

- [ ] **Step 1: Write the patch script**

```ts
// scripts/update-career-roles.ts
//
// One-off: write the role-specific description + highlights for the three
// open roles into careers-he / careers-en, matching items by code — without
// re-running the full seed, so client edits elsewhere are untouched.
//
// Run: npx tsx scripts/update-career-roles.ts

import { writeClient } from "./lib/sanity-write-client";
import { careersCopy } from "../app/content/careers";

async function main() {
  for (const lang of ["he", "en"] as const) {
    const id = `careers-${lang}`;
    const sets: Record<string, unknown> = {};
    for (const role of careersCopy[lang].roles) {
      if (!role.description) continue;
      sets[`roles[code=="${role.code}"].description`] = role.description;
      sets[`roles[code=="${role.code}"].highlights`] = [...(role.highlights ?? [])];
    }
    const res = await writeClient.patch(id).set(sets).commit({ autoGenerateArrayKeys: false });
    const withDetails = (res.roles as { code: string; description?: string }[]).filter(
      (r) => r.description
    );
    console.log(`✓ ${id}: ${withDetails.length}/3 roles have details`, withDetails.map((r) => r.code));
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Run it**

Run: `npx tsx scripts/update-career-roles.ts`
Expected output: `✓ careers-he: 3/3 roles have details [...]` and the same for `careers-en`.
Requires the Sanity write token already in `.env.local`. Note: the public site
reads through the CDN — edits can lag ~30–60s.

- [ ] **Step 3: Commit**

```bash
git add scripts/update-career-roles.ts
git commit -m "chore(sanity): patch careers roles with description + highlights"
```

---

### Task 5: Gates + visual verification

- [ ] **Step 1: Standard gates**

Run: `npm run lint && npx tsc --noEmit && npm run test && npm run test:e2e`
Expected: all green; e2e renders both `/he` and `/en`.

- [ ] **Step 2: Visual pass**

Start the dev server (preview tooling or `npm run dev`). On `/he`, scroll to the
roles list, click להגשה on רכז/ת איכות, and verify:
- Desktop (≥768px): dark panel shows מק״ט tag, "על התפקיד", "משרה מלאה · יבנה",
  the description paragraph, cyan-bordered bullets, dashed divider, inquire
  button, "1964" watermark. Form shows only name/phone/email/CV/submit.
- Mobile (~375px): the sand-colored details block appears above the form;
  the dark panel is absent.
- Repeat on `/en` for the English copy.
- Submit a test application (name/phone/email) and confirm the success panel
  still appears.

- [ ] **Step 3: Final commit (if any fixups) and report**

```bash
git status --short   # only intended files; catalog PNGs stay uncommitted
```
