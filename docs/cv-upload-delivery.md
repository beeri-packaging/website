# CV uploads and email delivery

The careers form accepts one PDF, DOC or DOCX up to 10 MiB (10,485,760 bytes), displayed as 10MB.

1. `prepareCvUpload` validates the application and issues a 15-minute token for a single random private Blob path. The token is restricted to the declared file size, type and no overwrites.
2. The browser uploads the file directly to the private `beeri-cv-uploads` store. No CV bytes go through a Vercel Function request.
3. `submitJobApplication` accepts a signed, one-hour receipt bound to the application fields. It reads only that private store path, checks the complete file size and sends the raw bytes as an attachment via Resend.
4. The recipient is `JOBS_TO_EMAIL` (fallback: `jobs@beeripacks.co.il`). The sender remains `CONTACT_FROM_EMAIL`.
5. A successful email send deletes the temporary Blob. A failed send keeps the form available for retry. Abandoned uploads older than 24 hours are swept on subsequent upload authorizations; this is activity-triggered cleanup, not a daily scheduled job.

## Deployment

Connect a **private** Vercel Blob store to the company `BEERI / website` project for Production and Preview, including `BLOB_READ_WRITE_TOKEN`. Keep the token server-only. Do not use the public Sanity media library for CVs.

The existing 4.25MB Server Action request limit remains only for compatibility with previously opened forms; it does not control the direct-upload limit.

## Verification

Unit tests cover token limits, forged/expired/mismatched receipts, the full 10 MiB attachment bytes, send failure, and cleanup ordering. The regular browser suite uses the honeypot and sends no emails. Actual email delivery must be tested explicitly with a synthetic file and an authorized test recipient; never silently send to the company jobs inbox.
