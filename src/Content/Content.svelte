<script lang="ts">
  import Wall from "./Wall.svelte";
  import { settingsStore } from "@/store";
  import { findPattern } from "@/lib/helpers";

  function balance(e: Event) {
    e.preventDefault();
    settingsStore.time.start();
  }

  const blacklistPattern = $derived.by(() =>
    findPattern($settingsStore.blacklist),
  );
  const whitelistPattern = $derived.by(() =>
    findPattern($settingsStore.whitelist),
  );
</script>

{#if blacklistPattern != null && whitelistPattern == null}
  <Wall {blacklistPattern} />

  <!-- HACK: This allows us to start the balance feature from Playwright.
  It won't show up in any other context. If only we could click the Popup :/ -->
  {#if import.meta.env.USE_PLAYWRIGHT_HELPERS}
    <button data-testid="balance-button" onclick={balance}>Balance </button>
  {/if}
{/if}
