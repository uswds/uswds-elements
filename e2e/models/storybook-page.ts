import { Page } from "@playwright/test";

export class StorybookPage {
  constructor(private readonly page: Page) {}

  /**
   * Navigate to a specific story
   * @param storyId - The story ID (e.g., "components-banner--default")
   * @param options - Additional options for the story URL
   */
  async goto(
    storyId: string,
    options?: {
      globals?: string;
      args?: string;
      viewMode?: "story" | "docs";
      baseUrl?: string;
    },
  ) {
    const {
      globals = "",
      args = "",
      viewMode = "story",
      baseUrl = "http://localhost:3000",
    } = options || {};

    const storyUrl = `${baseUrl}/iframe.html?globals=${globals}&args=${args}&id=${storyId}&viewMode=${viewMode}`;
    await this.page.goto(storyUrl);
  }

  /**
   * Navigate to a specific story and wait for the DOM to be loaded
   * @param storyId - The story ID (e.g., "components-banner--default")
   * @param options - Additional options for the story URL
   */
  async gotoAndWaitForDomLoaded(
    storyId: string,
    options?: Parameters<StorybookPage["goto"]>[1],
  ) {
    await this.goto(storyId, options);
    await this.page.waitForLoadState("domcontentloaded");
  }
}
