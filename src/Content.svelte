<script lang="ts">
  import Nag from "./Content/Nag.svelte";
  import { onMount } from "svelte";
  import {
    OVERLAY_DIV_ID,
    MESSAGE_DISPLAY_DIV_ID,
    MAX_BLUR,
  } from "./constants";
  type Wall = {
    // scroll Y position to start blurring
    triggerOffset: number;
    // The scrollY position when the Wall triggerOffset was calculated
    scrollY: number;
  };
  import { patternMatch } from "./Options/validator";
  import { settingsStore } from "./store.svelte";

  function randomItemFrom<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
  function scrollProgress(threshold: number, offset: number = 0) {
    const amountScrolled = Math.max(threshold - offset, 0);
    return Math.min(Math.floor(amountScrolled / 25), 100) / 100;
  }

  const makeWall = (
    n: number,
    scrollY: number,
    innerHeight: number,
    scrollFactor: number,
  ): Wall => {
    let nextWall = {
      scrollY: scrollY,
      triggerOffset: scrollY + (n + 1) * innerHeight * scrollFactor,
    };
    // HACK: If we're supposed to block the whole page, force the offset to
    // small number immediately, so that the page loads with the wall up
    if (siteConfig.blockWholePage && n == 0) {
      nextWall.triggerOffset = -999999;
    }
    return nextWall;
  };

  // Find the blacklist pattern that matches the current site
  const pattern = $derived.by(() => {
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

    // TODO MUST the most specific pattern the longest pattern?
    possiblePatterns.sort((a: string, b: string) => {
      return b.length - a.length;
    });
    return possiblePatterns[0];
  });
  const siteConfig = $derived.by(() => $settingsStore.blacklistSites[pattern]);
  const addonEnabled = $derived($settingsStore.enabled);

  let innerHeight = $state(window.innerHeight);
  let scrollY: number = $state(0);
  let nextWall: Wall = $state(
    makeWall(0, 0, innerHeight, siteConfig.scrollFactor),
  );

  let numScrollExtensions: number = $state(0);

  const blurIntensity = $derived.by(() => {
    const offset = nextWall.triggerOffset;
    if (!addonEnabled) {
      return 0;
    }

    if (scrollY < offset) {
      return 0;
    }

    // Calculate how far past the triggerOffset we are
    return scrollProgress(scrollY, offset);
  });
  const messageVisible = $derived(blurIntensity > 0.1);
  const blurAmount = $derived(blurIntensity * MAX_BLUR);
  const rgbOpacity = $derived(addonEnabled ? Math.min(blurIntensity, 0.75) : 0);
  const pointerEvents = $derived(blurIntensity > 0.1 ? "auto" : "none");
  let message = $state(randomItemFrom($settingsStore.messages));
  let onNextTransition: (() => void) | null = null;

  const extendScroll = (_e: Event) => {
    // HACK: Mutate nextWall now to rerender/hide the wall, but
    // don't increment numScrollExtensions until the animation is complete
    // so that the user doesn't see the counter increment
    nextWall = makeWall(
      numScrollExtensions + 1,
      window.scrollY,
      innerHeight,
      siteConfig.scrollFactor,
    );
    onNextTransition = () => {
      numScrollExtensions += 1;
    };
  };

  onMount(() => {
    window.addEventListener("resize", (_) => {
      innerHeight = window.innerHeight;
      nextWall = makeWall(
        numScrollExtensions,
        nextWall.scrollY,
        innerHeight,
        siteConfig.scrollFactor,
      );
    });

    document.addEventListener("scroll", (_) => {
      scrollY = window.scrollY;
    });
  });

  const handleAnimationEnd = () => {
    if (onNextTransition !== null) {
      onNextTransition();
      onNextTransition = null;
    }
    if (!messageVisible) {
      const oldMessage = $state.snapshot(message);
      let limit = 5;
      // Try and prevent duplicate messages
      while (oldMessage == message && limit > 0) {
        message = randomItemFrom($settingsStore.messages);
        limit -= 1;
      }
    }
  };
</script>

<div
  id={OVERLAY_DIV_ID}
  class="full-screen-overlay soft-transition isolated-element"
  style:pointer-events={pointerEvents}
  style:backdrop-filter={`blur(${blurAmount}px)`}
  style:background-color={`rgba(0, 0, 0, ${rgbOpacity})`}
  ontransitionend={handleAnimationEnd}
>
  <div
    id={MESSAGE_DISPLAY_DIV_ID}
    class="full-screen-overlay soft-transition center-flex-col"
    style="gap: 84px;"
    style:opacity={messageVisible ? "1" : "0"}
  >
    <div
      class="message-text-container center-flex-col soft-transition"
      style="gap: 12px;"
    >
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
    <Nag n={numScrollExtensions + 1} continueFn={extendScroll} site={pattern} />
  </div>
</div>

<style>
  .isolated-element {
    all: initial;
  }
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
    transition: all 0.1s cubic-bezier(0.445, 0.05, 0.55, 0.95);
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
