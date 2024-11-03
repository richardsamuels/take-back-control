import * as browser from "webextension-polyfill";
import { get } from "svelte/store";
import {
  setupStoreFromLocalStorage,
  initStorage,
  settingsStore,
  type Settings,
} from "./store.svelte";
import { type Message } from "./messages";

let registered: any = null;

async function registerScript(msg: Message) {
  await setupStoreFromLocalStorage();

  let store = get<Settings>(settingsStore);
  if (!store?.init) {
    return;
  }

  if (msg.reloadContentScripts) {
    try {
      await browser.scripting.unregisterContentScripts({
        ids: ["ads-injector"],
      });
    } catch (e) {}
    if (store.blacklist.length == 0 || store.messages.length == 0) {
      console.log("Blacklist/Messages empty, skippings scripts", store);
      return;
    }

    registered = await browser.scripting.registerContentScripts([
      {
        id: "ads-injector",
        matches: store.blacklist,
        excludeMatches: store.whitelist,
        js: ["assets/main-content.js"],
        runAt: "document_idle",
      },
    ]);
  }
}

browser.runtime.onInstalled.addListener(async function (
  event: browser.Runtime.OnInstalledDetailsType,
) {
  if (event.reason == "install") {
    await initStorage();
    console.trace(
      "Plugin installed, initializing defaults",
      get(settingsStore),
    );
    registerScript({
      sendUrlToPopup: false,
      behaviorChanged: true,
      reloadContentScripts: true,
      reloadMessages: true,
    });
  }
  if (event.reason == "update") {
    // TODO migrations
  }
});

// @ts-ignore
browser.runtime.onMessage.addListener(registerScript);
registerScript({
  sendUrlToPopup: false,
  behaviorChanged: true,
  reloadContentScripts: true,
  reloadMessages: true,
});
