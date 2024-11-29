<script lang="ts">
  import List from "./List.svelte";
  import UrlAdder from "./UrlAdder.svelte";
  import { settingsStore } from "@/store";
</script>

<div class="grid gap-3 pb-5">
  <h5>Whitelisted Websites</h5>
  <div id="urlInputHelp" class="form-text">
    If matched, the page with that URL will be exempt from doomscroll
    prevention. This is useful for allowing access to the useful parts of sites,
    while limiting access to the attention stealing parts. (ex: LinkedIn chat vs
    LinkedIn Feed)
  </div>

  <div class="mt-4 pe-3">
    <ul class="list-group">
      <li class="list-group-item">
        <h5 class="mt-2">Exempt a New URL from the Blacklist</h5>
        <UrlAdder
          add={settingsStore.whitelist.add}
          bind:list={$settingsStore.whitelist}
          desc={""}
        />
      </li>
      <li class="list-group-item">
        <h5 class="mt-2">Sites</h5>

        <List
          items={$settingsStore.whitelist}
          remove={settingsStore.whitelist.remove}
          setDefaults={settingsStore.whitelist.reset}
        />
      </li>
    </ul>
  </div>
</div>

<style>
</style>
