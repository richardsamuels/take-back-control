<script lang="ts">
  import { settingsStore } from "../store.svelte";
  let val = $derived($settingsStore.enabled);
  function click() {
    $settingsStore.enabled = !$settingsStore.enabled;
  }
</script>

<div class="mb-4">
  <div class="btn-group btn-group-toggle" data-toggle="buttons">
    <label
      class="btn"
      class:active={val}
      class:btn-secondary={val}
      class:btn-outline-secondary={!val}
    >
      <input type="radio" autocomplete="off" onclick={click} checked={val} /> Enabled
    </label>
    <label
      class="btn btn-secondary"
      class:active={!val}
      class:btn-secondary={!val}
      class:btn-outline-secondary={val}
    >
      <input type="radio" autocomplete="off" onclick={click} checked={!val} /> Disabled
    </label>
  </div>
</div>
