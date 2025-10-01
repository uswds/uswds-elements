# End-to-End (E2E) Testing Guide

This project uses [Playwright](https://playwright.dev/) for end-to-end (E2E) and visual regression testing with [Storybook](https://storybook.js.org/). E2E tests help ensure UI stability and catch breaking visual or behavioral changes. This guide describes how to **develop, run, and update E2E tests**, and how to handle **visual snapshot approval flows**.

---

## 📋 Table of Contents

- [Developing Tests Locally](#developing-tests-locally)
  - [1. Prerequisites](#1-prerequisites)
  - [2. Starting the Storybook Server](#2-starting-the-storybook-server)
  - [3. Running E2E Tests](#3-running-e2e-tests)
  - [4. Writing a New Visual Regression Test](#4-writing-a-new-visual-regression-test)
- [Visual Regression and Snapshots](#visual-regression-and-snapshots)
  - [How It Works](#how-it-works)
  - [Updating Snapshots](#updating-snapshots)
- [GitHub Actions Integration](#github-actions-integration)
  - [Playwright E2E Workflow](#playwright-e2e-workflow)
  - [Snapshot Update Workflow](#snapshot-update-workflow)
- [Troubleshooting](#troubleshooting)

---

## Developing Tests Locally

### 1. Prerequisites

- **Node.js** (See `.nvmrc` for version)
- **npm**
- Install dependencies:

  ```bash
  npm ci
  ```

- Install Playwright browsers and dependencies:

  ```bash
  npx playwright install --with-deps
  ```

### 2. Starting the Storybook Server

Playwright E2E tests run against the Storybook instance. For local development, start Storybook **using the Express server** setup.

```shell
npm run storybook:serve # Start the Express server for the static Storybook ([http://localhost:3000](http://localhost:3000))
```

_Note_: The `storybook:serve` script uses Express to serve the built static files from `storybook-static`. Make sure Storybook is running at `http://localhost:3000` before running any Playwright tests.

### 3. Running E2E Tests

With Storybook running locally, execute the E2E tests:

```shell
# Run all tests
npx playwright test
```

```shell
# Run a specific test file
npx playwright test e2e/components/usa-banner/usa-banner.spec.ts
```

### 4. Writing a New Visual Regression Test

Create a new test file under `e2e/components/{component-name}` named after your component or feature (e.g., `e2e/components/my-component/my-component.spec.ts`). Tests typically:

- Visit a Storybook story via an iframe URL (using the Story ID from Storybook).
- Interact with the page (clicks, input, etc.).
- Assert visual snapshots using `toHaveScreenshot()`. Screenshots are saved in `*-snapshots/`.

**Example test:**

```typescript
// e2e/components/my-component/my-component.spec.ts
import { test, expect } from "@playwright/test";

test.describe("my-component visual regression tests", () => {
  const storyName = "components-my-component--default";
  const storyUrl = `http://localhost:3000/iframe.html?globals=&args=&id=${storyName}&viewMode=story`;

  test.beforeEach(async ({ page }) => {
    await page.goto(storyUrl);
  });

  test("Component matches visual snapshot", async ({ page }) => {
    const element = page.locator("my-component");
    await expect(element).toHaveScreenshot(`default-${storyName}.png`);
  });
});
```

**Tips:**

- Use `page.goto(<URL>)` to load your story.
- Capture the specific element you want to test (e.g., `page.locator('my-component')`).
- Use `await expect(locator).toHaveScreenshot(<name.png>)` to capture or compare against stored visual snapshots.

---

## Visual Regression and Snapshots

### How It Works

- On first run or when `--update-snapshots` is used, Playwright saves baseline screenshots in `e2e/components/component-name/*-snapshots/`.
- On subsequent runs, Playwright compares current screenshots to these baselines.
- Failures are reported if screenshots differ ("visual regression detected").

### Updating Snapshots

If your UI changes intentionally, **update the visual snapshots**:

```shell
npx playwright test --update-snapshots
```

This will regenerate the baseline images in the relevant `*-snapshots/` folders.

---

## GitHub Actions Integration

### Playwright E2E Workflow

- **File:** `.github/workflows/playwright.yml`
- **Triggers:** `push` and `pull_request` to `main` and `develop`
- **Steps:**
  1. Installs dependencies and builds Storybook.
  2. Runs Playwright tests against the static Storybook.
  3. Uploads test results and snapshot diffs as workflow artifacts.
  4. If there are failures, a PR comment is added with a link to the Playwright report.

> Playwright tests failed.  
> View the [Playwright report](...) to review any visual differences.
> **To generate updated snapshots, run the "Generate New Playwright Screenshots" workflow.** and add the updated snapshots to your PR.

### Snapshot Update Workflow

- **File:** `.github/workflows/update-playwright-snapshots.yml`
- **How to trigger:**  
  Run manually via the GitHub Actions tab ("Run workflow").

**Workflow Steps:**

1. Checks out the branch.
2. Installs dependencies and Storybook.
3. Runs Playwright with `--update-snapshots`.
4. Uploads new snapshots as GitHub Actions artifacts.

---

## Visual Regression: Reviewing and Approving

1. **CI/PR fails due to a screenshot difference:**
   - Inspect the [Playwright report artifact](https://playwright.dev/docs/test-reporters) for visual diffs.
   - If changes are intentional, update and commit new snapshots by triggering the snapshot update workflow, downloading the zip file, and adding the new screenshots to the PR.

2. **After snapshot update:**
   - Review PR changes to confirm new images are correct.
   - PR is considered mergeable with an approval, and there are no visual diffs.
   - If there are visual diffs, update the snapshots and commit the changes.

---

## Troubleshooting

- **Storybook server is not running:**  
  Ensure `npm run storybook:serve` (Express server) is running at `http://localhost:3000`.

- **Snapshots not updating:**  
  Use `npx playwright test --update-snapshots` locally or trigger the update workflow in CI.

- **Test file not running:**  
  Check that your test files are located under `e2e/` and end with `.spec.ts`.

- **Artifact download:**  
  After a failed workflow, download and inspect [Playwright reports](https://playwright.dev/docs/test-reporters) for details.

---

## Further Reading

- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [Storybook Docs](https://storybook.js.org/docs)
- [Playwright CLI Docs](https://playwright.dev/docs/test-cli)

---

**Questions or problems?** Open an issue or reach out to the team!

```

```
