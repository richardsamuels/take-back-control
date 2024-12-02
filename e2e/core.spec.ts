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
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("blacklist test", async ({ page, extensionId }) => {
  // This test takes at least 10 seconds, but in CI its much worse
  test.setTimeout(20_000);
  await setup(page, extensionId);

  await page.goto(`chrome-extension://${extensionId}/options.html`);
  await page.getByRole("slider", { name: "Bypass Chance" }).fill("100");

  await page.clock.setFixedTime(new Date("2024-02-02T08:00:00"));
  await page.goto("http://localhost:3000");
  await waitForContentScript(page);

  await scroll(page);

  await expectContentWall(page);
  await page.getByText("It's important (1st time)").click();
  await page
    .getByText("Are you REALLY sure it's important? (1st time)")
    .click();
  await expectNoContentWall(page);
  await scroll(page, 200);

  await expectContentWall(page);
  await page.getByText("It's important (2nd time)").click();
  await page
    .getByText("Are you REALLY sure it's important? (2nd time)")
    .click();
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

  await page.goto(`chrome-extension://${extensionId}/options.html#/blacklist`);
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
// prevents the popup from correctly identifying the active tab, so any
// features that are triggered by the popup are untestable.
// Thus, we have a massive hack: inject a button into the content wall
// that we can click in this test. It is only present when using playwright
test("test balance", async ({ page, extensionId }) => {
  await setup(page, extensionId);

  await page.goto(`chrome-extension://${extensionId}/options.html`);
  await page.getByRole("slider", { name: "Balance Time" }).fill("1");
  await page.getByRole("link", { name: "Blacklist" }).click();

  await page
    .getByTestId("blacklist-item")
    .filter({ hasText: "*://localhost:3000/*" })
    .getByRole("button", { name: "More" })
    .click();
  await page
    .getByRole("radio", { name: "Block the Whole Page Immediately" })
    .click();

  await page.goto("http://localhost:3000/");
  await waitForContentScript(page);
  await expectContentWall(page);

  // We can't click the popup to start the balance featurem, so this hack
  // does that for us
  await page.getByTestId("balance-button").dispatchEvent("click");
  await expectNoContentWall(page);

  test.setTimeout(120_000);

  // HACK: Playwright Clock API doesn't work with the browser.alarm API, so
  // we actually have to wait a minute of wall time. Seriously
  await expectContentWall(page, { timeout: 65 * 1000 });
});

test("delete on options work", async ({ page, extensionId }) => {
  await setup(page, extensionId);

  await page.goto(`chrome-extension://${extensionId}/options.html`);

  // Blacklist
  await page.getByRole("link", { name: "Blacklist" }).click();
  await page.getByRole("checkbox", { name: "*://*.youtube.com/*" }).click();
  await page.getByRole("checkbox", { name: "*://*.instagram.com/*" }).click();
  await page.getByRole("button", { name: "Remove" }).click();

  await page.getByRole("checkbox", { name: "Select all" }).click();
  await page.getByRole("button", { name: "Remove" }).click();

  expect(page.getByText("There is nothing here"));
  await page.getByRole("button", { name: "Restore defaults" }).click();
  expect(page.getByText("There is nothing here")).toHaveCount(0);

  // Whitelist page
  await page.getByRole("link", { name: "Whitelist" }).click();
  await page
    .getByRole("checkbox", { name: "*://*.instagram.com/direct/inbox/" })
    .click();
  await page
    .getByRole("checkbox", { name: "*://*.instagram.com/direct/*" })
    .click();
  await page.getByRole("button", { name: "Remove" }).click();

  await page.getByRole("checkbox", { name: "Select all" }).click();
  await page.getByRole("button", { name: "Remove" }).click();

  expect(page.getByText("There is nothing here"));
  await page.getByRole("button", { name: "Restore defaults" }).click();
  expect(page.getByText("There is nothing here")).toHaveCount(0);

  // Messages
  await page.getByRole("link", { name: "Messages" }).click();
  await page.getByRole("textbox").fill("TESTTEST");
  await page.getByRole("button", { name: "Add" }).click();
  await page.getByRole("checkbox", { name: "TESTTEST" }).click();
  await page
    .getByRole("checkbox", { name: "Weren't you doing something?" })
    .click();
  await page
    .getByRole("checkbox", { name: "You are compromising your future self." })
    .click();
  await page.getByRole("button", { name: "Remove" }).click();

  await page.getByRole("checkbox", { name: "Select all" }).click();
  await page.getByRole("button", { name: "Remove" }).click();

  expect(page.getByText("There is nothing here"));
  await page.getByRole("button", { name: "Restore defaults" }).click();
});
