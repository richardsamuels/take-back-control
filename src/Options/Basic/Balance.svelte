<script lang="ts">
  import { settingsStore } from "../../store.svelte";

  import {
    Label,
    FormGroup,
    Input,
    ListGroupItem,
  } from "@sveltestrap/sveltestrap";
</script>

<ListGroupItem>
  <h5 class="mt-2">Balance</h5>

  <div class="mb-4">
    <div class="form-text mb-4">
      Once a day, disable this extension for a small period of time
    </div>
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
  </div>
</ListGroupItem>
