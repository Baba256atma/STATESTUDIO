import test from "node:test";
import assert from "node:assert/strict";

import {
  EXECUTIVE_ACTIVITY_TIMELINE_MAX_DISPLAY,
  FUTURE_EXECUTIVE_ACTIVITY_SOURCE_SLOTS,
  resetExecutiveContinuityBrakesForTests,
} from "./executiveContinuityContract.ts";
import {
  EXECUTIVE_CONTINUITY_APPROVED_DESTINATIONS,
  EXECUTIVE_CONTINUITY_LEGACY_ISOLATION,
} from "./executiveContinuityLegacyFindings.ts";
import {
  buildExecutiveActivityTimelineView,
  resolveExecutiveActivityWorkspaceEntry,
} from "./executiveContinuityRuntime.ts";
import { resetExecutiveWorkspaceRegistryRuntimeForTests } from "../executiveWorkspaceRegistryRuntime.ts";
import { resetExecutiveWorkspaceLifecycleRuntimeForTests } from "../executiveWorkspaceLifecycleRuntime.ts";
import { resetExecutiveWorkspaceTransitionControllerRuntimeForTests } from "../executiveWorkspaceTransitionControllerRuntime.ts";
import {
  resetExecutiveWorkspaceNavigationHistoryForTests,
} from "../executiveWorkspaceNavigationHistoryContract.ts";
import {
  initializeExecutiveWorkspaceNavigationHistory,
  recordForwardNavigationAfterCommit,
  resetExecutiveWorkspaceNavigationHistoryRuntimeForTests,
} from "../executiveWorkspaceNavigationHistoryRuntime.ts";
import {
  commitExecutiveWorkspaceTransition,
} from "../executiveWorkspaceTransitionControllerRuntime.ts";
import {
  resetExecutiveWorkspaceTransitionControllerForTests,
} from "../executiveWorkspaceTransitionControllerContract.ts";
import { requestWorkspaceLaunch } from "../workspaceLauncher/workspaceLauncherRuntime.ts";
import { resetWorkspaceLauncherForTests } from "../workspaceLauncher/workspaceLauncherContract.ts";

test.beforeEach(() => {
  resetExecutiveContinuityBrakesForTests();
  resetWorkspaceLauncherForTests();
  resetExecutiveWorkspaceRegistryRuntimeForTests();
  resetExecutiveWorkspaceLifecycleRuntimeForTests();
  resetExecutiveWorkspaceTransitionControllerRuntimeForTests();
  resetExecutiveWorkspaceTransitionControllerForTests();
  resetExecutiveWorkspaceNavigationHistoryForTests();
  resetExecutiveWorkspaceNavigationHistoryRuntimeForTests();
});

function seedNavigation(to: "analyze" | "compare" | "scenario" | "war_room"): void {
  initializeExecutiveWorkspaceNavigationHistory();
  const request = requestWorkspaceLaunch({
    source: "workspace_launcher",
    workspaceId: to,
    objectId: "line-1",
    objectName: "Production Line A",
  });
  assert.equal(request.approved, true, to);
  const commit = commitExecutiveWorkspaceTransition(to);
  assert.equal(commit.approved, true);
  recordForwardNavigationAfterCommit({
    originWorkspaceId: commit.previousWorkspaceId,
    targetWorkspaceId: to,
  });
}

test("timeline view uses executive continuity source", () => {
  const view = buildExecutiveActivityTimelineView({});
  assert.equal(view.source, "executive_continuity_layer");
  assert.ok(view.continuity);
  assert.ok(Array.isArray(view.entries));
});

test("empty timeline shows professional continuity and empty state narrative", () => {
  const view = buildExecutiveActivityTimelineView({});
  assert.equal(view.continuity.isEmpty, true);
  assert.equal(view.entries.length, 0);
  assert.match(view.continuity.narrative, /No recent activity available/i);
});

test("navigation history projects reverse chronological entries", () => {
  seedNavigation("analyze");
  seedNavigation("war_room");

  const view = buildExecutiveActivityTimelineView({
    activeWorkspaceId: "overview",
    selectedObjectId: "line-1",
    selectedObjectLabel: "Production Line A",
  });

  assert.ok(view.entries.length >= 2);
  assert.ok(view.entries.length <= EXECUTIVE_ACTIVITY_TIMELINE_MAX_DISPLAY);
  assert.equal(view.entries[0]?.relatedWorkspaceId, "war_room");
  assert.match(view.entries[0]?.title ?? "", /War Room/i);
  assert.equal(view.continuity.isEmpty, false);
});

test("activity categories stay within approved set", () => {
  seedNavigation("analyze");
  seedNavigation("scenario");

  const view = buildExecutiveActivityTimelineView({
    selectedObjectId: "line-1",
  });

  const allowed = new Set(["navigation", "workspace", "object", "recommendation", "scenario", "war_room"]);
  for (const entry of view.entries) {
    assert.ok(allowed.has(entry.activityCategory));
    assert.equal(entry.source, "workspace_navigation_history");
  }
});

test("continuity summary remains factual without inference", () => {
  seedNavigation("analyze");
  seedNavigation("compare");

  const view = buildExecutiveActivityTimelineView({ activeWorkspaceId: "overview" });
  assert.match(view.continuity.narrative, /recent activity/i);
  assert.doesNotMatch(view.continuity.narrative, /concerned|risk assessment|you appear/i);
});

test("analyze entry uses executive title and timestamp label", () => {
  seedNavigation("analyze");

  const view = buildExecutiveActivityTimelineView({});
  const analyzeEntry = view.entries.find((entry) => entry.relatedWorkspaceId === "analyze");
  assert.ok(analyzeEntry);
  assert.equal(analyzeEntry.title, "Opened Analyze Mode");
  assert.match(analyzeEntry.timestampLabel, /·/);
});

test("legacy isolation documents scene timeline separation", () => {
  assert.equal(EXECUTIVE_CONTINUITY_LEGACY_ISOLATION.sceneTimeline.status, "isolated");
  assert.equal(EXECUTIVE_CONTINUITY_LEGACY_ISOLATION.approvedSources.navigationHistory.status, "approved");
  assert.ok(EXECUTIVE_CONTINUITY_APPROVED_DESTINATIONS.includes("analyze"));
});

test("future activity source slots reserved", () => {
  assert.ok(FUTURE_EXECUTIVE_ACTIVITY_SOURCE_SLOTS.includes("simulation_sessions"));
  assert.ok(FUTURE_EXECUTIVE_ACTIVITY_SOURCE_SLOTS.includes("advisory_events"));
});

test("resolveExecutiveActivityWorkspaceEntry reads registry", () => {
  const entry = resolveExecutiveActivityWorkspaceEntry("analyze");
  assert.equal(entry.name, "Analyze");
  assert.equal(entry.dashboardMode, "analyze");
});
