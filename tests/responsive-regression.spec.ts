import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/search?query=masonry&community=aberdeen",
  "/listing/service-area-preview",
  "/maryland/harford-county/aberdeen",
  "/guides/well-service-basics",
];

const widths = [320, 768, 1440];

for (const route of routes) {
  for (const width of widths) {
    test(`${route} has no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route, { waitUntil: "networkidle" });

      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
    });
  }
}
