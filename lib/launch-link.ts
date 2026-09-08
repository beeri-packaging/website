/** Server-side access check for the temporary, shareable launch link. */
export function launchLinkAllowed(
  supplied: string | null,
  expected: string | undefined,
  expiresAt: string | undefined,
  now = Date.now(),
) {
  const deadline = Date.parse(expiresAt ?? "");
  return Boolean(expected && supplied === expected && Number.isFinite(deadline) && now < deadline);
}
