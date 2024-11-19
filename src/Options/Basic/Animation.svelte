<script lang="ts">
  import { settingsStore } from "../../store.svelte";

  const val = $derived($settingsStore.animation);

  function click(e: Event) {
    e.preventDefault();
    $settingsStore.animation = !$settingsStore.animation;
  }
</script>

<li class="list-group-item">
  <h5 class="mt-2">Animation Toggle</h5>

  <div class="mb-4">
    <div class="form-text mb-4">
      Toggle subtle animations on the doomscroll wall.
    </div>
    <div class="row">
      <div class="w-50">
        <div class="btn-group btn-group-toggle" data-toggle="buttons">
          <label
            class="btn"
            class:active={val}
            class:btn-secondary={!val}
            class:btn-success={val}
          >
            <input
              type="radio"
              autocomplete="off"
              onclick={click}
              checked={val}
            /> Enabled
          </label>
          <label
            class="btn btn-secondary"
            class:active={!val}
            class:btn-secondary={val}
            class:btn-danger={!val}
          >
            <input
              type="radio"
              autocomplete="off"
              onclick={click}
              checked={!val}
            />
            Disabled
          </label>
        </div>
      </div>
    </div>
  </div>
</li>
