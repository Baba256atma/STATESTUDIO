import test from "node:test";
import assert from "node:assert/strict";

import type { WorkspaceNavigationHistoryEntry } from "../../dashboard/executiveWorkspaceNavigationHistoryContract.ts";
import { MRP_TIMELINE_STATE_TAG } from "./timeline/timelineWorkspaceMetricsContract.ts";
import { resetTimelineObjectContextRuntimeForTests } from "./timeline/timelineObjectContextRuntime.ts";
import {
  buildTimelineWorkspaceMetricsSignature,
  deriveTimelineWorkspaceMetrics,
} from "./timeline/timelineWorkspaceMetricsResolver.ts";
import {
  resetTimelineWorkspaceDataRuntimeForTests,
  syncTimelineWorkspaceData,
} from "./timeline/timelineWorkspaceDataRuntime.ts";
import {
  getTimelineWorkspaceState,
  getTimelineWorkspaceStatePublishCountForTests,
  hydrateTimelineWorkspaceStateOnMount,
  publishTimelineWorkspaceState,
  resetTimelineWorkspaceStateRuntimeForTests,
} from "./timeline/timelineWorkspaceStateRuntime.ts";
import { buildTimelineWorkspaceViewFromState } from "./timeline/timelineWorkspaceStateViewMapper.ts";
import type { SceneJson } from "../../sceneTypes.ts";

test.beforeEach(() => {
  resetTimelineObjectContextRuntimeForTests();
  resetTimelineWorkspaceDataRuntimeForTests();
  resetTimelineWorkspaceStateRuntimeForTests();
});

const now = Date.now();

const navigationHistory: readonly WorkspaceNavigationHistoryEntry[] = Object.freeze([
  Object.freeze({
    workspaceId: "analyze",
    workspaceName: "Analyze",
    transitionType: "forward",
    timestamp: now - 60_000,
    originWorkspaceId: "overview",
    targetWorkspaceId: "analyze",
    lifecycleSnapshot: null,
    source: "workspace_navigation_history",
  }),
  Object.freeze({
    workspaceId: "war_room",
    workspaceName: "War Room",
    transitionType: "forward",
    timestamp: now - 3_600_000,
    originWorkspaceId: "overview",
    targetWorkspaceId: "war_room",
    lifecycleSnapshot: null,
    source: "workspace_navigation_history",
  }),
  Object.freeze({
    workspaceId: "scenario",
    workspaceName: "Scenario",
    transitionType: "forward",
    timestamp: now - 90_000_000,
    originWorkspaceId: "overview",
    targetWorkspaceId: "scenario",
    lifecycleSnapshot: null,
    source: "workspace_navigation_history",
  }),
]);

const sceneWithMarkers: SceneJson = {
  scene: {
    objects: [
      { id: "a", type: "Supply", severity: "critical", status: "active" },
      { id: "b", type: "Finance", decision_status: "approved", updated_at: now - 120_000 },
    ],
  },
} as SceneJson;

test("deriveTimelineWorkspaceMetrics counts navigation and scene timeline markers", () => {
  const metrics = deriveTimelineWorkspaceMetrics({
    selectedObjectId: "a",
    navigationHistoryEntries: navigationHistory,
    sceneJson: sceneWithMarkers,
  });

  assert.equal(metrics.selectedObjectId, "a");
  assert.equal(metrics.totalEvents, 5);
  assert.equal(metrics.recentEventCount, 3);
  assert.equal(metrics.decisionEventCount, 3);
  assert.equal(metrics.riskEventCount, 2);
  assert.ok(metrics.lastEventAt > 0);
});

test("syncTimelineWorkspaceData publishes canonical metrics once", () => {
  hydrateTimelineWorkspaceStateOnMount("test");
  const before = getTimelineWorkspaceStatePublishCountForTests();

  syncTimelineWorkspaceData({
    selectedObjectId: "a",
    navigationHistoryEntries: navigationHistory,
    sceneJson: sceneWithMarkers,
  });

  const state = getTimelineWorkspaceState();
  assert.equal(state.totalEvents, 5);
  assert.equal(state.selectedObjectId, "a");
  assert.equal(state.recentEventCount, 3);
  assert.ok(state.lastEventAt > 0);
  assert.equal(getTimelineWorkspaceStatePublishCountForTests(), before + 1);
});

test("syncTimelineWorkspaceData dedupes identical metrics signatures", () => {
  hydrateTimelineWorkspaceStateOnMount("test");
  syncTimelineWorkspaceData({
    selectedObjectId: "a",
    navigationHistoryEntries: navigationHistory,
    sceneJson: sceneWithMarkers,
  });
  const revisionAfterFirst = getTimelineWorkspaceState().revision;
  const publishAfterFirst = getTimelineWorkspaceStatePublishCountForTests();

  syncTimelineWorkspaceData({
    selectedObjectId: "a",
    navigationHistoryEntries: navigationHistory,
    sceneJson: sceneWithMarkers,
  });
  syncTimelineWorkspaceData({
    selectedObjectId: "a",
    navigationHistoryEntries: navigationHistory,
    sceneJson: sceneWithMarkers,
  });

  assert.equal(getTimelineWorkspaceState().revision, revisionAfterFirst);
  assert.equal(getTimelineWorkspaceStatePublishCountForTests(), publishAfterFirst);
});

test("selection changes update selectedObjectId without duplicate metric writes", () => {
  hydrateTimelineWorkspaceStateOnMount("test");
  syncTimelineWorkspaceData({
    selectedObjectId: "a",
    navigationHistoryEntries: navigationHistory,
    sceneJson: sceneWithMarkers,
  });
  const publishAfterFirst = getTimelineWorkspaceStatePublishCountForTests();

  syncTimelineWorkspaceData({
    selectedObjectId: "b",
    navigationHistoryEntries: navigationHistory,
    sceneJson: sceneWithMarkers,
  });

  const state = getTimelineWorkspaceState();
  assert.equal(state.selectedObjectId, "b");
  assert.equal(state.totalEvents, 5);
  assert.equal(getTimelineWorkspaceStatePublishCountForTests(), publishAfterFirst + 1);
});

test("publishTimelineWorkspaceState guards render loops", () => {
  hydrateTimelineWorkspaceStateOnMount("test");
  let guarded = 0;

  for (let index = 0; index < 40; index += 1) {
    const result = publishTimelineWorkspaceState({
      totalEvents: index,
      selectedObjectId: `obj-${index}`,
      lastEventAt: Date.now(),
    });
    if (result.guarded) guarded += 1;
  }

  assert.ok(guarded > 0);
});

test("view mapper surfaces derived metrics in ready phase", () => {
  hydrateTimelineWorkspaceStateOnMount("test");
  syncTimelineWorkspaceData({
    selectedObjectId: "a",
    navigationHistoryEntries: navigationHistory,
    sceneJson: sceneWithMarkers,
  });
  const view = buildTimelineWorkspaceViewFromState(getTimelineWorkspaceState());
  const summary = view.cards.find((card) => card.id === "timeline_summary");

  assert.match(summary?.headline ?? "", /5 tracked timeline events/);
  assert.match(summary?.detail ?? "", /3 recent/);
});

test("exports MRP timeline state tag", () => {
  assert.equal(MRP_TIMELINE_STATE_TAG, "[MRP_TIMELINE_STATE]");
});

test("metrics signature is stable for identical derived values", () => {
  const sigA = buildTimelineWorkspaceMetricsSignature({
    selectedObjectId: "a",
    totalEvents: 5,
    recentEventCount: 3,
    decisionEventCount: 3,
    riskEventCount: 2,
    lastEventAt: 100,
  });
  const sigB = buildTimelineWorkspaceMetricsSignature({
    selectedObjectId: "a",
    totalEvents: 5,
    recentEventCount: 3,
    decisionEventCount: 3,
    riskEventCount: 2,
    lastEventAt: 100,
  });
  assert.equal(sigA, sigB);
});
