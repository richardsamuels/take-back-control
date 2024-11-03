import { mount } from "svelte";
import "./app.css";
import Options from "./Options.svelte";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./theme";
import { storageChange } from "./store.svelte";

await storageChange();

const container = document.getElementById("app")!;
const app = mount(Options, {
  target: container,
});

export default app;
if (import.meta.hot) {
  const { addViteStyleTarget } = await import(
    "@samrum/vite-plugin-web-extension/client"
  );

  await addViteStyleTarget(container);
}
