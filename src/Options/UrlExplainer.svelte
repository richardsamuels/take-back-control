<script lang="ts">
  import {
    coerce_and_explain,
    isValidMatchPattern,
    tryParseMatchPattern,
  } from "./validator.ts";
  let url = $state("");
  let [realPattern, errors] = $derived(coerce_and_explain(url));
  let valid = $derived(isValidMatchPattern(realPattern));

  const { desc, value = $bindable(), add } = $props();

  function handle(e) {
    e.preventDefault();
    add(realPattern);
    url = "";
  }
</script>

<form class="mb-4" onsubmit={handle}>
  <div>
    <label class="form-label">
      {desc}
    </label>
    <div class="d-flex gap-2">
      <span>
        {#if errors.length > 0}
          <div class="alert alert-danger" role="alert">
            The host pattern is invalid because:
            <ul>
              {#each errors as item (item)}
                <li>{item}</li>
              {/each}
            </ul>
          </div>
        {/if}
      </span>
    </div>
    <div class="d-flex gap-2">
      <input
        bind:value={url}
        type="text"
        class="form-control"
        placeholder="www.instagram.com"
        aria-describedby="urlInputHelp"
        class:is-invalid={!valid && url != ""}
        required
      />
      <button
        type="submit"
        class="btn btn-primary"
        disabled={!valid}
        aria-label="Add"
      >
        <i class="bi bi-plus-lg"></i>
      </button>
    </div>
    <div id="urlInputHelp" class="form-text">
      <span>
        Using "*" will be treated as a wildcard. For example: Allowing
        "*.instagram.com/*" will also allow "www.instagram.com/explore".
      </span>
    </div>
  </div>
</form>

<style>
</style>
