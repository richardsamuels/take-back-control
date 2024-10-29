import { mount } from "svelte";
import "./app.css";
import Options from "./Options/index.svelte";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { setupStoreFromLocalStorage } from "./store.svelte";

await setupStoreFromLocalStorage();

const getPreferredTheme = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const setTheme = (theme: string) => {
  document.documentElement.setAttribute("data-bs-theme", theme);
};

// Set initial theme
setTheme(getPreferredTheme());

// Listen for preference changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", () => {
    setTheme(getPreferredTheme());
  });

const app = mount(Options, {
  target: document.getElementById("app")!,
});

export default app;
