import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import webExtension from "@samrum/vite-plugin-web-extension";
import { chromeConfig, chromeBuild } from "./vite.common.config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), webExtension(chromeConfig)],
  build: chromeBuild,
});
