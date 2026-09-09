/** This presentation-only soundtrack is never enabled on Vercel. */
export function internalLaunchMusicEnabled(env: NodeJS.ProcessEnv = process.env) {
  return env.BEERI_INTERNAL_LAUNCH_MUSIC === "1" && !env.VERCEL;
}

/** Keep the approved ten-second version available for local A/B comparison. */
export function internalLaunchCountdownSeconds(env: NodeJS.ProcessEnv = process.env) {
  return internalLaunchMusicEnabled(env) && env.BEERI_INTERNAL_LAUNCH_SECONDS === "15" ? 15 : 10;
}
