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
import {
  waitForContentScript,
  expectContentWall,
  expectNoContentWall,
  expectNoContentWallWhitelist,
  scroll,
  setup,
} from "./helpers";

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
  await setup(page, extensionId);

  await page.goto("http://localhost:3000");

  await waitForContentScript(page);
  await scroll(page);
  await expectContentWall(page);

  await page.goto("http://localhost:3000/whitelist");
  await waitForContentScript(page);
  await scroll(page);
  await expectNoContentWallWhitelist(page);
});

test("test blacklist options", async ({ page, extensionId }) => {
  await setup(page, extensionId);

  await page.goto(
    `chrome-extension://${extensionId}/src/options.html#/blacklist`,
  );
  await page
    .getByTestId("blacklist-item")
    .filter({ hasText: "*://localhost:3000/*" })
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
