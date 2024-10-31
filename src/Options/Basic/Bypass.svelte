<script lang="ts">
  import { settingsStore } from "../../store.svelte";
</script>

<li class="list-group-item">
  <h5 class="mt-2">Reconfirm Doomscroll Bypass</h5>

  <div class="mb-4">
    <div class="form-text mb-4">
      When bypassing the scroll wall, this is the chance you will be asked to
      confirm that you really want to bypass the wall
    </div>
    <span class="mb-2">
      {#if $settingsStore.settings.nagChance == 0}
        0% (Never happens)
      {:else if $settingsStore.settings.nagChance == 100}
        100% (Happens every time)
      {:else}
        {Math.round($settingsStore.settings.nagChance)}% chance of happening
      {/if}
    </span>
    <div class="row">
      <div class="w-50">
        <input
          type="range"
          class="form-range"
          bind:value={$settingsStore.settings.nagChance}
          min="0"
          max="100"
          step=""
        />
      </div>
    </div>
  </div>
</li>
