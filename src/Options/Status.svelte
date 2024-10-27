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

  function click(e) {
    settingsStore.enable(e.target.checked);
  }
</script>

<div class="pb-5">
  <h5>Plugin Status</h5>
  <div class="mb-4">
    <label class="form-check-label">
      <input
        class="form-check-input mt-0"
        type="checkbox"
        checked={$settingsStore.enable}
        onclick={click}
      /> Enable Plugin
    </label>
  </div>
  <ul class="list-group">
    <li
      class="list-group-item"
      class:list-group-item-success={$settingsStore.blacklist.length > 0}
      class:list-group-item-danger={$settingsStore.blacklist.length == 0}
    >
      {#if $settingsStore.blacklist.length == 0}
        You need to add some URLs to the blacklist
      {:else}
        You've got some URLs
      {/if}
    </li>
    <li
      class="list-group-item"
      class:list-group-item-success={$settingsStore.messages.length > 5}
      class:list-group-item-warning={$settingsStore.messages.length < 5}
      class:list-group-item-danger={$settingsStore.messages.length == 0}
    >
      {#if $settingsStore.messages.length == 0}
        You need to add some messages
      {:else if $settingsStore.messages.length < 5}
        You could add more, but it'll do
      {:else}
        You've got more than enough inspiration.
      {/if}
    </li>
  </ul>
  <div></div>
</div>

<style>
</style>
