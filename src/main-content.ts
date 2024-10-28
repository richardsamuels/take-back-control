import * as browser from "webextension-polyfill";
import { mount } from "svelte";
import { type Message } from "./messages";
import Content from "./Content.svelte";
import { setupStoreFromLocalStorage } from "./store.svelte";

(async function appendCreatedDivs() {
  await setupStoreFromLocalStorage();

  browser.runtime.onMessage.addListener((msg) => {
    console.log(msg);
  });

  const bodyElement = document.querySelector("body");
  // @ts-ignore
  mount(Content, { target: bodyElement });
})();
