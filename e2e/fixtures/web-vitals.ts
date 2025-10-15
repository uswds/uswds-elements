import { test as base } from "@playwright/test";
import type * as webVitals from "web-vitals";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

declare global {
  interface Window {
    webVitals: typeof webVitals;
    validateMetric: (name: string, good: boolean) => void;
  }
}

type WebVitalsFixture = {
  webVitals: {
    badMetrics: string[];
    setup: () => Promise<void>;
  };
};

// This approach was heavily inspired by
// https://gist.github.com/cloudydaiyz/923ca44bdb0a1ff3434a9360967025a6
export const test = base.extend<WebVitalsFixture>({
  webVitals: async ({ page }, use) => {
    const badMetrics: string[] = [];

    function validateMetric(name: string, good: boolean) {
      if (!good) {
        badMetrics.push(name);
      }
    }

    const setup = async () => {
      await page.exposeFunction("validateMetric", validateMetric);

      // Using classic script to get webVitals global namespace
      const scriptPath = path.join(
        __dirname,
        "../../",
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
          });
        },
        [scriptBody],
      );
    };

    await use({ badMetrics, setup });
  },
});

export { expect } from "@playwright/test";
