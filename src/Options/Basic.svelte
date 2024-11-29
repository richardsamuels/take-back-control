<script lang="ts">
  import Enable from "./Basic/Enable.svelte";
  import Bypass from "./Basic/Bypass.svelte";
  import Balance from "./Basic/Balance.svelte";
  import Animation from "./Basic/Animation.svelte";
  import EraseAll from "./Basic/EraseAll.svelte";
</script>

<div class="grid gap-3 pb-5">
  <div class="p-2 g-col-12">
    <Enable />
  </div>
  <div class="p-2 g-col-12">
    <Bypass />
  </div>
  <div class="p-2 g-col-12">
    <Balance />
  </div>
  <div class="p-2 g-col-12">
    <Animation />
  </div>
  <div class="p-2 g-col-12">
    <EraseAll />
  </div>
</div>

<style>
</style>
