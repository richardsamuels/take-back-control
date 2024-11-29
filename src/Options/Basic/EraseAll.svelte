<script lang="ts">
  import { settingsStore } from "@/store";

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
  import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
  } from "@sveltestrap/sveltestrap";
</script>

<Card>
  <CardHeader>
    <CardTitle>Reset All Settings</CardTitle>
  </CardHeader>
  <CardBody>
    <Button class="mb-4" color="danger" onclick={erase} data-testid="erase-all"
      >{eraseText}</Button
    >
  </CardBody>
</Card>
