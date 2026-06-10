import test from "node:test";
import assert from "node:assert/strict";

import {
  DAILY_READINESS_STATE_LABELS,
  FUTURE_WORKSPACE_SNAPSHOT_SOURCE_SLOTS,
  resetWorkspaceSnapshotBrakesForTests,
} from "./executiveWorkspaceSnapshotContract.ts";
import { WORKSPACE_SNAPSHOT_LEGACY_ISOLATION } from "./executiveWorkspaceSnapshotLegacyFindings.ts";
import { buildExecutiveWorkspaceSnapshotView } from "./executiveWorkspaceSnapshotRuntime.ts";
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
import { resetWorkspaceRecommendationForTests } from "../../workspaces/workspaceRecommendationContract.ts";

test.beforeEach(() => {
  resetWorkspaceSnapshotBrakesForTests();
  resetWorkspaceRecommendationForTests();
  resetWorkspaceLauncherForTests();
  resetExecutiveWorkspaceRegistryRuntimeForTests();
  resetExecutiveWorkspaceLifecycleRuntimeForTests();
  resetExecutiveWorkspaceTransitionControllerRuntimeForTests();
  resetExecutiveWorkspaceTransitionControllerForTests();
  resetExecutiveWorkspaceNavigationHistoryForTests();
  resetExecutiveWorkspaceNavigationHistoryRuntimeForTests();
});

function seedNavigation(to: "analyze" | "war_room"): void {
  initializeExecutiveWorkspaceNavigationHistory();
  const request = requestWorkspaceLaunch({
    source: "workspace_launcher",
    workspaceId: to,
    objectId: "line-1",
    objectName: "Line 1",
  });
  assert.equal(request.approved, true);
  const commit = commitExecutiveWorkspaceTransition(to);
  assert.equal(commit.approved, true);
  recordForwardNavigationAfterCommit({
    originWorkspaceId: commit.previousWorkspaceId,
    targetWorkspaceId: to,
  });
}

test("snapshot view uses executive workspace snapshot source", () => {
  const view = buildExecutiveWorkspaceSnapshotView({ dashboardMode: "overview" });
  assert.equal(view.source, "executive_workspace_snapshot");
  assert.equal(view.cards.length, 4);
  assert.ok(view.readiness);
});

test("ready state when no recommendations or recovery", () => {
  const view = buildExecutiveWorkspaceSnapshotView({ dashboardMode: "overview" });
  assert.equal(view.readiness.state, "ready");
  assert.equal(view.readiness.stateLabel, DAILY_READINESS_STATE_LABELS.ready);
  assert.match(view.readiness.summary, /ready for continued operational review/i);
});

test("attention recommended when recommendations present", () => {
  const view = buildExecutiveWorkspaceSnapshotView({
    dashboardMode: "overview",
    selectedObjectId: "line-1",
    selectedObjectLabel: "Line 1",
    objectSignal: "risk",
    objectImpact: "critical",
  });
  assert.equal(view.readiness.state, "attention_recommended");
  assert.ok(view.readiness.actions.some((action) => action.kind === "review_recommendations"));
});

test("review pending when recoverable sessions exist", () => {
  seedNavigation("analyze");
  seedNavigation("war_room");

  const view = buildExecutiveWorkspaceSnapshotView({
    dashboardMode: "overview",
    selectedObjectId: "line-1",
  });

  assert.equal(view.readiness.state, "review_pending");
  assert.ok(view.readiness.actions.some((action) => action.kind === "resume_session"));
});

test("snapshot cards include active workspace and object context", () => {
  const view = buildExecutiveWorkspaceSnapshotView({
    dashboardMode: "overview",
    selectedObjectId: "node-a",
    selectedObjectLabel: "Supply Chain Node A",
    selectedObjectStatus: "Monitoring",
  });

  const workspace = view.cards.find((card) => card.id === "active_workspace");
  const objectCard = view.cards.find((card) => card.id === "active_object");
  assert.ok(workspace);
  assert.ok(objectCard);
  assert.equal(objectCard.primaryValue, "Supply Chain Node A");
  assert.match(objectCard.detail, /Monitoring/);
});

test("no object shows no active object", () => {
  const view = buildExecutiveWorkspaceSnapshotView({ dashboardMode: "overview" });
  const objectCard = view.cards.find((card) => card.id === "active_object");
  assert.equal(objectCard?.primaryValue, "No Active Object");
});

test("legacy isolation separates summary and briefing", () => {
  assert.equal(WORKSPACE_SNAPSHOT_LEGACY_ISOLATION.executiveSummaryLayer.status, "separate");
  assert.equal(WORKSPACE_SNAPSHOT_LEGACY_ISOLATION.executiveBriefingLayer.status, "separate");
});

test("future snapshot source slots reserved", () => {
  assert.ok(FUTURE_WORKSPACE_SNAPSHOT_SOURCE_SLOTS.includes("operational_intelligence"));
});
