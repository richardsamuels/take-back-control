<script lang="ts">
  import type { Component } from "svelte";
  import ListItem from "./ListItem.svelte";

  type Props = {
    items: string[];
    setDefaults: () => void;
    remove: (i: number) => void;
    child?: Component<any>;
  };
  let { items, setDefaults, remove, child = ListItem }: Props = $props();
  const Child = child;

  import {
    Label,
    FormGroup,
    ListGroup,
    ListGroupItem,
    Container,
    Row,
    Col,
    Input,
  } from "@sveltestrap/sveltestrap";

  let selected: number[] = $state([]);
  let selectAll = $state(false);
  $effect(() => {
    if ((selectAll && selected.length != items.length) || items.length == 0) {
      selectAll = false;
    }
  });

  function removeSelected(e: Event) {
    e.preventDefault();
    const todel = $state.snapshot(selected);
    for (const d of todel.reverse()) {
      remove(d);
    }
    selected.length = 0;
  }

  function selectAllClick(_e: Event) {
    selectAll = !selectAll;
    if (!selectAll) {
      selected.length = 0;
    } else {
      selected = items.map((_, i) => i);
    }
  }
</script>

<form class="mb-4" onsubmit={removeSelected}>
  <div
    class="ps-3 pe-1 py-1 my-2 d-flex align-items-center justify-content-between"
  ></div>
  <ul class="list-group">
    {#if items.length == 0}
      <li class="list-group-item">
        There is nothing here. Either add something, or maybe <button
          type="button"
          class="btn btn-primary"
          onclick={setDefaults}>Restore Defaults</button
        >?
      </li>
    {:else}
      <li class="list-group-item">
        <Container>
          <Row>
            <Col sm="9">
              <Input
                type="checkbox"
                indeterminate={selected.length > 0 &&
                  selected.length < items.length}
                bind:checked={selectAll}
                onclick={selectAllClick}
                label="Select all"
              />
            </Col>
            <Col sm="3">
              <span class="float-end">
                <button
                  type="submit"
                  class="btn btn-outline-danger btn-sm"
                  onclick={removeSelected}
                >
                  Remove
                </button>
              </span>
            </Col>
          </Row>
        </Container>
      </li>
      {#each items as item, i (item)}
        <!--<li class="list-group-item">
          <div class="row align-items-start">
            <label class="ms-1 form-check-label col">
              <input
                class="form-check-input"
                type="checkbox"
                name="url"
                value={i}
                bind:group={selected}
              />
              <span>{item}</span>
            </label>
          </div>
        </li>-->
        <Child value={selected} {item} index={i} />
      {/each}
    {/if}
  </ul>
</form>
