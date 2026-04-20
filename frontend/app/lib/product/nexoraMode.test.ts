/**
 * B.24 — operator mode helpers.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { modeToBiasEnabled, parseNexoraMode } from "./nexoraMode.ts";

test("modeToBiasEnabled", () => {
  assert.equal(modeToBiasEnabled("adaptive"), true);
  assert.equal(modeToBiasEnabled("pure"), false);
});

test("parseNexoraMode", () => {
  assert.equal(parseNexoraMode("pure"), "pure");
  assert.equal(parseNexoraMode("ADAPTIVE"), "adaptive");
  assert.equal(parseNexoraMode("nope"), null);
});
