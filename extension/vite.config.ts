import webExtension from "@samrum/vite-plugin-web-extension";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

import manifest from "./manifest";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest,
      additionalInputs: {
        scripts: [{ fileName: "src/inpage/index.ts", webAccessible: true }],
      },
    }),
    nodePolyfills({
      exclude: ["fs"],
    }),
  ],
});
