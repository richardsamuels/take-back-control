<script lang="ts">
  import { settingsStore } from "../../store.svelte";
  import { Label, FormGroup, Input } from "@sveltestrap/sveltestrap";

  import {
    Card,
    CardBody,
    CardHeader,
    CardText,
    CardTitle,
    Row,
    Col,
    Container,
    Accordion,
    AccordionItem,
  } from "@sveltestrap/sveltestrap";
</script>

<Card>
  <CardHeader>
    <CardTitle>Reconfirm Bypass</CardTitle>
  </CardHeader>
  <CardBody>
    <CardText>
      When bypassing the wall, this is the chance you will be asked to reconfirm
      that you really want to bypass the wall by clicking It's Important again.
    </CardText>
    <Accordion class="pb-4">
      <AccordionItem header="Example">
        <Container>
          <Row>
            <Col>Normal wall</Col>
          </Row>
          <Row>
            <Col>
              <img width="600" src="/wall.png" alt="wall example" />
            </Col>
          </Row>
          <Row class="pt-4">
            <Col>When enabled, after clicking "It's important"</Col>
          </Row>
          <Row>
            <Col>
              <img width="600" src="/wall-nag.png" alt="wall with nag" />
            </Col>
          </Row>
        </Container>
      </AccordionItem>
    </Accordion>
    <FormGroup>
      <Label>
        {#if $settingsStore.nagChance == 0}
          0% (Never happens)
        {:else if $settingsStore.nagChance == 100}
          100% (Happens every time)
        {:else}
          {Math.round($settingsStore.nagChance)}% chance of happening
        {/if}
      </Label>
      <div class="w-50">
        <Input
          type="range"
          class="form-range"
          bind:value={$settingsStore.nagChance}
          min="0"
          max="100"
          step=""
          data-testid="nag-chance"
        />
      </div>
    </FormGroup>
  </CardBody>
</Card>
