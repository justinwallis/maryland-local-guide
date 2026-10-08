import { expect, test } from "@playwright/test";

test("pages are noindex before launch approval", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const robots = page.locator('meta[name="robots"]');
  await expect(robots).toHaveAttribute("content", /noindex/i);
  await expect(robots).toHaveAttribute("content", /nofollow/i);
});

test("robots.txt disallows crawling before launch approval", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.ok()).toBe(true);

  const body = await response.text();
  expect(body).toContain("User-Agent: *");
  expect(body).toContain("Disallow: /");
});
