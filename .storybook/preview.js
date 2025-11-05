/**
 * Custom elements for component docs generation.
 */
import { setCustomElementsManifest } from "@storybook/web-components-vite";
import { setStorybookHelpersConfig } from "@wc-toolkit/storybook-helpers";
import customElements from "../custom-elements.json";
import UswdsTheme from "./UswdsTheme";
import "../storybook/index.css";
import "../src/core/index.css";

setCustomElementsManifest(customElements);
setStorybookHelpersConfig({
  hideArgRef: true,
});

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
      codePanel: true,
      canvas: {
        sourceState: "shown",
      },
    },
  },
  tags: ["autodocs"],
};

export default preview;
