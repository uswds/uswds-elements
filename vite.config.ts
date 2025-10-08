import { defineConfig } from "vite";
import { resolve } from "path";
import bundlesize, { type Limit } from "vite-plugin-bundlesize";

const entries: Array<{ name: string; path: string; sizeLimit: string }> = [
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
    sourcemap: "hidden",
    lib: {
      entry: entries.reduce(
        (acc, entry) => {
          acc[entry.name] = entry.path;
          return acc;
        },
        {} as Record<string, string>,
      ),
    },
    rollupOptions: {
      external: ["lit"],
      output: { globals: { lit: "lit" }, format: "es" },
    },
  },
  plugins: [
    bundlesize({
      limits: [
        ...entries.map((item) => {
          return {
            name: `${item.name}.js`,
            limit: item.sizeLimit,
            mode: "brotli",
          } as Limit;
        }),
        { name: "**/*.cjs", limit: "Infinity" },
      ],
    }),
  ],
});
