<script lang="ts">
  import { get } from "svelte/store";
  import { SvelteSet } from "svelte/reactivity";
  import List from "./List.svelte";
  import UrlExplainer from "./UrlExplainer.svelte";
  import { settingsStore } from "../store.svelte";

  let selected: number[] = $state([]);
  const newWhitelist = $state("");

  function removeSelected(e: Event) {
    e.preventDefault();
    const todel = $state.snapshot(selected);

    for (const d of selected.reverse()) {
      settingsStore.whitelist.remove(d);
    }
    selected.length = 0;
  }

  function selectAll(e: Event) {
    const checked = e.target?.checked;

    if (!checked) {
      selected.length = 0;
    } else {
      selected = $settingsStore.whitelist.map((_, i) => i);
    }
  }

  function addUrl(realPattern: string) {
    for (const v in $settingsStore.whitelist) {
      if (v == realPattern) {
        console.log("DUPE"); // TODO real duplicate notifications
        return;
      }
    }
    settingsStore.whitelist.add(realPattern);
  }
</script>

<div class="pb-5">
  <h5>Whitelisted Websites</h5>
  <div id="urlInputHelp" class="form-text pb-5">
    If matched, the page with that URL will be exempt from doomscroll
    prevention. This is useful for allowing access to the useful parts of sites,
    while limiting access to the attention stealing parts. (ex: LinkedIn chat vs
    LinkedIn Feed)
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
      items={$settingsStore.whitelist}
      setDefaults={settingsStore.whitelist.reset}
    />
  </form>
  <UrlExplainer add={addUrl} desc={"Exempt a new URL from the blacklist:"} />
</div>

<style>
</style>
