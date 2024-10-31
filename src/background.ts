import * as browser from "webextension-polyfill";
import { get } from "svelte/store";
import {
  setupStoreFromLocalStorage,
  initStorage,
  settingsStore,
  type Store,
} from "./store.svelte";
import { type Message } from "./messages";

let registered: any = null;

async function registerScript(msg: Message) {
  await setupStoreFromLocalStorage();

  let store = get<Store>(settingsStore);
  if (!store.settings.init) {
    return;
  }

  if (msg.reloadContentScripts) {
    try {
      await browser.scripting.unregisterContentScripts({
        ids: ["ads-injector"],
      });
    } catch (e) {}
    if (
      store.settings.blacklist.length == 0 ||
      store.settings.messages.length == 0
    ) {
      console.log(
        "Blacklist/Messages empty, skippings scripts",
        store.settings,
      );
      return;
    }
    //console.info("Reloading scripts", store.settings.blacklist, store.settings.whitelist);

    registered = await browser.scripting.registerContentScripts([
      {
        id: "ads-injector",
        matches: store.settings.blacklist,
        excludeMatches: store.settings.whitelist,
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
});

// @ts-ignore
browser.runtime.onMessage.addListener(registerScript);
registerScript({
  sendUrlToPopup: false,
  behaviorChanged: true,
  reloadContentScripts: true,
  reloadMessages: true,
});
