import { expect, test } from "@playwright/test";

test("service-area listing renders truthfully on phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/listing/service-area-preview", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Representative masonry service",
  );
  await expect(page.getByText("Service area", { exact: true })).toBeVisible();
  await expect(page.getByText("Service area, not a storefront.")).toBeVisible();
  await expect(page.getByText("Preview listing — example content", { exact: false })).toBeVisible();
  await expect(page.getByRole("button", { name: "Call" })).toBeDisabled();

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
  await expect(page.getByText("Exact public location available.")).toBeVisible();
  await expect(page.getByText("This preview intentionally omits ratings", { exact: false })).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);

  await page.screenshot({ path: "artifacts/listing-exact-desktop.png", fullPage: true });
});
