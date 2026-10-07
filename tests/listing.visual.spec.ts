import { expect, test } from "@playwright/test";

test("service-area listing renders truthfully on phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/listing/service-area-preview", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Representative masonry service",
  );
  await expect(page.getByText("Service area", { exact: true })).toBeVisible();
  await expect(page.getByText("Service area is not a storefront pin.")).toBeVisible();
  await expect(page.getByText("Not a published business listing", { exact: false })).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);

  await page.screenshot({ path: "artifacts/listing-service-area-phone.png", fullPage: true });
});

test("exact-location listing renders distinct location treatment on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/listing/exact-location-preview", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Representative supplier storefront",
  );
  await expect(page.getByText("Exact-location record", { exact: true })).toBeVisible();
  await expect(page.getByText("Exact location can support a storefront pin.")).toBeVisible();
  await expect(page.getByText("No ratings, prices, hours", { exact: false })).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);

  await page.screenshot({ path: "artifacts/listing-exact-desktop.png", fullPage: true });
});
