// Based on https://playwright.dev/docs/chrome-extensions
import { test as base, chromium, type BrowserContext } from "@playwright/test";
import { fileURLToPath } from "url";
import path from "path";
import { mkdtemp, rmdir } from "fs/promises";
import { tmpdir } from "node:os";

const userDataDir = await mkdtemp(path.join(tmpdir(), "ads-"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({}, use) => {
    const pathToExtension = path.join(__dirname, "..", "dist-chrome");
    const cfg = {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    };
    if (!!process.env.CI) {
      cfg.headless = true;
      cfg.args.push("--headless=new");
    }
    const context = await chromium.launchPersistentContext(userDataDir, cfg);
    await use(context);
    await context.close();
    await rmdir(userDataDir, { recursive: true });
  },
  extensionId: async ({ context }, use) => {
    /*
    // for manifest v2:
    let [background] = context.backgroundPages()
    if (!background)
      background = await context.waitForEvent('backgroundpage')
    */

    // for manifest v3:
    let [background] = context.serviceWorkers();
    if (!background) background = await context.waitForEvent("serviceworker");

    const extensionId = background.url().split("/")[2];
    await use(extensionId);
  },
});
export const expect = test.expect;
