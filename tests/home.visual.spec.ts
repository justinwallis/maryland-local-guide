import { expect, test } from "@playwright/test";

const cases = [
  { name: "phone", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 1100 },
];

for (const viewport of cases) {
  test(`home renders cleanly on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/", { waitUntil: "networkidle" });

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Find what you need, close to home.",
    );
    await expect(page.getByRole("search")).toBeVisible();
    await expect(page.getByText("Harford County first", { exact: true })).toBeVisible();
    await expect(page.getByText("Local utility, not hype")).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);

    await page.keyboard.press("Tab");
    const activeTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(activeTag).not.toBe("BODY");

    if (viewport.name === "phone") {
      await page.getByText("Menu", { exact: true }).click();
      await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
      await page.getByText("Menu", { exact: true }).click();
    }

    await page.screenshot({
      path: `artifacts/home-${viewport.name}.png`,
      fullPage: true,
    });
  });
}
