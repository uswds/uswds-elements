import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.spec.{js,ts}", "src/**/*.test.{js,ts}"],
  },
});
