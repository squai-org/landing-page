import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import securityHeadersPlugin from "./plugins/vite-plugin-security-headers";
import Sitemap from "vite-plugin-sitemap";

export default defineConfig({
  base: "/",
  server: {
    host: "::",
    port: 8081,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    securityHeadersPlugin(),
    Sitemap({
      hostname: "https://teo.squai.co",
      dynamicRoutes: ["/terminos", "/privacidad"],
      exclude: ["/404"],
      outDir: "./dist",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react-router-dom/") ||
            id.includes("node_modules/react-router/")
          ) {
            return "vendor-react";
          }
        },
      },
    },
  },
});
