<script lang="ts">
  import * as browser from "webextension-polyfill";
  import Enable from "./Options/Basic/Enable.svelte";
  import { settingsStore } from "./store.svelte";
  import { onMount, onDestroy } from "svelte";
  import { patternMatch } from "./Options/validator";

  function options(e: Event) {
    e.preventDefault();
    browser.runtime.openOptionsPage();
  }

  let url = $state("");

  async function extensionActiveInActiveTab(): Promise<boolean> {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const active = tabs[0];
    console.log(active.url);
    try {
      const response = (await browser.tabs.sendMessage(active.id!, {
        sendUrlToPopup: true,
      })) as { url: URL };
      url = response.url.toString();
      return true;
    } catch (err) {
      // If we can't send a message to the tab, the content script isn't
      // injected. That means the extension isn't active on that tab
      return false;
    }
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
      <div class="form-check">
        <Enable />
      </div>
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
        {#if !extensionActive || isURLAllowed(url)}
          Extension not active
        {:else if isURLAllowed(url)}
          Allowed
        {:else}
          Not Allowed
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
