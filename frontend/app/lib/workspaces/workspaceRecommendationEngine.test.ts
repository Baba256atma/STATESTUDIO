import test from "node:test";
import assert from "node:assert/strict";

import { evaluateWorkspaceRecommendations } from "./workspaceRecommendationEngine.ts";
import { resetWorkspaceRecommendationForTests } from "./workspaceRecommendationContract.ts";
import { resetExecutiveWorkspaceRegistryRuntimeForTests } from "../dashboard/executiveWorkspaceRegistryRuntime.ts";
import { resetExecutiveWorkspaceLifecycleRuntimeForTests } from "../dashboard/executiveWorkspaceLifecycleRuntime.ts";
import { resetExecutiveWorkspaceTransitionControllerRuntimeForTests } from "../dashboard/executiveWorkspaceTransitionControllerRuntime.ts";
import {
  resetExecutiveWorkspaceNavigationHistoryForTests,
} from "../dashboard/executiveWorkspaceNavigationHistoryContract.ts";
import {
  initializeExecutiveWorkspaceNavigationHistory,
  recordForwardNavigationAfterCommit,
  resetExecutiveWorkspaceNavigationHistoryRuntimeForTests,
} from "../dashboard/executiveWorkspaceNavigationHistoryRuntime.ts";
import {
  commitExecutiveWorkspaceTransition,
  requestExecutiveWorkspaceTransition,
} from "../dashboard/executiveWorkspaceTransitionControllerRuntime.ts";

test.beforeEach(() => {
  resetWorkspaceRecommendationForTests();
  resetExecutiveWorkspaceRegistryRuntimeForTests();
  resetExecutiveWorkspaceLifecycleRuntimeForTests();
  resetExecutiveWorkspaceTransitionControllerRuntimeForTests();
  resetExecutiveWorkspaceNavigationHistoryForTests();
  resetExecutiveWorkspaceNavigationHistoryRuntimeForTests();
});

function activateWorkspace(workspace: "analyze" | "compare" | "scenario" | "war_room"): void {
  initializeExecutiveWorkspaceNavigationHistory();
  const request = requestExecutiveWorkspaceTransition({
    targetWorkspaceId: workspace,
    source: "dashboard_direct",
  });
  assert.equal(request.approved, true);
  const commit = commitExecutiveWorkspaceTransition(workspace);
  assert.equal(commit.approved, true);
  recordForwardNavigationAfterCommit({
    originWorkspaceId: commit.previousWorkspaceId,
    targetWorkspaceId: workspace,
  });
}

test("no selection: minimal or recent workspace guidance", () => {
  const state = evaluateWorkspaceRecommendations({});
  assert.ok(state.recommendations.length <= 6);
  assert.equal(state.source, "workspace_recommendation_engine");
});

test("object selected: recommends analyze and focus", () => {
  const state = evaluateWorkspaceRecommendations({
    selectedObjectId: "line-3",
    selectedObjectLabel: "Line 3",
    objectSignal: "general",
  });

  const ids = state.recommendations.map((card) => card.suggestedWorkspaceId);
  assert.ok(ids.includes("analyze"));
  assert.ok(state.recommendations.every((card) => card.launchable));
});

test("risk selected: recommends analyze and war room with priority ranking", () => {
  const state = evaluateWorkspaceRecommendations({
    selectedObjectId: "risk-node-1",
    selectedObjectLabel: "Risk Node",
    objectSignal: "risk",
    objectImpact: "high",
  });

  const ids = state.recommendations.map((card) => card.suggestedWorkspaceId);
  assert.ok(ids.includes("analyze"));
  assert.ok(ids.includes("war_room"));
  assert.equal(state.recommendations[0]?.priority, "critical");
});

test("scenario conflict: recommends compare and war room", () => {
  const state = evaluateWorkspaceRecommendations({
    selectedObjectId: "scenario-a",
    scenarioConflict: true,
  });

  const ids = state.recommendations.map((card) => card.suggestedWorkspaceId);
  assert.ok(ids.includes("compare"));
  assert.ok(ids.includes("war_room"));
});

test("timeline anomaly: recommends analyze and scenario", () => {
  const state = evaluateWorkspaceRecommendations({
    selectedObjectId: "event-1",
    timelineAnomaly: true,
  });

  const ids = state.recommendations.map((card) => card.suggestedWorkspaceId);
  assert.ok(ids.includes("analyze"));
  assert.ok(ids.includes("scenario"));
});

test("filters currently active workspace from recommendations", () => {
  activateWorkspace("analyze");

  const state = evaluateWorkspaceRecommendations({
    selectedObjectId: "line-1",
    objectSignal: "risk",
    objectImpact: "critical",
    activeWorkspaceId: "analyze",
  });

  assert.ok(!state.recommendations.some((card) => card.suggestedWorkspaceId === "analyze"));
});

test("kpi decline: recommends analyze and scenario", () => {
  const state = evaluateWorkspaceRecommendations({
    selectedObjectId: "kpi-1",
    kpiDecline: true,
  });

  const ids = state.recommendations.map((card) => card.suggestedWorkspaceId);
  assert.ok(ids.includes("analyze"));
  assert.ok(ids.includes("scenario"));
});

test("low confidence: prioritizes analyze", () => {
  const state = evaluateWorkspaceRecommendations({
    selectedObjectId: "obj-1",
    objectConfidence: 0.3,
  });

  assert.ok(state.recommendations.some((card) => card.suggestedWorkspaceId === "analyze"));
});

test("deduplicates recommendations per workspace", () => {
  const state = evaluateWorkspaceRecommendations({
    selectedObjectId: "risk-1",
    objectSignal: "risk",
    objectImpact: "critical",
    kpiDecline: true,
  });

  const analyzeCount = state.recommendations.filter(
    (card) => card.suggestedWorkspaceId === "analyze"
  ).length;
  assert.equal(analyzeCount, 1);
});

test("invalid context: no future workspace recommendations", () => {
  const state = evaluateWorkspaceRecommendations({
    selectedObjectId: "obj-1",
    objectSignal: "risk",
    systemSignals: ["risk_elevated"],
  });

  assert.ok(!state.recommendations.some((card) => card.suggestedWorkspaceId === "risk"));
});
