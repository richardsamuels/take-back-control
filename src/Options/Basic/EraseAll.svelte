<script lang="ts">
  import { settingsStore } from "../../store.svelte";

  let eraseText = $state("Erase Everything Without Any Undo");

  function erase(e: Event) {
    e.preventDefault();
    if (eraseText == "Erase Everything Without Any Undo") {
      eraseText = "One more time, just to be safe";
    } else {
      settingsStore.nuke();
      console.log($settingsStore);
    }
  }
</script>

<li class="list-group-item">
  <h5 class="mt-2">Reset All Settings</h5>
  <div class="mt-4 mb-4">
    <button
      type="button"
      class="btn btn-danger"
      onclick={erase}
      data-testid="erase-all">{eraseText}</button
    >
  </div>
</li>
