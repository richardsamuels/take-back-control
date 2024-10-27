<script lang="ts">
  import Blacklist from "./Blacklist.svelte";
  import Whitelist from "./Whitelist.svelte";
  import Messages from "./Messages.svelte";
  import EraseAll from "./EraseAll.svelte";
  import Status from "./Status.svelte";
  import { settingsStore } from "../store.svelte";

  function erase(e: Event) {
    e.preventDefault();
    settingsStore.nuke();
    window.location.reload();
  }
</script>

<main class="p-5">
  <Status />
  <Blacklist />
  <Whitelist />
  <Messages />
  <EraseAll />
</main>

<style>
</style>
