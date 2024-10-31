import * as browser from "webextension-polyfill";
import { mount } from "svelte";
import { type Message } from "./messages";
import Content from "./Content.svelte";
import { setupStoreFromLocalStorage } from "./store.svelte";

browser.runtime.onMessage.addListener(
  async (
    msg_: unknown,
    _sender: browser.Runtime.MessageSender,
    sendResponse: any,
  ) => {
    console.log(msg_);
    await setupStoreFromLocalStorage();
    const msg = msg_ as Message;

    if (msg.sendUrlToPopup) {
      sendResponse({ url: window.location });
      return;
    }
  },
);

(async function appendCreatedDivs() {
  await setupStoreFromLocalStorage();

  const bodyElement = document.querySelector("body");
  // @ts-ignore
  mount(Content, { target: bodyElement });
})();
