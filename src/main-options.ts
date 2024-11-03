import { mount } from "svelte";
import "./app.css";
import Options from "./Options.svelte";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { setupStoreFromLocalStorage } from "./store.svelte";
import { type Message } from "./messages";
import "./theme";

await setupStoreFromLocalStorage();

browser.runtime.onMessage.addListener(async (msg_: unknown) => {
  const msg = msg_ as Message;
  console.log(msg);

  await setupStoreFromLocalStorage();
});

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
