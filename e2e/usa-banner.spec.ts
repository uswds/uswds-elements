import { test, expect } from "@playwright/test";

test.describe("usa-banner visual regression tests", () => {
  test("Collapsed state should match visual snapshot", async ({ page }) => {
    const storyName = "components-banner--default";

    await page.goto(
      `http://localhost:3000/iframe.html?globals=&args=&id=${storyName}&viewMode=story`,
    );
    await expect(page).toHaveScreenshot(`collapsed-${storyName}.png`);
  });

  test("Expanded state should match visual snapshot", async ({ page }) => {
    const storyName = "components-banner--default";

    await page.goto(
      `http://localhost:3000/iframe.html?globals=&args=&id=${storyName}&viewMode=story`,
    );

    await page.getByRole('button', { name: 'Here’s how you know' }).click();
    await expect(page).toHaveScreenshot(`expanded-${storyName}.png`);
  });
});
