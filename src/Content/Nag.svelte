<script lang="ts">
  type Props = {
    n: number;
    continueFn: any;
    site: string;
  };
  let { n, continueFn, site }: Props = $props();

  import { settingsStore } from "@/store";
  import { onDestroy, onMount } from "svelte";
  import { getOrdinal } from "@/lib/helpers";

  let showNag = $state(false);
  let forceShowNag = $state(false);
  let counter = $state(5);
  let interval: ReturnType<typeof setInterval> | null = null;

  function tryDoNag(e: Event) {
    e.stopPropagation();
    e.preventDefault();

    let nag = false;
    if ($settingsStore.nagChance == 100) {
      nag = true;
    } else if ($settingsStore.nagChance == 0) {
      nag = false;
    } else {
      const r = Math.random();
      nag = r <= $settingsStore.nagChance / 100;
    }

    if (nag || forceShowNag) {
      showNag = true;
      startCount();
    } else {
      closeWall(e);
    }
  }

  function closeWall(e: Event) {
    showNag = false;
    resetTimerAndCounter();
    continueFn(e);
  }

  const siteConfig = $derived.by(() => $settingsStore.blacklistSites[site]);

  function startCount() {
    if (interval == null) {
      interval = setInterval(() => {
        counter = counter - 1;
        if (counter == 0) {
          resetTimer();
        }
      }, 1000);
    }
  }

  function resetTimer() {
    if (interval !== null) {
      clearInterval(interval);
      interval = null;
    }
  }
  function resetTimerAndCounter() {
    resetTimer();
    counter = 5;
    forceShowNag = false;
  }

  onMount(() => {
    window.addEventListener("focus", startCount);
    window.addEventListener("blur", resetTimer);
  });

  onDestroy(() => {
    // If the user scrolls up when the nag is visible, they will retrigger the
    // probability test and can bypass the wall timer. So, if the nag is up
    // when this window is destroyed, the next time the "It's Important" button
    // is pressed, the user should be forced to go through the nag
    if (showNag) {
      forceShowNag = true;
    }
    resetTimerAndCounter();
    window.removeEventListener("focus", startCount);
    window.removeEventListener("blur", resetTimer);
  });
</script>

<div class="center-flex-row" style="gap: 16px">
  {#if siteConfig.alwaysBlock || (!$settingsStore.allowBypass && !siteConfig.allowBypass)}
    <button
      id="finite-extend-button"
      class="finite-button nude soft-transition"
      type="button"
      disabled={true}
    >
      It's not important enough. Go do something else.
    </button>
  {:else if !showNag}
    <button
      id="finite-extend-button"
      class="finite-button nude soft-transition"
      type="button"
      onclick={tryDoNag}
    >
      It's important (<span class:blinking-red-text={n > 1}
        >{getOrdinal(n)}</span
      > time)
    </button>
  {:else}
    <div class="sliding-div">
      <button
        id="finite-extend-button"
        class="finite-button nude soft-transition"
        type="button"
        disabled={counter != 0}
        onclick={closeWall}
      >
        Are you <span style="font-style: italic" class="blinking-red-text"
          >REALLY</span
        >
        sure it's important? (<span class:blinking-red-text={n > 1}
          >{getOrdinal(n)}</span
        >
        time)
        {#if counter > 0}({counter}){/if}
      </button>
    </div>
  {/if}
</div>

<style>
  .center-flex-row {
    display: flex;
    align-items: center;
    justify-content: center;
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
  @keyframes slide {
    0% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(20px);
    }
    100% {
      transform: translateX(0);
    }
  }
  .blinking-red-text {
    animation: blink 2s infinite;
  }

  @keyframes blink {
    0%,
    100% {
      color: #ffc635;
    }
    50% {
      color: red;
    }
  }

  .sliding-div {
    animation: slide 0.3s ease-in-out 5;
  }
</style>
