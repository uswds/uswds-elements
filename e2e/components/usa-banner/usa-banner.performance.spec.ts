import { test, expect } from "@playwright/test";
import type * as webVitals from "web-vitals";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

declare global {
  interface Window {
    webVitals: typeof webVitals;
    validateMetric: (name: string, good: boolean) => void;
  }
}

test.describe("usa-banner performance", () => {
  // Web vitals are collected differently for each browser.
  // Some metrics may be collected inconsistently or not at all.
  test("should have good web vitals", async ({ page }) => {
    // Set up page listeners
    page.on("console", async (msg) => {
      if (msg.type() === "trace" || msg.type() === "error") {
        console.log(msg.text());
      }
    });

    const badMetrics: string[] = [];
    function validateMetric(name: string, good: boolean) {
      console.log(`${name} valid: ${good}`);
      if (!good) {
        badMetrics.push(name);
      }
    }
    await page.exposeFunction("validateMetric", validateMetric);

    // Using classic script to get webVitals global namespace
    const scriptPath = path.join(
      __dirname,
      "../../../",
      "node_modules/web-vitals/dist/web-vitals.attribution.iife.js",
    );
    // Read the web-vitals script content at runtime
    const scriptBody = fs.readFileSync(scriptPath, "utf8");

    /*
     * Inject the script into the page.
     * Make sure to use the raw script content instead of creating a script with the src set to `webVitalsUrl`.
     * Otherwise, the external script may get blocked on certain websites.
     */
    await page.addInitScript(
      async ([scriptBody]) => {
        window.addEventListener("DOMContentLoaded", async () => {
          const script = document.createElement("script");
          script.text = scriptBody;
          try {
            document.head.appendChild(script);
          } catch (e) {
            console.error("Error when initializing injected CWV script");
            console.error(e);
          }

          // From GoogleChrome/web-vitals:
          // > Note that some of these metrics will not report until the user has interacted with the page,
          // > switched tabs, or the page starts to unload.
          // See: https://github.com/GoogleChrome/web-vitals#:~:text=Note%20that%20some%20of%20these%20metrics%20will%20not%20report%20until%20the%20user%20has%20interacted%20with%20the%20page%2C%20switched%20tabs%2C%20or%20the%20page%20starts%20to%20unload.
          function checkMetric(m: webVitals.Metric) {
            console.trace(JSON.stringify(m, null, 4));
            if (m.rating !== "good") {
              window.validateMetric(m.name, false);
              return;
            }
            window.validateMetric(m.name, true);
          }

          window.webVitals.onCLS(checkMetric);
          window.webVitals.onFCP(checkMetric);
          window.webVitals.onINP(checkMetric);
          window.webVitals.onLCP(checkMetric);
          window.webVitals.onTTFB(checkMetric);
          console.log("Initialized web vital monitors");
        });
      },
      [scriptBody],
    );

    // Go to Hacker News, record FCP and TTFB
    const storyName = "components-banner--default";
    const storyUrl = `http://localhost:3000/iframe.html?globals=&args=&id=${storyName}&viewMode=story`;

    await page.goto(storyUrl);

    // Page click to record LCP and FID
    await page.waitForLoadState("domcontentloaded");
    console.log("Page click");
    await page.getByRole("button", { name: "Here’s how you know" }).click();

    // Manually obtain navigation event metrics for page load time
    // - NOTE: There is only one PerformanceNavigationTiming object in the performance timeline
    //   See: https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming
    const [navTiming] = await page.evaluate(() =>
      window.performance.getEntriesByType("navigation").map((e) => e.toJSON()),
    );
    console.debug("Navigation Entry:", navTiming);
    console.log("Page load time:", navTiming.loadEventEnd);
    validateMetric("Page load", navTiming.loadEventEnd < 2000);

    // Page unload to record INP and CLS
    console.log("Page unload");
    await page.close();
    expect(badMetrics).toHaveLength(0);
  });
});
