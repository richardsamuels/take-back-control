<script lang="ts">
  let {
    item,
    index,
    group = $bindable(),
  }: { item: string; index: number; group: any } = $props();
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
        bind:group
      />
      <span>{item}</span>
    </label>
  </div>
</li>
