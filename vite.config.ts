import { defineConfig } from "vite";
import { resolve } from "path";
import litCss from "vite-plugin-lit-css";

export default defineConfig({
  plugins: [litCss()],
  resolve: {
    alias: {
      "@uswds/uswds": resolve(__dirname, "node_modules/@uswds/uswds/dist"),
    },
  },
  css: {
    transformer: "lightningcss",
    lightningcss: {
      // Lightning CSS options
      minify: true,
      drafts: {
        nesting: true, // Enable CSS nesting (useful for your :host { a { } } syntax)
      },
      targets: {
        // Target browsers (adjust as needed)
        chrome: 90,
        firefox: 88,
        safari: 14,
      },
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./node_modules/@uswds/uswds/packages";`,
      },
    },
  },
  build: {
    lib: {
      entry: {
        "components/usa-banner": "src/components/usa-banner/index.ts",
        "components/usa-link": "src/components/usa-link/index.js",
        "components/index": "src/components/index",
      },
    },
    rollupOptions: {
      external: ["lit"],
      output: { globals: { lit: "lit" }, format: "es" },
    },
  },
});
