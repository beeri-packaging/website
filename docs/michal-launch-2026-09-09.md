# Internal launch presentation

The approved local presentation uses a ten-second countdown, followed by the
existing website reveal and a 32-second music/fireworks tail. The soundtrack
starts from zero and uses its own rhythm instead of synthetic countdown chimes.
The website layout and public launch soundtrack are unchanged.

## Local setup

Provide the internal audio separately at
`review-assets/launch/michal-internal-v2.mp3`. This file and `.env.local` are
ignored by Git. Set the following local environment values and rebuild:

```dotenv
BEERI_INTERNAL_LAUNCH_MUSIC=1
BEERI_INTERNAL_LAUNCH_SECONDS=10
```

Run `npm run build`, then
`npm run start -- --hostname 127.0.0.1 --port 3002`.
Open `/he?launch=presentation` or `/en?launch=presentation` to replay.

The internal route returns private, non-cacheable responses. Local audio is
excluded from deployment file tracing. The separately configured remote
private store supplies the approved audio for authorized presentations.
Without the local opt-in, the existing public soundtrack remains selected.

An inactive fifteen-second comparison can be selected locally with
`BEERI_INTERNAL_LAUNCH_SECONDS=15` and a separately supplied
`review-assets/launch/michal-internal-v3-15s.mp3`. The approved setting remains
10; the v2 audio was restored unchanged after the comparison.

## Remote presentation

The approved v2 audio is stored in a private Vercel Blob store, separately from
Git and Sanity. Production and preview opt in with
`BEERI_INTERNAL_LAUNCH_MUSIC=1`, `BEERI_LAUNCH_READ_WRITE_TOKEN`, and the existing
`LAUNCH_ACCESS_TOKEN` / `LAUNCH_LINK_EXPIRES_AT` settings. The browser forwards
its presentation access key only to the same-origin internal audio endpoint.
The endpoint rechecks the key and expiry before reading private storage and
returns non-cacheable audio. Requests without valid access cannot fetch it.
Remote presentations always use ten seconds, regardless of the local trial flag.

To test a deployed presentation, supply `E2E_BASE_URL` and `E2E_LAUNCH_ACCESS`
from the environment alongside the internal soundtrack test flags below.
Never put the access key or storage token into Git or test command arguments.

## Verification

Lint, TypeScript, production build and 121 unit tests passed. The full browser
suite passed 48 tests during the initial internal edit. All seven launch tests
also passed for the fifteen-second comparison. After restoring ten seconds,
the production build and full-length real-audio playback test passed again.
The restored endpoint serves bytes identical to the unchanged v2 file.

The playback test checks all countdown numbers, one decoded audio source,
reveal timing within half a second of the music cue, fireworks for at least
30 seconds after reveal, and automatic cleanup after the 42-second soundtrack.
Run it against the configured local server with:

```sh
E2E_PORT=3002 E2E_INTERNAL_LAUNCH_MUSIC=1 E2E_INTERNAL_LAUNCH_SECONDS=10 npm run test:e2e -- e2e/launch.spec.ts --grep 'video-only presentation'
```

## Verified publication — 9 September 2026

- Application commit: `4f614eb8d41474b8b1ddbccdca2d3b8b800f2ce6`, pushed to
  `main` and `codex/michal-launch-september-9`.
- Preview: `https://beeri-arizot-1bxc-j645p0h82-asd12288s-projects.vercel.app`,
  deployment `dpl_D8RPWuCxX9xUhAb6hhs1TaGyqYSd`, Ready.
- Production: `https://beeri-arizot-1bxc.vercel.app`, deployment
  `dpl_2GJ1pLMnRmNJhqpEPoKHTUQp4D5x`, Ready and promoted. The domain-to-deployment
  mapping was verified independently through the alias API.
- Production build took 66 seconds. Both deployments use the same application
  commit; production was checked before assigning the main domain.
- The approved 42-second audio is served remotely, byte-for-byte identical to
  the local v2 file (1,009,514 bytes). Its private storage URL rejects anonymous
  requests with 403. The application route rejects missing/incorrect access
  keys with 404 and uses private/no-store responses. Unit tests cover expiry.
- The existing presentation key and expiry were preserved in production and
  configured identically in preview. The link expires at midnight entering
  Saturday 12 September in Israel. Normal visits do not show the launch.
- Lint, TypeScript, build, 126 unit tests, and all 48 local browser tests passed.
  All seven launch browser tests passed separately on the preview deployment
  and on the production domain, including real audio playback, ten countdown
  numbers, synchronized reveal, 30 seconds of fireworks, and automatic cleanup.
- Both languages returned 200; unauthorized presentation links redirected to
  normal pages. The preview countdown and fireworks were also checked visually.
- A production mobile Lighthouse run measured performance 95, accessibility 100,
  total blocking time 10 ms and cumulative layout shift 0. Error-level log queries
  returned no entries on either deployment at verification time.
- Audio, credentials, private source messages and verification artifacts remain
  outside Git. No CMS changes or custom-domain settings were made.
