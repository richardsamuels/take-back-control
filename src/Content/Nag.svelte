<script lang="ts">
  let { n, continueFn }: { n: number; continueFn: any } = $props();

  import { settingsStore } from "../store.svelte";

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

  let showNag = $state(false);

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

    if (nag) {
      showNag = true;
    } else {
      continueFn(e);
    }
  }
</script>

<div class="center-flex-row" style="gap: 16px">
  {#if !showNag}
    <button
      id="finite-extend-button"
      class="finite-button nude soft-transition"
      type="button"
      onclick={tryDoNag}
    >
      It's important ({getOrdinal(n)} time)
    </button>
  {:else}
    <div class="sliding-div">
      <button
        id="finite-extend-button"
        class="finite-button nude soft-transition"
        type="button"
        onclick={continueFn}
      >
        Are you <span style="font-style: italic" class="blinking-red-text"
          >REALLY</span
        >
        sure it's important? ({getOrdinal(n)} time)
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
    animation: slide 0.3s ease-in-out 10;
  }
</style>
