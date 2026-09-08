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

## Production result

- Application commit: `672a712` (pushed to `origin/main`, including launch commit `1a5abd8`).
- Vercel deployment: `dpl_GDf4n1EXbGGU79M1QyYimgUG7Yeo`, **Ready / production**.
- Production URL: https://beeri-arizot-1bxc.vercel.app
- Immutable URL: https://beeri-arizot-1bxc-qcsn7p0b1-asd12288s-projects.vercel.app
- Built with production settings, verified before domain assignment, then promoted.
- Live verification: 18 pages returned HTTP 200; English branding, lab copy,
  catalog photo, certificate links and bilingual article links passed assertions.
- Both published PDFs matched the supplied files byte for byte.
- Unsigned/incorrect launch links returned 307 to the ordinary site. The authorized
  link returned 200 with private/no-store, no-referrer and noindex headers.
- Browser verification on production: ordinary English visit had no launch;
  authorized Hebrew link showed the launch button, counted down from 30 and
  displayed visible fireworks over the live site.
- Error-level log query for this deployment returned no entries at verification time.
- The shareable access key is in Vercel environment configuration and the ignored
  local `.env.launch-release`; it is not stored in this document or the repository.
