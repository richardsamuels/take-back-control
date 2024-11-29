import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { chromeIifeBuild } from "./vite.common.config";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte({ emitCss: false }), tsconfigPaths()],
  build: chromeIifeBuild,
  define: {
    "import.meta.env.USE_PLAYWRIGHT_HELPERS": JSON.stringify(
      process.env.USE_PLAYWRIGHT_HELPERS,
    ),
  },
});
