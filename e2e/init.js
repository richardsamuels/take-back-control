import { settingsStore } from "./store.svelte";

// This exists only for playwright. See `core.spec.ts` > test balance for
// reasoning
// @ts-ignore
settingsStore.time.start();
