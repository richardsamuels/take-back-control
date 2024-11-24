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

  import { Button, ListGroupItem } from "@sveltestrap/sveltestrap";
</script>

<ListGroupItem>
  <h5 class="mt-2">Reset All Settings</h5>
  <div class="mt-4 mb-4">
    <Button color="danger" onclick={erase} data-testid="erase-all"
      >{eraseText}</Button
    >
  </div>
</ListGroupItem>
