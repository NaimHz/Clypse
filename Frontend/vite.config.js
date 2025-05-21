import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
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
