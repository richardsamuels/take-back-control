<script lang="ts">
  import Nag from "./Content/Nag.svelte";
  import { onMount } from "svelte";
  import {
    OVERLAY_DIV_ID,
    MESSAGE_DISPLAY_DIV_ID,
    MAX_BLUR,
    MAX_INTENSITY,
  } from "./constants";
  import { patternMatch } from "./Options/validator";
  import { settingsStore } from "./store.svelte";

  function randomItemFrom<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  function scrollProgress(offset: number = 0) {
    const amountScrolled = Math.max(window.scrollY - offset, 0);
    return Math.min(Math.floor(amountScrolled / 25), 100) / 100;
  }

  const pattern = $derived.by(() => {
    // Determine the pattern that caused this script to be injected
    const possiblePatterns = $settingsStore.blacklist.filter((p) =>
      patternMatch(p, window.location.toString()),
    );
    if (possiblePatterns.length == 0) {
      console.error(
        "Failed to match any pattern. This should NOT happen",
        window.location.toString,
        $settingsStore.blacklist,
      );
    }

    // TODO is the most specific pattern the longest pattern?
    possiblePatterns.sort((a: string, b: string) => {
      return b.length - a.length;
    });
    return possiblePatterns[0];
  });
  const siteConfig = $derived.by(() => $settingsStore.blacklistSites[pattern]);

  const canBeVisible = $derived($settingsStore.enabled);

  let numScrollExtensions = $state(1);
  let innerHeight = $state(window.innerHeight);
  const overlayTriggerOffset = $derived.by(() => {
    if (siteConfig.blockWholePage && numScrollExtensions == 1) {
      return -999999;
    }

    return (
      window.scrollY +
      numScrollExtensions * innerHeight * siteConfig.scrollFactor
    );
  });
  let rawBlurIntensity = $state(0);
  const blurIntensity = $derived.by(() => {
    if (siteConfig.blockWholePage && numScrollExtensions == 1) {
      return MAX_INTENSITY;
    }
    return canBeVisible ? rawBlurIntensity : 0;
  });
  const blurAmount = $derived(blurIntensity * MAX_BLUR);
  const rgbOpacity = $derived(canBeVisible ? Math.min(blurIntensity, 0.75) : 0);
  const pointerEvents = $derived(blurIntensity > 0.1 ? "auto" : "none");
  const messageVisible = $derived(blurIntensity > 0.1);
  let message = $state(randomItemFrom($settingsStore.messages));

  function lieToSelf(_e: Event) {
    numScrollExtensions += 1;
    rawBlurIntensity = 0;
  }

  $effect(() => {
    if (!messageVisible) {
      message = randomItemFrom($settingsStore.messages);
    }
  });

  onMount(() => {
    window.addEventListener("resize", (_) => {
      innerHeight = window.innerHeight;
    });

    document.addEventListener("scroll", (_) => {
      const amountScrolled = scrollProgress(overlayTriggerOffset);
      rawBlurIntensity = amountScrolled;
    });
  });
</script>

<div
  id={OVERLAY_DIV_ID}
  class="full-screen-overlay soft-transition"
  style:pointer-events={pointerEvents}
  style:backdrop-filter={`blur(${blurAmount}px)`}
  style:background-color={`rgba(0, 0, 0, ${rgbOpacity})`}
>
  <div
    id={MESSAGE_DISPLAY_DIV_ID}
    class="full-screen-overlay soft-transition center-flex-col"
    style="gap: 84px;"
    style:opacity={messageVisible ? "1" : "0"}
  >
    <div class="message-text-container center-flex-col" style="gap: 12px;">
      <div
        id="reason-text-div"
        class="center-text"
        style="opacity: 0.7; font-weight: 300; font-size: 12px;"
      >
        Scrolling deep are we?
      </div>
      <div id="message-text-div" class="center-text" style="font-size: 56px;">
        {message}
      </div>
    </div>
    <Nag n={numScrollExtensions} continueFn={lieToSelf} site={pattern} />
  </div>
</div>

<style>
  .full-screen-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99999;
    pointer-events: none;
    background-color: rgba(0, 0, 0, 0);
  }

  .soft-transition {
    /* transition: all 0.2s cubic-bezier(0.445, 0.05, 0.55, 0.95); */
  }

  .center-flex-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .message-text-container {
    max-width: 75%;
  }

  .center-text {
    font-family: "Helvetica Neue", Helvetica, sans-serif;
    line-height: 127%;
    color: #fafafa;
    text-align: center;
    font-weight: 300;
  }
</style>
