<script lang="ts">
  import { settingsStore } from "../../store.svelte";

  import { Label, FormGroup, Input } from "@sveltestrap/sveltestrap";
  import Item from "./Item.svelte";
</script>

{#snippet desc()}
  Once a day, disable this extension for a small period of time
{/snippet}

<Item title="Balance" description={desc}>
  <FormGroup>
    <Label class="mb-2">
      {#if $settingsStore.dailyBalanceInterval == 0}
        Disable this feature
      {:else}
        {$settingsStore.dailyBalanceInterval} minutes
      {/if}
    </Label>
    <div class="row">
      <div class="w-50">
        <Input
          type="range"
          class="form-range"
          bind:value={$settingsStore.dailyBalanceInterval}
          min="0"
          max="30"
          step="1"
          data-testid="balance"
        />
      </div>
    </div>
  </FormGroup>
</Item>
