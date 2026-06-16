import test from "node:test";
import assert from "node:assert/strict";

import type { SceneJson } from "../../sceneTypes.ts";
import type { WorkspaceNavigationHistoryEntry } from "../dashboard/executiveWorkspaceNavigationHistoryContract.ts";
import {
  MRP_TIMELINE_VISUAL_TAG,
  TIMELINE_DECISION_HISTORY_COLUMN_LABELS,
  TIMELINE_RECENT_EVENTS_COLUMN_LABELS,
  TIMELINE_SUMMARY_METRIC_LABELS,
} from "./timeline/timelineVisualSurfaceContract.ts";
import { deriveTimelineDecisionHistoryRows } from "./timeline/timelineDecisionHistoryResolver.ts";
import { deriveTimelineRecentEventRows } from "./timeline/timelineRecentEventsResolver.ts";
import { buildTimelineVisualSurfaceFromState } from "./timeline/timelineVisualSurfaceMapper.ts";
import { syncTimelineWorkspaceData } from "./timeline/timelineWorkspaceDataRuntime.ts";
import {
  getTimelineWorkspaceState,
  hydrateTimelineWorkspaceStateOnMount,
  resetTimelineWorkspaceStateRuntimeForTests,
} from "./timeline/timelineWorkspaceStateRuntime.ts";
import { buildTimelineWorkspaceViewFromState } from "./timeline/timelineWorkspaceStateViewMapper.ts";
import { resetTimelineObjectContextRuntimeForTests } from "./timeline/timelineObjectContextRuntime.ts";
import { resetTimelineWorkspaceDataRuntimeForTests } from "./timeline/timelineWorkspaceDataRuntime.ts";

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
    timestamp: now - 120_000,
    originWorkspaceId: "overview",
    targetWorkspaceId: "war_room",
    lifecycleSnapshot: null,
    source: "workspace_navigation_history",
  }),
  Object.freeze({
    workspaceId: "scenario",
    workspaceName: "Scenario",
    transitionType: "forward",
    timestamp: now - 180_000,
    originWorkspaceId: "overview",
    targetWorkspaceId: "scenario",
    lifecycleSnapshot: null,
    source: "workspace_navigation_history",
  }),
]);

const sceneWithTimelineMarkers: SceneJson = {
  scene: {
    objects: [
      {
        id: "a",
        label: "Supplier Node",
        severity: "critical",
        decision_status: "approved",
        updated_at: now - 90_000,
      },
    ],
  },
} as SceneJson;

test("exports MRP timeline visual tag", () => {
  assert.equal(MRP_TIMELINE_VISUAL_TAG, "[MRP_TIMELINE_VISUAL]");
});

test("deriveTimelineRecentEventRows returns time event category rows", () => {
  const rows = deriveTimelineRecentEventRows({
    navigationHistoryEntries: navigationHistory,
    sceneJson: sceneWithTimelineMarkers,
  });
  assert.ok(rows.length >= 3);
  assert.equal(rows[0]?.event, "Opened Analyze Mode");
  assert.equal(rows[0]?.category, "Decision");
  assert.match(rows[0]?.time ?? "", /\d/);
});

test("deriveTimelineDecisionHistoryRows returns decision date status rows", () => {
  const rows = deriveTimelineDecisionHistoryRows({
    navigationHistoryEntries: navigationHistory,
    sceneJson: sceneWithTimelineMarkers,
  });
  assert.ok(rows.length >= 2);
  assert.match(rows[0]?.decision ?? "", /Analyze Mode session|decision checkpoint/);
  assert.match(rows[0]?.date ?? "", /[A-Za-z]/);
  assert.ok(rows[0]?.status);
});

test("visual surface summary exposes total decisions risk and last activity", () => {
  hydrateTimelineWorkspaceStateOnMount("test");
  syncTimelineWorkspaceData({
    navigationHistoryEntries: navigationHistory,
    sceneJson: sceneWithTimelineMarkers,
  });
  const surface = buildTimelineVisualSurfaceFromState(getTimelineWorkspaceState());

  assert.ok(surface.summary.totalEvents > 0);
  assert.ok(surface.summary.decisionsRecorded > 0);
  assert.ok(surface.summary.riskEvents > 0);
  assert.notEqual(surface.summary.lastActivity, "None");
  assert.ok(surface.recentEvents.length > 0);
  assert.ok(surface.decisionHistory.length > 0);
});

test("workspace view includes executive visual surface", () => {
  hydrateTimelineWorkspaceStateOnMount("test");
  syncTimelineWorkspaceData({
    navigationHistoryEntries: navigationHistory,
    sceneJson: sceneWithTimelineMarkers,
  });
  const view = buildTimelineWorkspaceViewFromState(getTimelineWorkspaceState());

  assert.equal(view.visualSurface.summary.totalEvents, getTimelineWorkspaceState().totalEvents);
  assert.ok(view.visualSurface.recentEvents.length > 0);
  assert.ok(view.visualSurface.decisionHistory.length > 0);
});

test("visual surface shows empty messages when no timeline data", () => {
  hydrateTimelineWorkspaceStateOnMount("test");
  syncTimelineWorkspaceData({ sceneJson: null, navigationHistoryEntries: Object.freeze([]) });
  const surface = buildTimelineVisualSurfaceFromState(getTimelineWorkspaceState());

  assert.equal(surface.summary.totalEvents, 0);
  assert.equal(surface.recentEvents.length, 0);
  assert.equal(surface.decisionHistory.length, 0);
  assert.match(surface.recentEventsEmptyMessage ?? "", /No recent timeline events/);
  assert.match(surface.decisionHistoryEmptyMessage ?? "", /No decision history/);
});

test("exports summary and list column labels", () => {
  assert.equal(TIMELINE_SUMMARY_METRIC_LABELS.totalEvents, "Total Events");
  assert.equal(TIMELINE_SUMMARY_METRIC_LABELS.decisionsRecorded, "Decisions Recorded");
  assert.equal(TIMELINE_SUMMARY_METRIC_LABELS.riskEvents, "Risk Events");
  assert.equal(TIMELINE_SUMMARY_METRIC_LABELS.lastActivity, "Last Activity");
  assert.equal(TIMELINE_RECENT_EVENTS_COLUMN_LABELS.time, "Time");
  assert.equal(TIMELINE_RECENT_EVENTS_COLUMN_LABELS.event, "Event");
  assert.equal(TIMELINE_RECENT_EVENTS_COLUMN_LABELS.category, "Category");
  assert.equal(TIMELINE_DECISION_HISTORY_COLUMN_LABELS.decision, "Decision");
  assert.equal(TIMELINE_DECISION_HISTORY_COLUMN_LABELS.date, "Date");
  assert.equal(TIMELINE_DECISION_HISTORY_COLUMN_LABELS.status, "Status");
});
