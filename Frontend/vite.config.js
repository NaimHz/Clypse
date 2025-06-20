import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), tailwindcss(), VitePWA({ registerType: 'autoUpdate', manifest: { /* ...voir ci-dessus... */ } })],  build: {
    rollupOptions: {
      external: ['chart.js/auto'],
      output: {
        globals: {
          'chart.js/auto': 'Chart'
        }
      }
    }
  }
});
