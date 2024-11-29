<script lang="ts">
  import List from "./List.svelte";
  import { settingsStore } from "@/store";
  import {
    Input,
    FormGroup,
    Container,
    Row,
    Col,
  } from "@sveltestrap/sveltestrap";

  const settings = $derived($settingsStore);
  let newMsg = $state("");

  function handleNewMsg(e: Event) {
    e.preventDefault();

    settingsStore.messages.add(newMsg.trim());
    newMsg = "";
  }

  const feedback = $derived.by(() => {
    if ($settingsStore.messages.includes(newMsg.trim())) {
      return "Message is already in the list";
    }
    return "";
  });
  const validMsg = $derived.by(() => {
    const msg = newMsg.trim();
    if (!msg || $settingsStore.messages.includes(msg)) {
      return false;
    }

    return true;
  });
</script>

<div class="grid gap-3 pb-5">
  <h5>Inspirational Messages</h5>
  <div class="form-text pb-2">
    A randomly selected message from this list will show up when you start
    doomscrolling. Use any combination of Motivational, Inspirational, or
    Insulting phrasing to change your behaviour
  </div>

  <div class="mt-4 pe-3">
    <ul class="list-group">
      <li class="list-group-item">
        <h5 class="mt-2">Add New Message</h5>

        <form class="mb-4" onsubmit={handleNewMsg}>
          <label for="urlInput" class="form-label"></label>
          <div class="d-flex gap-2">
            <Container>
              <Row>
                <Col sm="10">
                  <FormGroup>
                    <Input
                      type="text"
                      class="form-control"
                      bind:value={newMsg}
                      placeholder="Do something better"
                      aria-describedby="messageHelp"
                      required
                      valid={newMsg != "" && validMsg}
                      invalid={newMsg != "" && !validMsg}
                      data-testid="message"
                      {feedback}
                    />
                  </FormGroup>
                </Col>
                <Col sm="2">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    aria-label="Add"
                    data-testid="message-submit"
                    disabled={!validMsg}
                  >
                    <i class="bi bi-plus-lg"></i>
                  </button>
                </Col>
              </Row>
            </Container>
          </div>
          <div id="messageHelp" class="form-text">
            Try crafting a message that targets one of your fixable fears or
            insecurities, such as your waist circumference.
          </div>
        </form>
      </li>
      <li class="list-group-item">
        <h5 class="mt-2">Inspirational Messages</h5>

        <List
          items={$settingsStore.messages}
          remove={settingsStore.messages.remove}
          setDefaults={settingsStore.messages.reset}
        />
      </li>
    </ul>
  </div>
</div>

<style>
</style>
