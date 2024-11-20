<script lang="ts">
  import Wall from "./Content/Wall.svelte";
  import { onMount } from "svelte";
  import {
    OVERLAY_DIV_ID,
    MESSAGE_DISPLAY_DIV_ID,
    MAX_BLUR,
    ONE_DAY_MINUTES,
  } from "./constants";
  import { patternMatch } from "./Options/validator";
  import { settingsStore } from "./store.svelte";

  const blacklistPattern = $derived.by(() => {
    // Determine the pattern that caused this script to be injected
    const possiblePatterns = $settingsStore.blacklist.filter((p) =>
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
  });

  const whitelistPattern = $derived.by(() => {
    const possiblePatterns = $settingsStore.whitelist.filter((p) =>
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
  });
</script>

<div>
  {#if blacklistPattern != null && whitelistPattern == null}
    <Wall {blacklistPattern} {whitelistPattern} />
  {/if}
</div>
