import { defineConfig } from "vite";
import config from "./vite.config.single-file.js";

export default defineConfig({
  ...config,
  build: {
    lib: {
      name: "usa-banner",
      entry: {
        "components/usa-banner": "src/components/usa-banner/index.js",
      },
    },
  },
});
