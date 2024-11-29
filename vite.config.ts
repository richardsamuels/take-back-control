import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import webExtension from "@samrum/vite-plugin-web-extension";
import { config, build } from "./vite.common.config";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  // @ts-ignore
  plugins: [svelte(), webExtension(config), tsconfigPaths()],
  build,
});
