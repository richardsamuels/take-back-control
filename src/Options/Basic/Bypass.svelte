<script lang="ts">
  import { settingsStore } from "../../store.svelte";
  import { Label, FormGroup, Input } from "@sveltestrap/sveltestrap";
  import Item from "./Item.svelte";
</script>

{#snippet desc()}
  When clicking 'It's Important', this is the chance you will be asked to
  reconfirm that you really want to bypass the wall
{/snippet}

<Item title="Reconfirm Doomscroll Bypass" description={desc}>
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
  </FormGroup>
</Item>
