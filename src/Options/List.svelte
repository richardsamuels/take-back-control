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
  >
    <div class="d-flex align-items-center gap-2">
      <Input
        type="checkbox"
        indeterminate={selected.length > 0 && selected.length < items.length}
        bind:checked={selectAll}
        onclick={selectAllClick}
        label="Select all"
      />
    </div>
    <span>
      <button type="submit" class="btn btn-outline-danger btn-sm">
        Remove
      </button>
    </span>
  </div>
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
      {#each items as item, i (item)}
        <Child {item} index={i} bind:selected />
      {/each}
    {/if}
  </ul>
</form>
