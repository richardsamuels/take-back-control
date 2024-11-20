import { defineConfig } from "vite";

export default defineConfig({
  // @ts-ignore
  test: {
    exclude: ["e2e/*"],
  },
});
