import { beforeEach, describe, expect, it } from "vitest";

import "./index.ts";

function getInsideLink(): HTMLAnchorElement {
  const link = document.body
    .querySelector("usa-link")
    ?.shadowRoot?.querySelector("a");

  if (!link) {
    throw new Error("Could not find inner <a> inside <usa-link>");
  }

  return link as HTMLAnchorElement;
}

describe("usa-link component", async () => {
  beforeEach(async () => {
    document.body.innerHTML = `<usa-link href="http://designsystem.digital.gov">It's dangerous to go alone. Here, take this.</usa-link>`;
  });

  it("should show href props", () => {
    expect(getInsideLink().getAttribute("href")).toContain(".gov");
  });

  it("should show slotted children", () => {
    const slot = document.body
      .querySelector("usa-link")
      ?.shadowRoot?.querySelector("slot");

    expect(
      slot?.assignedNodes({ flatten: true })[0].textContent ?? "",
    ).toContain("dangerous");
  });
});

describe("progressively enhanced usa-link component", async () => {
  beforeEach(async () => {
    document.body.innerHTML = `<usa-link><a href="http://designsystem.digital.gov">It's dangerous to go alone. Here, take this.</a></usa-link>`;
  });

  it("should show href props", () => {
    getInsideLink();
    expect(getInsideLink().getAttribute("href")).toContain(".gov");
  });

  it("should render link with component markup", () => {
    expect(getInsideLink().className).toContain("usa-link");
  });
});
