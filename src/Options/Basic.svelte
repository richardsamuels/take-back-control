<script lang="ts">
  import Enable from "./Basic/Enable.svelte";
  import Balance from "./Basic/Balance.svelte";
  import Bypass from "./Basic/Bypass.svelte";
  import EraseAll from "./Basic/EraseAll.svelte";
</script>

<div class="pb-5">
  <h5>Basic Settings</h5>
  <div class="mt-4">
    <ul class="list-group">
      <Enable />
      <Balance />
      <Bypass />
      <EraseAll />
    </ul>
  </div>
</div>

<style>
</style>
