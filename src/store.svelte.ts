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

export type Store = {
  settings: Settings;
};

function removeElement<T>(arr: T[], i: number): T[] {
  return arr.slice(0, i).concat(arr.slice(i + 1));
}

function createSettingsStore() {
  const { subscribe, set, update } = writable<Store>({
    settings: {
      init: false,
      enabled: true,
      nagChance: 0,
      messages: [],
      whitelist: [],
      blacklist: [],
      blacklistSites: new SvelteMap(),
    },
  });

  return {
    subscribe,
    set,
    nuke: () => update((_store) => defaultStore()),
    init: () =>
      update((store) => ({
        ...store,
        settings: { ...store.settings, init: true },
      })),
    enable: (v: boolean) =>
      update((store) => ({
        ...store,

        settings: { ...store.settings, enabled: v },
      })),
    blacklist: {
      add: (url: string) =>
        update((store) => {
          const newStore = {
            ...store,
            settings: {
              ...store.settings,
              blacklist: [...store.settings.blacklist, url],
            },
          };
          newStore.settings.blacklistSites.set(url, {
            scrollFactor: constants.PERMITTED_SCROLL_FACTOR,
            blockWholePage: false,
            alwaysBlock: false,
          });
          return newStore;
        }),
      remove: (i: number) =>
        update((store) => ({
          ...store,
          settings: {
            ...store.settings,
            blacklist: removeElement(store.settings.blacklist, i),
          },
        })),
      reset: () =>
        update((store) => ({
          settings: {
            ...store.settings,
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
          },
        })),
    },
    whitelist: {
      add: (url: string) =>
        update((store) => ({
          settings: {
            ...store.settings,
            whitelist: [...store.settings.whitelist, url],
          },
        })),
      remove: (i: number) =>
        update((store) => ({
          ...store.settings,
          settings: {
            ...store.settings,
            whitelist: removeElement(store.settings.whitelist, i),
          },
        })),
      reset: () =>
        update((store) => ({
          settings: {
            ...store.settings,
            whitelist: constants.DEFAULT_URL_WHITELIST,
          },
        })),
    },
    messages: {
      add: (url: string) =>
        update((store) => ({
          settings: {
            ...store.settings,
            messages: [...store.settings.messages, url],
          },
        })),
      remove: (i: number) =>
        update((store) => ({
          settings: {
            ...store.settings,
            messages: removeElement(store.settings.messages, i),
          },
        })),
      reset: () =>
        update((store) => ({
          settings: { ...store.settings, messages: constants.DEFAULT_MESSAGES },
        })),
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
    settings: {
      init: false,
      enabled: true,
      nagChance: 0,
      blacklist: [],
      whitelist: [],
      messages: [],
      blacklistSites: {},
      //timeoutBlacklist: [],
    },
  };

  subscribe = async (store: Store) => {
    const msg: Message = {
      sendUrlToPopup: false,
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
    if (store.settings.messages != this.lastStore?.settings.messages) {
      msg.reloadMessages = true;
    }
    if (store.settings.enabled != this.lastStore?.settings.enabled) {
      msg.behaviorChanged = true;
    }
    if (
      // @ts-ignore: implicit any
      store.settings.blacklist != this.lastStore?.settings.blacklist ||
      // @ts-ignore: implicit any
      store.settings.whitelist != this.lastStore?.settings.whitelist
    ) {
      msg.reloadContentScripts = true;
    }
    const newStore = storeSerialize(store);
    this.lastStore = newStore;
    console.log("storing", newStore);
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

function defaultStore(): Store {
  const settings = {
    init: true,
    enabled: true,
    nagChance: 0,
    blacklist: constants.DEFAULT_URL_BLACKLIST,
    whitelist: constants.DEFAULT_URL_WHITELIST,
    messages: constants.DEFAULT_MESSAGES,
    blacklistSites: new SvelteMap<string, BlacklistSiteConfig>(),
  };

  for (const site of settings.blacklist) {
    settings.blacklistSites.set(site, {
      scrollFactor: constants.PERMITTED_SCROLL_FACTOR,
      blockWholePage: false,
      alwaysBlock: false,
    });
  }
  return { settings: settings };
}

export async function initStorage() {
  const store = defaultStore();

  await browser.storage.sync.set(storeSerialize(store as Store));
  settingsStore.update((_store: Store) => store);
}

let unsubscribe: any = null;
export async function setupStoreFromLocalStorage(): Promise<void> {
  if (unsubscribe != null) {
    unsubscribe();
  }

  const storeSettings = await storeDeserializeFromStorage();
  settingsStore.update((_store: Store) => storeSettings);

  // Subscribe and store unsubscribe function
  if (unsubscribe === null) {
    unsubscribe = settingsStore.subscribe(likeCommentAnd.subscribe);
  }
}

function storeSerialize(store: Store): any {
  return {
    ...store,
    settings: {
      ...store.settings,
      blacklistSites: Object.fromEntries(store.settings.blacklistSites),
    },
  };
}

async function storeDeserializeFromStorage(): Promise<Store> {
  const store = (await browser.storage.sync.get()) as Store;
  const realStore = {
    ...store,
    settings: {
      ...store.settings,
      // @ts-ignore
      blacklistSites: new SvelteMap(
        Object.entries(store.settings?.blacklistSites || {}),
      ),
    },
  } as Store;
  return realStore;
}
