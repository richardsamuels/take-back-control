<script lang="ts">
  import { settingsStore } from "@/store";

  import { FormGroup, Input } from "@sveltestrap/sveltestrap";

  const label = $settingsStore.animation
    ? "Animations active"
    : "Animations disabled";

  import {
    Card,
    CardBody,
    CardHeader,
    CardText,
    CardTitle,
  } from "@sveltestrap/sveltestrap";
</script>

{#if $settingsStore.showDebug}
  <Card>
    <CardHeader>
      <CardTitle>EXPERIMENTAL: Animation</CardTitle>
    </CardHeader>
    <CardBody>
      <CardText>Toggle subtle animations on the doomscroll wall</CardText>
      <FormGroup>
        <div class="w-50">
          <FormGroup>
            <Input
              type="switch"
              bind:checked={$settingsStore.animation}
              {label}
            />
          </FormGroup>
        </div>
      </FormGroup>
    </CardBody>
  </Card>
{/if}
