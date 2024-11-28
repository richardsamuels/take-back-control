<script lang="ts">
  let {
    item,
    index,
    selected = $bindable(),
  }: { item: string; index: number; selected: any } = $props();
  const i = index;
</script>

<li class="list-group-item">
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
</li>
