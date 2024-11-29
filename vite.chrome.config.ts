import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import webExtension from "@samrum/vite-plugin-web-extension";
import { chromeConfig, chromeBuild } from "./vite.common.config";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), webExtension(chromeConfig), tsconfigPaths()],
  build: chromeBuild,
  define: {
    "import.meta.env.USE_PLAYWRIGHT_HELPERS": JSON.stringify(
      process.env.USE_PLAYWRIGHT_HELPERS,
    ),
  },
});
