import test from "node:test";
import assert from "node:assert/strict";

import {
  auditTopologyConnectionHighlight,
  collectTopologyConnectionObjectIds,
  isTopologyLineRelatedToSelectedObject,
  resolveTopologyLineVisualState,
} from "./topologyConnectionHighlight.ts";
import { buildTopologyConnectionLineId } from "./topologyConnectionResolver.ts";
import { resetTopologyConnectionHighlightBrakeLogsForTests } from "./topologyConnectionHighlightDevLog.ts";

const line = { sourceId: "hub", targetId: "sat-a" };
const lineId = buildTopologyConnectionLineId("hub", "sat-a");

test.beforeEach(() => {
  resetTopologyConnectionHighlightBrakeLogsForTests();
});

test("isTopologyLineRelatedToSelectedObject matches source or target only", () => {
  assert.equal(
    isTopologyLineRelatedToSelectedObject({ line, selectedObjectId: "hub" }),
    true
  );
  assert.equal(
    isTopologyLineRelatedToSelectedObject({ line, selectedObjectId: "sat-a" }),
    true
  );
  assert.equal(
    isTopologyLineRelatedToSelectedObject({ line, selectedObjectId: "other" }),
    false
  );
  assert.equal(
    isTopologyLineRelatedToSelectedObject({ line, selectedObjectId: null }),
    false
  );
});

test("resolveTopologyLineVisualState returns dim without selection", () => {
  assert.equal(resolveTopologyLineVisualState({ line, selectedObjectId: null }), "dim");
});

test("hub selection activates all hub lines only", () => {
  const lines = [
    { id: buildTopologyConnectionLineId("hub", "a"), sourceId: "hub", targetId: "a", valid: true },
    { id: buildTopologyConnectionLineId("hub", "b"), sourceId: "hub", targetId: "b", valid: true },
  ];
  const states = lines.map((entry) =>
    resolveTopologyLineVisualState({ line: entry, selectedObjectId: "hub" })
  );
  assert.deepEqual(states, ["active", "active"]);
  assert.equal(
    resolveTopologyLineVisualState({ line: lines[0]!, selectedObjectId: "a" }),
    "active"
  );
  assert.equal(
    resolveTopologyLineVisualState({ line: lines[1]!, selectedObjectId: "a" }),
    "dim"
  );
});

test("flow middle object activates previous and next lines only", () => {
  const prev = {
    id: buildTopologyConnectionLineId("a", "b"),
    sourceId: "a",
    targetId: "b",
    valid: true,
  };
  const next = {
    id: buildTopologyConnectionLineId("b", "c"),
    sourceId: "b",
    targetId: "c",
    valid: true,
  };
  assert.equal(
    resolveTopologyLineVisualState({ line: prev, selectedObjectId: "b" }),
    "active"
  );
  assert.equal(
    resolveTopologyLineVisualState({ line: next, selectedObjectId: "b" }),
    "active"
  );
  assert.equal(
    resolveTopologyLineVisualState({ line: prev, selectedObjectId: "c" }),
    "dim"
  );
});

test("auditTopologyConnectionHighlight skips idle states", () => {
  assert.doesNotThrow(() =>
    auditTopologyConnectionHighlight({
      lines: [],
      selectedObjectId: null,
      visible: false,
    })
  );
  assert.doesNotThrow(() =>
    auditTopologyConnectionHighlight({
      lines: [],
      selectedObjectId: "hub",
      visible: true,
      topologyEnabled: true,
    })
  );
});

test("auditTopologyConnectionHighlight warns for unknown selected id", () => {
  const warned: string[] = [];
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    warned.push(args.map(String).join(" "));
  };
  try {
    auditTopologyConnectionHighlight({
      lines: [{ id: lineId, sourceId: "hub", targetId: "sat-a", valid: true }],
      selectedObjectId: "missing",
      visible: true,
      topologyEnabled: true,
    });
  } finally {
    console.warn = originalWarn;
  }
  assert.equal(
    warned.some((message) => message.includes("does not exist in topology positions")),
    true
  );
});

test("collectTopologyConnectionObjectIds gathers endpoint ids", () => {
  const ids = collectTopologyConnectionObjectIds([
    { sourceId: "a", targetId: "b", valid: true },
    { sourceId: "b", targetId: "c", valid: false },
  ]);
  assert.deepEqual([...ids].sort(), ["a", "b"]);
});
