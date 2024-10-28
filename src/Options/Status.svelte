<script lang="ts">
  import { settingsStore } from "../store.svelte";
</script>

<div class="pb-5">
  <h5>Plugin Status</h5>
  <div>
    <ul class="list-group">
      <li class="list-group-item">
        <label class="form-check-label mb-4">
          <input
            class="form-check-input mt-0"
            type="checkbox"
            bind:checked={$settingsStore.enabled}
          /> Enable Plugin
        </label>
        <ul class="list-group mb-4">
          <li
            class="list-group-item"
            class:list-group-item-success={$settingsStore.blacklist.length > 0}
            class:list-group-item-danger={$settingsStore.blacklist.length == 0}
          >
            {#if $settingsStore.blacklist.length == 0}
              You need to add some URLs to the blacklist
            {:else}
              You've got some URLs
            {/if}
          </li>
          <li
            class="list-group-item"
            class:list-group-item-success={$settingsStore.messages.length > 5}
            class:list-group-item-warning={$settingsStore.messages.length < 5}
            class:list-group-item-danger={$settingsStore.messages.length == 0}
          >
            {#if $settingsStore.messages.length == 0}
              You need to add some messages
            {:else if $settingsStore.messages.length < 5}
              You could add more, but it'll do
            {:else}
              You've got more than enough inspiration.
            {/if}
          </li>
        </ul>
      </li>
      <li class="list-group-item">
        <label for="customRange1" class="form-label"
          >Reconfirm Doomscroll Bypass</label
        >
        <div class="form-text pb-5">
          When bypassing the scroll wall, this is the chance you will be asked
          to confirm that you really want to bypass the wall
        </div>
        <span>
          {#if $settingsStore.nagChance == 0}
            0% (Never happens)
          {:else if $settingsStore.nagChance == 100}
            100% (Happens every time)
          {:else}
            {Math.round($settingsStore.nagChance)}% chance of happening
          {/if}
        </span>
        <input
          type="range"
          class="form-range"
          bind:value={$settingsStore.nagChance}
          min="0"
          max="100"
          step=""
        />
      </li>
    </ul>
  </div>
</div>

<style>
</style>
