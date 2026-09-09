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

The internal route returns private, non-cacheable responses. It is disabled on
Vercel, and internal audio is excluded from deployment file tracing. Pushing
this code does not publish the soundtrack or activate it on the public site.
Without the local opt-in, the existing public soundtrack remains selected.

An inactive fifteen-second comparison can be selected locally with
`BEERI_INTERNAL_LAUNCH_SECONDS=15` and a separately supplied
`review-assets/launch/michal-internal-v3-15s.mp3`. The approved setting remains
10; the v2 audio was restored unchanged after the comparison.

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
