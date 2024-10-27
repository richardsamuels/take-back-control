<script lang="ts">
  let {
    items,
    value = $bindable(),
    setDefaults,
  }: { items: string[]; setDefaults: () => void; value: any } = $props();
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
      <li class="list-group-item">
        <label class="ms-1 form-check-label">
          <input
            class="form-check-input"
            type="checkbox"
            name="url"
            value={i}
            bind:group={value}
          />
          <span>{item}</span>
        </label>
      </li>
    {/each}
  {/if}
</ul>
