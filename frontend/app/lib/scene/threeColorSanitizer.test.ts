import test from "node:test";
import assert from "node:assert/strict";

import { sanitizeThreeColor, NEXORA_THREE_COLOR_TOKENS } from "./threeColorSanitizer.ts";
import { logThreeColorBrake, resetThreeColorBrakeLogsForTests } from "./threeColorDevLog.ts";

test.beforeEach(() => {
  resetThreeColorBrakeLogsForTests();
});

test("sanitizeThreeColor returns fallback for non-string input", () => {
  assert.equal(sanitizeThreeColor(null), "#94a3b8");
  assert.equal(sanitizeThreeColor(undefined, "#111111"), "#111111");
});

test("sanitizeThreeColor allows hex colors", () => {
  assert.equal(sanitizeThreeColor("#abc"), "#abc");
  assert.equal(sanitizeThreeColor("#aabbcc"), "#aabbcc");
  assert.equal(sanitizeThreeColor("#aabbccdd"), "#aabbccdd");
});

test("sanitizeThreeColor maps Nexora CSS token variables to hex", () => {
  assert.equal(sanitizeThreeColor("var(--nx-risk)"), "#ef4444");
  assert.equal(sanitizeThreeColor("var(--nx-accent-ink)"), "#93c5fd");
});

test("sanitizeThreeColor allows named CSS colors supported by THREE", () => {
  assert.equal(sanitizeThreeColor("white"), "white");
  assert.equal(sanitizeThreeColor("red"), "red");
});

test("sanitizeThreeColor blocks CSS functions and variables with fallback", () => {
  const colorMix = "color-mix(in srgb, var(--nx-accent-ink) 45%, transparent)";
  assert.equal(sanitizeThreeColor(colorMix), "#94a3b8");
  assert.equal(sanitizeThreeColor("rgba(10, 20, 30, 0.5)"), "#94a3b8");
  assert.equal(sanitizeThreeColor("rgb(10, 20, 30)"), "#94a3b8");
});

test("logThreeColorBrake logs once per color signature", () => {
  resetThreeColorBrakeLogsForTests();
  const uniqueColor = "color-mix(in srgb, var(--nx-warning) 30%, transparent)";
  const warnings: string[] = [];
  const originalWarn = globalThis.console.warn;
  globalThis.console.warn = (message?: unknown) => {
    warnings.push(String(message));
  };

  try {
    logThreeColorBrake(uniqueColor);
    logThreeColorBrake(uniqueColor);
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /\[ThreeColor\]\[Brake\] Invalid Three.js color sanitized:/);
  } finally {
    globalThis.console.warn = originalWarn;
  }
});

test("NEXORA_THREE_COLOR_TOKENS exports required mappings", () => {
  assert.deepEqual(Object.keys(NEXORA_THREE_COLOR_TOKENS), [
    "var(--nx-risk)",
    "var(--nx-success)",
    "var(--nx-warning)",
    "var(--nx-accent)",
    "var(--nx-accent-ink)",
    "var(--nx-muted)",
  ]);
});
