# Approved production release — 8 September 2026

The user approved publishing all reviewed feedback and the existing launch experience.
The follow-up requires the celebration to be visible only through a special link,
valid through Friday 11 September in Israel. At `2026-09-12T00:00:00+03:00`, the
link redirects to the ordinary website. Normal visits have no launch campaign.

## Published content

- Uploaded the final SABON image, supplied English logo, two certificate previews
  and two original certificate PDFs to Sanity.
- Published 33 changed Hebrew/English documents in one revision-checked transaction.
- Preserved an export of the documents before publication in the ignored
  `output/production-release/` folder. A follow-up dry run reported no pending changes.
- CMS fields now contain the approved copy, catalog placement, article links, logo
  and certificates. Studio schemas expose the new fields for future editing.
- The approved fallback adapters in `app/content/client-feedback.ts` apply only to
  bundled fallback content; fetched CMS content remains editable. Punctuation
  normalization is shared. New assets use Sanity CDN URLs, not local routes.
- The local-only asset route and environment gates were removed. Original review
  attachments remain on this computer and are excluded from Git/deployment uploads.

## Launch access

- `LAUNCH_ACCESS_TOKEN`: server-side key for the shareable link; not committed.
- `LAUNCH_LINK_EXPIRES_AT`: `2026-09-12T00:00:00+03:00`.
- No `LAUNCH_START_AT` / `LAUNCH_END_AT` campaign is enabled.
- On Vercel, missing/incorrect keys and expired links redirect to the ordinary page.
- Authorized launch responses are private/no-store and noindex, with no-referrer.
- The production project is `beeri-arizot-1bxc`, with the configured production
  domain `beeri-arizot-1bxc.vercel.app`. No custom domain is attached to this project.

The original feedback records describe the local review before this publication:
`docs/orly-feedback-2026-09-08.md` and `docs/michal-feedback-2026-09-08.md`.

## Verification before deployment

- Build, lint and TypeScript passed.
- All 118 unit tests and all 46 browser tests passed (3.5 minutes).
- Tests cover both languages, catalog inventory/images, accessibility and the
  complete countdown/music/fireworks experience, including reduced motion.
- Expiry tests cover the exact Friday/Saturday midnight boundary in Israel and
  missing/incorrect access keys.
- Direct CMS reads confirmed four standards with working CDN PDF URLs, the
  premium placement of the SABON carton, and both article links in both languages.
