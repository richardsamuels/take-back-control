<script lang="ts">
  import { settingsStore } from "../../store.svelte";
  import {
    Label,
    ListGroupItem,
    FormGroup,
    Input,
  } from "@sveltestrap/sveltestrap";
</script>

<ListGroupItem>
  <h5 class="mt-2">Reconfirm Doomscroll Bypass</h5>

  <div class="mb-4">
    <div class="form-text mb-4">
      When bypassing the scroll wall, this is the chance you will be asked to
      confirm that you really want to bypass the wall
    </div>
    <FormGroup>
      <Label>
        {#if $settingsStore.nagChance == 0}
          0% (Never happens)
        {:else if $settingsStore.nagChance == 100}
          100% (Happens every time)
        {:else}
          {Math.round($settingsStore.nagChance)}% chance of happening
        {/if}
      </Label>
      <div class="row">
        <div class="w-50">
          <Input
            type="range"
            class="form-range"
            bind:value={$settingsStore.nagChance}
            min="0"
            max="100"
            step=""
            data-testid="nag-chance"
          />
        </div>
      </div>
    </FormGroup>
  </div>
</ListGroupItem>
