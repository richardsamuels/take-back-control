<script lang="ts">
  import Wall from "./Content/Wall.svelte";
  import { patternMatch } from "./Options/validator";
  import { settingsStore } from "./store.svelte";

  function findPattern(patterns: string[]) {
    // Determine the pattern that caused this script to be injected
    const possiblePatterns = patterns.filter((p) =>
      patternMatch(p, window.location.toString()),
    );
    if (!possiblePatterns) {
      return null;
    }

    // TODO: MUST the most specific pattern the longest pattern?
    possiblePatterns.sort((a: string, b: string) => {
      return b.length - a.length;
    });
    return possiblePatterns[0];
  }
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
