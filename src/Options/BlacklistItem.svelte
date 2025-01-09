<script lang="ts">
  type Props = { item: string; index: number; group: number[] };
  let { item, index, group = $bindable() }: Props = $props();

  import { Container, Row, Col } from "@sveltestrap/sveltestrap";

  import { DEFAULT_SCROLL_FACTOR } from "@/lib/constants";
  import { settingsStore, type BlacklistSiteConfig } from "@/store";
  const siteConfig: BlacklistSiteConfig = $derived(
    $settingsStore.blacklistSites[item]!,
  );
  const blockWholePage = $derived(siteConfig.blockWholePage);
  const alwaysBlock = $derived(siteConfig.alwaysBlock);
  const allowBypass = $derived(siteConfig.allowBypass);

  function clickBlockWholePage(_e: Event) {
    settingsStore.blacklistSites.set(item, {
      ...siteConfig,
      blockWholePage: !blockWholePage,
    });
  }
  function clickAlwaysBlock(_e: Event) {
    settingsStore.blacklistSites.set(item, {
      ...siteConfig,
      alwaysBlock: !alwaysBlock,
    });
  }
  function clickAllowBypass(_e: Event) {
    settingsStore.blacklistSites.set(item, {
      ...siteConfig,
      allowBypass: !allowBypass,
    });
  }

  // svelte-ignore state_referenced_locally
  let value = $state(siteConfig.scrollFactor);
  function change() {
    if (value == null) {
      value = DEFAULT_SCROLL_FACTOR;
    }
    settingsStore.blacklistSites.set(item, {
      ...siteConfig,
      scrollFactor: value,
    });
  }

  const handleCheck = () => {
    group = [...group, index];
  };
  const handleUncheck = () => {
    group = group.filter((checkedValue) => checkedValue !== index);
  };

  let checked = $derived(group.includes(index));
  function onclick() {
    if (!checked) {
      handleCheck();
    } else {
      handleUncheck();
    }
  }
</script>

<li class="list-group-item">
  <Container>
    <Row data-testid="blacklist-item">
      <Col sm="9">
        <label class="ms-1 form-check-label">
          <input
            class="form-check-input"
            type="checkbox"
            name="url"
            value={index}
            {checked}
            {onclick}
          />
          <span>{item}</span>
        </label>
      </Col>
      <Col sm="3" class="float-end">
        <button
          class="btn btn-primary float-end"
          data-bs-toggle="collapse"
          data-bs-target={`#list-${index}`}
        >
          More
        </button>
      </Col>
    </Row>
  </Container>
  <div class="collapse" id={`list-${index}`}>
    <ul class="list-group pt-3 pb-3">
      <li class="list-group-item">
        <label
          class="btn"
          class:active={blockWholePage}
          class:btn-secondary={!blockWholePage}
          class:btn-danger={blockWholePage}
        >
          <input
            type="radio"
            name={`blockWholePage-${index}`}
            autocomplete="off"
            onclick={clickBlockWholePage}
            checked={blockWholePage}
          /> Block the Whole Page Immediately
        </label>
        <label
          class="btn btn-secondary"
          class:active={!blockWholePage}
          class:btn-secondary={blockWholePage}
          class:btn-success={!blockWholePage}
        >
          <input
            type="radio"
            name={`blockWholePage-${index}`}
            autocomplete="off"
            onclick={clickBlockWholePage}
            checked={!blockWholePage}
          />
          Block After Scrolling
        </label>
      </li>
      <li class="list-group-item">
        <label
          class="btn"
          class:active={alwaysBlock}
          class:btn-secondary={!alwaysBlock}
          class:btn-danger={alwaysBlock}
        >
          <input
            type="radio"
            name={`alwaysBlock-${index}`}
            autocomplete="off"
            onclick={clickAlwaysBlock}
            checked={alwaysBlock}
          /> Never Allow Access (except if matching Whitelist)
        </label>
        <label
          class="btn btn-secondary"
          class:active={!alwaysBlock}
          class:btn-secondary={alwaysBlock}
          class:btn-success={!alwaysBlock}
        >
          <input
            type="radio"
            name={`alwaysBlock-${index}`}
            autocomplete="off"
            onclick={clickAlwaysBlock}
            checked={!alwaysBlock}
          />
          Allow User to Bypass the Wall
        </label>
      </li>
      <li class="list-group-item">
        <label
          class="btn btn-secondary"
          class:active={!allowBypass}
          class:btn-secondary={allowBypass}
          class:btn-success={!allowBypass}
        >
          <input
            type="radio"
            name={`allowBypass-${index}`}
            autocomplete="off"
            onclick={clickAllowBypass}
            checked={!allowBypass}
          />Inherit global bypass setting
        </label>
        <label
          class="btn"
          class:active={allowBypass}
          class:btn-secondary={!allowBypass}
          class:btn-danger={allowBypass}
        >
          <input
            type="radio"
            name={`allowBypass-${index}`}
            autocomplete="off"
            onclick={clickAllowBypass}
            checked={allowBypass}
          />

          Allow User to Bypass the Wall
        </label>
      </li>
      {#if $settingsStore.showDebug}
        <li class="list-group-item">
          Scroll Factor <input
            type="number"
            min="0"
            max="2"
            step="0.01"
            bind:value
            onchange={change}
          />
        </li>
      {/if}
    </ul>
  </div>
</li>
