import pkg from "./package.json";
import { resolve } from "path";

export const config = {
  manifest: {
    name: "Anti-Doomscroll",
    description: "Take back control.",
    version: pkg.version,
    manifest_version: 3 as any,
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
      open_in_tab: true,
    },
    background: {
      scripts: ["src/background.ts"],
    },
    web_accessible_resources: [
      {
        matches: ["<all_urls>"],
        resources: ["assets/main-content.js"],
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
};

export const chromeConfig = {
  ...config,
  manifest: {
    ...config.manifest,
    background: {
      ...config.manifest.background,
      service_worker: config.manifest.background.scripts[0],
    },
  },
};
// @ts-ignore
delete chromeConfig.manifest.background.scripts;
// @ts-ignore
delete chromeConfig.manifest.browser_specific_settings;

export const build = {
  outDir: "dist",
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
};

export const chromeBuild = {
  ...build,
  outDir: "dist-chrome",
};

export const iifeBuild = {
  ...build,
  rollupOptions: {
    ...build.rollupOptions,
    output: {
      ...build.rollupOptions.output,
      format: "iife",
      inlineDynamicImports: true,
    },
    input: ["src/main-content.ts"],
  },
};

export const chromeIifeBuild = {
  ...chromeBuild,
  rollupOptions: {
    ...chromeBuild.rollupOptions,
    output: {
      ...chromeBuild.rollupOptions.output,
      format: "iife",
      inlineDynamicImports: true,
    },
    input: ["src/main-content.ts"],
  },
};
