<script lang="ts">
  import Blacklist from "./Blacklist.svelte";
  import Whitelist from "./Whitelist.svelte";
  import Messages from "./Messages.svelte";
  import EraseAll from "./EraseAll.svelte";
  import Status from "./Status.svelte";

  function erase(e) {
    e.preventDefault();
    settingsStore.nuke();
    window.reload();
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
