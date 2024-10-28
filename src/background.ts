import * as browser from "webextension-polyfill";
import { get } from "svelte/store";
import {
  setupStoreFromLocalStorage,
  settingsStore,
  type Settings,
} from "./store.svelte";
import { type Message } from "./messages";

let registered: any = null;

async function registerScript(_msg: unknown) {
  //console.log("Message", _message);
  await setupStoreFromLocalStorage();

  let settings = get<Settings>(settingsStore);
  //console.log(settings);
  try {
    await browser.scripting.unregisterContentScripts({ ids: ["ads-injector"] });
  } catch (e) {}
  if (settings.blacklist.length == 0 || settings.messages.length == 0) {
    console.info("Blacklist/Messages empty, skippings scripts", settings);
    return;
  }
  if (!settings.enable) {
    console.info("Plugin disabled, skipping scripts");
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

browser.runtime.onMessage.addListener(registerScript);

registerScript({ reloadContentScripts: true, reloadMessages: true });
