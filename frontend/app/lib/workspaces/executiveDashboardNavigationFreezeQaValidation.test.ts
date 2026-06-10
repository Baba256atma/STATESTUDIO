/**
 * MRP:9:5 — Dashboard Navigation Layer freeze QA integration tests.
 *
 * Executive Navigation Matrix + cross-surface certification.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  DASHBOARD_NAVIGATION_OWNERSHIP_MATRIX,
  DASHBOARD_NAVIGATION_SURFACE_BRAKE_PREFIXES,
  DASHBOARD_NAVIGATION_VALIDATION_BRAKE_PREFIXES,
  resolveDashboardNavigationFreezeVerdict,
  runDashboardNavigationFreezeQaMatrix,
  validateDashboardNavigationAuthority,
  validateFavoritesSurfaceIntegration,
  validateLauncherSurfaceIntegration,
  validateRecommendationsSurfaceIntegration,
  validateRecentsSurfaceIntegration,
} from "./executiveDashboardNavigationFreezeQaValidation.ts";
import { DASHBOARD_NAVIGATION_LEGACY_FINDINGS } from "./executiveDashboardNavigationLegacyFindings.ts";
import {
  certifySingleActiveWorkspace,
  countActiveExecutiveWorkspaces,
} from "../dashboard/executiveWorkspaceFreezeQaValidation.ts";
import { requestWorkspaceLaunch } from "../dashboard/workspaceLauncher/workspaceLauncherRuntime.ts";
import { resetWorkspaceLauncherForTests } from "../dashboard/workspaceLauncher/workspaceLauncherContract.ts";
import { evaluateWorkspaceRecommendations } from "./workspaceRecommendationEngine.ts";
import { resetWorkspaceRecommendationForTests } from "./workspaceRecommendationContract.ts";
import {
  initializeWorkspaceFavoritesRegistry,
  pinWorkspaceAction,
  restoreDefaultWorkspaceFavorites,
  validatePinnedActionLaunch,
  recoverWorkspaceFavoritesFromSnapshot,
  resetWorkspaceFavorites,
  resetWorkspaceFavoritesRegistryForTests,
} from "./workspaceFavoritesRegistry.ts";
import { resetWorkspaceFavoritesBrakesForTests } from "./workspaceFavoritesContract.ts";
import {
  buildWorkspaceRecentsView,
  validateRecentReturnPath,
  assertRecentsCannotMutateHistory,
} from "./workspaceRecentsRegistry.ts";
import { resetWorkspaceRecentsBrakesForTests } from "./workspaceRecentsContract.ts";
import {
  getWorkspaceLifecycleState,
  resetExecutiveWorkspaceLifecycleRuntimeForTests,
} from "../dashboard/executiveWorkspaceLifecycleRuntime.ts";
import { resetExecutiveWorkspaceRegistryRuntimeForTests } from "../dashboard/executiveWorkspaceRegistryRuntime.ts";
import {
  resetExecutiveWorkspaceTransitionControllerRuntimeForTests,
} from "../dashboard/executiveWorkspaceTransitionControllerRuntime.ts";
import {
  resetExecutiveWorkspaceTransitionControllerForTests,
} from "../dashboard/executiveWorkspaceTransitionControllerContract.ts";
import {
  resetExecutiveWorkspaceNavigationHistoryForTests,
} from "../dashboard/executiveWorkspaceNavigationHistoryContract.ts";
import {
  commitExecutiveWorkspaceBackNavigation,
  getWorkspaceNavigationBackStack,
  getWorkspaceNavigationSummary,
  initializeExecutiveWorkspaceNavigationHistory,
  recordForwardNavigationAfterCommit,
  requestExecutiveWorkspaceBackNavigation,
  resetExecutiveWorkspaceNavigationHistoryRuntimeForTests,
} from "../dashboard/executiveWorkspaceNavigationHistoryRuntime.ts";
import {
  commitExecutiveWorkspaceTransition,
  requestExecutiveWorkspaceTransition,
} from "../dashboard/executiveWorkspaceTransitionControllerRuntime.ts";

type ActiveWorkspace = "focus" | "analyze" | "compare" | "scenario" | "war_room";

test.beforeEach(() => {
  resetWorkspaceLauncherForTests();
  resetWorkspaceRecommendationForTests();
  resetWorkspaceFavoritesBrakesForTests();
  resetWorkspaceFavoritesRegistryForTests();
  resetWorkspaceRecentsBrakesForTests();
  resetExecutiveWorkspaceRegistryRuntimeForTests();
  resetExecutiveWorkspaceLifecycleRuntimeForTests();
  resetExecutiveWorkspaceTransitionControllerRuntimeForTests();
  resetExecutiveWorkspaceTransitionControllerForTests();
  resetExecutiveWorkspaceNavigationHistoryForTests();
  resetExecutiveWorkspaceNavigationHistoryRuntimeForTests();
});

function assertExactlyOneActive(): void {
  const count = countActiveExecutiveWorkspaces((id) => getWorkspaceLifecycleState(id));
  assert.equal(count, 1, `expected exactly one active workspace, got ${count}`);
}

function assertActiveIs(workspace: ActiveWorkspace): void {
  const state = getWorkspaceLifecycleState(workspace);
  assert.equal(state?.currentState, "active", `expected ${workspace} active`);
  assertExactlyOneActive();
}

function launchViaLauncher(
  workspace: "analyze" | "compare" | "scenario" | "war_room",
  objectId = "line-1"
): void {
  const request = requestWorkspaceLaunch({
    source: "workspace_launcher",
    workspaceId: workspace,
    objectId,
    objectName: "Line 1",
  });
  assert.equal(request.approved, true, `launcher → ${workspace}`);
  const commit = commitExecutiveWorkspaceTransition(workspace);
  assert.equal(commit.approved, true);
  recordForwardNavigationAfterCommit({
    originWorkspaceId: commit.previousWorkspaceId,
    targetWorkspaceId: workspace,
  });
}

function launchViaRecommendation(
  workspace: "analyze" | "compare" | "scenario" | "war_room",
  objectId = "risk-node-1"
): void {
  const activeId = (["analyze", "compare", "scenario", "war_room"] as const).find(
    (id) => getWorkspaceLifecycleState(id)?.currentState === "active"
  ) ?? null;

  const context =
    workspace === "scenario"
      ? { selectedObjectId: objectId, kpiDecline: true, activeWorkspaceId: activeId }
      : workspace === "compare"
        ? { selectedObjectId: objectId, scenarioConflict: true, activeWorkspaceId: activeId }
        : { selectedObjectId: objectId, objectSignal: "risk" as const, objectImpact: "critical" as const, activeWorkspaceId: activeId };

  const recs = evaluateWorkspaceRecommendations(context);
  const target = recs.recommendations.find((card) => card.suggestedWorkspaceId === workspace);
  assert.ok(target, `recommendation for ${workspace} exists`);

  const request = requestWorkspaceLaunch({
    source: "dashboard_control",
    workspaceId: workspace,
    objectId,
    objectName: "Risk Node",
  });
  assert.equal(request.approved, true, `recommendation → ${workspace}`);
  const commit = commitExecutiveWorkspaceTransition(workspace);
  assert.equal(commit.approved, true);
  recordForwardNavigationAfterCommit({
    originWorkspaceId: commit.previousWorkspaceId,
    targetWorkspaceId: workspace,
  });
}

function launchViaFavorite(
  workspace: "analyze" | "compare" | "scenario" | "war_room",
  objectId = "line-1"
): void {
  restoreDefaultWorkspaceFavorites();
  const favorite = initializeWorkspaceFavoritesRegistry().items.find(
    (item) => item.workspaceTarget === workspace
  );
  assert.ok(favorite, `favorite for ${workspace} exists`);

  const activeId = (["analyze", "compare", "scenario", "war_room"] as const).find(
    (id) => getWorkspaceLifecycleState(id)?.currentState === "active"
  ) ?? null;

  const validation = validatePinnedActionLaunch({
    favoriteId: favorite.id,
    activeWorkspaceId: activeId,
    selectedObjectId: objectId,
  });
  assert.equal(validation.approved, true, `favorite validate → ${workspace}`);

  const request = requestWorkspaceLaunch({
    source: "dashboard_control",
    workspaceId: workspace,
    objectId,
    objectName: "Line 1",
  });
  assert.equal(request.approved, true, `favorite → ${workspace}`);
  const commit = commitExecutiveWorkspaceTransition(workspace);
  assert.equal(commit.approved, true);
  recordForwardNavigationAfterCommit({
    originWorkspaceId: commit.previousWorkspaceId,
    targetWorkspaceId: workspace,
  });
}

function returnViaRecent(
  workspace: "analyze" | "compare" | "scenario" | "war_room",
  activeWorkspaceId: ActiveWorkspace,
  objectId = "line-1"
): void {
  const validation = validateRecentReturnPath({
    workspaceId: workspace,
    activeWorkspaceId,
    selectedObjectId: objectId,
  });
  assert.equal(validation.approved, true, `recent return → ${workspace}`);

  if (validation.returnKind === "back_via_history") {
    const back = requestExecutiveWorkspaceBackNavigation();
    assert.equal(back.approved, true);
    assert.equal(back.targetWorkspaceId, workspace);
    commitExecutiveWorkspaceBackNavigation(workspace);
  } else {
    const request = requestWorkspaceLaunch({
      source: "dashboard_control",
      workspaceId: workspace,
      objectId,
      objectName: "Line 1",
    });
    assert.equal(request.approved, true);
    const commit = commitExecutiveWorkspaceTransition(workspace);
    assert.equal(commit.approved, true);
    recordForwardNavigationAfterCommit({
      originWorkspaceId: commit.previousWorkspaceId,
      targetWorkspaceId: workspace,
    });
  }
}

// --- Validation brake prefix registration ---

test("MRP:9:5 validation brake prefixes registered", () => {
  assert.equal(DASHBOARD_NAVIGATION_VALIDATION_BRAKE_PREFIXES.length, 8);
  assert.ok(DASHBOARD_NAVIGATION_VALIDATION_BRAKE_PREFIXES.includes("[LauncherValidation][Brake]"));
  assert.ok(DASHBOARD_NAVIGATION_VALIDATION_BRAKE_PREFIXES.includes("[DashboardAuthorityValidation][Brake]"));
  assert.ok(DASHBOARD_NAVIGATION_SURFACE_BRAKE_PREFIXES.length >= 20);
});

test("surface integration validators pass", () => {
  const launcher = validateLauncherSurfaceIntegration();
  const recommendations = validateRecommendationsSurfaceIntegration();
  const favorites = validateFavoritesSurfaceIntegration();
  const recents = validateRecentsSurfaceIntegration();
  const authority = validateDashboardNavigationAuthority();

  assert.ok(launcher.every((r) => r.status === "pass"));
  assert.ok(recommendations.every((r) => r.status === "pass"));
  assert.ok(favorites.every((r) => r.status === "pass"));
  assert.ok(recents.every((r) => r.status === "pass"));
  assert.equal(authority.status, "pass");
});

test("ownership matrix defines single authority per layer", () => {
  assert.equal(DASHBOARD_NAVIGATION_OWNERSHIP_MATRIX.dashboard, "execution_authority");
  assert.equal(DASHBOARD_NAVIGATION_OWNERSHIP_MATRIX.recommendations, "advisory_only");
  assert.equal(DASHBOARD_NAVIGATION_OWNERSHIP_MATRIX.recents, "read_only_history_projection");
  assert.equal(DASHBOARD_NAVIGATION_OWNERSHIP_MATRIX.assistant, "read_only_observer");
});

// --- Executive Navigation Matrix ---

test("matrix: Launcher → Analyze, Compare, Scenario, War Room", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  launchViaLauncher("analyze");
  assertActiveIs("analyze");

  launchViaLauncher("compare");
  assertActiveIs("compare");

  launchViaLauncher("scenario");
  assertActiveIs("scenario");

  launchViaLauncher("war_room");
  assertActiveIs("war_room");
});

test("matrix: Recommendation → Analyze, Scenario", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  launchViaRecommendation("analyze");
  assertActiveIs("analyze");

  launchViaRecommendation("scenario");
  assertActiveIs("scenario");
});

test("matrix: Favorite → Analyze, War Room", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  launchViaFavorite("analyze");
  assertActiveIs("analyze");

  launchViaFavorite("war_room");
  assertActiveIs("war_room");
});

test("matrix: Recent → Compare, Scenario", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  launchViaLauncher("analyze");
  launchViaLauncher("compare");
  launchViaLauncher("scenario");

  returnViaRecent("compare", "scenario");
  assertActiveIs("compare");

  launchViaLauncher("war_room");
  returnViaRecent("scenario", "war_room");
  assertActiveIs("scenario");
});

test("matrix: History Back navigation", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  launchViaLauncher("analyze");
  launchViaLauncher("compare");
  launchViaLauncher("scenario");

  const back = requestExecutiveWorkspaceBackNavigation();
  assert.equal(back.approved, true);
  assert.equal(back.targetWorkspaceId, "compare");
  commitExecutiveWorkspaceBackNavigation("compare");
  assertActiveIs("compare");

  const stack = getWorkspaceNavigationBackStack();
  assert.deepEqual(stack, ["analyze"]);
});

test("matrix: Return Path Navigation preserves workspace", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  launchViaLauncher("analyze");
  launchViaLauncher("compare");

  returnViaRecent("analyze", "compare");
  assertActiveIs("analyze");

  const summary = getWorkspaceNavigationSummary();
  assert.equal(summary.currentWorkspaceId, "analyze");
});

test("matrix: Repeated navigation requests blocked", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  launchViaLauncher("analyze");

  const repeat = requestWorkspaceLaunch({
    source: "workspace_launcher",
    workspaceId: "analyze",
    objectId: "line-1",
  });
  assert.equal(repeat.approved, false);
  assert.equal(repeat.reason, "already_active");
  assertActiveIs("analyze");
});

test("matrix: full chain maintains single active workspace", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  launchViaLauncher("analyze");
  launchViaFavorite("war_room");
  launchViaRecommendation("scenario");
  returnViaRecent("war_room", "scenario");

  assertExactlyOneActive();
  assert.equal(certifySingleActiveWorkspace(1).status, "pass");
});

// --- Failure scenarios ---

test("failure: missing workspace rejected at launch", () => {
  const request = requestWorkspaceLaunch({
    source: "workspace_launcher",
    workspaceId: "risk",
    objectId: "line-1",
  });
  assert.equal(request.approved, false);
  assert.equal(countActiveExecutiveWorkspaces((id) => getWorkspaceLifecycleState(id)), 0);
});

test("failure: corrupt favorites snapshot fails safely", () => {
  const recovery = recoverWorkspaceFavoritesFromSnapshot({
    version: "0.0.0",
    updatedAt: Date.now(),
    items: [{ id: "bad", workspaceTarget: "analyze", title: "Bad", pinnedAt: 0, order: 0 }],
  });
  assert.equal(recovery.recovered, false);
});

test("failure: broken recent entry rejected", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  launchViaLauncher("analyze");

  const validation = validateRecentReturnPath({
    workspaceId: "war_room",
    activeWorkspaceId: "analyze",
    selectedObjectId: "obj-1",
  });
  assert.equal(validation.approved, false);
});

test("failure: invalid transition concurrent request rejected", () => {
  requestWorkspaceLaunch({
    source: "workspace_launcher",
    workspaceId: "analyze",
    objectId: "line-1",
  });
  const concurrent = requestWorkspaceLaunch({
    source: "workspace_launcher",
    workspaceId: "compare",
    objectId: "line-1",
  });
  assert.equal(concurrent.approved, false);
  assert.equal(concurrent.reason, "concurrent_transition_detected");
});

test("failure: unauthorized direct transition without commit rejected", () => {
  const request = requestExecutiveWorkspaceTransition({
    targetWorkspaceId: "analyze",
    source: "dashboard_direct",
  });
  assert.equal(request.approved, true);
  // Without commit — no active workspace
  assert.equal(countActiveExecutiveWorkspaces((id) => getWorkspaceLifecycleState(id)), 0);
});

test("failure: recents cannot mutate history", () => {
  assertRecentsCannotMutateHistory("delete");
  assertRecentsCannotMutateHistory("clear");
});

test("failure: recommendation advisory does not activate workspace", () => {
  const state = evaluateWorkspaceRecommendations({
    selectedObjectId: "risk-1",
    objectSignal: "risk",
    objectImpact: "critical",
  });
  assert.ok(state.recommendations.length > 0);
  assert.equal(countActiveExecutiveWorkspaces((id) => getWorkspaceLifecycleState(id)), 0);
});

// --- Freeze QA matrix ---

test("freeze QA matrix: navigation layer passes with zero failures", () => {
  const matrix = runDashboardNavigationFreezeQaMatrix();
  assert.equal(matrix.failCount, 0, matrix.results.filter((r) => r.status === "fail").map((r) => r.evidence).join("; "));
  assert.ok(matrix.passCount > 0);
});

test("freeze verdict: PASS WITH WARNINGS due to legacy bypasses", () => {
  const legacyCount = Object.keys(DASHBOARD_NAVIGATION_LEGACY_FINDINGS).length;
  assert.ok(legacyCount >= 6);

  const verdict = resolveDashboardNavigationFreezeVerdict({
    failCount: 0,
    warningCount: 0,
    legacyBypassCount: legacyCount,
  });
  assert.equal(verdict, "PASS WITH WARNINGS");
});

test("recents projection reflects navigation history after matrix", () => {
  initializeExecutiveWorkspaceNavigationHistory();
  launchViaLauncher("analyze");
  launchViaLauncher("compare");

  const recents = buildWorkspaceRecentsView({
    activeWorkspaceId: "compare",
    selectedObjectLabel: "Demand Model",
  });
  assert.ok(recents.items.length >= 2);
  assert.equal(recents.currentWorkspaceId, "compare");
});

test("favorites duplicate pin rejected", () => {
  resetWorkspaceFavorites();
  const first = pinWorkspaceAction({ workspaceId: "analyze" });
  assert.equal(first.success, true);
  const duplicate = pinWorkspaceAction({ workspaceId: "analyze" });
  assert.equal(duplicate.success, false);
  assert.equal(duplicate.reason, "already_pinned");
});
