import { expect } from "./fixtures";
import { type Page } from "playwright";

export const timeout = { timeout: 3_000 };

export async function waitForContentScript(page: Page) {
  // this is the closest approximation to "wait for content script to be
  // injected"
  await page.waitForLoadState("domcontentloaded", timeout);
  await page.waitForLoadState("load", timeout);
}

export async function expectContentWall(page: Page) {
  await expect(page.getByTestId("overlay")).not.toHaveAttribute(
    "data-blur-intensity",
    "0",
  );
  await expect(page.getByTestId("overlay")).toHaveAttribute(
    "data-msg-visible",
    "true",
  );
}

export async function expectNoContentWallWhitelist(page: Page) {
  await expect(page.getByTestId("overlay")).toHaveCount(0);
}

export async function expectNoContentWall(page: Page) {
  await expect(page.getByTestId("overlay")).toHaveAttribute(
    "data-blur-intensity",
    "0",
  );
  await expect(page.getByTestId("overlay")).toHaveAttribute(
    "data-msg-visible",
    "false",
  );
}

export async function scroll(page: Page, n: number = 100) {
  // The nearly instant scrolling prevents the wall from being triggered
  // TODO look into that
  for (let i = 0; i < 10; i++) {
    await page.mouse.wheel(0, n);
  }
}

export async function setup(page: Page, extensionId: string) {
  // Chrome sometimes fail to initialize the extension, so force that now
  await page.goto(`chrome-extension://${extensionId}/src/options.html`);

  await page.getByTestId("erase-all").click();
  await page.getByTestId("erase-all").click();

  await page.goto(
    `chrome-extension://${extensionId}/src/options.html#/blacklist`,
  );
  await page.getByTestId("blacklist-input").fill("*://localhost:3000/*");
  await page.getByTestId("blacklist-submit").click();

  await page.goto(
    `chrome-extension://${extensionId}/src/options.html#/whitelist`,
  );
  await page.reload();
  await page
    .getByTestId("blacklist-input")
    .fill("*://localhost:3000/whitelist");
  await page.getByTestId("blacklist-submit").click();

  //await page.goto(`chrome-extension://${extensionId}/src/options.html#/`);
  //await page.getByTestId("extension-enable").click();
}
