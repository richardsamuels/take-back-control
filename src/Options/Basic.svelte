<script lang="ts">
  import Enable from "./Basic/Enable.svelte";
  import Bypass from "./Basic/Bypass.svelte";
  import Balance from "./Basic/Balance.svelte";
  import Animation from "./Basic/Animation.svelte";
  import EraseAll from "./Basic/EraseAll.svelte";

  import { ListGroup } from "@sveltestrap/sveltestrap";
</script>

<div class="pb-5">
  <h5>Basic Settings</h5>
  <div class="mt-4">
    <ListGroup>
      <Enable />
      <Bypass />
      <Balance />
      <Animation />
      <EraseAll />
    </ListGroup>
  </div>
</div>

<style>
</style>
