<script lang="ts">
  let {
    item,
    index,
    selected,
  }: { item: string; index: number; selected: number[] } = $props();
</script>

<li class="list-group-item">
  <div class="row align-items-start">
    <label class="ms-1 form-check-label col">
      <input
        class="form-check-input"
        type="checkbox"
        name="url"
        value={index}
        bind:group={selected}
      />
      <span>{item}</span>
    </label>
  </div>
</li>
