<script lang="ts">
  let { item, index }: { item: string; index: number } = $props();

  import { DEFAULT_SCROLL_FACTOR } from "../constants";
  import { settingsStore, type BlacklistSiteConfig } from "../store.svelte";

  const siteConfig: BlacklistSiteConfig = $derived(
    $settingsStore.blacklistSites[item]!,
  );
  const blockWholePage = $derived(siteConfig.blockWholePage);
  const alwaysBlock = $derived(siteConfig.alwaysBlock);

  function clickBlockWholePage(_e: Event) {
    settingsStore.blacklistSites.set(item, {
      ...siteConfig,
      blockWholePage: !blockWholePage,
    });
  }
  function clickAlwaysBlock(_e: Event) {
    settingsStore.blacklistSites.set(item, {
      ...siteConfig,
      alwaysBlock: !alwaysBlock,
    });
  }

  // svelte-ignore state_referenced_locally
  let scrollFactor = $state(siteConfig.scrollFactor);
  function changeScrollFactor() {
    if (scrollFactor == null) {
      scrollFactor = DEFAULT_SCROLL_FACTOR;
    }
    settingsStore.blacklistSites.set(item, {
      ...siteConfig,
      scrollFactor: scrollFactor,
    });
  }

  import { ListGroup, ListGroupItem } from "@sveltestrap/sveltestrap";
</script>

<ListGroup>
  <ListGroupItem>
    <label
      class="btn"
      class:active={blockWholePage}
      class:btn-secondary={!blockWholePage}
      class:btn-danger={blockWholePage}
    >
      <input
        type="radio"
        name={`blockWholePage-${index}`}
        autocomplete="off"
        onclick={clickBlockWholePage}
        checked={blockWholePage}
      /> Block the Whole Page Immediately
    </label>
    <label
      class="btn btn-secondary"
      class:active={!blockWholePage}
      class:btn-secondary={blockWholePage}
      class:btn-success={!blockWholePage}
    >
      <input
        type="radio"
        name={`blockWholePage-${index}`}
        autocomplete="off"
        onclick={clickBlockWholePage}
        checked={!blockWholePage}
      />
      Block After Scrolling
    </label>
  </ListGroupItem>
  <ListGroupItem>
    <label
      class="btn"
      class:active={alwaysBlock}
      class:btn-secondary={!alwaysBlock}
      class:btn-danger={alwaysBlock}
    >
      <input
        type="radio"
        name={`alwaysBlock-${index}`}
        autocomplete="off"
        onclick={clickAlwaysBlock}
        checked={alwaysBlock}
      /> Never Allow Access (except if matching Whitelist)
    </label>
    <label
      class="btn btn-secondary"
      class:active={!alwaysBlock}
      class:btn-secondary={alwaysBlock}
      class:btn-success={!alwaysBlock}
    >
      <input
        type="radio"
        name={`alwaysBlock-${index}`}
        autocomplete="off"
        onclick={clickAlwaysBlock}
        checked={!alwaysBlock}
      />
      Allow User to Bypass the Wall
    </label>
  </ListGroupItem>
  {#if $settingsStore.showDebug}
    <ListGroupItem>
      EXPERIMENTAL: Scroll Factor <input
        type="number"
        min="0"
        max="2"
        step="0.01"
        bind:value={scrollFactor}
        onchange={changeScrollFactor}
      />
    </ListGroupItem>
  {/if}
</ListGroup>
