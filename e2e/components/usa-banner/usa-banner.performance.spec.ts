import { test, expect } from "../../fixtures/web-vitals";

test.describe("usa-banner performance", () => {
  test("should have good web vitals", async ({ page, webVitals }) => {
    await webVitals.setup();

    const storyName = "components-banner--default";
    const storyUrl = `http://localhost:3000/iframe.html?globals=&args=&id=${storyName}&viewMode=story`;

    await page.goto(storyUrl);

    // Page click to record LCP and FID
    await page.waitForLoadState("domcontentloaded");
    await page.getByRole("button", { name: "Here’s how you know" }).click();

    // Page unload to record INP and CLS
    await page.close();
    expect(webVitals.failingMetrics).toHaveLength(0);
  });
});
