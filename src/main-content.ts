import * as browser from "webextension-polyfill";
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

browser.runtime.onMessage.addListener((msg: unknown): undefined => {
  if ((msg as Message)?.reloadContentScripts) {
    console.log("need to reassess");
  }
});
