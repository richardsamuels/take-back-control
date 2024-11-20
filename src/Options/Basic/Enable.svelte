<script lang="ts">
  import { settingsStore } from "../../store.svelte";
</script>

<li class="list-group-item">
  <div class="mb-4">
    <div class="mb-4">
      <h5 class="mt-2">Plugin Status</h5>

      <ul class="list-group mb-4">
        <li
          class="list-group-item"
          class:list-group-item-success={$settingsStore.blacklist.length > 0}
          class:list-group-item-danger={$settingsStore.blacklist.length == 0}
        >
          {#if $settingsStore.blacklist.length == 0}
            You need to add some URLs to the blacklist
          {:else}
            You've got some URLs in the blacklist
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
            You could add more messages, but it'll do
          {:else}
            You've got more than enough inspirational messages.
          {/if}
        </li>
      </ul>
      <div class="mt-4">
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            id="enable-toggle"
            bind:checked={$settingsStore.enabled}
          />
          <label class="form-check-label" for="enable-toggle">
            {#if $settingsStore.enabled}
              Plugin active!
            {:else}
              Plugin disabled
            {/if}
          </label>
        </div>
      </div>
    </div>
  </div>
</li>
