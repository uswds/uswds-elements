import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: [
      "src/**/*.spec.{js,ts}",
      "src/**/*.test.{js,ts}",
      "utils/**/*.spec.{js,ts}",
      "utils/**/*.test.{js,ts}",
    ],
  },
});
