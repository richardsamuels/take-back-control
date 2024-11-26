<script lang="ts">
  import { ListGroupItem, Container, Row, Col } from "@sveltestrap/sveltestrap";
  import type { Snippet } from "svelte";

  type Props = {
    title: string;
    description?: Snippet;
    children: Snippet;
  };

  const { title, description, children }: Props = $props();
</script>

<ListGroupItem>
  <Container>
    <Row><Col class="mt-2"><h5>{title}</h5></Col></Row>
    {#if description !== null}
      <Row>
        <Col class="mb-4 form-text">
          {description}
        </Col>
      </Row>
    {/if}
    <Row>
      <Col>{@render children()}</Col>
    </Row>
  </Container>
</ListGroupItem>
