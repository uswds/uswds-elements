import { defineConfig } from "vite";
import { resolve } from "path";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
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
      minify: process.env.NODE_ENV === "production" || process.env.CI,
      drafts: {
        nesting: true,
      },
      targets: browserslistToTargets(
        browserslist(["> 2%", "last 2 versions", "not dead"]),
      ),
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
