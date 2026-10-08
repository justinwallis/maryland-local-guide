import { expect, test } from "@playwright/test";

test("canonical brand assets render and landmarks are structured", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "networkidle" });

  const logo = page.locator('header img[alt="Maryland Local Guide"]');
  await expect(logo).toBeVisible();
  await expect(logo).toHaveAttribute(
    "src",
    "/maryland-local-guide-logo-header-dark-900.png",
  );

  const loaded = await logo.evaluate((image: HTMLImageElement) => ({
    complete: image.complete,
    naturalWidth: image.naturalWidth,
  }));
  expect(loaded.complete).toBe(true);
  expect(loaded.naturalWidth).toBeGreaterThan(0);

  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("main header")).toHaveCount(0);
  await expect(page.locator("main footer")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "For Businesses" }).first()).toBeVisible();
});

test("mobile header switches to the canonical compact icon", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });

  const logo = page.locator('header img[alt="Maryland Local Guide"]');
  const currentSrc = await logo.evaluate((image: HTMLImageElement) => image.currentSrc);
  expect(currentSrc).toContain("/android-chrome-192x192.png");
});

test("route titles and canonical icon metadata are present", async ({ page }) => {
  await page.goto("/search?community=harford", { waitUntil: "networkidle" });

  await expect(page).toHaveTitle("Search Local Services | Maryland Local Guide");
  await expect(page.locator('link[rel="icon"][href="/favicon.ico"]')).toHaveCount(1);
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
    "href",
    "/apple-touch-icon.png",
  );
});

test("service-area search preview does not draw fake storefront pins", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/search?query=masonry&community=aberdeen", {
    waitUntil: "networkidle",
  });

  await expect(page.locator(".map-pin")).toHaveCount(0);
  await expect(page.locator(".map-service-area-ring")).toHaveCount(1);
  await expect(page.getByText("Service areas are not storefront pins.")).toBeVisible();
});
