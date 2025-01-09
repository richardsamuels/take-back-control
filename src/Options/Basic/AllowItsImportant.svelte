<script lang="ts">
  import { settingsStore } from "@/store";
  import { ListGroup, ListGroupItem, Input } from "@sveltestrap/sveltestrap";

  import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    CardText,
  } from "@sveltestrap/sveltestrap";
</script>

<Card>
  <CardHeader>
    <CardTitle>Allow Bypass</CardTitle>
  </CardHeader>
  <CardBody>
    <CardText>When enabled, you can bypass The Wall on all sites.</CardText>
    <div class="mt-4">
      <Input
        type="switch"
        bind:checked={$settingsStore.allowBypass}
        label={$settingsStore.allowBypass
          ? "Allow Bypassing The Wall"
          : "Prevent Bypassing The Wall"}
      />
    </div>
  </CardBody>
</Card>
