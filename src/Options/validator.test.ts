/* global navigator */
import { describe, it, expect, beforeEach } from "vitest";

import * as ut from "./validator";

function setGlobals(agent: string, vendor: string) {
  // @ts-ignore
  global.window = { navigator: {} };
  // @ts-ignore
  global.window.navigator.__defineGetter__("userAgent", function () {
    return agent; // customized user agent
  });
  // @ts-ignore
  global.window.navigator.__defineGetter__("vendor", function () {
    return vendor; // customized  vendor
  });
}

describe("tryParseMatchPattern", () => {
  beforeEach(() => setGlobals("firefox", "mozilla"));
  it("accepts valid patterns", () => {
    const table: [string, ut.ParsedPattern][] = [
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
    const table: [string, ut.ParsedPattern][] = [
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

    const table: [string, ut.ParsedPattern][] = [
      [
        "*://localhost:3000/*",
        {
          host: {
            data: "localhost:3000",
            has_port: true,
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
        "*://localhost/*",
        {
          host: {
            data: "localhost",
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
    const table: [string, ut.ParsedPattern][] = [
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

describe("patternMatch", () => {
  it("correctly matches whitelist urls", () => {
    const table = [
      [
        "*://*.reddit.com/r/cats/*",
        "http://old.reddit.com/r/cats/blahblahblah",
        true,
      ],
      [
        "*://*.reddit.com/r/cats/*",
        "http://old.reddit.com/r/dogs/blahblahblah",
        false,
      ],
      [
        "*://*.reddit.com/r/cats/*/notblah",
        "http://old.reddit.com/r/dogs/blahblahblah",
        false,
      ],
      [
        "*://*.reddit.com/r/cats/*/notblah",
        "http://old.reddit.com/r/dogs/blahblahblah/notblah",
        false,
      ],
      [
        "*://*.reddit.com/r/cats/*/notblah/*/end",
        "https://old.reddit.com/r/cats/blahblahblah/notblah/sdfdsfdsfsdfds/fdshfksdfsdf/end",
        true,
      ],
      [
        "*://*/r/cats/*/notblah/*/end",
        "http://old.reddit.com/r/cats/blahblahblah/notblah/sdfdsfdsfsdfds/fdshfksdfsdf/end",
        true,
      ],
      [
        "*://*/r/cats/*/notblah/*",
        "http://old.reddit.com/r/cats/blahblahblah/notblah/sdfdsfdsfsdfds/fdshfksdfsdf/end",
        true,
      ],
      [
        "*://reddit.com/r/cats/*/notblah/*",
        "http://old.reddit.com/r/cats/blahblahblah/notblah/sdfdsfdsfsdfds/fdshfksdfsdf/end",
        false,
      ],
      ["*://*.reddit.com/r/blender/*", "https://reddit.com/r/blender/", true],
    ];

    for (const [pattern, url, expected] of table) {
      //  @ts-ignore
      expect(ut.patternMatch(pattern, url), `${pattern} ${url}`).toEqual(
        expected,
      );
    }
  });
});
