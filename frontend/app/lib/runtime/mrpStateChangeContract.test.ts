import test from "node:test";
import assert from "node:assert/strict";

import {
  buildMrpStateSnapshot,
  isMeaningfulMrpStateChange,
  isMeaningfulWorkspaceCommit,
} from "./mrpStateChangeContract.ts";

test("isMeaningfulMrpStateChange returns false for identical snapshots", () => {
  const snapshot = buildMrpStateSnapshot({
    view: "dashboard",
    tab: "dashboard",
    dashboardContext: "overview",
    dashboardMode: "overview",
    surfaceId: "operational",
    contextId: "obj-1",
    selectedObjectId: "obj-1",
    workspaceId: "ws-1",
  });
  assert.equal(isMeaningfulMrpStateChange(snapshot, snapshot), false);
});

test("isMeaningfulMrpStateChange detects view change", () => {
  const previous = buildMrpStateSnapshot({ view: "dashboard" });
  const next = buildMrpStateSnapshot({ view: "object" });
  assert.equal(isMeaningfulMrpStateChange(previous, next), true);
});

test("isMeaningfulMrpStateChange detects selected object change", () => {
  const previous = buildMrpStateSnapshot({ selectedObjectId: "obj-a" });
  const next = buildMrpStateSnapshot({ selectedObjectId: "obj-b" });
  assert.equal(isMeaningfulMrpStateChange(previous, next), true);
});

test("isMeaningfulMrpStateChange detects workspace switch", () => {
  const previous = buildMrpStateSnapshot({ workspaceId: "ws-a" });
  const next = buildMrpStateSnapshot({ workspaceId: "ws-b" });
  assert.equal(isMeaningfulMrpStateChange(previous, next), true);
});

test("isMeaningfulWorkspaceCommit ignores derived surface metadata", () => {
  const previous = buildMrpStateSnapshot({
    tab: "dashboard",
    dashboardContext: "war_room",
    dashboardMode: "war_room",
    surfaceId: null,
  });
  const next = buildMrpStateSnapshot({
    tab: "dashboard",
    dashboardContext: "war_room",
    dashboardMode: "war_room",
    surfaceId: "war_room",
  });
  assert.equal(isMeaningfulMrpStateChange(previous, next), true);
  assert.equal(isMeaningfulWorkspaceCommit(previous, next), false);
});
