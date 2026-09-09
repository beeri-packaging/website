/** Opt in to the internal soundtrack; remote use requires private storage and a protected link. */
export function internalLaunchMusicEnabled(env: NodeJS.ProcessEnv = process.env) {
  return env.BEERI_INTERNAL_LAUNCH_MUSIC === "1" && (!env.VERCEL || Boolean(
    env.BEERI_LAUNCH_READ_WRITE_TOKEN && env.LAUNCH_ACCESS_TOKEN && env.LAUNCH_LINK_EXPIRES_AT,
  ));
}

/** The deployed presentation always uses the approved ten-second edit. */
export function internalLaunchCountdownSeconds(env: NodeJS.ProcessEnv = process.env) {
  return !env.VERCEL && internalLaunchMusicEnabled(env) && env.BEERI_INTERNAL_LAUNCH_SECONDS === "15" ? 15 : 10;
}
