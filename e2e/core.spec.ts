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

const timeout = { timeout: 3_000 };

async function waitForContentScript(page) {
  // this is the closest approximation to "wait for content script to be
  // injected"
  await page.waitForLoadState("domcontentloaded", timeout);
  await page.waitForLoadState("load", timeout);
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

  // The nearly instant scrolling prevents the wall from being triggered
  // TODO look into that
  for (let i = 0; i < 10; i++) {
    await page.mouse.wheel(0, 100);
  }

  await expect(page.getByTestId("overlay")).toBeAttached(timeout);
  await expect(page.getByTestId("overlay")).toBeVisible();
  await expect(page.getByTestId("overlay")).toContainText("Scrolling deep");
  await expect(page.getByTestId("overlay-msg")).toBeVisible();

  await page.getByText("It's important (1st time)").click();
  await page.waitForTimeout(1000);
  for (let i = 0; i < 10; i++) {
    await page.mouse.wheel(0, 100);
  }
  //await expect(page.getByTestId("overlay")).toBeAttached();
  //await expect(page.getByTestId("overlay")).not.toBeVisible();
  //await expect(page.getByTestId("overlay-msg")).not.toBeVisible();
  await page.getByText("It's important (2nd time)").click();
});

test("whitelist", async ({ page, extensionId }) => {
  await setup(page, extensionId);

  await page.goto("http://example.com/whitelist");
  await waitForContentScript(page);

  for (let i = 0; i < 10; i++) {
    await page.mouse.wheel(0, 100);
  }

  await expect(page.getByTestId("overlay")).not.toBeVisible(timeout);
  await expect(page.getByTestId("overlay-msg")).not.toBeVisible();
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

  await expect(page.getByTestId("overlay")).toBeAttached(timeout);
  await expect(page.getByTestId("overlay")).toBeVisible();
  await expect(page.getByTestId("overlay")).toContainText("Scrolling deep");
  await expect(page.getByTestId("overlay-msg")).toBeVisible();
  await expect(
    page.getByText("It's not important enough. Go do something else."),
  ).toBeDisabled();

  await page.goto("http://localhost:3000/whitelist");
  await expect(page.getByTestId("overlay")).not.toBeVisible();
  await expect(page.getByTestId("overlay-msg")).not.toBeVisible();
});
