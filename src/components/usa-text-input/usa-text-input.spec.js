import { beforeEach, describe, expect, it } from "vitest";

import "./index.js";

function getInsideInput() {
  return document.body.querySelector("usa-text-input").shadowRoot;
}

function getLabelElement() {
  return getInsideInput().querySelector("label");
}

function getLabelContext() {
  return getLabelElement().getAttribute("for");
}

function getInputElement() {
  return getInsideInput().querySelector("input");
}

describe("usa-text-input component", async () => {
  beforeEach(async () => {
    document.body.innerHTML = `
      <usa-text-input>
        <label for="input-type-text">Text input label</label>
        <input id="input-type-text" name="input-type-text">
      </usa-text-input>
    `;
  });

  it("adds input element to shadow DOM", () => {
    expect(getInputElement());
  });

  it("adds the input id in shadow DOM", () => {
    expect(getInputElement().getAttribute("id")).toContain("input-type-text");
  });

  it("adds the input name in shadow DOM", () => {
    expect(getInputElement().getAttribute("name")).toContain("input-type-text");
  });

  it("adds the usa-input class in shadow DOM", () => {
    expect(getInputElement().getAttribute("class")).toContain("usa-input");
  });

  it("adds label element to shadow DOM", () => {
    expect(getLabelElement());
  });

  it("adds the usa-label class in shadow DOM", () => {
    expect(getLabelElement().getAttribute("class")).toContain("usa-label");
  });

  it("connects the label and input with the for attribute in shadow DOM", () => {
    expect(getInputElement().getAttribute("id")).toMatch(getLabelContext());
  });
});
