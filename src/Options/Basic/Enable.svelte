<script lang="ts">
  import { settingsStore } from "../../store.svelte";
  import {
    ListGroup,
    ListGroupItem,
    Form,
    Input,
    FormGroup,
  } from "@sveltestrap/sveltestrap";

  const messagesColor = $derived.by(() => {
    if ($settingsStore.blacklist.length == 0) {
      return "danger";
    }
    if ($settingsStore.blacklist.length < 5) {
      return "warning";
    }
    return "success";
  });
</script>

<ListGroupItem>
  <div class="mb-4">
    <div class="mb-4">
      <h5 class="mt-2">Plugin Status</h5>

      <ListGroup class="mb-4">
        <ListGroupItem
          color={$settingsStore.blacklist.length == 0 ? "danger" : "success"}
        >
          {#if $settingsStore.blacklist.length == 0}
            You need to add some URLs to the blacklist
          {:else}
            You've got some URLs in the blacklist
          {/if}
        </ListGroupItem>
        <ListGroupItem color={messagesColor}>
          {#if $settingsStore.messages.length == 0}
            You need to add some messages
          {:else if $settingsStore.messages.length < 5}
            You could add more messages, but it'll do
          {:else}
            You've got more than enough inspirational messages.
          {/if}
        </ListGroupItem>
      </ListGroup>
      <div class="mt-4">
        <Input
          type="switch"
          bind:checked={$settingsStore.enabled}
          label={$settingsStore.enabled ? "Plugin Enabled!" : "Plugin disabled"}
        />
      </div>
    </div>
  </div>
</ListGroupItem>
