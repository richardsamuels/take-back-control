<script lang="ts">
  type Props = { item: string; index: number; group: number[] };
  let { item, index, group = $bindable() }: Props = $props();

  const handleCheck = () => {
    group = [...group, index];
  };
  const handleUncheck = () => {
    group = group.filter((checkedValue) => checkedValue !== index);
  };

  let checked = $derived(group.includes(index));
  function onclick() {
    if (!checked) {
      handleCheck();
    } else {
      handleUncheck();
    }
  }
</script>

<li class="list-group-item">
  <div class="row align-items-start">
    <label class="ms-1 form-check-label col">
      <input
        type="checkbox"
        value={index}
        class="form-check-input"
        {onclick}
        {checked}
      />
      <span>{item}</span>
    </label>
  </div>
</li>
