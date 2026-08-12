export const PUBLIC_MAINTENANCE_ROUTE = "/under-construction";

const PRODUCTION_HOSTS = new Set([
  "beeripacks.co.il",
  "www.beeripacks.co.il",
]);

export function isPublicProductionHost(hostname: string) {
  return PRODUCTION_HOSTS.has(hostname.toLowerCase());
}

export function requestHostname(
  forwardedHost: string | null,
  host: string | null,
  fallback: string,
) {
  const authority = (forwardedHost ?? host ?? fallback).split(",", 1)[0].trim();
  return authority.replace(/:\d+$/, "").toLowerCase();
}

export function maintenanceLocale(pathname: string) {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "he";
}
