import { test, expect } from "../../fixtures/web-vitals";
import { StorybookPage } from "../../models/storybook-page";

test.describe("usa-banner performance", () => {
  test("should have good web vitals", async ({ page, webVitals }) => {
    await webVitals.setup();

    const storybookPage = new StorybookPage(page);
    await storybookPage.gotoAndWaitForDomLoaded("components-banner--default");

    // Page click to record LCP
    await page.getByRole("button", { name: "Here’s how you know" }).click();

    // Page unload to record INP and CLS
    await page.close();
    expect(webVitals.failingMetrics).toHaveLength(0);
  });
});
