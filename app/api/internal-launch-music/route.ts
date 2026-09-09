import { readFile } from "node:fs/promises";
import path from "node:path";
import { internalLaunchMusicEnabled, internalLaunchCountdownSeconds } from "@/lib/internal-launch-music";

/** Local presentation media; deliberately excluded from deployment file tracing. */
export async function GET() {
  if (!internalLaunchMusicEnabled()) return new Response(null, { status: 404 });
  try {
    const filename = internalLaunchCountdownSeconds() === 15 ? "michal-internal-v3-15s.mp3" : "michal-internal-v2.mp3";
    const audio = await readFile(path.join(process.cwd(), "review-assets/launch", filename));
    return new Response(new Uint8Array(audio), {
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
