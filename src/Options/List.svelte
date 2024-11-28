<script lang="ts">
  import type { Component } from "svelte";
  import ListItem from "./ListItem.svelte";

  type Props = {
    items: string[];
    setDefaults: () => void;
    child?: Component<any>;
    remove: (i: number) => void;
  };
  let {
    items = $bindable(),
    setDefaults,
    remove,
    child = ListItem,
  }: Props = $props();
  const Child = child;

  import {
    ListGroup,
    ListGroupItem,
    Accordion,
    AccordionItem,
    Input,
    Container,
    Row,
    Col,
  } from "@sveltestrap/sveltestrap";

  function removeSelected(e: Event) {
    e.preventDefault();

    const todel = $state.snapshot(selected);
    for (const d of todel.reverse()) {
      remove(d);
    }
    selected.length = 0;
  }
</script>

<form class="mb-4" onsubmit={removeSelected}>
  <div
    class="ps-3 pe-1 py-1 my-2 d-flex align-items-center justify-content-between"
  >
    <ListGroup>
      {#if items.length == 0}
        <ListGroupItem>
          There is nothing here. Either add something, or maybe <button
            type="button"
            class="btn btn-primary"
            onclick={setDefaults}>Restore Defaults</button
          >?
        </ListGroupItem>
      {:else}
        <li class="list-group-item">
          <Container>
            <Row>
              <Col md="3">
                <Input type="checkbox" label="Select all" />
              </Col>
              <Col md="5"></Col>
              <Col md="4">Mor</Col>
            </Row>
          </Container>
        </li>
        {#each items as item, i (item)}
          <li class="list-group-item">
            <label class="form-check-label stretched-link">
              <input class="form-check-input me-1" type="checkbox" value={i} />
              {item}</label
            >
          </li>
        {/each}
      {/if}
    </ListGroup>
  </div>
</form>
