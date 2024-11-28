<script lang="ts">
  import List from "./List.svelte";
  import UrlAdder from "./UrlAdder.svelte";
  import { settingsStore } from "../store.svelte";

  let selected: number[] = $state([]);
  let selectAll = $state(false);
  $effect(() => {
    if (
      (selectAll && selected.length != $settingsStore.whitelist.length) ||
      $settingsStore.whitelist.length == 0
    ) {
      selectAll = false;
    }
  });

  function removeSelected(e: Event) {
    e.preventDefault();
    const todel = $state.snapshot(selected);

    for (const d of todel.reverse()) {
      settingsStore.whitelist.remove(d);
    }
    selected.length = 0;
  }

  function selectAllClick(_e: Event) {
    selectAll = !selectAll;
    if (!selectAll) {
      selected = [];
    } else {
      selected = $settingsStore.whitelist.map((_, i) => i);
    }
  }
</script>

<div class="grid gap-3 pb-5">
  <h5>Whitelisted Websites</h5>
  <div id="urlInputHelp" class="form-text">
    If matched, the page with that URL will be exempt from doomscroll
    prevention. This is useful for allowing access to the useful parts of sites,
    while limiting access to the attention stealing parts. (ex: LinkedIn chat vs
    LinkedIn Feed)
  </div>

  <div class="mt-4">
    <ul class="list-group">
      <li class="list-group-item">
        <h5 class="mt-2">Exempt a New URL from the Blacklist</h5>
        <UrlAdder
          add={settingsStore.whitelist.add}
          bind:list={$settingsStore.whitelist}
          desc={""}
        />
      </li>
      <li class="list-group-item">
        <h5 class="mt-2">Sites</h5>

        <form class="mb-4" onsubmit={removeSelected}>
          <div
            class="ps-3 pe-1 py-1 my-2 bg-dark d-flex align-items-center justify-content-between"
          >
            <div class="d-flex align-items-center gap-2">
              <label
                class="form-check-label text-light small"
                style="opacity: 0.75;"
              >
                <input
                  class="form-check-input mt-0"
                  type="checkbox"
                  indeterminate={selected.length > 0 &&
                    selected.length < $settingsStore.whitelist.length}
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
            items={$settingsStore.whitelist}
            setDefaults={settingsStore.whitelist.reset}
          />
        </form>
      </li>
    </ul>
  </div>
</div>

<style>
</style>
