<script lang="ts">
  import Nav from "./Nav.svelte";
  import Blacklist from "./Blacklist.svelte";
  import Whitelist from "./Whitelist.svelte";
  import Messages from "./Messages.svelte";
  import EraseAll from "./EraseAll.svelte";
  import Status from "./Status.svelte";
  import Debug from "./Debug.svelte";
  import { onMount, onDestroy } from "svelte";
  import { settingsStore } from "../store.svelte";

  function erase(e: Event) {
    e.preventDefault();
    settingsStore.nuke();
    window.location.reload();
  }

  let url = $state("");
  function hashChange(event: HashChangeEvent) {
    console.log(event.newURL);
    if (event.newURL == event.oldURL) {
      return;
    }
    const u = URL.parse(event.newURL);
    url = u!.hash;
  }

  onDestroy(() => {
    removeEventListener("hashchange", hashChange);
  });

  onMount(() => {
    if (window.location.hash == "") {
      window.location.hash = "#/";
    }
    url = window.location.hash;

    addEventListener("hashchange", hashChange);
  });
</script>

<Nav />
<main class="p5">
  {#if url == "#/"}
    <Status />
  {:else if url == "#/blacklist"}
    <Blacklist />
  {:else if url == "#/whitelist"}
    <Whitelist />
  {:else if url == "#/messages"}
    <Messages />
  {:else if url == "#/debug"}
    <Debug />
  {/if}
</main>

<style>
</style>
