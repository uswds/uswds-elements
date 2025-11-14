import { defineConfig } from "vite";
import { resolve } from "path";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import litCss from "vite-plugin-lit-css";
import bundlesize from "vite-plugin-bundlesize";
import dts from "vite-plugin-dts";
import {
  type Entry,
  mapEntriesToKeyValue,
  mapEntryToLimit,
} from "../internals/build-helpers";

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
    litCss({
      exclude: ["./src/core/index.css", "./storybook/index.css"],
    }),
    bundlesize({
      limits: [
        ...entries.map(mapEntryToLimit),
        { name: "**/*.cjs", limit: "Infinity" },
      ],
    }),
    dts({
      tsconfigPath: "./config/tsconfig.json",
    }),
  ],
  resolve: {
    alias: {
      // Resolve from project root even when config is in ./config
      "@uswds/uswds": resolve(process.cwd(), "node_modules/@uswds/uswds/dist"),
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
      /**
       * The regex resolves the error in vite environments:
       * - https://github.com/uswds/uswds-elements/issues/222
       * - https://github.com/shoelace-style/shoelace/discussions/1847#discussioncomment-14516120
       */
      external: [/^@?lit(-\w+)?($|\/.+)/],
      output: { format: "es" },
    },
  },
});
