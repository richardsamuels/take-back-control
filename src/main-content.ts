import * as browser from "/node_modules/webextension-polyfill/dist/browser-polyfill.min.js";
import { mount } from "svelte";
import { type Message } from "./messages";
import Content from "./Content.svelte";
import { setupStoreFromLocalStorage } from "./store.svelte";

(async function appendCreatedDivs() {
  await setupStoreFromLocalStorage(true);

  const bodyElement = document.querySelector("body");
  // @ts-ignore
  mount(Content, { target: bodyElement });
})();

browser.runtime.onMessage.addListener((msg: Message) => {
  if (msg?.reloadContentScripts) {
    console.log("need to reassess");
  }
});
