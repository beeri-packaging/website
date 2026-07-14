import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * WCAG 2.1 AA gate — enforces the AGENTS.md promise of "no serious axe
 * violations" mechanically. We scan the primary routes in both locales
 * (he/RTL is primary, en/LTR secondary) and fail on serious + critical
 * findings. Minor/moderate impacts are reported but don't break the build.
 */

// Routes rendered from the same components in both locales.
const ROUTES = [
  "",
  "/about",
  "/catalog",
  "/blog",
  "/careers",
  "/finishing",
  "/presentation",
];
const LOCALES = ["he", "en"] as const;

const BLOCKING = new Set(["serious", "critical"]);

for (const locale of LOCALES) {
  for (const route of ROUTES) {
    const path = `/${locale}${route}`;
    test(`a11y: ${path} has no serious/critical violations`, async ({ page }) => {
      await page.goto(path, { waitUntil: "load" });
      // The home hero autoplays a looping <video>, so the network never goes
      // fully idle. Wait for the primary heading to render (Playwright also
      // discourages "networkidle") before scanning — axe still sees the
      // fully rendered DOM.
      await page.locator("h1").first().waitFor({ state: "visible" });

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const blocking = results.violations.filter((v) =>
        BLOCKING.has(v.impact ?? "")
      );

      // Surface a readable summary when the gate fails.
      const summary = blocking
        .map(
          (v) =>
            `  [${v.impact}] ${v.id}: ${v.help}\n    ${v.nodes
              .map((n) => n.target.join(" "))
              .join("\n    ")}`
        )
        .join("\n");

      expect(blocking, `Accessibility violations on ${path}:\n${summary}`).toEqual([]);
    });
  }
}
