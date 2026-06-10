import test from "node:test";
import assert from "node:assert/strict";

import {
  resolveCanonicalLeftNavHydrationState,
  resolveCanonicalLeftNavSnapshotFromView,
  resolveLeftNavModeForSection,
  resetLeftNavHydrationLogsForTests,
} from "./leftNavCanonicalHydration.ts";

test.beforeEach(() => {
  resetLeftNavHydrationLogsForTests();
});

test("dashboard default resolves to executive/dashboard", () => {
  const snapshot = resolveCanonicalLeftNavHydrationState({ preferredRightPanelTab: null });
  assert.equal(snapshot.activeSection, "executive");
  assert.equal(snapshot.activeNavMode, "dashboard");
  assert.equal(snapshot.rightPanelView, null);
});

test("risk panel view resolves to risk nav mode", () => {
  const snapshot = resolveCanonicalLeftNavSnapshotFromView("risk");
  assert.equal(snapshot.activeSection, "risk_flow");
  assert.equal(snapshot.activeNavMode, "risk");
  assert.equal(snapshot.rightPanelView, "risk");
});

test("war_room panel view resolves to war_room nav mode", () => {
  const snapshot = resolveCanonicalLeftNavSnapshotFromView("war_room");
  assert.equal(snapshot.activeSection, "war_room");
  assert.equal(snapshot.activeNavMode, "war_room");
  assert.equal(snapshot.rightPanelView, "war_room");
});

test("studio shell mode resolves to objects section", () => {
  const snapshot = resolveCanonicalLeftNavHydrationState({ shellMode: "studio" });
  assert.equal(snapshot.activeSection, "objects");
});

test("runtime view snapshot matches section mapping", () => {
  const snapshot = resolveCanonicalLeftNavSnapshotFromView("war_room");
  assert.equal(snapshot.activeSection, "war_room");
  assert.equal(snapshot.activeNavMode, "war_room");
  assert.equal(resolveLeftNavModeForSection("risk_flow"), "risk");
});
