import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Configuration Vite pour le projet Third Eyes Co.
// Optimisé pour le déploiement sur GitHub Pages
export default defineConfig(({ mode }) => ({
  // Configuration du serveur de développement
  server: {
    host: "::",
    port: 8080,
  },
  // Plugins utilisés (React avec SWC pour de meilleures performances)
  plugins: [react()],
  // Configuration des alias pour les imports
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Configuration pour GitHub Pages
  base: mode === "production" ? "/thirdeyesco/" : "/",
  // Optimisations de build
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-select"],
        },
      },
    },
  },
}));
