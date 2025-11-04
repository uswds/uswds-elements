/**
 * Custom elements for component docs generation.
 */
import { setCustomElementsManifest } from "@storybook/web-components-vite";
import { setStorybookHelpersConfig } from "@wc-toolkit/storybook-helpers";
import customElements from "../custom-elements.json";

setCustomElementsManifest(customElements);
setStorybookHelpersConfig({
  hideArgRef: true,
});

/**
 *
 * StorybookJS theme
 *
 */

// Custom theme.
import UswdsTheme from "./UswdsTheme";

// Global styles.
import "../storybook/index.css";
// Documentation overrides.
import "./index.css";

// USWDS Core props.
import "../src/core/index.css";

/** @type { import('@storybook/web-components-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true, // Autogenerate table of contents.
      theme: UswdsTheme,
      canvas: {
        sourceState: "shown",
      },
    },
  },
  tags: ["autodocs"],
};

export default preview;
