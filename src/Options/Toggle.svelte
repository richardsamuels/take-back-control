<script lang="ts">
  type Props = {
    left: string;
    right: string;
    value: any;
    update: (boolean) => void;
  };
  let { left, right, value = $bindable(), update }: Props = $props();

  import { settingsStore } from "../store.svelte";
  const siteConfig = $derived($settingsStore.blacklistSites.get(item));
  const blockWholePage = $derived(siteConfig.blockWholePage);
  const alwaysBlock = $derived(siteConfig.alwaysBlock);

  function clickBlockWholePage(e: Event) {
    $settingsStore.blacklistSites.set(item, {
      ...siteConfig,
      blockWholePage: !blockWholePage,
    });
  }
  function clickAlwaysBlock(e: Event) {
    $settingsStore.blacklistSites.set(item, {
      ...siteConfig,
      alwaysBlock: !alwaysBlock,
    });
  }
</script>

<label
  class="btn"
  class:active={blockWholePage}
  class:btn-info={!blockWholePage}
  class:btn-danger={blockWholePage}
>
  <input
    type="radio"
    name={`blockWholePage-${i}`}
    autocomplete="off"
    onclick={clickBlockWholePage}
    checked={blockWholePage}
  /> Block the Whole Page
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
    onclick={click}
    checked={!blockWholePage}
  />
  Block After Scrolling
</label>
