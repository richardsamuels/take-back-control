<script lang="ts">
  import { settingsStore } from "./store.svelte";
  import * as browser from "webextension-polyfill";
  function options(e) {
    e.preventDefault();
    browser.runtime.openOptionsPage();
  }
  function click(e) {
    console.log(e.target.checked);
    $settingsStore.enable = e.target.checked;
  }
</script>

<main>
  <div class="pb-2 d-flex justify-content-between align-items-bottom">
    <h1>Anti-Doomscroll</h1>
  </div>
  <div class="d-flex flex-column gap-1">
    <div id="checkboxContainer" class="d-flex flex-column gap-1">
      <div class="form-check">
        <label class="form-check-label">
          <input
            class="form-check-input"
            type="checkbox"
            checked={$settingsStore.enable}
            onclick={click}
          />
          Limited scroll
        </label>
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
        <a href="#" class="link-primary text-light" onclick={options}
          >Edit allowed websites</a
        >
      </div>
    </div>
  </div>
</main>
