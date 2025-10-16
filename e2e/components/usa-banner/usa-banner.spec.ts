import { test, expect } from "@playwright/test";
import { StorybookPage } from "../../models/storybook-page";

test.describe("usa-banner visual regression tests", () => {
  const storyName = "components-banner--default";

  test.beforeEach(async ({ page }) => {
    const storybookPage = new StorybookPage(page);
    await storybookPage.gotoAndWaitForDomLoaded(storyName);
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
