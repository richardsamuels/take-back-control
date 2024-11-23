import * as browser from "webextension-polyfill";
import { mount } from "svelte";
import { type Message } from "./messages";
import Content from "./Content.svelte";
import { storageChange } from "./store.svelte";

browser.runtime.onMessage.addListener(
  async (
    msg_: unknown,
    _sender: browser.Runtime.MessageSender,
    sendResponse: any,
  ) => {
    const msg = msg_ as Message;
    if (msg.sendUrlToPopup) {
      sendResponse({ url: window.location });
      return;
    }
  },
);

(async function appendCreatedDivs() {
  await storageChange();
  const bodyElement = document.querySelector("body");
  if (!bodyElement) {
    console.warn(
      "Document contains no body element. Doomscrolling will NOT be blocked",
    );
    return;
  }
  const container = document.createElement("div");
  bodyElement.appendChild(container);
  // XXX: Do not change to closed, or playwright will break
  const shadowRoot = container.attachShadow({ mode: "open" });
  mount(Content, { target: shadowRoot });
})();
