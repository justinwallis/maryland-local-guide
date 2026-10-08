import { expect, test } from "@playwright/test";

test("home project guide renders cleanly on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/guides/planning-a-home-project", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Planning a Home Project",
  );
  await expect(page.getByText("What to know first")).toBeVisible();
  await expect(page.getByText("Project-call preparation checklist")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Harford County first." })).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);

  await page.screenshot({
    path: "artifacts/guide-home-project-desktop.png",
    fullPage: true,
  });
});

test("well service guide renders cleanly on phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/guides/well-service-basics", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Before You Call for Well or Water Service",
  );
  await expect(page.getByText("Service-call notes")).toBeVisible();
  await expect(
    page.getByText("Checklist selections stay in your browser", { exact: false }),
  ).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);

  await page.screenshot({
    path: "artifacts/guide-well-service-phone.png",
    fullPage: true,
  });
});
