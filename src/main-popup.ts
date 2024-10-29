import * as browser from "webextension-polyfill";
import { mount } from "svelte";
import "./app.css";
import Popup from "./Popup.svelte";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { setupStoreFromLocalStorage } from "./store.svelte";

await setupStoreFromLocalStorage();

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

const bodyElement = document.querySelector("body");
// @ts-ignore
mount(Popup, { target: bodyElement });
