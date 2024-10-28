<script lang="ts">
  import { settingsStore } from "../store.svelte";

  function erase(e: Event) {
    e.preventDefault();
    settingsStore.nuke();
    window.location.reload();
  }
</script>

<div class="pb-5">
  <h5>Reset All Settings</h5>
  <button type="button" class="btn btn-danger" onclick={erase}
    >Erase Everything Without Any Undo</button
  >
</div>
