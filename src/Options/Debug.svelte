<script lang="ts">
  import { settingsStore } from "../store.svelte";
  import { prettyPrintJson } from "pretty-print-json";

  import "/node_modules/pretty-print-json/dist/css/pretty-print-json.dark-mode.css";
  const s: any = $state.snapshot($settingsStore);
  if (s.blacklistSites) {
    s.blacklistSites = Object.fromEntries(s.blacklistSites);
  }
</script>

<div class="pb-5">
  <h5>Debug</h5>
  <pre class="json-container">
{@html prettyPrintJson.toHtml(s)}
  </pre>
</div>

<style>
</style>
