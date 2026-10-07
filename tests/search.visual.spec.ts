import { expect, test } from "@playwright/test";

test("search results render cleanly on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/search?query=masonry&community=aberdeen", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1 })).toContainText("masonry");
  await expect(page.getByText("Masonry contractor")).toBeVisible();
  await expect(page.getByText("Not live directory data.").first()).toBeVisible();
  await expect(page.getByText("Truthful location before fancy pins.")).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);

  await page.screenshot({ path: "artifacts/search-desktop.png", fullPage: true });
});

test("search results stay list-first on phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/search?query=well&community=harford", { waitUntil: "networkidle" });

  await expect(page.getByText("Well service provider")).toBeVisible();
  await expect(page.getByRole("button", { name: "Map preview unavailable" })).toBeVisible();
  await expect(page.getByText("Truthful location before fancy pins.")).not.toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);

  await page.screenshot({ path: "artifacts/search-phone.png", fullPage: true });
});

test("zero-results recovery is explicit", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/search?mode=empty&community=aberdeen", { waitUntil: "networkidle" });

  await expect(page.getByText("Nothing matched this preview state.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Search Harford County" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Suggest a listing" })).toBeVisible();
});
