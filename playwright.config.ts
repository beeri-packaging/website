import { defineConfig, devices } from "@playwright/test";

// E2E_PORT lets the suite run on a dedicated port when localhost:3000 is
// occupied by another project's dev server — reuseExistingServer can't tell
// a foreign app from ours and would test against the wrong site.
const port = Number(process.env.E2E_PORT ?? 3000);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: `http://localhost:${port}`, trace: "on-first-retry" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run dev -- --port ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
