import { patternMatch } from "@/lib/validator";

export function randomItemFrom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function getOrdinal(n: number) {
  let suffix = "th";
  if (n % 10 == 1 && n % 100 != 11) {
    suffix = "st";
  } else if (n % 10 == 2 && n % 100 != 12) {
    suffix = "nd";
  } else if (n % 10 == 3 && n % 100 != 13) {
    suffix = "rd";
  }
  return n + suffix;
}

export function findPattern(patterns: string[]) {
  // Determine the pattern that caused this script to be injected
  const possiblePatterns = patterns.filter((p) =>
    patternMatch(p, window.location.toString()),
  );
  if (!possiblePatterns) {
    return null;
  }

  // TODO: MUST the most specific pattern the longest pattern?
  possiblePatterns.sort((a: string, b: string) => {
    return b.length - a.length;
  });
  return possiblePatterns[0];
}

export function isChrome(): boolean {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const vendor = window.navigator.vendor.toLowerCase();
  return (
    /chrome/.test(userAgent) && /google inc/.test(vendor) && !("opr" in window)
  );
}
