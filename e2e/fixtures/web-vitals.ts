import { test as base } from "@playwright/test";
import type * as webVitals from "web-vitals";

declare global {
  interface Window {
    webVitals: typeof webVitals;
    validateMetric: (name: string, good: boolean) => void;
  }
}

type WebVitalsFixture = {
  webVitals: {
    failingMetrics: string[];
    setup: () => Promise<void>;
  };
};

// This approach was heavily inspired by
// https://gist.github.com/cloudydaiyz/923ca44bdb0a1ff3434a9360967025a6
export const test = base.extend<WebVitalsFixture>({
  webVitals: async ({ page }, use) => {
    const failingMetrics: string[] = [];

    function validateMetric(name: string, isWithinThreshold: boolean) {
      if (!isWithinThreshold) {
        failingMetrics.push(name);
      }
    }

    const setup = async () => {
      await page.exposeFunction("validateMetric", validateMetric);

      /*
       * Inject the script into the page using ES6 module imports.
       * This approach dynamically imports the web-vitals library at runtime.
       */
      await page.addInitScript(async () => {
        window.addEventListener("DOMContentLoaded", async () => {
          try {
            window.webVitals = await import("web-vitals/attribution");

            // From GoogleChrome/web-vitals:
            // > Note that some of these metrics will not report until the user has interacted with the page,
            // > switched tabs, or the page starts to unload.
            // See: https://github.com/GoogleChrome/web-vitals#:~:text=Note%20that%20some%20of%20these%20metrics%20will%20not%20report%20until%20the%20user%20has%20interacted%20with%20the%20page%2C%20switched%20tabs%2C%20or%20the%20page%20starts%20to%20unload.
            function checkMetric(metric: webVitals.Metric) {
              if (metric.rating !== "good") {
                window.validateMetric(metric.name, false);
                return;
              }
              window.validateMetric(metric.name, true);
            }

            window.webVitals.onCLS(checkMetric);
            window.webVitals.onFCP(checkMetric);
            window.webVitals.onINP(checkMetric);
            window.webVitals.onLCP(checkMetric);
            window.webVitals.onTTFB(checkMetric);
          } catch (e) {
            console.error("Error when initializing injected CWV script");
            console.error(e);
          }
        });
      });
    };

    await use({ failingMetrics, setup });
  },
});

export { expect } from "@playwright/test";
