import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // Use global APIs like `describe`, `it`, `expect`
    environment: "node",
    //setupFiles: "./tests/setup.ts", // Global setup file for tests
    hookTimeout: 2000,
    coverage: {
      provider: "v8", // or 'istanbul'
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "dist/", "src/server.ts", "src/app.ts"],
    },
  },
});
