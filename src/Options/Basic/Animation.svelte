<script lang="ts">
  import { settingsStore } from "../../store.svelte";
</script>

<li class="list-group-item">
  <h5 class="mt-2">Animation Toggle</h5>

  <div class="mb-4">
    <div class="form-text mb-4">
      Toggle subtle animations on the doomscroll wall.
    </div>
    <div class="row">
      <div class="w-50">
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            id="enable-toggle"
            bind:checked={$settingsStore.animation}
          />
          <label class="form-check-label" for="enable-toggle">
            {#if $settingsStore.animation}
              Animations active
            {:else}
              Animations disabled
            {/if}
          </label>
        </div>
      </div>
    </div>
  </div>
</li>
