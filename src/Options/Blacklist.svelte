<script lang="ts">
  import { get } from "svelte/store";
  import { SvelteSet } from "svelte/reactivity";
  import List from "./List.svelte";
  import UrlExplainer from "./UrlExplainer.svelte";
  import { settingsStore } from "../store.svelte";

  let selected = $state([]);
  const newBlacklist = $state("");

  function removeSelected(e) {
    e.preventDefault();
    const todel = $state.snapshot(selected);

    for (const d of selected.reverse()) {
      settingsStore.blacklist.remove(d);
    }
    selected.length = 0;
  }

  function selectAll(e) {
    const checked = e.target.checked;

    if (!checked) {
      selected.length = 0;
    } else {
      selected = $settingsStore.blacklist.map((_, i) => i);
    }
  }

  function addUrl(realPattern) {
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
            onclick={selectAll}
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
