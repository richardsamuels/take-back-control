/* global navigator */
import { describe, it, expect, beforeEach } from "vitest";

import * as ut from "./helpers";

describe("findPattern", () => {
  beforeEach(() => {
    // @ts-ignore
    global.window = {
      // @ts-ignore
      location: {
        href: "http://example.com/test/my/patience",
        toString: function () {
          return this.href;
        },
      },
    };
  });

  it("accepts valid patterns", () => {
    const table = [
      [
        ["http://example.com/test/my/patience"],
        "http://example.com/test/my/patience",
      ],
      [
        ["*://*.example.com/test/*", "*://example.com/test/something/else"],
        "*://*.example.com/test/*",
      ],
      [
        [
          "*://example.com/test/my/patienc*",
          "*://example.com/t*st/my/patienc*",
          "*://example.com/t*st/m*/patienc*",
          "*://example.com/test/my/patience",
        ],
        "*://example.com/test/my/patience",
      ],
    ];
    for (const [url, expected] of table) {
      const find = ut.findPattern(url as string[]);
      expect(find).toBe(expected);
    }
  });
});
