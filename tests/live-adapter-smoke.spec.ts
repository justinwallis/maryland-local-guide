import { expect, test } from "@playwright/test";

test("live Directorist search renders the controlled Home Services record", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/search?community=aberdeen", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Find local services");
  await expect(page.getByText("MLG QA Live Acceptance Published")).toBeVisible();
  await expect(page.getByText("Preview listing — not live directory data.")).toHaveCount(0);
  await expect(page.getByText("Service area", { exact: true }).first()).toBeVisible();
  await expect(page.locator(".result-location", { hasText: "Aberdeen" })).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);

  await page.screenshot({ path: "artifacts/live-search-desktop.png", fullPage: true });
});

test("live Directorist listing renders canonical custom fields truthfully", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/listing/mlg-qa-live-accept-20261008-pub", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "MLG QA Live Acceptance Published",
  );
  await expect(page.getByText("Synthetic masonry QA", { exact: true })).toBeVisible();
  await expect(page.getByText("Brick and block QA", { exact: true })).toBeVisible();
  await expect(page.getByText("Aberdeen and nearby Harford County", { exact: true })).toBeVisible();
  await expect(page.getByText("Service area, not a storefront.")).toBeVisible();
  await expect(page.getByText("Preview listing — example content", { exact: false })).toHaveCount(0);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);

  await page.screenshot({ path: "artifacts/live-listing-phone.png", fullPage: true });
});
