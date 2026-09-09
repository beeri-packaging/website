import { describe, expect, it } from "vitest";
import { internalLaunchMusicEnabled, internalLaunchCountdownSeconds } from "./internal-launch-music";

const remote = {
  NODE_ENV: "production" as const, VERCEL: "1", BEERI_INTERNAL_LAUNCH_MUSIC: "1",
  BEERI_LAUNCH_READ_WRITE_TOKEN: "private-test-token", LAUNCH_ACCESS_TOKEN: "presentation-key",
  LAUNCH_LINK_EXPIRES_AT: "2099-01-01T00:00:00Z",
};

describe("internal presentation soundtrack", () => {
  it("requires explicit activation", () => {
    expect(internalLaunchMusicEnabled({ NODE_ENV: "test" })).toBe(false);
    expect(internalLaunchMusicEnabled({ NODE_ENV: "test", BEERI_INTERNAL_LAUNCH_MUSIC: "1" })).toBe(true);
    expect(internalLaunchMusicEnabled({ ...remote, BEERI_INTERNAL_LAUNCH_MUSIC: "0" })).toBe(false);
  });
  it("requires private storage and protected link configuration on Vercel", () => {
    expect(internalLaunchMusicEnabled(remote)).toBe(true);
    for (const field of ["BEERI_LAUNCH_READ_WRITE_TOKEN", "LAUNCH_ACCESS_TOKEN", "LAUNCH_LINK_EXPIRES_AT"]) {
      expect(internalLaunchMusicEnabled({ ...remote, [field]: undefined })).toBe(false);
    }
  });
  it("keeps the fifteen-second comparison local and always deploys ten seconds", () => {
    const env = { NODE_ENV: "test" as const, BEERI_INTERNAL_LAUNCH_MUSIC: "1", BEERI_INTERNAL_LAUNCH_SECONDS: "15" };
    expect(internalLaunchCountdownSeconds(env)).toBe(15);
    expect(internalLaunchCountdownSeconds({ ...env, BEERI_INTERNAL_LAUNCH_SECONDS: "10" })).toBe(10);
    expect(internalLaunchCountdownSeconds({ ...remote, BEERI_INTERNAL_LAUNCH_SECONDS: "15" })).toBe(10);
  });
});
