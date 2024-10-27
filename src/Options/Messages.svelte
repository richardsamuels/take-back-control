<script lang="ts">
  import { get } from "svelte/store";
  import { SvelteSet } from "svelte/reactivity";
  import List from "./List.svelte";
  import UrlExplainer from "./UrlExplainer.svelte";
  import { settingsStore } from "../store.svelte";

  let selected = $state([]);
  let newMsg = $state("");

  function removeSelected(e) {
    e.preventDefault();
    const todel = $state.snapshot(selected);

    for (const d of selected.reverse()) {
      settingsStore.messages.remove(d);
    }
    selected.length = 0;
  }

  function selectAll(e) {
    const checked = e.target.checked;

    if (!checked) {
      selected.length = 0;
    } else {
      selected = $settingsStore.messages.map((_, i) => i);
    }
  }

  function handleNewMsg(e) {
    e.preventDefault();

    for (const v in $settingsStore.messages) {
      if (v == newMsg) {
        console.log("DUPE");
        return;
      }
    }
    settingsStore.messages.add(newMsg);
    newMsg = "";
  }
</script>

<div class="pb-5">
  <h5>Inspirational Messages</h5>
  <div class="form-text pb-2">
    A randomly selected message from this list will show up when you start
    doomscrolling. Use any combination of Motivational, Inspirational, or
    Insulting phrasing to change your behaviour
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
      items={$settingsStore.messages}
      bind:value={selected}
      setDefaults={settingsStore.messages.reset}
    />
  </form>
  <form class="mb-4" onsubmit={handleNewMsg}>
    <label for="urlInput" class="form-label">Add a new message:</label>
    <div class="d-flex gap-2">
      <input
        type="text"
        class="form-control"
        bind:value={newMsg}
        placeholder="Do something better"
        aria-describedby="messageHelp"
        required
      />
      <button type="submit" class="btn btn-primary" aria-label="Add">
        <i class="bi bi-plus-lg"></i>
      </button>
    </div>
    <div id="messageHelp" class="form-text">
      Try crafting a message that targets one of your fixable fears or
      insecurities, such as your waist circumference.
    </div>
  </form>
</div>

<style>
</style>
