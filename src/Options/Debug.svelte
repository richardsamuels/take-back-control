<script lang="ts">
  import { settingsStore } from "../store.svelte";
  import { prettyPrintJson } from "pretty-print-json";

  import "/node_modules/pretty-print-json/dist/css/pretty-print-json.dark-mode.css";
  const s: any = $state.snapshot($settingsStore);

  function click() {
    $settingsStore.showDebug = !$settingsStore.showDebug;
  }
</script>

<div class="pb-5">
  <h5>Debug</h5>
  <div class="pb-5">
    <label
      class="btn"
      class:active={$settingsStore.showDebug}
      class:btn-secondary={!$settingsStore.showDebug}
      class:btn-success={$settingsStore.showDebug}
    >
      <input
        type="radio"
        autocomplete="off"
        onclick={click}
        checked={$settingsStore.showDebug}
      /> Show Debug Menu Links
    </label>
    <label
      class="btn btn-secondary"
      class:active={!$settingsStore.showDebug}
      class:btn-secondary={$settingsStore.showDebug}
      class:btn-danger={!$settingsStore.showDebug}
    >
      <input
        type="radio"
        autocomplete="off"
        onclick={click}
        checked={!$settingsStore.showDebug}
      />
      Hide Debug Menu Links
    </label>
  </div>
  <pre class="json-container">
{@html prettyPrintJson.toHtml(s)}
  </pre>
</div>

<style>
</style>
