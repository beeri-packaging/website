# Career role details in the application dialog — design

**Date:** 2026-06-10
**Status:** approved (user)

## Problem

A job seeker who opens the application dialog never learns anything about the
specific job. The dark aside panel shows the same generic company pitch and the
same three perks (יציבות / צוות / התמקצעות) for every role, because the
`careerRole` object in Sanity has no description fields at all — editors can
only fill code, status, title, scope, location and department. The dialog
compensates by feeling like a long, unexplained form.

Two personas drive the fix:

- **The editor** posting a job in Sanity Studio: must stay simple — a couple of
  plain-text boxes, no rich-text authoring.
- **The applicant**: must quickly understand the role and apply with minimal
  friction, on mobile too.

## Decision (user-approved)

Keep the existing two-column split dialog. One column becomes a slimmer form;
the other shows the details of the specific job.

### 1. Sanity schema (`sanity/schemaTypes/careerRole.ts`)

Add two optional fields to the existing משרה object:

- `description` — title **על התפקיד**, `type: "text"` (rows: 3). 2–4 plain
  sentences about the role.
- `highlights` — title **נקודות עיקריות**, `array` of `string`, max 5 short
  bullet lines (what you'll do / what's needed).

Both optional for backward compatibility: a role without a description renders
today's generic pitch as fallback.

### 2. Application dialog (`app/components/careers/JobApplicationDialog.tsx`)

**Details column (dark `DialogAside`, md+ only):**

- Keep: role-code tag, "1964" watermark, the "יש לי שאלה — לפנייה כללית"
  general-inquiry button.
- Replace the generic kicker/lead/perks with, in order: a meta line
  (`scope · location`), the על התפקיד paragraph, the highlight bullets reusing
  the existing cyan `border-s-2 border-cyan ps-4` list style.
- Fallback: when the role has no `description`, render the current generic
  pitch + perks unchanged.

**Form column (`DialogMain`):**

- Remove the read-only role box (title + code already sit in the dialog
  header) and the optional message textarea.
- Remaining fields: name, phone, email, CV upload, submit. Honeypot stays.
- `roleCode`/`roleTitle` keep being injected into the FormData on submit (the
  server action contract does not change).

**Mobile (`< md`):**

- `DialogAside` is `hidden md:flex`, so render the same details (meta line,
  paragraph, bullets) as a compact `md:hidden` block above the form. Each
  viewport shows exactly one copy, so screen readers hear it once.
- When the role has no `description`, the mobile block does not render at all
  (status quo on phones — the generic pitch stays desktop-only).

### 3. Data flow

- `CareerRole` type in `app/content/careers.ts` gains
  `description?: string; highlights?: readonly string[]`.
- GROQ careers query + mapping in `sanity/queries.ts` select the new fields.
- Real Hebrew/English copy for the three live roles (#BR-402, #BR-409,
  #BR-312) is written into the he/en fallbacks in `app/content/careers.ts`
  (Hebrew via the hebrew-content-writer skill) and pushed to the live
  `careers-he` / `careers-en` documents with a one-off patch script
  `scripts/update-career-roles.ts` (same pattern as `seed-finishing.ts` —
  editing the fallback file alone does not change the live site).
- All dialog chrome strings live in `jobApplicationCopy`
  (`app/content/jobApplication.ts`): drop the message-field copy there and add
  any new details labels there; `messages/{he,en}.json` is not involved.

### 4. Out of scope

- No change to the roles list rows, filters, or the careers section layout.
- No change to the contact dialog, server action, or Resend delivery.
- No rich-text (portable text) authoring for roles.

### 5. Verification

- Update `JobApplicationDialog.test.tsx`: removed fields gone, details render
  from role data, generic fallback when `description` is absent.
- Standard gates: `npm run lint`, `tsc --noEmit`, `npm run test`,
  `npm run test:e2e` (both locales render), visual pass on `/he` + `/en`
  (desktop + mobile dialog).
