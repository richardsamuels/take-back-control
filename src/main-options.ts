import { mount } from "svelte";
import "./app.css";
import Options from "./Options/index.svelte";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { setupStoreFromLocalStorage } from "./store.svelte";

await setupStoreFromLocalStorage();

const app = mount(Options, {
  target: document.getElementById("app")!,
});

function setTheme() {
  const prefersDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  document.documentElement.setAttribute(
    "data-bs-theme",
    prefersDarkMode ? "dark" : "light",
  );
}
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", setTheme);

export default app;
