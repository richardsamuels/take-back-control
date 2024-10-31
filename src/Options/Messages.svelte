<script lang="ts">
  import List from "./List.svelte";
  import { settingsStore } from "../store.svelte";

  let selected: number[] = $state([]);
  let selectAll = $state(false);
  $effect(() => {
    if (
      (selectAll && selected.length != $settingsStore.messages.length) ||
      $settingsStore.messages.length == 0
    ) {
      selectAll = false;
    }
  });
  let newMsg = $state("");

  function removeSelected(e: Event) {
    e.preventDefault();
    const todel = $state.snapshot(selected);

    for (const d of todel.reverse()) {
      settingsStore.messages.remove(d);
    }
    selected.length = 0;
  }

  function selectAllClick(_e: Event) {
    selectAll = !selectAll;
    if (!selectAll) {
      selected = [];
    } else {
      selected = $settingsStore.messages.map((_, i) => i);
    }
  }

  function handleNewMsg(e: Event) {
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

  <div class="mt-4">
    <ul class="list-group">
      <li class="list-group-item">
        <h5 class="mt-2">Add New Message</h5>

        <form class="mb-4" onsubmit={handleNewMsg}>
          <label for="urlInput" class="form-label"></label>
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
      </li>
      <li class="list-group-item">
        <h5 class="mt-2">Inspirational Messages</h5>

        <form class="mb-4" onsubmit={removeSelected}>
          <div
            class="ps-3 pe-1 py-1 my-2 d-flex align-items-center justify-content-between"
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
            items={$settingsStore.messages}
            bind:value={selected}
            setDefaults={settingsStore.messages.reset}
          />
        </form>
      </li>
    </ul>
  </div>
</div>

<style>
</style>
