<script lang="ts">
  import { settingsStore } from "../../store.svelte";

  let val = $derived($settingsStore.enabled);
  function click() {
    $settingsStore.enabled = !$settingsStore.enabled;
  }
</script>

<li class="list-group-item">
  <div class="mb-4">
    <div class="mb-4">
      <h5 class="mt-2">Plugin Status</h5>
      <div class="mt-4">
        <div class="btn-group btn-group-toggle" data-toggle="buttons">
          <label
            class="btn"
            class:active={val}
            class:btn-secondary={!val}
            class:btn-success={val}
          >
            <input
              type="radio"
              autocomplete="off"
              onclick={click}
              checked={val}
              data-testid="extension-enable"
            /> Enabled
          </label>
          <label
            class="btn btn-secondary"
            class:active={!val}
            class:btn-secondary={val}
            class:btn-danger={!val}
          >
            <input
              type="radio"
              autocomplete="off"
              onclick={click}
              checked={!val}
              data-testid="extension-disable"
            />
            Disabled
          </label>
        </div>
      </div>
    </div>
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
          You could add more, but it'll do
        {:else}
          You've got more than enough inspiration.
        {/if}
      </li>
    </ul>
  </div>
</li>
