import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { iifeBuild } from "./vite.common.config";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte({ emitCss: false }), tsconfigPaths()],
  build: iifeBuild,
});
