import { mount } from "svelte";
import { get } from "svelte/store";
import { type Message } from "./messages";
import Content from "./Content.svelte";
import { settingsStore, setupStoreFromLocalStorage } from "./store.svelte";

(async function appendCreatedDivs() {
  await setupStoreFromLocalStorage();

  const bodyElement = document.querySelector("body");
  // @ts-ignore
  mount(Content, { target: bodyElement });
})();

browser.runtime.onMessage.addListener(async () => {
  console.log("old", get(settingsStore));
  await setupStoreFromLocalStorage();
  console.log("new", get(settingsStore));
});
