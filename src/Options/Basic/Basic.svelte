<script lang="ts">
  import Enable from "./Enable.svelte";
  import AllowItsImportant from "./AllowItsImportant.svelte";
  import Bypass from "./Bypass.svelte";
  import Balance from "./Balance.svelte";
  import Animation from "./Animation.svelte";
  import EraseAll from "./EraseAll.svelte";
</script>

<div class="grid gap-3 pb-5">
  <div class="p-2 g-col-12">
    <Enable />
  </div>
  <div class="p-2 g-col-12">
    <AllowItsImportant />
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
