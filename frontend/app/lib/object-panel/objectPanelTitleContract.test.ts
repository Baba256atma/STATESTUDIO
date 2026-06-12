import test from "node:test";
import assert from "node:assert/strict";

import {
  formatObjectPanelTitle,
  OBJECT_PANEL_NO_SELECTION_LABEL,
  resetObjectPanelTitleContractForTests,
  traceObjectPanelTitleIdentity,
} from "./objectPanelTitleContract.ts";

test.beforeEach(() => {
  resetObjectPanelTitleContractForTests();
});

test("formatObjectPanelTitle prefixes selected object name", () => {
  assert.equal(formatObjectPanelTitle("Sales"), "OBJECT : Sales");
  assert.equal(formatObjectPanelTitle("Customer"), "OBJECT : Customer");
  assert.equal(formatObjectPanelTitle("  Operations  "), "OBJECT : Operations");
});

test("formatObjectPanelTitle uses no-selection label when name missing", () => {
  assert.equal(formatObjectPanelTitle(null), `OBJECT : ${OBJECT_PANEL_NO_SELECTION_LABEL}`);
  assert.equal(formatObjectPanelTitle(""), `OBJECT : ${OBJECT_PANEL_NO_SELECTION_LABEL}`);
  assert.equal(formatObjectPanelTitle("   "), `OBJECT : ${OBJECT_PANEL_NO_SELECTION_LABEL}`);
});

test("traceObjectPanelTitleIdentity logs formatted title once per identity", () => {
  const logs: string[] = [];
  const original = globalThis.console?.log;
  globalThis.console.log = (message?: unknown) => {
    logs.push(String(message ?? ""));
  };
  try {
    traceObjectPanelTitleIdentity("Delivery");
    traceObjectPanelTitleIdentity("Delivery");
    assert.equal(logs.length, 1);
    assert.match(logs[0] ?? "", /title=OBJECT : Delivery/);
  } finally {
    globalThis.console.log = original;
  }
});
