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
    Input,
  } from "@sveltestrap/sveltestrap";
</script>

<div class="pb-5">
  <h5>Blacklisted Websites</h5>
  <div id="urlInputHelp" class="form-text">
    If a matching page is loaded, scrolling on it will blur the screen and offer
    you an inspirational message
  </div>

  <div class="mt-4 pe-3">
    <ListGroup>
      <ListGroupItem>
        <h5 class="mt-2">Add New</h5>
        <UrlAdder
          add={settingsStore.blacklist.add}
          list={$settingsStore.blacklist}
        />
      </ListGroupItem>
      <ListGroupItem>
        <h5 class="mt-2">Sites</h5>

        <List
          items={$settingsStore.blacklist}
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
