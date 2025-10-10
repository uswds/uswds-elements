import { defineConfig } from "vite";
import { resolve } from "path";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import litCss from "vite-plugin-lit-css";
import bundlesize from "vite-plugin-bundlesize";
import {
  type Entry,
  mapEntriesToKeyValue,
  mapEntryToLimit,
} from "./utils/build-helpers";

const entries: Array<Entry> = [
  {
    name: "components/index",
    path: "src/components/index",
    sizeLimit: "0.2 kB",
  },
  {
    name: "components/usa-banner",
    path: "src/components/usa-banner/index.ts",
    sizeLimit: "10 kB",
  },
  {
    name: "components/usa-link",
    path: "src/components/usa-link/index.js",
    sizeLimit: "0.8 kB",
  },
];

export default defineConfig({
  plugins: [
    litCss(),
    bundlesize({
      limits: [
        ...entries.map(mapEntryToLimit),
        { name: "**/*.cjs", limit: "Infinity" },
      ],
    }),
  ],
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
    sourcemap: "hidden",
    lib: {
      entry: mapEntriesToKeyValue(entries),
    },
    rollupOptions: {
      external: ["lit"],
      output: { globals: { lit: "lit" }, format: "es" },
    },
  },
});
