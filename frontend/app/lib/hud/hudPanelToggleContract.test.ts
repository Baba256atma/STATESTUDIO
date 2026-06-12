import test from "node:test";
import assert from "node:assert/strict";

import {
  HUD_TOGGLE_BUTTON_RADIUS,
  HUD_TOGGLE_BUTTON_SIZE,
  resetHudPanelToggleContractForTests,
  resolveHudPanelToggleIcon,
  resolveHudPanelToggleState,
  traceNexoraHudToggle,
} from "./hudPanelToggleContract.ts";

test.beforeEach(() => {
  resetHudPanelToggleContractForTests();
});

test("toggle icon contract uses down for expanded and up for collapsed", () => {
  assert.equal(resolveHudPanelToggleIcon(true), "▼");
  assert.equal(resolveHudPanelToggleIcon(false), "▲");
});

test("toggle state maps expanded boolean to runtime state", () => {
  assert.equal(resolveHudPanelToggleState(true), "expanded");
  assert.equal(resolveHudPanelToggleState(false), "collapsed");
});

test("toggle sizing tokens match unified HUD contract", () => {
  assert.equal(HUD_TOGGLE_BUTTON_SIZE, 28);
  assert.equal(HUD_TOGGLE_BUTTON_RADIUS, 6);
});

test("traceNexoraHudToggle logs shared contract per panel and state", () => {
  const logs: string[] = [];
  const original = globalThis.console?.log;
  globalThis.console.log = (message?: unknown) => {
    logs.push(String(message ?? ""));
  };
  try {
    traceNexoraHudToggle("scene", true);
    traceNexoraHudToggle("scene", true);
    traceNexoraHudToggle("object", false);
    traceNexoraHudToggle("timeline", true);
    assert.equal(logs.length, 3);
    assert.match(logs[0] ?? "", /panel=scene shared=true state=expanded/);
    assert.match(logs[1] ?? "", /panel=object shared=true state=collapsed/);
    assert.match(logs[2] ?? "", /panel=timeline shared=true state=expanded/);
  } finally {
    globalThis.console.log = original;
  }
});
