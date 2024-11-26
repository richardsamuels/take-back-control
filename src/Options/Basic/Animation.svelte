<script lang="ts">
  import { settingsStore } from "../../store.svelte";

  import { FormGroup, Input } from "@sveltestrap/sveltestrap";
  import Item from "./Item.svelte";

  const label = $settingsStore.animation
    ? "Animations active"
    : "Animations disabled";
</script>

{#snippet desc()}
  Toggle subtle animations on the doomscroll wall
{/snippet}

<Item title="Animation" description={desc}>
  <FormGroup>
    <div class="w-50">
      <FormGroup>
        <Input type="switch" bind:checked={$settingsStore.animation} {label} />
      </FormGroup>
    </div>
  </FormGroup>
</Item>
