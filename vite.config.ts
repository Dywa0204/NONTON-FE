import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import { nodePolyfills } from "vite-plugin-node-polyfills";

import path, { resolve } from "path";

const BASE_URL_SERVER_KEYCLOAK = "http://192.168.1.130:9008";
const BASE_URL_SERVER_DEMO = "http://demo.farmagitechs.co.id:9003";
const BASE_URL_COAS = "http://localhost:5050"
const BASE_URL_WG = "http://11.11.14.87:9008"
const TEMP = "https://53b69bbc9f2e.ngrok-free.app"

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 3006,
    proxy: {
      "/api": {
        target: BASE_URL_COAS,
        // target: BASE_URL_WG,
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  plugins: [
    react(),
    svgrPlugin(),
    ViteEjsPlugin(),
    nodePolyfills({
      protocolImports: true,
    }),
    splitVendorChunkPlugin()
  ],
  build: {
    cssCodeSplit: true,
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        light: resolve(__dirname, "src/assets/scss/light.scss"),
        dark: resolve(__dirname, "src/assets/scss/dark.scss"),
      },
      output: {
        assetFileNames: "assets/[name][extname]",
        manualChunks: {
          apexcharts: ["apexcharts"],
          chartjs: ["chart.js", "react-chartjs-2"],
          googlemaps: ["google-map-react"],
          vectormaps: [
            "jsvectormap",
          ],
          fullcalendar: [
            "@fullcalendar/bootstrap",
            "@fullcalendar/daygrid",
            "@fullcalendar/react",
            "@fullcalendar/timegrid",
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@api': path.resolve(__dirname, './src/api'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@models': path.resolve(__dirname, './src/models'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@redux': path.resolve(__dirname, './src/redux'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
});
