<script lang="ts">
  import List from "./List.svelte";
  import UrlAdder from "./UrlAdder.svelte";
  import { settingsStore } from "../store.svelte";
  import BlacklistItem from "./BlacklistItem.svelte";
  import {
    FormGroup,
    ListGroup,
    ListGroupItem,
    Container,
    Row,
    Col,
  } from "@sveltestrap/sveltestrap";
</script>

<div class="grid gap-3 pb-5">
  <h5>Blacklisted Websites</h5>
  <div class="form-text">
    If a matching page is loaded, scrolling on it will blur the screen and offer
    you an inspirational message
  </div>

  <div class="mt-4 pr-4">
    <ListGroup>
      <ListGroupItem>
        <h5 class="mt-2">Add New</h5>
        <UrlAdder
          bind:list={$settingsStore.blacklist}
          add={settingsStore.blacklist.add}
        />
      </ListGroupItem>
      <ListGroupItem>
        <h5 class="mt-2">Sites</h5>

        <List
          bind:items={$settingsStore.blacklist}
          remove={settingsStore.blacklist.remove}
          setDefaults={settingsStore.blacklist.reset}
          child={BlacklistItem}
        />
      </ListGroupItem>
    </ListGroup>
  </div>
</div>

<style>
</style>
