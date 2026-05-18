import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LitElement } from "lit";

import "./index.js";

function getAlert(): HTMLElement & LitElement {
  const alert = document.body.querySelector("usa-alert");
  if (!alert) throw new Error("usa-alert element not found");
  return alert as HTMLElement & LitElement;
}

function getShadow(): ShadowRoot {
  const shadow = getAlert().shadowRoot;
  if (!shadow) throw new Error("usa-alert shadowRoot not found");
  return shadow;
}

describe("usa-alert component", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <usa-alert>
        <h3 slot="headline">Alert heading</h3>
        <p>Alert body content.</p>
      </usa-alert>
    `;
  });

  it("renders with default info status", () => {
    const alertDiv = getShadow().querySelector(".usa-alert");
    expect(alertDiv?.classList.contains("usa-alert--info")).toBe(true);
  });

  it("has role=status for info alerts", () => {
    const alertDiv = getShadow().querySelector(".usa-alert");
    expect(alertDiv?.getAttribute("role")).toBe("status");
  });

  it("renders headline slot", () => {
    const slot = getShadow().querySelector(
      'slot[name="headline"]',
    ) as HTMLSlotElement;
    expect(slot).not.toBeNull();
    const assigned = slot?.assignedElements();
    expect(assigned?.[0]?.textContent).toBe("Alert heading");
  });

  it("renders default slot content", () => {
    const slot = getShadow().querySelector(
      "slot:not([name])",
    ) as HTMLSlotElement;
    expect(slot).not.toBeNull();
    const assigned = slot?.assignedElements();
    expect(assigned?.[0]?.textContent).toBe("Alert body content.");
  });
});

describe("status variants", () => {
  const statuses = ["info", "warning", "error", "success", "emergency"];

  statuses.forEach((status) => {
    it(`renders ${status} variant`, async () => {
      document.body.innerHTML = `<usa-alert status="${status}"><p>Test</p></usa-alert>`;
      await getAlert().updateComplete;
      const alertDiv = getShadow().querySelector(".usa-alert");
      expect(alertDiv?.classList.contains(`usa-alert--${status}`)).toBe(true);
    });
  });

  it("falls back to info for invalid status", async () => {
    document.body.innerHTML = `<usa-alert status="invalid"><p>Test</p></usa-alert>`;
    await getAlert().updateComplete;
    const alertDiv = getShadow().querySelector(".usa-alert");
    expect(alertDiv?.classList.contains("usa-alert--info")).toBe(true);
  });
});

describe("ARIA roles", () => {
  it("uses role=status for info", async () => {
    document.body.innerHTML = `<usa-alert status="info"><p>Test</p></usa-alert>`;
    await getAlert().updateComplete;
    const alertDiv = getShadow().querySelector(".usa-alert");
    expect(alertDiv?.getAttribute("role")).toBe("status");
  });

  it("uses role=status for success", async () => {
    document.body.innerHTML = `<usa-alert status="success"><p>Test</p></usa-alert>`;
    await getAlert().updateComplete;
    const alertDiv = getShadow().querySelector(".usa-alert");
    expect(alertDiv?.getAttribute("role")).toBe("status");
  });

  it("uses role=alert for error", async () => {
    document.body.innerHTML = `<usa-alert status="error"><p>Test</p></usa-alert>`;
    await getAlert().updateComplete;
    const alertDiv = getShadow().querySelector(".usa-alert");
    expect(alertDiv?.getAttribute("role")).toBe("alert");
  });

  it("uses role=alert for warning", async () => {
    document.body.innerHTML = `<usa-alert status="warning"><p>Test</p></usa-alert>`;
    await getAlert().updateComplete;
    const alertDiv = getShadow().querySelector(".usa-alert");
    expect(alertDiv?.getAttribute("role")).toBe("alert");
  });

  it("uses role=alert for emergency", async () => {
    document.body.innerHTML = `<usa-alert status="emergency"><p>Test</p></usa-alert>`;
    await getAlert().updateComplete;
    const alertDiv = getShadow().querySelector(".usa-alert");
    expect(alertDiv?.getAttribute("role")).toBe("alert");
  });
});

describe("slim variant", () => {
  beforeEach(() => {
    document.body.innerHTML = `<usa-alert slim><p>Slim alert</p></usa-alert>`;
  });

  it("applies slim class", () => {
    const alertDiv = getShadow().querySelector(".usa-alert");
    expect(alertDiv?.classList.contains("usa-alert--slim")).toBe(true);
  });

  it("does not render headline slot when slim", () => {
    const slot = getShadow().querySelector('slot[name="headline"]');
    expect(slot).toBeNull();
  });
});

describe("no-icon variant", () => {
  beforeEach(() => {
    document.body.innerHTML = `<usa-alert no-icon><p>No icon</p></usa-alert>`;
  });

  it("applies no-icon class", () => {
    const alertDiv = getShadow().querySelector(".usa-alert");
    expect(alertDiv?.classList.contains("usa-alert--no-icon")).toBe(true);
  });
});

describe("closeable", () => {
  beforeEach(() => {
    document.body.innerHTML = `<usa-alert closeable><p>Closeable alert</p></usa-alert>`;
  });

  it("renders close button", () => {
    const btn = getShadow().querySelector(".usa-alert__close");
    expect(btn).not.toBeNull();
  });

  it("has correct default aria-label", () => {
    const btn = getShadow().querySelector(".usa-alert__close");
    expect(btn?.getAttribute("aria-label")).toBe("Close alert");
  });

  it("dispatches close event on click", async () => {
    const handler = vi.fn();
    getAlert().addEventListener("close", handler);

    const btn = getShadow().querySelector(
      ".usa-alert__close",
    ) as HTMLButtonElement;
    btn.click();

    expect(handler).toHaveBeenCalledOnce();
  });

  it("hides alert after close", async () => {
    const btn = getShadow().querySelector(
      ".usa-alert__close",
    ) as HTMLButtonElement;
    btn.click();

    // Wait for Lit reactive update
    await getAlert().updateComplete;

    const alertDiv = getShadow().querySelector(".usa-alert");
    expect(alertDiv).toBeNull();
  });

  it("supports custom close-label", async () => {
    document.body.innerHTML = `<usa-alert closeable close-label="Dismiss warning"><p>Test</p></usa-alert>`;
    await getAlert().updateComplete;
    const btn = getShadow().querySelector(".usa-alert__close");
    expect(btn?.getAttribute("aria-label")).toBe("Dismiss warning");
  });
});

describe("does not render close button when not closeable", () => {
  beforeEach(() => {
    document.body.innerHTML = `<usa-alert><p>Not closeable</p></usa-alert>`;
  });

  it("has no close button", () => {
    const btn = getShadow().querySelector(".usa-alert__close");
    expect(btn).toBeNull();
  });
});
