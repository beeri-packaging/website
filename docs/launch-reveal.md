# Upbeat website launch — 8 September 2026

Built on `origin/main` commit `58420a2950a81c32714b3c9da2f1ee39c924128a`,
including the approved catalog imagery and normalized client logo marquee.
The isolated checkout is `/Users/ilanchelly/dev/beeri-launch`, branch
`codex/upbeat-launch-countdown`. The original Desktop checkout was left intact.

## Preview

Run `npm run start -- --port 3002` after `npm run build`.
Open `/he?launch=presentation` or `/en?launch=presentation` and press the launch button.
The hero film restarts full-screen, with 10 seconds of upbeat music, with light ascending chimes marking the final five
numbers. During the final two seconds the film fades to cream. At zero,
the existing canvas-confetti cannons fire above a framed view of the real website.
The page starts at 82% scale (88% on mobile), holds briefly, then expands to full
size over 2.4 seconds. Its hero video resumes after the expansion. All temporary
height, overflow and transform styling is then removed; the website stays unchanged.
The sound has a 32-second musical outro. Fireworks continue for 30 seconds after
the reveal, followed by two seconds for the last sparks to settle. Effects finish
automatically without an End celebration button. The transparent overlay allows
normal clicks and scrolling; fireworks use the dynamically loaded `fireworks-js`
library (https://github.com/crashmax-dev/fireworks-js). Reload the presentation link to replay.

The countdown reads the Web Audio playback clock. Audio is decoded before playing;
late activation seeks to the current countdown time. Playback starts from asset second 20.
Failed audio downloads fall back to a silent elapsed-time countdown. Skip and
Escape close the intro. Sound/video controls are omitted; reduced motion
uses a still image and suppresses confetti, fireworks and the zoom. No audio is loaded on ordinary visits
when the launch is disabled.

## Schedule

Set `LAUNCH_START_AT` and `LAUNCH_END_AT` to ISO timestamps with timezones to enable
a temporary homepage campaign. Both are unset by default. After the end time,
the normal website opens. Ordinary visitors see it at most once per 24 hours in
the same browser, shared across Hebrew/English. Presentation and preview links
bypass dates and cooldown; they do not bypass production maintenance mode.

## Music provenance

**I Do!**, Michael Ramir C., Mixkit track 1001.
Source: https://mixkit.co/free-stock-music/edm/
Original audio: https://assets.mixkit.co/music/1001/1001.mp3
License: https://mixkit.co/license/#musicFree (verified 8 September 2026).

The Stock Music Free License permits modified excerpts in commercial web projects.
Do not distribute it as a standalone music product, claim authorship, or register Content ID.
The source file is not included in this repository. The excerpt is a Sanity asset:
`file-ec3e7b08da6933126765f169bd4c7c6afff00ef4-mp3` (1,489,650 bytes).
The fixed `/api/launch-music?v=ec3e7b08` endpoint avoids cross-origin audio decoding
restrictions and prevents the earlier soundtrack being reused from browser cache.

The excerpt runs from original 7.5 to 69.5 seconds. A strong beat at original 37.5
seconds matches the 10-second website reveal. Playback skips the first 20 seconds
of the asset and adds a 0.4-second entrance fade,
and fades from 59 to 62 seconds. Five soft ascending chimes are scheduled at
seconds 5–9 on the same audio clock. The final experience has no spoken voice,
ominous cinematic riser, or sub-bass impacts.

## Validation

Production build, lint, TypeScript, and 118 unit tests pass. Browser verification
includes actual decoded playback, all 10 numbers, automatic audio and absence of sound/video controls,
reveal within 0.5 seconds of the audio cue, visible confetti, mobile/reduced motion,
keyboard access, and failed audio downloads. Full-suite results are recorded below.

The zoom reveal passed all 45 browser tests. After adding fireworks, the updated
launch tests also cover the full 30-second celebration, actual rendered sparks,
scrolling through the overlay, automatic cleanup without an end button, and reduced motion.

Mobile Lighthouse on the ordinary homepage: Performance 66, Accessibility 100,
LCP 4.9s, CLS 0. This run does not meet the project performance target.

The soundtrack plays for 42 seconds from the 62-second asset and fades during the final three seconds,
covering all 30 seconds of fireworks and the two seconds for the sparks to settle. Links are usable from second 10; normal scrolling resumes after the 2.4-second reveal.

The promo logo uses the brand cyan through an SVG color filter that preserves transparency; header/footer logos retain their supplied colors.

September 8 follow-up: shortened the countdown to ten seconds, removed sound/video and End celebration controls, and made the promo logo cyan in both languages. The full countdown browser checks now follow ten numbers and verify the music seeks forward while retaining the same reveal beat and complete outro. A pre-existing job-application test now waits for the pending submit state to finish after an upload rejection before checking that retry is enabled; production form behavior is unchanged.
