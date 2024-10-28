<script lang="ts">
  import * as browser from "webextension-polyfill";
  import { onMount } from "svelte";
  import {
    OVERLAY_DIV_ID,
    MESSAGE_DISPLAY_DIV_ID,
    PERMITTED_SCROLL_FACTOR,
    MAX_BLUR,
  } from "./constants";
  import { settingsStore } from "./store.svelte";

  function getOrdinal(n: number) {
    let suffix = "th";
    if (n % 10 == 1 && n % 100 != 11) {
      suffix = "st";
    } else if (n % 10 == 2 && n % 100 != 12) {
      suffix = "nd";
    } else if (n % 10 == 3 && n % 100 != 13) {
      suffix = "rd";
    }
    return n + suffix;
  }

  function randomItemFrom<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  function scrollProgress(offset: number = 0) {
    const amountScrolled = Math.max(window.scrollY - offset, 0);
    return Math.min(Math.floor(amountScrolled / 25), 100) / 100;
  }

  let canBeVisible = $derived($settingsStore.enabled);

  let numScrollExtensions = $state(1);

  let innerHeight = $state(window.innerHeight);
  const overlayTriggerOffset = $derived(
    window.scrollY +
      numScrollExtensions * innerHeight * PERMITTED_SCROLL_FACTOR,
  );
  let rawBlurIntensity = $state(0);
  const blurIntensity = $derived(canBeVisible ? rawBlurIntensity : 0);
  const blurAmount = $derived(blurIntensity * MAX_BLUR);
  const rgbOpacity = $derived(canBeVisible ? Math.min(blurIntensity, 0.75) : 0);
  const pointerEvents = $derived(blurIntensity > 0.1 ? "auto" : "none");
  const messageVisible = $derived(blurIntensity > 0.1);
  const message = $derived.by(() => {
    if (!messageVisible) {
      return;
    }
    return randomItemFrom($settingsStore.messages);
  });

  function lieToSelf(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    numScrollExtensions += 1;
    rawBlurIntensity = 0;
  }

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
    <div class="center-flex-row" style="gap: 16px">
      <button
        id="finite-extend-button"
        class="finite-button nude soft-transition"
        type="button"
        onclick={lieToSelf}
      >
        It's important ({getOrdinal(numScrollExtensions)} time)
      </button>
    </div>
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

  .center-flex-row {
    display: flex;
    align-items: center;
    justify-content: center;
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

  .finite-button {
    padding: 8px 12px;
    font-size: 16px;
    border: 1px solid #ffc635;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0);
    color: #ffc635;
    pointer-events: auto;
  }

  .finite-button.nude {
    color: rgba(255, 255, 255, 0.28);
    border: none;
  }

  .finite-button:hover {
    cursor: pointer;
    background-color: #ffc635;
    color: #1b1b1b;
  }

  .finite-button.nude:hover {
    background-color: rgba(0, 0, 0, 0);
    color: white;
    text-decoration: underline;
  }
</style>
