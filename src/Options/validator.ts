function isChrome(): boolean {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const vendor = window.navigator.vendor.toLowerCase();
  return (
    /chrome/.test(userAgent) && /google inc/.test(vendor) && !("opr" in window)
  );
}

export type ParsedPattern = {
  valid: boolean;
  scheme?: Scheme;
  path?: Path;
  host?: Host;
  data?: Data;
};

type Scheme = {
  valid: boolean;
  data: string;
};
type Host = {
  valid: boolean;
  data: string;
  has_port: boolean;
  wildcard_ok: boolean;
};
type Path = {
  valid: boolean;
  data: string;
  has_leader: boolean;
};
type Data = {
  mime?: string;
  base64: boolean;
  data: string; // TODO type
};

const SCHEME_FILE = "file://";
function explain_errors(p: ParsedPattern): string[] {
  const errors = [];
  // Check if the scheme is bad or missing
  if (!p.scheme?.valid) {
    errors.push("Check URL scheme (the part before ://)");
  }
  if (p.host) {
    if (p.host.has_port) {
      errors.push(
        "Hosts cannot contain a port number. If you remove the port number, the URL will match any port number",
      );
    }
    if (!p.host.wildcard_ok) {
      errors.push(
        `The host must either be a "*" or start with "*.". Wildcards may not be used elsewhere.`,
      );
    }
  }
  if (p.path) {
    if (!p.path.has_leader) {
      errors.push("Paths must start with /");
    }
  }
  return errors;
}
export function coerce(pattern: string): string {
  // try and add a scheme of *:// and path of /* if there is no scheme/path
  let newPattern = pattern;
  const scheme = findSchemeLike(pattern);
  if (scheme === null) {
    newPattern = `*://${pattern}`;
  }
  const p = tryParseMatchPattern(newPattern);
  if (p.valid) {
    return newPattern;
  }
  // if valid scheme and host, but path not found, add the wildcard path
  if (p.scheme?.valid && p.host?.valid && !("path" in p)) {
    newPattern = `${newPattern}/*`;
  }
  return newPattern;
}
export function coerce_and_explain(pattern: string): [string, string[]] {
  if (pattern == "<all_urls>" || pattern.startsWith("data:")) {
    return ["", ["<all_urls> and data: are forbidden"]];
  }
  if (pattern == "") {
    return [pattern, []];
  }
  const coercedPattern = coerce(pattern);
  const p = tryParseMatchPattern(coercedPattern);
  if (p.valid) {
    return [coercedPattern, []];
  }
  return [coercedPattern, explain_errors(p)];
}

// You MUST strictly test the output of this function. Do not use a falsey test
function findSchemeLike(pattern: string): string | null {
  const tryFindScheme = /^(.*):\/\//;
  const m = pattern.match(tryFindScheme);
  if (m) {
    return m[1];
  }
  return null;
}
export function tryParseMatchPattern(pattern: string): ParsedPattern {
  if (pattern.startsWith("data:")) {
    return handleDataPattern(pattern);
  }
  if (pattern.startsWith(SCHEME_FILE)) {
    return handleFilePattern(pattern);
  }
  // Validate scheme
  const schemeTokens = ["*", "http", "https", "ws", "wss", "ftp", "extension"];
  if (isChrome()) {
    schemeTokens.push("chrome-extension");
  }
  let scheme = null;
  for (const scheme_ of schemeTokens) {
    if (pattern.startsWith(`${scheme_}://`)) {
      scheme = { data: scheme_, valid: true };
      break;
    }
  }
  if (!scheme) {
    const schemeLike = findSchemeLike(pattern);
    if (schemeLike) {
      return {
        valid: false,
        scheme: { data: schemeLike, valid: false },
      };
    }
    return { valid: false };
  }
  const tail = pattern.slice(scheme.data.length + 3);
  return tryParseHostPattern(scheme, tail);
}
export function isValidMatchPattern(pattern: string) {
  // Quoted portions from:
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns
  if (pattern == "<all_urls>") {
    return true;
  }
  const p = tryParseMatchPattern(pattern);
  return p.valid;
}
function handleFilePattern(pattern: string): ParsedPattern {
  const path_candidate = pattern.slice(SCHEME_FILE.length);
  const path = tryParseFilePath(path_candidate);
  if (path.valid) {
    return {
      valid: true,
      scheme: {
        valid: true,
        data: "file",
      },
      path,
    };
  } else {
    return {
      valid: false,
      scheme: {
        valid: true,
        data: "file",
      },
      path,
    };
  }
}
function handleDataPattern(_pattern: string): ParsedPattern {
  // TODO
  console.error("While technically correct, this is unsupported.");
  return {
    valid: false,
    scheme: {
      data: "data",
      valid: true,
    },
    data: {
      data: "",
      base64: false,
    },
  };
}

function tryParseFilePath(path: string): Path {
  if (!path.startsWith("/")) {
    return { data: path, valid: false, has_leader: false };
  }
  return { data: path, valid: true, has_leader: true };
}

function tryParseHostPattern(
  scheme: Scheme,
  hostandpath: string,
): ParsedPattern {
  // Let's extract host and path
  // Any valid host does not contain "/", and every valid path starts with "/"
  // so just split on that
  const hap = hostandpath.split("/");
  // For valid URLS this MUST return no less than 2 parts
  // host without path
  if (hap.length == 0) {
    return { valid: false, scheme: scheme };
  }
  // At this point, index 0 is the host, and all subsequent index are the path
  // so we can rebuild the path, ensuring a leading "/"
  const host_ = hap[0];
  const host = {
    data: host_,
    valid: false,
    has_port: false,
    wildcard_ok: false,
  };
  // "The path pattern string should not include a port number. Adding a
  // port, ... causes the match pattern to be ignored"
  if (host_.match(/:[0-9]+$/)) {
    host.has_port = true;
  }
  // Host MUST either be "*" or start with "*.". Wildcard cannot be elsewhere
  if (
    host_ == "*" ||
    (host_.startsWith("*.") && !host_.slice(2).match(/\*/)) ||
    !host_.match(/\*/)
  ) {
    host.wildcard_ok = true;
  }
  if (
    host.has_port ||
    !host.wildcard_ok ||
    (host_ != "*" && !host_.match(/.+\..+/))
  ) {
    return {
      valid: false,
      scheme: scheme,
      host,
    };
  }
  host.valid = true;
  if (hap.length == 1) {
    return { valid: false, scheme, host };
  }
  const path_parts = hap.slice(1);
  const path_candidate = `/${path_parts.join("/")}`;
  const path = tryParseFilePath(path_candidate);
  if (!path.valid) {
    return {
      valid: false,
      scheme: scheme,
      host,
      path,
    };
  }
  return {
    valid: true,
    scheme,
    host,
    path,
  };
}

export function patternMatch(pattern: string, url: string): boolean {
  const p = tryParseMatchPattern(pattern);
  const u = URL.parse(url);
  if (!p.valid || !u) {
    return false;
  }

  return (
    patternSchemeMatch(p, u) && patternHostMatch(p, u) && patternPathMatch(p, u)
  );
}

function patternSchemeMatch(pattern: ParsedPattern, url: URL): boolean {
  if (!pattern.scheme) {
    return false;
  }
  const scheme = url.protocol.split(":")[0];
  if (pattern.scheme?.data == "*") {
    return scheme == "http" || scheme == "https";
  } else {
    return scheme == pattern.scheme?.data;
  }
}

function patternHostMatch(pattern: ParsedPattern, url: URL): boolean {
  if (!pattern.host) {
    return false;
  }
  if (pattern.host.data == "*") {
    return true;
  } else if (pattern.host?.data.startsWith("*.")) {
    const baseHost = pattern.host.data.slice(2);
    return url.host.endsWith(baseHost);
  } else {
    return url.host == pattern.host?.data;
  }
}

function patternPathMatch(pattern: ParsedPattern, url: URL): boolean {
  const path = pattern.path?.data.replaceAll("/", "\\/").replaceAll("*", ".*");
  if (!path) {
    return false;
  }

  const r = new RegExp(path);

  return r.test(url.pathname);
}
