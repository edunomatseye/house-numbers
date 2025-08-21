// tsdown.config.js
export default {
  entry: "./src/server.ts",
  outDir: "./build",
  target: "node18",
  format: "esm",
  minify: true,
  sourcemap: false,
  tsconfig: "tsconfig.bundle.json",
  external: [
    "express",
    "cors",
    "pg",
    "openai",
    "drizzle-orm",
    // Add other node_modules you want to exclude from bundle
  ],
  plugins: [
    // Add any custom plugins if needed
  ],
};
