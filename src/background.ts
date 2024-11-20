import * as browser from "webextension-polyfill";
import { get } from "svelte/store";
import { ONE_DAY_MINUTES } from "./constants";
import { settingsStore, type Settings } from "./store.svelte";
import { initStorage, storageChange } from "./store.svelte";
import { tryParseMatchPattern } from "./Options/validator";

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

  // Strip ports from the blacklist and dedupe
  const blacklist = [
    ...new Set(
      store.blacklist.map((item) => {
        const p = tryParseMatchPattern(item);
        if (p.host?.has_port) {
          const host = p.host?.data.split(":")[0];
          return `${p.scheme?.data}://${host}${p.path?.data}`;
        }
        return item;
      }),
    ),
  ];

  // Remove whitelist items that have ports so that Firefox won't panic.
  // The content script reimplements the whitelist to check port numbers
  const whitelist = store.whitelist.filter((item) => {
    const p = tryParseMatchPattern(item);
    return !p.host?.has_port;
  });

  registered = await browser.scripting.registerContentScripts([
    {
      id: "ads-injector",
      matches: blacklist,
      excludeMatches: whitelist,
      js: ["assets/main-content.js"],
      runAt: "document_idle",
    },
  ]);
}

function getTomorrowAt3AM(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(3, 0, 0, 0);
  return tomorrow;
}

function dailyAlarm(alarmInfo: browser.Alarms.Alarm) {
  if (alarmInfo.name !== "daily-reset") {
    return;
  }
  settingsStore.time.reset();
}

function minuteTick(alarmInfo: browser.Alarms.Alarm) {
  if (alarmInfo.name !== "every-minute") {
    return;
  }
  let store = get<Settings>(settingsStore);
  if (!store?.init) {
    return;
  }

  if (store.time.global == 0 || store.time.global == ONE_DAY_MINUTES) {
    return;
  }
  settingsStore.time.inc();
  if (store.time.global > store.dailyBalanceInterval) {
    settingsStore.time.overload();
  }
}

// Chrome does not support top level await in service workers, so we have to
// do this
storageChange().then(() => {
  function finish() {
    browser.alarms.onAlarm.addListener(dailyAlarm);
    browser.alarms.onAlarm.addListener(minuteTick);
    browser.alarms.create("daily-reset", {
      when: getTomorrowAt3AM().getTime(),
      periodInMinutes: ONE_DAY_MINUTES,
    });
    browser.alarms.create("every-minute", {
      delayInMinutes: 1,
      periodInMinutes: 1,
    });
    browser.storage.sync.onChanged.addListener(registerScript);
    registerScript();
  }

  // runtime.onInstalled is not reliably firing, so we work around that.
  let store = get<Settings>(settingsStore);
  if (!store?.init) {
    initStorage().then(() => {
      console.trace(
        "Plugin installed, initialized defaults",
        get(settingsStore),
      );
      finish();
    });
  } else {
    finish();
  }
});
