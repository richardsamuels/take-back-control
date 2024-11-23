import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { iifeBuild } from "./vite.common.config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte({ emitCss: false })],
  build: iifeBuild,
});
