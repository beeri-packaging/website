export const LAUNCH_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export type LaunchConfig = {
  startsAt: number;
  endsAt: number;
  storageKey: string;
  cooldownMs: number;
};

/** Explicit dates only: rebuilding or restarting never extends the campaign. */
export function launchConfig(start?: string, end?: string): LaunchConfig {
  const startsAt = Date.parse(start ?? "");
  const endsAt = Date.parse(end ?? "");
  const valid = Number.isFinite(startsAt) && Number.isFinite(endsAt) && endsAt > startsAt;
  return {
    startsAt: valid ? startsAt : 0,
    endsAt: valid ? endsAt : 0,
    storageKey: `beeri:launch:v1:${valid ? startsAt : "preview"}`,
    cooldownMs: LAUNCH_COOLDOWN_MS,
  };
}

/** Self-contained because this also runs inline before the first paint. */
export function launchBootstrap(config: LaunchConfig) {
  const root = document.documentElement;
  try {
    const url = new URL(window.location.href);
    const home = /^\/(he|en)?\/?$/.test(url.pathname);
    const mode = url.searchParams.get("launch");
    const preview = home && (mode === "presentation" || mode === "preview");
    const now = Date.now();
    const active = now >= config.startsAt && now < config.endsAt;
    // Suppress the older logo intro throughout the launch, including return visits.
    if (active || preview) root.setAttribute("data-launch-campaign", "on");
    if (!home || (!active && !preview)) return;
    if (!preview) {
      // If persistence is unavailable, fail open into the ordinary website.
      const last = Number(window.localStorage.getItem(config.storageKey) || window.sessionStorage.getItem(config.storageKey));
      if (last > 0 && now - last < config.cooldownMs) return;
      window.localStorage.setItem(config.storageKey, String(now));
      window.sessionStorage.setItem(config.storageKey, String(now));
    }
    root.setAttribute("data-launch", mode === "presentation" ? "ready" : "countdown");
    // A broken/slow client bundle must never leave an opaque screen over the site.
    const timer = window.setTimeout(() => {
      root.removeAttribute("data-launch");
      const dialog = document.getElementById("launch-reveal") as HTMLDialogElement | null;
      dialog?.close();
    }, 12000);
    root.setAttribute("data-launch-safety", String(timer));
  } catch {
    root.removeAttribute("data-launch");
  }
}

export function launchScript(config: LaunchConfig) {
  return `(${launchBootstrap.toString()})(${JSON.stringify(config).replace(/</g, "\\u003c")});`;
}
