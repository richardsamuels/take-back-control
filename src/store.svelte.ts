import * as browser from "webextension-polyfill";
import * as constants from "./constants";
import { writable } from "svelte/store";
import { type Message } from "./messages";

const KEY_BLACKLIST = "blacklist";
const KEY_WHITELIST = "whitelist";
const KEY_MESSAGES = "messages";
const KEY_DIDINIT = "init";

export type Settings = {
  init: boolean;
  enable: boolean;
  messages: string[];
  blacklist: string[];
  timeoutBlacklist: string[];
  whitelist: string[];
};

function createSettingsStore() {
  const { subscribe, set, update } = writable<Settings>({
    init: false,
    enable: true,
    messages: [],
    whitelist: [],
    blacklist: [],
    timeoutBlacklist: [],
  });

  function removeElement<T>(arr: T[], i: number): T[] {
    return arr.slice(0, i).concat(arr.slice(i + 1));
  }

  return {
    subscribe,
    set,
    nuke: () =>
      update((_store) => ({
        init: false,
        enable: true,
        messages: [],
        whitelist: [],
        blacklist: [],
        timeoutBlacklist: [],
      })),
    init: () => update((store) => ({ ...store, init: true })),
    enable: (v: boolean) => update((store) => ({ ...store, enable: v })),
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

class LikeCommentAnd {
  lastStore = { messages: [], whitelist: [], blacklist: [] };

  subscribe = async (store: Settings) => {
    const msg: Message = { reloadMessages: false, reloadContentScripts: false };

    // @ts-ignore: implicit any
    if (store.messages != this.lastStore.messages) {
      msg.reloadMessages = true;
    }
    if (
      // @ts-ignore: implicit any
      store.blacklist != this.lastStore.blacklist ||
      // @ts-ignore: implicit any
      store.whitelist != this.lastStore.whitelist
    ) {
      msg.reloadContentScripts = true;
    }
    await browser.storage.sync.set(store);
    // @ts-ignore: implicit any
    this.lastStore = store;
    try {
      await browser.runtime.sendMessage(msg);
    } catch (e) {
      console.error(e);
    }
  };
}

let likeCommentAnd = new LikeCommentAnd();

export async function setupStoreFromLocalStorage(
  never_init = false,
): Promise<void> {
  if (unsubscribe) {
    unsubscribe();
  }
  let store: Partial<Settings> = await browser.storage.sync.get([
    KEY_DIDINIT,
    KEY_BLACKLIST,
    KEY_WHITELIST,
    KEY_MESSAGES,
  ]);
  //console.log(
  //  "Loaded from storage",
  //  store,
  //  "init needed?",
  //  !store[KEY_DIDINIT],
  //);

  const newstore: Partial<Settings> = {
    [KEY_BLACKLIST]: constants.DEFAULT_URL_BLACKLIST,
    [KEY_WHITELIST]: constants.DEFAULT_URL_WHITELIST,
    [KEY_MESSAGES]: constants.DEFAULT_MESSAGES,
    [KEY_DIDINIT]: true,
  };
  if (never_init) {
    // @ts-ignore
    delete newstore[KEY_DIDINIT];
  }
  if (store.init || never_init) {
    // @ts-ignore
    delete newstore[KEY_WHITELIST];
    // @ts-ignore
    delete newstore[KEY_BLACKLIST];
    // @ts-ignore
    delete newstore[KEY_MESSAGES];
  }
  if (store.init) {
    if (KEY_BLACKLIST in store) {
      newstore[KEY_BLACKLIST] = store[KEY_BLACKLIST];
    }

    if (KEY_WHITELIST in store) {
      newstore[KEY_WHITELIST] = store[KEY_WHITELIST];
    }

    if (KEY_MESSAGES in store) {
      newstore[KEY_MESSAGES] = store[KEY_MESSAGES];
    }
  } else {
    console.log("First launch, initializing to defaults");
  }

  //console.log("Update", newstore);

  settingsStore.update((store: Settings) => ({
    ...store,
    ...newstore,
  }));

  // Subscribe and store unsubscribe function
  if (unsubscribe === null) {
    unsubscribe = settingsStore.subscribe(likeCommentAnd.subscribe);
  }
}

let unsubscribe: any = null;
