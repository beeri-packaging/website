// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { get } from "@vercel/blob";
import { GET } from "./route";

vi.mock("@vercel/blob", () => ({ get: vi.fn() }));
beforeEach(() => {
  vi.stubEnv("VERCEL", "1");
  vi.stubEnv("BEERI_INTERNAL_LAUNCH_MUSIC", "1");
  vi.stubEnv("BEERI_LAUNCH_READ_WRITE_TOKEN", "test-private-token");
  vi.stubEnv("LAUNCH_ACCESS_TOKEN", "presentation-key");
  vi.stubEnv("LAUNCH_LINK_EXPIRES_AT", "2099-01-01T00:00:00Z");
});
afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks(); });
const request = (key?: string) => new Request("https://example.com/api/internal-launch-music", {
  headers: key ? { "X-Launch-Access": key } : undefined,
});

describe("private remote launch audio", () => {
  it.each([undefined, "wrong"])("rejects missing or incorrect access before reading storage", async (key) => {
    const response = await GET(request(key));
    expect(response.status).toBe(404);
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    expect(get).not.toHaveBeenCalled();
  });
  it("rejects expired links even with the correct key", async () => {
    vi.stubEnv("LAUNCH_LINK_EXPIRES_AT", "2000-01-01T00:00:00Z");
    expect((await GET(request("presentation-key"))).status).toBe(404);
    expect(get).not.toHaveBeenCalled();
  });
  it("serves the fixed v2 bytes privately for an authorized presentation", async () => {
    const audio = new Uint8Array([73, 68, 51]);
    vi.mocked(get).mockResolvedValue({ statusCode: 200, stream: new Response(audio).body! } as Awaited<ReturnType<typeof get>>);
    const response = await GET(request("presentation-key"));
    expect(response.status).toBe(200);
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(audio);
    expect(response.headers.get("Content-Type")).toBe("audio/mpeg");
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    expect(get).toHaveBeenCalledWith("launch/michal-internal-v2.mp3", expect.objectContaining({ access: "private", token: "test-private-token" }));
  });
  it("fails cleanly when the private store is unavailable", async () => {
    vi.mocked(get).mockRejectedValue(new Error("unavailable"));
    expect((await GET(request("presentation-key"))).status).toBe(503);
  });
});
