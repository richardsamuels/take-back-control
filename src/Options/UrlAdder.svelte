<script lang="ts">
  import { coerce_and_explain, isValidMatchPattern } from "./validator";
  let url = $state("");
  let [realPattern, errors] = $derived(coerce_and_explain(url.trimStart()));

  let {
    add,
    desc,
    list = $bindable(),
  }: { add: (url: string) => void; desc?: string; list: string[] } = $props();

  let dupe = $state(false);

  $effect(() => {
    if (list.includes(realPattern)) {
      dupe = true;
    } else {
      dupe = false;
    }
  });

  let valid = $derived(isValidMatchPattern(realPattern) && !dupe);

  function handle(e: Event) {
    e.preventDefault();
    add(url);
    url = "";
  }
</script>

<form class="mb-4" onsubmit={handle}>
  <div>
    {#if desc}
      <span class="form-label">
        {desc}
      </span>
    {/if}
    <div class="d-flex gap-2">
      <span>
        {#if errors.length > 0 || dupe}
          <div class="alert alert-danger" role="alert">
            The host pattern is invalid because:
            <ul>
              {#each errors as item (item)}
                <li>{item}</li>
              {/each}
              {#if dupe}
                <li>Pattern is already in the list</li>
              {/if}
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
        data-testid="blacklist-input"
      />
      <button
        type="submit"
        class="btn btn-primary"
        disabled={!valid}
        aria-label="Add"
        data-testid="blacklist-submit"
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
