<script lang="ts">
  import { settingsStore, type Settings } from "@/store";
  import { prettyPrintJson } from "pretty-print-json";
  import {
    RICHARDS_DEFAULTS_BLACKLIST,
    RICHARDS_DEFAULTS_WHITELIST,
    ONE_DAY_MINUTES,
  } from "@/lib/constants";

  import "/node_modules/pretty-print-json/dist/css/pretty-print-json.dark-mode.css";
  const s: Settings = $derived($settingsStore);

  function click() {
    $settingsStore.showDebug = !$settingsStore.showDebug;
  }

  function richards_defaults() {
    $settingsStore.blacklist = [
      ...$settingsStore.blacklist,
      ...RICHARDS_DEFAULTS_BLACKLIST,
    ];
    $settingsStore.whitelist = [
      ...$settingsStore.whitelist,
      ...RICHARDS_DEFAULTS_WHITELIST,
    ];
    $settingsStore.animation = false;
    $settingsStore.nagChance = 20;
  }
  function balance_reset() {
    settingsStore.time.reset();
  }
  function balance_start() {
    settingsStore.time.start();
  }
  function balance_almost_done() {
    $settingsStore.time = {
      ...$settingsStore.time,
      global: $settingsStore.dailyBalanceInterval,
    };
  }
  function balance_overload() {
    settingsStore.time.overload();
  }
  function balance_almost_reset() {
    settingsStore.time.overload();

    const d = new Date();
    d.setMinutes(d.getMinutes() + 2);
    d.setTime(d.getTime() - 24 * 60 * 60 * 1000);
    $settingsStore.time = {
      ...$settingsStore.time,
      globalDate: d.getTime(),
    };
  }
</script>

<div class="pb-5">
  <div class="pb-5">
    <label
      class="btn"
      class:active={$settingsStore.showDebug}
      class:btn-secondary={!$settingsStore.showDebug}
      class:btn-success={$settingsStore.showDebug}
    >
      <input
        type="radio"
        autocomplete="off"
        onclick={click}
        checked={$settingsStore.showDebug}
      /> Show Debug Menu Links
    </label>
    <label
      class="btn btn-secondary"
      class:active={!$settingsStore.showDebug}
      class:btn-secondary={$settingsStore.showDebug}
      class:btn-danger={!$settingsStore.showDebug}
    >
      <input
        type="radio"
        autocomplete="off"
        onclick={click}
        checked={!$settingsStore.showDebug}
      />
      Hide Debug Menu Links
    </label>
  </div>
  <div class="pb-5">
    <button type="button" class="btn btn-primary" onclick={richards_defaults}
      >Add Richard's Defaults</button
    >
    <button
      type="button"
      class="btn btn-primary"
      onclick={balance_start}
      disabled={$settingsStore.dailyBalanceInterval == 0}>Balance: Start</button
    >
    <button
      type="button"
      class="btn btn-primary"
      onclick={balance_overload}
      disabled={$settingsStore.dailyBalanceInterval == 0}
      >Balance: Overload</button
    >
    <button
      type="button"
      class="btn btn-primary"
      onclick={balance_almost_done}
      disabled={$settingsStore.dailyBalanceInterval == 0}
      >Balance: Near Expiration</button
    >
    <button
      type="button"
      class="btn btn-primary"
      onclick={balance_reset}
      disabled={$settingsStore.dailyBalanceInterval == 0}>Balance: Reset</button
    >
    <button
      type="button"
      class="btn btn-primary"
      onclick={balance_almost_reset}
      disabled={$settingsStore.dailyBalanceInterval == 0 &&
        ($settingsStore.time.global == 0 ||
          $settingsStore.time.global == ONE_DAY_MINUTES)}
      >Balance: Set Renewal Time to +1 minute</button
    >
  </div>
  <pre class="json-container pb-5">
{@html prettyPrintJson.toHtml(s)}
  </pre>
</div>

<style>
</style>
