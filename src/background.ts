import * as browser from "webextension-polyfill";
import { get } from "svelte/store";
import { settingsStore, type Settings } from "./store.svelte";
import { initStorage, storageChange } from "./store.svelte";

let registered: any = null;

async function registerScript() {
  let store = get<Settings>(settingsStore);
  if (!store?.init) {
    return;
  }

  try {
    await browser.scripting.unregisterContentScripts({
      ids: ["ads-injector"],
    });
  } catch (e) {
    // pass: we don't care if this fails
  }
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

browser.runtime.onInstalled.addListener(async function (
  event: browser.Runtime.OnInstalledDetailsType,
) {
  if (event.reason == "install") {
    await initStorage();
    console.trace(
      "Plugin installed, initializing defaults",
      get(settingsStore),
    );
    registerScript();
  }
  if (event.reason == "update") {
    // TODO migrations
  }
});

// @ts-ignore
browser.storage.sync.onChanged.addListener(registerScript);
await storageChange();
registerScript();
