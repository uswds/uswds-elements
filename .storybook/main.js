/** @type { import('@storybook/web-components-vite').StorybookConfig } */
const config = {
  stories: [
    "../storybook/**/*.mdx",
    "../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
  viteFinal: async (config) => {
    /**
     * Unload the `vite-plugin-bundlesize` plugin.
     * This plugin is only used in the CI pipeline for output size of the
     * individual components.
     */
    config.plugins = config.plugins.filter(
      (plugin) => plugin.name !== "vite-plugin-bundlesize",
    );

    return config;
  },
};
export default config;
