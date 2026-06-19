import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { componentTagger } from "lovable-tagger";
import securityHeadersPlugin from "./plugins/vite-plugin-security-headers";
import Sitemap from "vite-plugin-sitemap";

export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    securityHeadersPlugin(),
    Sitemap({
      hostname: "https://squai.io",
      dynamicRoutes: ["/en", "/es", "/en/privacy", "/es/privacy"],
      exclude: ["/404"],
      outDir: "./dist",
    }),
  ].filter(Boolean),
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
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router-dom/') ||
            id.includes('node_modules/react-router/')
          ) {
            return 'vendor-react';
          }
          if (
            id.includes('node_modules/framer-motion/') ||
            id.includes('node_modules/motion/')
          ) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/@radix-ui/')) {
            return 'vendor-radix';
          }
        },
      },
    },
  },
}));
