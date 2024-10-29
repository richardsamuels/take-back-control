<script lang="ts">
  import { settingsStore } from "../store.svelte";
</script>

<nav class="navbar navbar-expand-lg bg-body-tertiary mb-4">
  <div class="container-fluid">
    <a class="navbar-brand" href="#/">Anti-Doomscroll</a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link" href="#/">Basic Settings</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/blacklist">Blacklist</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/whitelist">Whitelist</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/messages">Messages</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/debug">Debug</a>
        </li>
      </ul>
    </div>
  </div>
</nav>

<style>
</style>
