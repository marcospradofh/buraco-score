import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // O app avisa quando há versão nova em vez de recarregar no meio de uma rodada.
      registerType: "prompt",
      includeAssets: ["icons/icon.svg", "icons/apple-touch-icon.png"],
      manifest: {
        id: "/",
        name: "Placar do Buraco",
        short_name: "Buraco",
        description: "Placar de pontos do buraco em duplas.",
        lang: "pt-BR",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#edf1ec",
        theme_color: "#1f5e45",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
          { src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        navigateFallback: "/index.html",
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
