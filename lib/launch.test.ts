import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LAUNCH_COOLDOWN_MS, launchBootstrap, launchConfig, launchScript } from "./launch";
import { launchLinkAllowed } from "./launch-link";

describe("temporary launch link", () => {
  const expires = "2026-09-12T00:00:00+03:00";
  it("accepts the shared link through Friday and expires at Israel midnight", () => {
    expect(launchLinkAllowed("test-key", "test-key", expires, Date.parse(expires) - 1)).toBe(true);
    expect(launchLinkAllowed("test-key", "test-key", expires, Date.parse(expires))).toBe(false);
  });
  it("rejects missing, incorrect or unconfigured access and invalid expiry", () => {
    const now = Date.parse(expires) - 1;
    expect(launchLinkAllowed(null, "test-key", expires, now)).toBe(false);
    expect(launchLinkAllowed("wrong", "test-key", expires, now)).toBe(false);
    expect(launchLinkAllowed(null, undefined, expires, now)).toBe(false);
    expect(launchLinkAllowed("test-key", "test-key", "bad-date", now)).toBe(false);
  });
});

const start = "2026-09-10T09:00:00+03:00";
const end = "2026-09-15T09:00:00+03:00";
const config = launchConfig(start, end);

function browserStorage(): Storage {
  const values = new Map<string, string>();
  return {
    get length() { return values.size; },
    clear: () => values.clear(),
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, value); },
    removeItem: key => { values.delete(key); },
    key: index => [...values.keys()][index] ?? null,
  };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-09-11T10:00:00+03:00"));
  // Node 25 exposes its own storage globals; provide browser storage explicitly.
  vi.stubGlobal("localStorage", browserStorage());
  vi.stubGlobal("sessionStorage", browserStorage());
  window.history.replaceState({}, "", "/he");
  document.documentElement.removeAttribute("data-launch");
  document.documentElement.removeAttribute("data-launch-campaign");
});
afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe("launch schedule and repeat visits", () => {
  it("defaults to off and rejects invalid/reversed dates", () => {
    for (const settings of [launchConfig(), launchConfig("invalid", end), launchConfig(end, start)]) {
      launchBootstrap(settings);
      expect(document.documentElement.hasAttribute("data-launch")).toBe(false);
    }
  });

  it("shows on the first visit, suppresses both locales for 24 hours, then permits another visit", () => {
    launchBootstrap(config);
    expect(document.documentElement.getAttribute("data-launch")).toBe("countdown");
    document.documentElement.removeAttribute("data-launch");
    window.history.replaceState({}, "", "/en");
    vi.advanceTimersByTime(LAUNCH_COOLDOWN_MS - 1);
    launchBootstrap(config);
    expect(document.documentElement.hasAttribute("data-launch")).toBe(false);
    expect(document.documentElement.getAttribute("data-launch-campaign")).toBe("on");
    vi.advanceTimersByTime(1);
    launchBootstrap(config);
    expect(document.documentElement.getAttribute("data-launch")).toBe("countdown");
  });

  it("enforces the exact start and end independently of visitor history", () => {
    vi.setSystemTime(config.startsAt - 1);
    launchBootstrap(config);
    expect(document.documentElement.hasAttribute("data-launch")).toBe(false);
    vi.setSystemTime(config.startsAt);
    launchBootstrap(config);
    expect(document.documentElement.hasAttribute("data-launch")).toBe(true);
    document.documentElement.removeAttribute("data-launch");
    vi.setSystemTime(config.endsAt);
    window.localStorage.clear(); window.sessionStorage.clear();
    launchBootstrap(config);
    expect(document.documentElement.hasAttribute("data-launch")).toBe(false);
  });

  it("replays presentation without a schedule or changing visitor history", () => {
    window.history.replaceState({}, "", "/he?launch=presentation");
    launchBootstrap(launchConfig());
    expect(document.documentElement.getAttribute("data-launch")).toBe("ready");
    expect(window.localStorage.length).toBe(0);
  });

  it("does not obstruct direct links to internal pages", () => {
    window.history.replaceState({}, "", "/he/catalog?launch=presentation");
    launchBootstrap(config);
    expect(document.documentElement.hasAttribute("data-launch")).toBe(false);
  });

  it("fails open if browser storage is blocked", () => {
    vi.spyOn(window.localStorage, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    launchBootstrap(config);
    expect(document.documentElement.hasAttribute("data-launch")).toBe(false);
  });

  it("executes the serialized pre-paint script without module dependencies and unlocks after a stalled load", () => {
    window.eval(launchScript(config));
    expect(document.documentElement.hasAttribute("data-launch")).toBe(true);
    vi.advanceTimersByTime(12000);
    expect(document.documentElement.hasAttribute("data-launch")).toBe(false);
  });
});
