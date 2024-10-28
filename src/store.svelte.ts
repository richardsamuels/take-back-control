import * as browser from "webextension-polyfill";
import * as constants from "./constants";
import { writable } from "svelte/store";
import { type Message } from "./messages";
import { asyncable } from "svelte-asyncable";

const KEY_BLACKLIST = "blacklist";
const KEY_WHITELIST = "whitelist";
const KEY_MESSAGES = "messages";
const KEY_DIDINIT = "init";
const KEY_ENABLED = "enabled";

export type Settings = {
  init: boolean;
  enabled: boolean;
  messages: string[];
  blacklist: string[];
  //timeoutBlacklist: string[];
  whitelist: string[];
};

function removeElement<T>(arr: T[], i: number): T[] {
  return arr.slice(0, i).concat(arr.slice(i + 1));
}

function createSettingsStore() {
  const { subscribe, set, update } = writable<Settings>({
    init: false,
    enabled: true,
    messages: [],
    whitelist: [],
    blacklist: [],
    //timeoutBlacklist: [],
  });

  return {
    subscribe,
    set,
    nuke: () => update((_store) => defaultStore()),
    init: () => update((store) => ({ ...store, init: true })),
    enable: (v: boolean) => update((store) => ({ ...store, enabled: v })),
    blacklist: {
      add: (url: string) =>
        update((store) => ({ ...store, blacklist: [...store.blacklist, url] })),
      remove: (i: number) =>
        update((store) => ({
          ...store,
          blacklist: removeElement(store.blacklist, i),
        })),
      reset: () =>
        update((store) => ({
          ...store,
          blacklist: constants.DEFAULT_URL_BLACKLIST,
        })),
    },
    whitelist: {
      add: (url: string) =>
        update((store) => ({ ...store, whitelist: [...store.whitelist, url] })),
      remove: (i: number) =>
        update((store) => ({
          ...store,
          whitelist: removeElement(store.whitelist, i),
        })),
      reset: () =>
        update((store) => ({
          ...store,
          whitelist: constants.DEFAULT_URL_WHITELIST,
        })),
    },
    messages: {
      add: (url: string) =>
        update((store) => ({ ...store, messages: [...store.messages, url] })),
      remove: (i: number) =>
        update((store) => ({
          ...store,
          messages: removeElement(store.messages, i),
        })),
      reset: () =>
        update((store) => ({ ...store, messages: constants.DEFAULT_MESSAGES })),
    },
    update,
  };
}

export const settingsStore = createSettingsStore();

async function sendToTabsWithContentScript(msg: Message) {
  // Query all tabs
  const allTabs = await browser.tabs.query({});

  for (const tab of allTabs) {
    try {
      // @ts-ignore
      await browser.tabs.sendMessage(tab.id, msg);
    } catch (error) {
      // If an error occurs, the content script is not present in this tab
      continue;
    }
  }
}

class LikeCommentAnd {
  lastStore: Settings = {
    init: false,
    enabled: true,
    messages: [],
    whitelist: [],
    blacklist: [],
    //timeoutBlacklist: [],
  };

  subscribe = async (store: Settings) => {
    const msg: Message = {
      behaviorChanged: false,
      reloadMessages: false,
      reloadContentScripts: false,
    };
    console.log(this.lastStore?.enabled, store.enabled);
    if (this.lastStore == undefined) {
      msg.reloadContentScripts = true;
      msg.behaviorChanged = true;
      msg.reloadMessages = true;
    }

    // @ts-ignore: implicit any
    if (store.messages != this.lastStore?.messages) {
      msg.reloadMessages = true;
    }
    if (store.enabled != this.lastStore?.enabled) {
      msg.behaviorChanged = true;
    }
    if (
      // @ts-ignore: implicit any
      store.blacklist != this.lastStore?.blacklist ||
      // @ts-ignore: implicit any
      store.whitelist != this.lastStore?.whitelist
    ) {
      msg.reloadContentScripts = true;
    }

    // @ts-ignore: implicit any
    this.lastStore = store;
    await browser.storage.sync.set(store);
    try {
      await browser.runtime.sendMessage(msg);
    } catch (e) {
      console.error(e);
    }

    try {
      await browser.runtime.sendMessage(msg);
    } catch (e) {
      console.error(e);
    }

    if ("tabs" in browser) {
      try {
        await sendToTabsWithContentScript(msg);
      } catch (e) {
        console.error(e);
      }
    }
  };
}

let likeCommentAnd = new LikeCommentAnd();

function defaultStore(): Settings {
  return {
    [KEY_BLACKLIST]: constants.DEFAULT_URL_BLACKLIST,
    [KEY_WHITELIST]: constants.DEFAULT_URL_WHITELIST,
    [KEY_MESSAGES]: constants.DEFAULT_MESSAGES,
    [KEY_DIDINIT]: true,
    [KEY_ENABLED]: true,
  };
}

export async function initStorage() {
  const store = defaultStore();

  await browser.storage.sync.set(store);
  settingsStore.update((_store: Settings) => store);
}

export async function setupStoreFromLocalStorage(): Promise<void> {
  if (unsubscribe) {
    unsubscribe();
  }

  const store: Settings = (await browser.storage.sync.get()) as Settings;
  settingsStore.update((_store: Settings) => store);

  // Subscribe and store unsubscribe function
  if (unsubscribe === null) {
    unsubscribe = settingsStore.subscribe(likeCommentAnd.subscribe);
  }
}

let unsubscribe: any = null;
