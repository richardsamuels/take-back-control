import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
import webExtension from "@samrum/vite-plugin-web-extension";
import pkg from "./package.json";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    webExtension({
      manifest: {
        name: "Anti Doomscroll",
        description: "Take back control",
        version: pkg.version,
        manifest_version: 3,
        icons: {
          "16": "icons/skull-16.png",
          "32": "icons/skull-32.png",
          "48": "icons/skull-48.png",
          "64": "icons/skull-64.png",
          "128": "icons/skull-128.png",
        },
        action: {
          default_popup: "src/popup.html",
        },
        options_ui: {
          page: "src/options.html",
        },
        background: {
          scripts: ["src/background.ts"],
        },
        web_accessible_resources: [
          {
            matches: ["<all_urls>"],
            resources: ["assets/main-content.ts", "styles/overlay.css"],
          },
        ],
        permissions: ["storage", "activeTab", "scripting"],
        host_permissions: ["<all_urls>"],
        browser_specific_settings: {
          gecko: {
            id: "{9893e597-ebef-4695-92bd-dcbac2461493}",
          },
        },
      },
    }),
  ],
  build: {
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
      input: {
        options: resolve(__dirname, "src/options.html"),
      },
    },
    sourcemap: true,
  },
});
