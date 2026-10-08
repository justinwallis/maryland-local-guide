import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/search?query=masonry&community=aberdeen",
  "/listing/service-area-preview",
  "/maryland/harford-county",
  "/guides/planning-a-home-project",
  "/this-route-does-not-exist",
];

for (const route of routes) {
  test(`no serious accessibility violations on ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(route, { waitUntil: "networkidle" });

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const blocking = results.violations.filter(
      (violation) => violation.impact === "serious" || violation.impact === "critical",
    );

    expect(blocking).toEqual([]);
  });
}

test("skip link is the first keyboard target", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");

  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
});

test("not-found page offers recovery actions", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/definitely-not-a-real-route", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "This local path doesn’t exist.",
  );
  await expect(page.getByRole("link", { name: "Explore Harford County" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Search services" })).toBeVisible();
});
