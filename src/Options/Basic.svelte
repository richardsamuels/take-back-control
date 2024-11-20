<script lang="ts">
  import Enable from "./Basic/Enable.svelte";
  import Bypass from "./Basic/Bypass.svelte";
  import Animation from "./Basic/Animation.svelte";
  import EraseAll from "./Basic/EraseAll.svelte";
</script>

<div class="pb-5">
  <h5>Basic Settings</h5>
  <div class="mt-4">
    <ul class="list-group">
      <Enable />
      <Bypass />
      <Animation />
      <EraseAll />
    </ul>
  </div>
</div>

<style>
</style>
