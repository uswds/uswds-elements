import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@uswds/uswds": resolve(__dirname, "node_modules/@uswds/uswds/dist"),
    },
  },
  css: {
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
