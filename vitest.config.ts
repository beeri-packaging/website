import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.ts", "**/*.test.tsx"],
    // Glob form matters: node_modules is reached through the
    // `.local-deps.nosync` symlink, so a bare "node_modules" entry never
    // matches and third-party package tests get collected.
    exclude: [
      "**/node_modules/**",
      "**/.local-deps.nosync/**",
      "**/.next/**",
      "**/e2e/**",
      "**/.claude/**",
    ],
  },
});
