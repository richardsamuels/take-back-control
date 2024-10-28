<script lang="ts">
  import List from "./List.svelte";
  import UrlExplainer from "./UrlExplainer.svelte";
  import { settingsStore } from "../store.svelte";

  let selected: number[] = $state([]);
  let selectAll = $state(false);
  $effect(() => {
    if (selectAll && selected.length != $settingsStore.blacklist.length) {
      selectAll = false;
    }
  });

  function removeSelected(e: Event) {
    e.preventDefault();
    const todel = $state.snapshot(selected);
    for (const d of todel.reverse()) {
      settingsStore.blacklist.remove(d);
    }
    selected.length = 0;
  }

  function selectAllClick(_e: Event) {
    selectAll = !selectAll;
    if (!selectAll) {
      selected = [];
    } else {
      selected = $settingsStore.blacklist.map((_, i) => i);
    }
  }

  function addUrl(realPattern: string) {
    for (const v in $settingsStore.blacklist) {
      if (v == realPattern) {
        console.log("DUPE");
        return;
      }
    }
    settingsStore.blacklist.add(realPattern);
  }
</script>

<div class="pb-5">
  <h5>Blacklisted Websites</h5>
  <div id="urlInputHelp" class="form-text pb-5">
    If a matching page is loaded, scrolling on it will blur the screen and offer
    you an inspirational message from the list below.
  </div>
  <form class="mb-4" onsubmit={removeSelected}>
    <div
      class="ps-3 pe-1 py-1 my-2 bg-dark d-flex align-items-center justify-content-between"
    >
      <div class="d-flex align-items-center gap-2">
        <label class="form-check-label text-light small" style="opacity: 0.75;">
          <input
            class="form-check-input mt-0"
            type="checkbox"
            indeterminate={selected.length > 0 &&
              selected.length < $settingsStore.blacklist.length}
            bind:checked={selectAll}
            onclick={selectAllClick}
          /> Select all
        </label>
      </div>
      <span>
        <button type="submit" class="btn btn-outline-danger btn-sm">
          Remove
        </button>
      </span>
    </div>
    <List
      items={$settingsStore.blacklist}
      bind:value={selected}
      setDefaults={settingsStore.blacklist.reset}
    />
  </form>
  <UrlExplainer add={addUrl} desc={"Add a new URL to the blacklist:"} />
</div>

<style>
</style>
