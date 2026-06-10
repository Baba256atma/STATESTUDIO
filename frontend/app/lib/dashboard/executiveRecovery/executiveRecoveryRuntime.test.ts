import test from "node:test";
import assert from "node:assert/strict";

import {
  EXECUTIVE_RECOVERY_MAX_ENTRIES,
  FUTURE_EXECUTIVE_RECOVERY_SOURCE_SLOTS,
  resetExecutiveRecoveryBrakesForTests,
} from "./executiveRecoveryContract.ts";
import {
  EXECUTIVE_RECOVERY_APPROVED_DESTINATIONS,
  EXECUTIVE_RECOVERY_LEGACY_ISOLATION,
} from "./executiveRecoveryLegacyFindings.ts";
import { buildExecutiveWorkspaceRecoveryView } from "./executiveRecoveryRuntime.ts";
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
  resetExecutiveRecoveryBrakesForTests();
  resetWorkspaceLauncherForTests();
  resetExecutiveWorkspaceRegistryRuntimeForTests();
  resetExecutiveWorkspaceLifecycleRuntimeForTests();
  resetExecutiveWorkspaceTransitionControllerRuntimeForTests();
  resetExecutiveWorkspaceTransitionControllerForTests();
  resetExecutiveWorkspaceNavigationHistoryForTests();
  resetExecutiveWorkspaceNavigationHistoryRuntimeForTests();
});

function seedNavigation(to: "analyze" | "compare" | "scenario" | "war_room" | "focus"): void {
  initializeExecutiveWorkspaceNavigationHistory();
  const request = requestWorkspaceLaunch({
    source: "workspace_launcher",
    workspaceId: to,
    objectId: "node-a",
    objectName: "Supply Chain Node A",
  });
  assert.equal(request.approved, true, to);
  const commit = commitExecutiveWorkspaceTransition(to);
  assert.equal(commit.approved, true);
  recordForwardNavigationAfterCommit({
    originWorkspaceId: commit.previousWorkspaceId,
    targetWorkspaceId: to,
  });
}

test("recovery view uses executive workspace recovery source", () => {
  const view = buildExecutiveWorkspaceRecoveryView({});
  assert.equal(view.source, "executive_workspace_recovery_layer");
  assert.ok(Array.isArray(view.entries));
});

test("empty recovery shows no entries", () => {
  const view = buildExecutiveWorkspaceRecoveryView({});
  assert.equal(view.entries.length, 0);
});

test("recovery projects resumable workspace contexts from history", () => {
  seedNavigation("analyze");
  seedNavigation("war_room");

  const view = buildExecutiveWorkspaceRecoveryView({
    activeWorkspaceId: "overview",
    selectedObjectId: "node-a",
  });

  assert.ok(view.entries.length >= 2);
  assert.ok(view.entries.length <= EXECUTIVE_RECOVERY_MAX_ENTRIES);
  assert.ok(view.entries.some((entry) => entry.recoveryKind === "analyze"));
  assert.ok(view.entries.some((entry) => entry.recoveryKind === "war_room"));
  assert.match(view.entries[0]?.activityName ?? "", /Continue Last/i);
});

test("recovery entries are not recommendations", () => {
  seedNavigation("scenario");
  const view = buildExecutiveWorkspaceRecoveryView({ selectedObjectId: "node-a" });
  for (const entry of view.entries) {
    assert.equal(entry.source, "workspace_navigation_history");
    assert.match(entry.activityName, /Continue Last/i);
  }
});

test("legacy isolation separates favorites recommendations and timeline", () => {
  assert.equal(EXECUTIVE_RECOVERY_LEGACY_ISOLATION.separation.favorites.status, "isolated");
  assert.equal(EXECUTIVE_RECOVERY_LEGACY_ISOLATION.separation.activityTimeline.status, "isolated");
  assert.ok(EXECUTIVE_RECOVERY_APPROVED_DESTINATIONS.includes("analyze"));
});

test("future recovery source slots reserved", () => {
  assert.ok(FUTURE_EXECUTIVE_RECOVERY_SOURCE_SLOTS.includes("scenario_chains"));
});
