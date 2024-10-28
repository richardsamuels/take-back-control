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

  let settings = get<Settings>(settingsStore);
  if (!settings.init) {
    return;
  }

  if (msg.reloadContentScripts) {
    try {
      await browser.scripting.unregisterContentScripts({
        ids: ["ads-injector"],
      });
    } catch (e) {}
    if (settings.blacklist.length == 0 || settings.messages.length == 0) {
      console.log("Blacklist/Messages empty, skippings scripts", settings);
      return;
    }
    //console.info("Reloading scripts", settings.blacklist, settings.whitelist);

    registered = await browser.scripting.registerContentScripts([
      {
        id: "ads-injector",
        matches: settings.blacklist,
        excludeMatches: settings.whitelist,
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
      behaviorChanged: true,
      reloadContentScripts: true,
      reloadMessages: true,
    });
  }
});

// @ts-ignore
browser.runtime.onMessage.addListener(registerScript);
registerScript({
  behaviorChanged: true,
  reloadContentScripts: true,
  reloadMessages: true,
});
