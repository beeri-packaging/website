import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      // next-intl imports "next/navigation" (bare, no .js) which Vitest ESM
      // can't resolve without help. Point it at the CJS build that works in jsdom.
      "next/navigation": path.resolve(
        __dirname,
        "node_modules/next/dist/client/components/navigation.js",
      ),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.ts", "**/*.test.tsx"],
    exclude: ["node_modules", ".next", "e2e"],
    server: {
      deps: {
        // Force next-intl (and its transitive next/navigation import) through
        // Vite's transform pipeline so our resolve.alias applies.
        inline: ["next-intl", "use-intl"],
      },
    },
  },
});
