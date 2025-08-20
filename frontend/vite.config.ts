import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  server: {
    host: true, // Listen on all network interfaces
    port: 3030, // Frontend will run on port 3030
    proxy: {
      "/api": {
        target: "http://api:3000", // Points to the backend service in Docker Compose
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // Remove /api prefix
      },
    },
  },
});
