<script lang="ts">
  let {
    item,
    index,
    group = $bindable(),
  }: { item: string; index: number; group: any } = $props();
  const i = index;

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
  let value = $state(siteConfig.scrollFactor);
  function change() {
    if (value == null) {
      value = DEFAULT_SCROLL_FACTOR;
    }
    settingsStore.blacklistSites.set(item, {
      ...siteConfig,
      scrollFactor: value,
    });
  }
</script>

<li class="list-group-item">
  <div class="row align-items-start" data-testid="blacklist-item">
    <label class="ms-1 form-check-label col">
      <input
        class="form-check-input"
        type="checkbox"
        name="url"
        value={i}
        bind:group
      />
      <span>{item}</span>
    </label>
    <button
      class="btn btn-info position-end col-1"
      data-bs-toggle="collapse"
      data-bs-target={`#item-${i}`}
      onclick={(e: Event) => e.preventDefault()}
    >
      More
    </button>
  </div>
  <div id={`item-${i}`} class="collapse">
    <ul class="list-group">
      <li class="list-group-item">
        <label
          class="btn"
          class:active={blockWholePage}
          class:btn-secondary={!blockWholePage}
          class:btn-danger={blockWholePage}
        >
          <input
            type="radio"
            name={`blockWholePage-${i}`}
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
            name={`blockWholePage-${i}`}
            autocomplete="off"
            onclick={clickBlockWholePage}
            checked={!blockWholePage}
          />
          Block After Scrolling
        </label>
      </li>
      <li class="list-group-item">
        <label
          class="btn"
          class:active={alwaysBlock}
          class:btn-secondary={!alwaysBlock}
          class:btn-danger={alwaysBlock}
        >
          <input
            type="radio"
            name={`alwaysBlock-${i}`}
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
            name={`alwaysBlock-${i}`}
            autocomplete="off"
            onclick={clickAlwaysBlock}
            checked={!alwaysBlock}
          />
          Allow User to Bypass the Wall
        </label>
      </li>
      <li class="list-group-item">
        Scroll Factor <input
          type="number"
          min="0"
          max="2"
          step="0.01"
          bind:value
          onchange={change}
        />
      </li>
    </ul>
  </div>
</li>
