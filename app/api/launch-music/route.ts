import { launchMusicAsset } from "@/app/content/launch";

/** Serve the fixed licensed asset on this origin so Web Audio also works on preview hosts. */
export async function GET() {
  try {
    const response = await fetch(launchMusicAsset, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(6000) });
    if (!response.ok) return new Response(null, { status: 502 });
    return new Response(await response.arrayBuffer(), {
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=3600, s-maxage=86400" },
    });
  } catch {
    return new Response(null, { status: 503 });
  }
}
