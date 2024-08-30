import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  // base path for gh-pages
  base: "typesafe-query-builder-playground/",
  plugins: [
    react(),
    // Didn't work with my own little polyfills as the vite dev
    // server would always mangle the imports in
    // typesafe-query-builder.index.mjs when the browser imports it
    nodePolyfills(),
  ],
  optimizeDeps: {
    exclude: ["@electric-sql/pglite"],
  },
});
