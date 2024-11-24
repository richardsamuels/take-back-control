<script lang="ts">
  import { settingsStore } from "../../store.svelte";

  import { FormGroup, Input, ListGroupItem } from "@sveltestrap/sveltestrap";

  const label = $settingsStore.animation
    ? "Animations active"
    : "Animations disabled";
</script>

<ListGroupItem>
  <h5 class="mt-2">Animation Toggle</h5>

  <div class="mb-4">
    <div class="form-text mb-4">
      Toggle subtle animations on the doomscroll wall.
    </div>
    <div class="row">
      <div class="w-50">
        <FormGroup>
          <Input
            type="switch"
            bind:checked={$settingsStore.animation}
            {label}
          />
        </FormGroup>
      </div>
    </div>
  </div>
</ListGroupItem>
