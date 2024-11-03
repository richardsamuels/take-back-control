<script lang="ts">
  import type { Component } from "svelte";
  import ListItem from "./ListItem.svelte";

  type Props = {
    items: string[];
    setDefaults: () => void;
    value: any;
    child?: Component<any>;
  };
  let {
    items,
    value = $bindable(),
    setDefaults,
    child = ListItem,
  }: Props = $props();
  const Child = child;
</script>

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
      <Child {item} index={i} bind:group={value} />
    {/each}
  {/if}
</ul>
