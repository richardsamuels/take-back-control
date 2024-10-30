<script lang="ts">
  import Nav from "./Options/Nav.svelte";
  import Basic from "./Options/Basic.svelte";
  import Blacklist from "./Options/Blacklist.svelte";
  import Whitelist from "./Options/Whitelist.svelte";
  import Messages from "./Options/Messages.svelte";
  import Debug from "./Options/Debug.svelte";
  import { onMount, onDestroy } from "svelte";
  import { settingsStore } from "./store.svelte";

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
<main class="p5 ms-4 me-4">
  {#if url == "#/"}
    <Basic />
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
