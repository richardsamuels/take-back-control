// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// READ ME READ ME READ ME READ ME
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//
// Because we are testing an extension, we have to bypass the happy path of
// playwright as described here: https://playwright.dev/docs/chrome-extensions
// This means we're subject to breakages, slowness, and instability. Keep this
// file to the absolute bare minimum to prove that core functionality works,
// and place your other tests somewhere else, outside of Playwright's execution
// context.
//
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// READ ABOVE READ ABOVE READ ABOVE READ ABOVE
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
import { test, expect } from "./fixtures";

const timeout = { timeout: 3_000 };

async function setup(page, extensionId) {
  await page.goto(
    `chrome-extension://${extensionId}/src/options.html#/blacklist`,
  );
  // TODO Need way to await content script
  await page.waitForTimeout(3000);
  await page.getByTestId("blacklist-input").fill("*://localhost/*");
  await page.getByTestId("blacklist-submit").click();

  await page.goto(
    `chrome-extension://${extensionId}/src/options.html#/whitelist`,
  );
  await page.getByTestId("blacklist-input").fill("*://localhost/whitelist");
  await page.getByTestId("blacklist-submit").click();

  //await page.goto(`chrome-extension://${extensionId}/src/options.html#/`);
  //await page.getByTestId("extension-enable").click();
}

test("add localhost to blacklist", async ({ page, extensionId }) => {
  await setup(page, extensionId);
  await page.goto("http://localhost:3000");

  // The nearly instant scrolling prevents the wall from being triggered
  // TODO look into that
  for (let i = 0; i < 10; i++) {
    await page.mouse.wheel(0, 100);
  }
  // TODO Need way to await content script
  //await page.waitForTimeout(3000);
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
  await page.goto("http://localhost:3000/whitelist");
  await page.mouse.wheel(0, 10000);
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
