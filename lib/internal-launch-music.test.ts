import { describe, expect, it } from "vitest";
import { internalLaunchMusicEnabled, internalLaunchCountdownSeconds } from "./internal-launch-music";

describe("internal presentation soundtrack", () => {
  it("requires explicit local activation", () => {
    expect(internalLaunchMusicEnabled({ NODE_ENV: "test" })).toBe(false);
    expect(internalLaunchMusicEnabled({ NODE_ENV: "test", BEERI_INTERNAL_LAUNCH_MUSIC: "0" })).toBe(false);
    expect(internalLaunchMusicEnabled({ NODE_ENV: "test", BEERI_INTERNAL_LAUNCH_MUSIC: "1" })).toBe(true);
  });
  it("stays disabled on Vercel even with the local flag set", () => {
    expect(internalLaunchMusicEnabled({ NODE_ENV: "production", VERCEL: "1", BEERI_INTERNAL_LAUNCH_MUSIC: "1" })).toBe(false);
  });
});

it("selects fifteen seconds only for the explicit internal trial", () => {
  const env = { NODE_ENV: "test" as const, BEERI_INTERNAL_LAUNCH_MUSIC: "1", BEERI_INTERNAL_LAUNCH_SECONDS: "15" };
  expect(internalLaunchCountdownSeconds(env)).toBe(15);
  expect(internalLaunchCountdownSeconds({ ...env, BEERI_INTERNAL_LAUNCH_SECONDS: "10" })).toBe(10);
  expect(internalLaunchCountdownSeconds({ ...env, BEERI_INTERNAL_LAUNCH_MUSIC: "0" })).toBe(10);
  expect(internalLaunchCountdownSeconds({ ...env, VERCEL: "1" })).toBe(10);
});
