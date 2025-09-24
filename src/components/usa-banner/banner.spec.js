import { beforeEach, describe, expect, it } from "vitest";

import "./index.js";

function getInsideBanner() {
  return document.body.querySelector("usa-banner")?.shadowRoot;
}

function getBannerButton() {
  return getInsideBanner().querySelector(".usa-accordion__button");
}

describe("USA Banner component", async () => {
  beforeEach(async () => {
    document.body.innerHTML = "<usa-banner></usa-banner>";
  });

  it("renders correctly", () => {
    expect(getInsideBanner().textContent).toContain(
      "An official website of the United States government",
    );
  });

  it("uses gov TLD by default", () => {
    expect(getInsideBanner().querySelector(".content").textContent).toContain(
      ".gov",
    );
  });

  it("initializes closed", () => {
    expect(getBannerButton().ariaExpanded).toBe("false");
  });

  it("expands on button click", async () => {
    const bannerButton = getBannerButton();

    await bannerButton.click();

    expect(bannerButton.ariaExpanded).toBe("true");
  });
});

describe("Spanish variant", async () => {
  beforeEach(async () => {
    document.body.innerHTML = `<usa-banner lang="es"></usa-banner>`;
  });

  it("renders correctly", () => {
    expect(getInsideBanner().textContent).toContain(
      "Un sitio oficial del Gobierno de Estados Unidos",
    );
  });
});

describe("MIL variant", async () => {
  beforeEach(async () => {
    document.body.innerHTML = `<usa-banner tld="mil"></usa-banner>`;
  });

  it("renders correctly", () => {
    expect(getInsideBanner().querySelector(".content").textContent).toContain(
      ".mil",
    );
  });
});
