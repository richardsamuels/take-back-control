<script lang="ts">
  import { settingsStore } from "../../store.svelte";

  import { Label, FormGroup, Input } from "@sveltestrap/sveltestrap";

  import {
    Card,
    CardBody,
    CardHeader,
    CardText,
    CardTitle,
    Container,
    Row,
    Col,
    Accordion,
    AccordionItem,
  } from "@sveltestrap/sveltestrap";
</script>

<Card>
  <CardHeader>
    <CardTitle>Balance</CardTitle>
  </CardHeader>
  <CardBody>
    <CardText>
      If enabled, once a day, you can disable the wall for a small period of
      time. Enable this feature by clicking the skull icon in your addon bar
    </CardText>
    <Accordion class="pb-4">
      <AccordionItem header="Example">
        <Container>
          <Row>
            <Col>Normal wall</Col>
          </Row>
          <Row>
            <Col>
              <img width="600" src="/balance.png" alt="wall example" />
            </Col>
          </Row>
        </Container>
      </AccordionItem>
    </Accordion>
    <FormGroup>
      <Label class="mb-2">
        {#if $settingsStore.dailyBalanceInterval == 0}
          Disable this feature
        {:else}
          {$settingsStore.dailyBalanceInterval} minutes
        {/if}
      </Label>
      <div class="row">
        <div class="w-50">
          <Input
            type="range"
            class="form-range"
            aria-label="Balance Time"
            bind:value={$settingsStore.dailyBalanceInterval}
            min="0"
            max="30"
            step="1"
          />
        </div>
      </div>
    </FormGroup>
  </CardBody>
</Card>
