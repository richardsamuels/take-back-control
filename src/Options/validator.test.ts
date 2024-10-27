/* global navigator */
import { describe, it, expect } from "vitest";

import * as ut from "./validator";

function setGlobals(agent: string, vendor: string) {
  // @ts-ignore
  navigator.__defineGetter__("userAgent", function () {
    return agent; // customized user agent
  });
  // @ts-ignore
  navigator.__defineGetter__("vendor", function () {
    return vendor; // customized  vendor
  });
  // @ts-ignore
  global.window = {};
}
setGlobals("firefox", "mozilla");

describe("tryParseMatchPattern", () => {
  it("accepts valid patterns", () => {
    const table = [
      [
        "*://*.test.com/*",
        {
          host: {
            data: "*.test.com",
            has_port: false,
            valid: true,
            wildcard_ok: true,
          },
          path: {
            data: "/*",
            has_leader: true,
            valid: true,
          },
          scheme: {
            data: "*",
            valid: true,
          },
          valid: true,
        },
      ],
      [
        "*://*/testing/my/*/patience",
        {
          host: {
            data: "*",
            has_port: false,
            valid: true,
            wildcard_ok: true,
          },
          path: {
            data: "/testing/my/*/patience",
            has_leader: true,
            valid: true,
          },
          scheme: {
            data: "*",
            valid: true,
          },
          valid: true,
        },
      ],
      [
        "*://*.mozilla.org/*",
        {
          host: {
            data: "*.mozilla.org",
            has_port: false,
            valid: true,
            wildcard_ok: true,
          },
          path: {
            data: "/*",
            has_leader: true,
            valid: true,
          },
          scheme: {
            data: "*",
            valid: true,
          },
          valid: true,
        },
      ],
      [
        "file:///*",
        {
          path: {
            data: "/*",
            has_leader: true,
            valid: true,
          },
          scheme: {
            data: "file",
            valid: true,
          },
          valid: true,
        },
      ],
      [
        "chrome-extension://*.test.com/*",
        {
          scheme: {
            data: "chrome-extension",
            valid: false,
          },
          valid: false,
        },
      ],
    ];
    for (const [t, expected] of table) {
      expect(ut.tryParseMatchPattern(t)).toStrictEqual(expected);
      expect(ut.isValidMatchPattern(t), t).toStrictEqual(expected.valid);
    }
  });

  it("accepts valid patterns for file", () => {
    const table = [
      [
        "file:///*",
        {
          path: {
            data: "/*",
            has_leader: true,
            valid: true,
          },
          scheme: {
            data: "file",
            valid: true,
          },
          valid: true,
        },
      ],
      [
        "file:///test/*/test",
        {
          path: {
            data: "/test/*/test",
            has_leader: true,
            valid: true,
          },
          scheme: {
            data: "file",
            valid: true,
          },
          valid: true,
        },
      ],
      [
        "file:///blah/*",
        {
          path: {
            data: "/blah/*",
            has_leader: true,
            valid: true,
          },
          scheme: {
            data: "file",
            valid: true,
          },
          valid: true,
        },
      ],
    ];
    for (const [t, expected] of table) {
      expect(ut.tryParseMatchPattern(t), t).toStrictEqual(expected);
      expect(ut.isValidMatchPattern(t), t).toBe(expected.valid);
    }
  });

  it("accepts valid patterns (chrome)", () => {
    setGlobals("chrome", "google inc");

    const table = [
      [
        "*://*.test.com/*",
        {
          host: {
            data: "*.test.com",
            has_port: false,
            valid: true,
            wildcard_ok: true,
          },
          path: {
            data: "/*",
            has_leader: true,
            valid: true,
          },
          scheme: {
            data: "*",
            valid: true,
          },
          valid: true,
        },
      ],
      [
        "extension://*.test.com/*",
        {
          host: {
            data: "*.test.com",
            has_port: false,
            valid: true,
            wildcard_ok: true,
          },
          path: {
            data: "/*",
            has_leader: true,
            valid: true,
          },
          scheme: {
            data: "extension",
            valid: true,
          },
          valid: true,
        },
      ],
      [
        "chrome-extension://*.test.com/*",
        {
          host: {
            data: "*.test.com",
            has_port: false,
            valid: true,
            wildcard_ok: true,
          },
          path: {
            data: "/*",
            has_leader: true,
            valid: true,
          },
          scheme: {
            data: "chrome-extension",
            valid: true,
          },
          valid: true,
        },
      ],
    ];
    for (const [t, expected] of table) {
      expect(ut.tryParseMatchPattern(t), t).toStrictEqual(expected);
      expect(ut.isValidMatchPattern(t), t).toStrictEqual(expected.valid);
    }
    setGlobals("firefox", "mozilla");
  });

  it("rejects invalid patterns", () => {
    const table = [
      ["", { valid: false }],
      [
        "bs://*.test.com/*",
        {
          scheme: {
            data: "bs",
            valid: false,
          },
          valid: false,
        },
      ],
      [
        "*://*.test.com:95/*",
        {
          host: {
            data: "*.test.com:95",
            has_port: true,
            valid: false,
            wildcard_ok: true,
          },
          scheme: {
            data: "*",
            valid: true,
          },
          valid: false,
        },
      ],
      [
        "file://*",
        {
          path: {
            data: "*",
            has_leader: false,
            valid: false,
          },
          scheme: {
            data: "file",
            valid: true,
          },
          valid: false,
        },
      ],
      [
        "data:content/type;base64,",
        {
          data: {
            base64: false,
            data: "",
          },
          scheme: {
            data: "data",
            valid: true,
          },
          valid: false,
        },
      ],
    ];
    for (const [e, expected] of table) {
      expect(ut.tryParseMatchPattern(e), e).toStrictEqual(expected);
      expect(ut.isValidMatchPattern(e), e).toStrictEqual(expected.valid);
    }
  });
});

describe("coerce", () => {
  it("coerces domains into fully qualified URLs", () => {
    const table = [
      ["example.org", "*://example.org/*"],
      ["*://example.org", "*://example.org/*"],
      ["example.org/*", "*://example.org/*"],
      ["*.example.org/*", "*://*.example.org/*"],
      ["*/*", "*://*/*"],
      ["bs://example.org", "bs://example.org"],
      ["://example.org", "://example.org"],
      ["::/example.org", "*://::/example.org"],
    ];

    for (const [t, expected] of table) {
      expect(ut.coerce(t), t).toStrictEqual(expected);
    }
  });
});
