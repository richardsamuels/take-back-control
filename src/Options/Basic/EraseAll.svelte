<script lang="ts">
  import { settingsStore } from "../../store.svelte";

  let eraseText = $state("Erase Everything Without Any Undo");

  function erase(e: Event) {
    e.preventDefault();
    if (eraseText == "Erase Everything Without Any Undo") {
      eraseText = "One more time, just to be safe";
    } else {
      settingsStore.nuke();
      window.location.reload();
    }
  }

  import { Button } from "@sveltestrap/sveltestrap";
  import Item from "./Item.svelte";
</script>

<Item title="Reset All Settings">
  <Button class="mb-4" color="danger" onclick={erase} data-testid="erase-all"
    >{eraseText}</Button
  >
</Item>
