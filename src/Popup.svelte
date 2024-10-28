<script lang="ts">
  import * as browser from "webextension-polyfill";
  import Enable from "./Options/Enable.svelte";
  function options(e: Event) {
    e.preventDefault();
    browser.runtime.openOptionsPage();
  }
</script>

<main>
  <div class="pb-2 d-flex justify-content-between align-items-bottom">
    <h1>Anti-Doomscroll</h1>
  </div>
  <div class="d-flex flex-column gap-1">
    <div id="checkboxContainer" class="d-flex flex-column gap-1">
      <div class="form-check">
        <Enable />
      </div>
      <!--<div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" type="checkbox">
                Timeout enabled
            </label>
            <div class="spinner-border spinner-border-sm d-none" role="status" id="finiteDurationSpinner">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>-->

      <div>
        <a href="#options" class="link-primary text-light" onclick={options}
          >Edit allowed websites</a
        >
      </div>
    </div>
  </div>
</main>
