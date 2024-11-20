import { expect } from "./fixtures";
import { OVERLAY_DIV_ID, MESSAGE_DISPLAY_DIV_ID } from "../src/constants";
import { type Page } from "playwright";

export const timeout = { timeout: 3_000 };

export async function waitForContentScript(page: Page) {
  // this is the closest approximation to "wait for content script to be
  // injected"
  await page.waitForLoadState("domcontentloaded", timeout);
  await page.waitForLoadState("load", timeout);
}

export async function expectContentWall(page: Page) {
  const opacity = await getOverlayOpacity(page);
  expect(opacity !== null && opacity > 0).toBeTruthy();
}
export async function expectNoContentWall(page: Page) {
  const opacity = await getOverlayOpacity(page);
  expect(opacity === null || opacity == 0).toBeTruthy();
}
async function getOverlayOpacity(page: Page) {
  const opacity = await page.evaluate((selector) => {
    const element = document.querySelector(selector);
    if (element == null) {
      return null;
    }
    // @ts-ignore
    return element.style.getPropertyValue("opacity");
  }, `#${MESSAGE_DISPLAY_DIV_ID}`);
  console.log("XX", opacity);
  return opacity;
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
