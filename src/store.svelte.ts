import * as browser from "webextension-polyfill";
import * as constants from "./constants";
import { writable } from "svelte/store";
import { SvelteMap } from "svelte/reactivity";
import { type Message } from "./messages";

export type BlacklistSitesMap = SvelteMap<string, BlacklistSiteConfig>;

export type BlacklistSiteConfig = {
  scrollFactor: number;
  blockWholePage: boolean;
  alwaysBlock: boolean;
};

export type Settings = {
  init: boolean;
  enabled: boolean;
  nagChance: number;
  messages: string[];
  blacklist: string[];
  whitelist: string[];
  blacklistSites: BlacklistSitesMap;
};

function removeElement<T>(arr: T[], i: number): T[] {
  return arr.slice(0, i).concat(arr.slice(i + 1));
}

function createSettingsStore() {
  const { subscribe, set, update } = writable<Settings>({
    init: false,
    enabled: true,
    nagChance: 0,
    messages: [],
    whitelist: [],
    blacklist: [],
    blacklistSites: new SvelteMap(),
  });

  return {
    subscribe,
    set,
    nuke: () => update((_store) => defaultStore()),
    init: () => update((store) => ({ ...store, init: true })),
    enable: (v: boolean) => update((store) => ({ ...store, enabled: v })),
    blacklist: {
      add: (url: string) =>
        update((store) => {
          const newStore = { ...store, blacklist: [...store.blacklist, url] };
          newStore.blacklistSites.set(url, {
            scrollFactor: constants.PERMITTED_SCROLL_FACTOR,
            blockWholePage: false,
            alwaysBlock: false,
          });
          return newStore;
        }),
      remove: (i: number) =>
        update((store) => ({
          ...store,
          blacklist: removeElement(store.blacklist, i),
        })),
      reset: () =>
        update((store) => ({
          ...store,
          blacklist: constants.DEFAULT_URL_BLACKLIST,
          blacklistSites: new SvelteMap(
            constants.DEFAULT_URL_BLACKLIST.map((url: string) => [
              url,
              {
                scrollFactor: constants.PERMITTED_SCROLL_FACTOR,
                blockWholePage: false,
                alwaysBlock: false,
              },
            ]),
          ),
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
  lastStore = {
    init: false,
    enabled: true,
    nagChance: 0,
    blacklist: [],
    whitelist: [],
    messages: [],
    blacklistSites: {},
    //timeoutBlacklist: [],
  };

  subscribe = async (store: Settings) => {
    const msg: Message = {
      behaviorChanged: false,
      reloadMessages: false,
      reloadContentScripts: false,
    };
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
    const newStore = storeSerialize(store);
    this.lastStore = newStore;
    await browser.storage.sync.set(newStore);
    try {
      await browser.runtime.sendMessage(msg);
    } catch (e) {
      console.trace(e);
    }

    if ("tabs" in browser) {
      try {
        await sendToTabsWithContentScript(msg);
      } catch (e) {
        console.trace(e);
      }
    }
  };
}

let likeCommentAnd = new LikeCommentAnd();

function defaultStore(): Settings {
  const store = {
    init: true,
    enabled: true,
    nagChance: 0,
    blacklist: constants.DEFAULT_URL_BLACKLIST,
    whitelist: constants.DEFAULT_URL_WHITELIST,
    messages: constants.DEFAULT_MESSAGES,
    blacklistSites: new SvelteMap<string, BlacklistSiteConfig>(),
  };

  for (const site of store.blacklist) {
    store.blacklistSites.set(site, {
      scrollFactor: constants.PERMITTED_SCROLL_FACTOR,
      blockWholePage: false,
      alwaysBlock: false,
    });
  }
  return store;
}

export async function initStorage() {
  const store = defaultStore();

  await browser.storage.sync.set(storeSerialize(store as Settings));
  settingsStore.update((_store: Settings) => store);
}

export async function setupStoreFromLocalStorage(): Promise<void> {
  if (unsubscribe) {
    unsubscribe();
  }

  const storeSettings = await storeDeserializeFromStorage();
  console.trace(storeSettings);
  settingsStore.update((_store: Settings) => storeSettings);

  // Subscribe and store unsubscribe function
  if (unsubscribe === null) {
    unsubscribe = settingsStore.subscribe(likeCommentAnd.subscribe);
  }
}

function storeSerialize(store: Settings): any {
  return {
    ...store,
    blacklistSites: Object.fromEntries(store.blacklistSites),
  };
}

async function storeDeserializeFromStorage(): Promise<Settings> {
  const store = await browser.storage.sync.get();
  return {
    ...store,
    // @ts-ignore
    blacklistSites: new SvelteMap(Object.entries(store.blacklistSites)),
  } as Settings;
}

let unsubscribe: any = null;
