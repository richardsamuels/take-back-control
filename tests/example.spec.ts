import { test, expect } from "./fixtures";

test("add example.com to blacklist", async ({ page, extensionId }) => {
  await page.goto(
    `chrome-extension://${extensionId}/src/options.html#/blacklist`,
  );
  await page.getByTestId("blacklist-input").fill("*://*.example.com/*");
  await page.getByTestId("blacklist-submit").click();

  await page.goto("https://example.com");

  await page.pause();
  await expect(page.getByTestId("overlay")).toBeAttached();
});
