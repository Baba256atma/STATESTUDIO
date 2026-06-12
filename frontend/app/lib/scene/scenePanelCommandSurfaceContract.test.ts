import test from "node:test";
import assert from "node:assert/strict";

import {
  resolveSceneCommandStripInnerWidth,
  resolveScenePanelCollapsedHeight,
  resetScenePanelCommandSurfaceForTests,
  SCENE_PANEL_ACTION_BUTTON_COUNT,
  SCENE_PANEL_ACTION_BUTTON_MIN_WIDTH,
  traceSceneCommandStrip,
  traceScenePanelCommandSurface,
} from "./scenePanelCommandSurfaceContract.ts";
import {
  SCENE_PANEL_MINIMIZED_HEIGHT,
  SCENE_PANEL_WIDTH,
  resolveScenePanelZoneHeight,
  resetScenePanelWidthContractForTests,
} from "./scenePanelWidthContract.ts";

test.beforeEach(() => {
  resetScenePanelCommandSurfaceForTests();
  resetScenePanelWidthContractForTests();
});

test("collapsed scene panel height uses single horizontal command row", () => {
  const collapsedHeight = resolveScenePanelCollapsedHeight();
  assert.equal(collapsedHeight, 84);
  assert.equal(SCENE_PANEL_MINIMIZED_HEIGHT, collapsedHeight);
  assert.equal(
    resolveScenePanelZoneHeight({ timelineTop: 700, minimized: true, zoneGap: 8 }),
    collapsedHeight
  );
});

test("three compact labels fit within fixed scene panel inner width", () => {
  const innerWidth = resolveSceneCommandStripInnerWidth();
  const minimumStripWidth =
    SCENE_PANEL_ACTION_BUTTON_COUNT * SCENE_PANEL_ACTION_BUTTON_MIN_WIDTH +
    (SCENE_PANEL_ACTION_BUTTON_COUNT - 1) * 8;
  assert.equal(innerWidth, SCENE_PANEL_WIDTH - 24);
  assert.ok(minimumStripWidth <= innerWidth);
});

test("traceSceneCommandStrip logs horizontal single-row contract", () => {
  const logs: string[] = [];
  const original = globalThis.console?.log;
  globalThis.console.log = (message?: unknown) => {
    logs.push(String(message ?? ""));
  };
  try {
    traceSceneCommandStrip();
    traceSceneCommandStrip();
    assert.equal(logs.length, 1);
    assert.match(logs[0] ?? "", /layout=horizontal/);
    assert.match(logs[0] ?? "", /rows=1/);
    assert.match(logs[0] ?? "", /wrap=false/);
    assert.match(logs[0] ?? "", /buttonCount=3/);
  } finally {
    globalThis.console.log = original;
  }
});

test("traceScenePanelCommandSurface logs always-visible contract", () => {
  const logs: string[] = [];
  const original = globalThis.console?.log;
  globalThis.console.log = (message?: unknown) => {
    logs.push(String(message ?? ""));
  };
  try {
    traceScenePanelCommandSurface();
    traceScenePanelCommandSurface();
    assert.equal(logs.length, 1);
    assert.match(logs[0] ?? "", /alwaysVisible=true/);
    assert.match(logs[0] ?? "", /collapsedActionsVisible=true/);
    assert.match(logs[0] ?? "", /expandedActionsVisible=true/);
  } finally {
    globalThis.console.log = original;
  }
});
