<script lang="ts">
  import * as browser from "webextension-polyfill";
  import { settingsStore, setupStoreFromLocalStorage } from "./store.svelte";
  import { onMount, onDestroy } from "svelte";
  import { patternMatch } from "./Options/validator";

  function options(e: Event) {
    e.preventDefault();
    const optionsUrl =
      browser.runtime.getURL("src/options.html") + "#/whitelist";
    browser.tabs.create({ url: optionsUrl });
  }

  let url = $state("");
  let needRefresh = $state(false);
  let extensionActive = $state(false);

  async function extensionActiveInActiveTab(): Promise<boolean> {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const active = tabs[0];
    url = active.url || "";
    try {
      (await browser.tabs.sendMessage(active.id!, {
        sendUrlToPopup: true,
      })) as { url: URL };
      extensionActive = true;
      return true;
    } catch (err) {
      extensionActive = false;
      // If we can't send a message to the tab, the content script isn't
      // injected. That means the extension isn't active on that tab
      return false;
    }
  }

  async function block(e: Event) {
    e.preventDefault();
    const p = URL.parse(url);
    settingsStore.blacklist.add(`*://${p!.host}/*`);
    needRefresh = true;
  }

  const isURLAllowed = (currentUrl: string) => {
    const whitelist = $settingsStore.settings.whitelist;
    return whitelist.some((pattern: string) =>
      patternMatch(pattern, currentUrl),
    );
  };

  onMount(() => {
    browser.tabs.onActivated.addListener(extensionActiveInActiveTab);
    browser.tabs.onUpdated.addListener(extensionActiveInActiveTab);
  });
  onDestroy(() => {
    browser.tabs.onActivated.removeListener(extensionActiveInActiveTab);
    browser.tabs.onUpdated.removeListener(extensionActiveInActiveTab);
  });
</script>

<main>
  <div class="pb-2 d-flex justify-content-between align-items-bottom">
    <h1>Anti-Doomscroll</h1>
  </div>
  <div class="d-flex flex-column gap-1">
    <div id="checkboxContainer" class="d-flex flex-column gap-1">
      <!--<div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="checkbox">
                Timeout enabled
            </label>
            <div class="spinner-border spinner-border-sm d-none" role="status" id="finiteDurationSpinner">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>-->
      {#await extensionActiveInActiveTab()}
        &nbsp;
      {:then extensionActive}
        {#if !extensionActive}
          <button
            type="button"
            class="btn btn-danger"
            onclick={block}
            disabled={needRefresh}
          >
            {#if needRefresh}
              Refresh Page to Block
            {:else}
              Block this Page
            {/if}
          </button>
        {:else if isURLAllowed(url)}
          Page is Allowed
        {:else}
          Page is Not Allowed
        {/if}
      {/await}
      <div>
        <a href="#options" class="link-primary text-light" onclick={options}
          >Edit allowed websites</a
        >
      </div>
    </div>
  </div>
</main>
