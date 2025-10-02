# End-to-End (E2E) Testing Guide

This project uses [Playwright](https://playwright.dev/) for end-to-end (E2E) and visual regression testing with [Storybook](https://storybook.js.org/). E2E tests help ensure UI stability and catch breaking visual or behavioral changes. This guide describes how to **develop, run, and update E2E tests**, and how to handle **visual snapshot approval flows**.

---

## 📋 Table of Contents

- [Developing Tests Locally](#developing-tests-locally)
    - [1. Prerequisites](#1-prerequisites)
    - [2. Running E2E Tests](#3-running-e2e-tests)
    - [3. Writing a New Visual Regression Test](#4-writing-a-new-visual-regression-test)
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

### 2. Running E2E Tests

With Storybook running locally, execute the E2E tests:

```shell
# Run all tests
npx playwright test
```

```shell
# Run a specific test file
npx playwright test e2e/components/usa-banner/usa-banner.spec.ts
```

### 3. Writing a New Visual Regression Test

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

Updating the snapshots locally has a dependency on [Docker](https://docs.docker.com/get-docker/). If there are restrictions in being able to install Docker on your machine, you can run the snapshot update workflow in CI as described in the section called [Snapshot Update Workflow](#snapshot-update-workflow) below.

If your UI changes intentionally, **update the visual snapshots**, To update snapshots locally:

**Ensure Docker is installed.**

#### Start a dev shell (container with Playwright + Node)

```shell
docker compose run --service-ports --rm e2e
```

This will open a shell inside the container with the Playwright and Node dependencies installed.

From the terminal in the container environment, run the snapshot update workflow:

```sh
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

- **Snapshots not updating:**  
  Use the docker container to update your snapshots locally or trigger the update workflow in CI.

- **Test file not running:**  
  Check that your test files are located under `e2e/` and end with `.spec.ts`.

- **Artifact download:**  
  After a failed workflow, download and inspect [Playwright reports](https://playwright.dev/docs/test-reporters) for details.

---

## Further Reading

- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [Storybook Docs](https://storybook.js.org/docs)
- [Playwright CLI Docs](https://playwright.dev/docs/test-cli)
