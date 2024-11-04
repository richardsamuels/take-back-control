import * as browser from "webextension-polyfill";
import * as constants from "./constants";
import { writable, get } from "svelte/store";
import { type Message } from "./messages";

export type BlacklistSitesMap = {
  [key: string]: BlacklistSiteConfig;
};

export type BlacklistSiteConfig = {
  scrollFactor: number;
  blockWholePage: boolean;
  alwaysBlock: boolean;
};

export type Time = {
  global: number;
};

export type Settings = {
  init: boolean;
  showDebug: boolean;
  enabled: boolean;
  nagChance: number;
  messages: string[];
  blacklist: string[];
  whitelist: string[];
  blacklistSites: BlacklistSitesMap;
  dailyBalanceInterval: number;
  time: Time;
};

function removeElement<T>(arr: T[], i: number): T[] {
  return arr.slice(0, i).concat(arr.slice(i + 1));
}

function nilSettings(): Settings {
  return {
    init: false,
    showDebug: false,
    enabled: false,
    nagChance: 0,
    messages: [],
    whitelist: [],
    blacklist: [],
    blacklistSites: {},
    dailyBalanceInterval: 0,
    time: {
      global: 0,
    },
  };
}

function defaultSettings(): Settings {
  const settings: Settings = {
    init: true,
    showDebug: false,
    enabled: true,
    nagChance: 0,
    blacklist: constants.DEFAULT_URL_BLACKLIST,
    whitelist: constants.DEFAULT_URL_WHITELIST,
    messages: constants.DEFAULT_MESSAGES,
    blacklistSites: {},
    dailyBalanceInterval: 0,
    time: {
      global: 0,
    },
  };

  for (const site of settings.blacklist) {
    settings.blacklistSites[site] = {
      scrollFactor: constants.DEFAULT_SCROLL_FACTOR,
      blockWholePage: false,
      alwaysBlock: false,
    };
  }
  return settings;
}

function createSettingsStore() {
  const { subscribe, set, update } = writable<Settings>(nilSettings());

  return {
    subscribe,
    set,
    nuke: () => update((_store) => defaultSettings()),
    init: () =>
      update((store) => ({
        ...store,
        init: true,
      })),
    enable: (v: boolean) =>
      update((store) => ({
        ...store,
        enabled: v,
      })),
    blacklist: {
      add: (url: string) =>
        update((store) => {
          return {
            ...store,
            blacklist: [...store.blacklist, url],
            blacklistSites: {
              ...store.blacklistSites,
              [url]: {
                scrollFactor: constants.DEFAULT_SCROLL_FACTOR,
                blockWholePage: false,
                alwaysBlock: false,
              },
            },
          };
        }),
      remove: (i: number) =>
        update((store) => {
          const toDel = store.blacklist[i];
          const newStore = {
            ...store,
            blacklist: removeElement(store.blacklist, i),
          };
          delete newStore.blacklistSites[toDel];
          return newStore;
        }),
      reset: () =>
        update((store) => ({
          ...store,
          blacklist: constants.DEFAULT_URL_BLACKLIST,
          blacklistSites: defaultSettings().blacklistSites,
        })),
    },
    blacklistSites: {
      set: (key: string, value: BlacklistSiteConfig) =>
        update((store) => {
          return {
            ...store,
            blacklistSites: {
              ...store.blacklistSites,
              [key]: value,
            },
          };
        }),
    },
    whitelist: {
      add: (url: string) =>
        update((store) => ({
          ...store,
          whitelist: [...store.whitelist, url],
        })),
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
        update((store) => ({
          ...store,
          messages: [...store.messages, url],
        })),
      remove: (i: number) =>
        update((store) => ({
          ...store,
          messages: removeElement(store.messages, i),
        })),
      reset: () =>
        update((store) => ({
          ...store,
          messages: constants.DEFAULT_MESSAGES,
        })),
    },
    update,
  };
}

export const settingsStore = createSettingsStore();

class LikeCommentAnd {
  lastStore: Settings | undefined = undefined;

  subscribe = async (store: Settings) => {
    if (this.lastStore === undefined) {
      // For initial fetch, just store the store. This is called
      // immediately after the subscription is created
      this.lastStore = store;
      return;
    }

    this.lastStore = store;
    const newStore = { settings: store };
    console.trace("storing", newStore);
    await browser.storage.sync.set(newStore);
  };
}

let likeCommentAnd = new LikeCommentAnd();

export async function initStorage() {
  const newStore = defaultSettings();
  settingsStore.update((_store: Settings) => newStore);
}

let unsubscribe: any = null;

export async function hydrateStorage() {
  const newStore = (await browser.storage.sync.get()) as Settings;
  settingsStore.update((_store: Settings) => newStore);
}

export async function storageChange(_changes?: browser.Storage.StorageChange) {
  browser.storage.sync.onChanged.removeListener(storageChange);
  if (unsubscribe !== null) {
    unsubscribe();
    likeCommentAnd.lastStore = undefined;
  }

  await hydrateStorage();

  unsubscribe = settingsStore.subscribe(likeCommentAnd.subscribe);
  browser.storage.sync.onChanged.addListener(storageChange);
}
