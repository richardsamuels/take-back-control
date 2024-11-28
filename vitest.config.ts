import { defineConfig } from "vite";

export default defineConfig({
  // @ts-ignore
  test: {
    exclude: [
      "e2e/*",
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
    ],
  },
});
