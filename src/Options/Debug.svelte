<script lang="ts">
  import { settingsStore } from "../store.svelte";
  import { prettyPrintJson } from "pretty-print-json";

  import "/node_modules/pretty-print-json/dist/css/pretty-print-json.dark-mode.css";
</script>

<div class="pb-5">
  <h5>Debug</h5>
  <pre class="json-container">
{@html prettyPrintJson.toHtml($settingsStore)}
  </pre>
</div>

<style>
</style>
