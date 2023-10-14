import webExtension from "@samrum/vite-plugin-web-extension";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import manifest from "./manifest";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest,
    }),
  ],
});
