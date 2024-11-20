// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// READ ME READ ME READ ME READ ME
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//
// Because we are testing an extension, we have to bypass the happy path of
// playwright as described here: https://playwright.dev/docs/chrome-extensions
// (You may find the code for that inside ./fixtures.ts)
//
// This means we're subject to breakages, slowness, and instability. Keep this
// file to the minimum required to prove that core functionality works,
// and place your other tests somewhere else, outside of Playwright's execution
// context, or this test will take even longer
//
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// READ ABOVE READ ABOVE READ ABOVE READ ABOVE
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
import { test, expect } from "./fixtures";
import { OVERLAY_DIV_ID, MESSAGE_DISPLAY_DIV_ID } from "../src/constants";
import { type Page } from "playwright";

const timeout = { timeout: 3_000 };

async function waitForContentScript(page: Page) {
  // this is the closest approximation to "wait for content script to be
  // injected"
  await page.waitForLoadState("domcontentloaded", timeout);
  await page.waitForLoadState("load", timeout);
}

async function expectContentWall(page: Page) {
  const opacity = await getOverlayOpacity(page);
  expect(opacity !== null && opacity > 0).toBeTruthy();
}
async function expectNoContentWall(page: Page) {
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

async function scroll(page: Page, n: number = 100) {
  // The nearly instant scrolling prevents the wall from being triggered
  // TODO look into that
  for (let i = 0; i < 10; i++) {
    await page.mouse.wheel(0, n);
  }
}

async function setup(page, extensionId) {
  // Chrome sometimes fail to initialize the extension, so force that now
  await page.goto(`chrome-extension://${extensionId}/src/options.html`);

  await page.getByTestId("erase-all").click();
  await page.getByTestId("erase-all").click();

  await page.goto(
    `chrome-extension://${extensionId}/src/options.html#/blacklist`,
  );
  await page.getByTestId("blacklist-input").fill("*://localhost/*");
  await page.getByTestId("blacklist-submit").click();

  await page.goto(
    `chrome-extension://${extensionId}/src/options.html#/whitelist`,
  );
  await page.reload();
  await page.getByTestId("blacklist-input").fill("*://localhost/whitelist");
  await page.getByTestId("blacklist-submit").click();

  //await page.goto(`chrome-extension://${extensionId}/src/options.html#/`);
  //await page.getByTestId("extension-enable").click();
}

test("blacklist test", async ({ page, extensionId }) => {
  await setup(page, extensionId);
  await page.goto("http://localhost:3000");
  await waitForContentScript(page);

  await scroll(page);

  await expectContentWall(page);
  await page.getByText("It's important (1st time)").click();
  await expectNoContentWall(page);
  await scroll(page, 200);
  await page.waitForTimeout(1000);

  await expectContentWall(page);
  await page.getByText("It's important (2nd time)").click();
  await page.waitForTimeout(1000);
  await expectNoContentWall(page);
});

test("whitelist", async ({ page, extensionId }) => {
  await page.goto(
    `chrome-extension://${extensionId}/src/options.html#/blacklist`,
  );
  await page.getByTestId("blacklist-input").fill("*://*.example.com/*");
  await page.getByTestId("blacklist-submit").click();

  await page
    .getByTestId("blacklist-item")
    .filter({ hasText: "*://*.example.com/*" })
    .getByRole("button", { name: "More" })
    .click();

  await page
    .getByRole("radio", { name: "Block the Whole Page Immediately" })
    .click();

  await page.goto(
    `chrome-extension://${extensionId}/src/options.html#/whitelist`,
  );
  await page.getByTestId("blacklist-input").fill("*://*.example.com/whitelist");
  await page.getByTestId("blacklist-submit").click();

  await page.goto("http://example.com/whitelist");

  await waitForContentScript(page);
  await page.pause();
  await expectNoContentWall(page);
});

test("test blacklist options", async ({ page, extensionId }) => {
  await setup(page, extensionId);

  await page.goto(
    `chrome-extension://${extensionId}/src/options.html#/blacklist`,
  );
  await page
    .getByTestId("blacklist-item")
    .filter({ hasText: "*://localhost/*" })
    .getByRole("button", { name: "More" })
    .click();

  await page
    .getByRole("radio", {
      name: "Never Allow Access (except if matching Whitelist)",
    })
    .click();
  await page
    .getByRole("radio", { name: "Block the Whole Page Immediately" })
    .click();

  await page.goto("http://localhost:3000/");
  await waitForContentScript(page);

  await expectContentWall(page);
  await expect(
    page.getByText("It's not important enough. Go do something else."),
  ).toBeDisabled();

  await page.goto("http://localhost:3000/whitelist");
  await expectNoContentWall(page);
});

// Playwright does not allow interaction with the popup. Opening the page
// prevents the popup from correctly identifying the active tab
//test("test balance", async ({ page, extensionId }) => {
//  await setup(page, extensionId);
//
//  await page.goto(`chrome-extension://${extensionId}/src/options.html#/`);
//  await page.getByTestId("balance").fill("20");
//  await page.goto(`chrome-extension://${extensionId}/src/popup.html`);
//  await page.getByTestId("balance-start").click();
//
//  await page.goto("http://localhost:3000/");
//  await waitForContentScript(page);
//  await expectNoContentWall(page);
//
//  // Initialize clock with a specific time, let the page load naturally.
//  await page.clock.install({ time: new Date("2024-02-02T08:00:00") });
//  await page.clock.runFor(25 * 60 * 1000); // 25 minutes
//  await expectContentWall(page);
//});
