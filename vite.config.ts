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
      hostname: "https://heysquai.vercel.app",
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
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion', 'motion'],
          'vendor-radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
          ],
        },
      },
    },
  },
}));
