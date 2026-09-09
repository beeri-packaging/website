import { readFile } from "node:fs/promises";
import path from "node:path";
import { get } from "@vercel/blob";
import { internalLaunchMusicEnabled, internalLaunchCountdownSeconds } from "@/lib/internal-launch-music";
import { launchLinkAllowed } from "@/lib/launch-link";

const headers = {
  "Content-Type": "audio/mpeg",
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "Referrer-Policy": "no-referrer",
};

/** The same expiring presentation credential protects the private remote soundtrack. */
export async function GET(request: Request) {
  if (!internalLaunchMusicEnabled()) return new Response(null, { status: 404, headers });
  if ((process.env.VERCEL || process.env.LAUNCH_ACCESS_TOKEN) && !launchLinkAllowed(
    request.headers.get("X-Launch-Access"),
    process.env.LAUNCH_ACCESS_TOKEN,
    process.env.LAUNCH_LINK_EXPIRES_AT,
  )) return new Response(null, { status: 404, headers });

  try {
    if (process.env.VERCEL) {
      const audio = await get("launch/michal-internal-v2.mp3", {
        access: "private",
        token: process.env.BEERI_LAUNCH_READ_WRITE_TOKEN,
        abortSignal: AbortSignal.timeout(6000),
      });
      if (!audio || audio.statusCode !== 200) return new Response(null, { status: 502, headers });
      return new Response(audio.stream, { headers });
    }
    const filename = internalLaunchCountdownSeconds() === 15 ? "michal-internal-v3-15s.mp3" : "michal-internal-v2.mp3";
    const audio = await readFile(path.join(process.cwd(), "review-assets/launch", filename));
    return new Response(new Uint8Array(audio), { headers });
  } catch {
    return new Response(null, { status: 503, headers });
  }
}
