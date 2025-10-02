import { test, expect } from "@playwright/test";

test.describe("usa-banner visual regression tests", () => {
  const storyName = "components-banner--default";
  const storyUrl = `http://localhost:3000/iframe.html?globals=&args=&id=${storyName}&viewMode=story`;

  test.beforeEach(async ({ page }) => {
    await page.goto(storyUrl);
  });

  test("Collapsed state should match visual snapshot", async ({ page }) => {
    const bannerElement = page.locator("usa-banner");
    await expect(bannerElement).toHaveScreenshot(`collapsed-${storyName}.png`);
  });

  test("Expanded state should match visual snapshot", async ({ page }) => {
    await page.getByRole("button", { name: "Here’s how you know" }).click();
    const bannerElement = page.locator("usa-banner");
    await expect(bannerElement).toHaveScreenshot(`expanded-${storyName}.png`);
  });
});
