import { expect, test } from "@playwright/test";

test("Harford County hub renders on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/maryland/harford-county", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Harford County");
  await expect(page.getByText("Aberdeen", { exact: true })).toBeVisible();
  await expect(page.getByText("Havre de Grace", { exact: true })).toBeVisible();
  await expect(page.getByText("Preview data")).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);

  await page.screenshot({ path: "artifacts/harford-county-desktop.png", fullPage: true });
});

test("Aberdeen community hub renders on phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/maryland/harford-county/aberdeen", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Aberdeen");
  await expect(page.getByText("Aberdeen, Harford County", { exact: true })).toBeVisible();
  await expect(page.getByText("Useful local paths before endless browsing.")).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);

  await page.screenshot({ path: "artifacts/aberdeen-hub-phone.png", fullPage: true });
});
