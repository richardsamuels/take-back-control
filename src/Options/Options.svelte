<script lang="ts">
  import Basic from "./Basic";
  import Blacklist from "./Blacklist.svelte";
  import Whitelist from "./Whitelist.svelte";
  import Messages from "./Messages.svelte";
  import Debug from "./Debug.svelte";
  import { onMount, onDestroy } from "svelte";
  import { settingsStore } from "@/store";

  let url = $state("");
  function hashChange(event: HashChangeEvent) {
    if (event.newURL == event.oldURL) {
      return;
    }
    if (window.location.hash) {
      url = window.location.hash;
    } else {
      url = "";
    }
  }

  onDestroy(() => {
    removeEventListener("hashchange", hashChange);
  });

  onMount(() => {
    if (
      !window.location.hash ||
      ["", "#", "#/"].includes(window.location.hash)
    ) {
      //window.location.hash = "#/basic";
      window.history.replaceState(
        null,
        "",
        `${window.location.toString()}#/basic`,
      );
    }
    url = window.location.hash;

    addEventListener("hashchange", hashChange);
  });

  import { Container, Card, Row, Col } from "@sveltestrap/sveltestrap";

  // BUG: sveltestap bug prevent use of TabContent:
  // https://github.com/sveltestrap/sveltestrap/issues/82
</script>

<main class="p5 ms-4 me-4">
  <Container>
    <h4 class="font-weight-bold py-3 mb-4">Settings</h4>
    <Card class="overflow-hidden">
      <Row class="no-gutters row-bordered">
        <div class="col-md-3 pt-0">
          <div class="list-group list-group-flush account-settings-links">
            <a
              class="list-group-item list-group-item-action"
              data-toggle="list"
              class:active={url == "#/basic"}
              href="#/basic">Basic Settings</a
            >
            <a
              class="list-group-item list-group-item-action"
              data-toggle="list"
              class:active={url == "#/blacklist"}
              href="#/blacklist">Blacklist</a
            >
            <a
              class="list-group-item list-group-item-action"
              data-toggle="list"
              class:active={url == "#/whitelist"}
              href="#/whitelist">Whitelist</a
            >
            <a
              class="list-group-item list-group-item-action"
              data-toggle="list"
              class:active={url == "#/messages"}
              href="#/messages">Messages</a
            >

            {#if $settingsStore.showDebug}
              <a
                class="list-group-item list-group-item-action"
                data-toggle="list"
                class:active={url == "#/debug"}
                href="#/debug">Debug</a
              >
            {/if}
          </div>
          <hr class="border-light m-0" />
        </div>
        <Col class="col-md-9">
          <div class="tab-content mt-2">
            <div
              class="tab-pane fade"
              class:active={url == "#/basic"}
              class:show={url == "#/basic"}
              id="#/basic"
            >
              <Basic />
            </div>
            <div
              class="tab-pane fade"
              class:active={url == "#/blacklist"}
              class:show={url == "#/blacklist"}
              id="#/blacklist"
            >
              <Blacklist />
            </div>
            <div
              class="tab-pane fade"
              class:active={url == "#/whitelist"}
              class:show={url == "#/whitelist"}
              id="#/whitelist"
            >
              <Whitelist />
            </div>
            <div
              class="tab-pane fade"
              class:active={url == "#/messages"}
              class:show={url == "#/messages"}
              id="#/messages"
            >
              <Messages />
            </div>
            <div
              class="tab-pane fade"
              class:active={url == "#/debug"}
              class:show={url == "#/debug"}
              id="#/debug"
            >
              <Debug />
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  </Container>
</main>

<style>
</style>
