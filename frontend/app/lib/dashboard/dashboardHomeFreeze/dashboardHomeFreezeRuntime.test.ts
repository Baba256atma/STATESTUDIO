import test from "node:test";
import assert from "node:assert/strict";

import {
  DASHBOARD_HOME_FROZEN_CONTRACTS,
  DASHBOARD_HOME_FROZEN_HIERARCHY,
  DASHBOARD_HOME_MVP_APPROVAL_STATUS,
  getDashboardHomeFrozenContract,
  resetDashboardHomeFreezeBrakesForTests,
} from "./dashboardHomeFreezeContract.ts";
import {
  detectDashboardHomeHierarchyDrift,
  runDashboardHomeFreezeCertification,
  validateDashboardHomeHierarchyFreeze,
} from "./dashboardHomeFreezeRuntime.ts";
import { DASHBOARD_HOME_CANONICAL_SECTION_ORDER } from "../dashboardHomeLayout/dashboardHomeLayoutContract.ts";
import { resetExecutiveWorkspaceRegistryRuntimeForTests } from "../executiveWorkspaceRegistryRuntime.ts";
import { resetExecutiveWorkspaceLifecycleRuntimeForTests } from "../executiveWorkspaceLifecycleRuntime.ts";
import { resetExecutiveWorkspaceTransitionControllerRuntimeForTests } from "../executiveWorkspaceTransitionControllerRuntime.ts";
import { resetExecutiveWorkspaceTransitionControllerForTests } from "../executiveWorkspaceTransitionControllerContract.ts";
import { resetWorkspaceLauncherForTests } from "../workspaceLauncher/workspaceLauncherContract.ts";
import { resetExecutiveWorkspaceNavigationHistoryForTests } from "../executiveWorkspaceNavigationHistoryContract.ts";
import { resetExecutiveWorkspaceNavigationHistoryRuntimeForTests } from "../executiveWorkspaceNavigationHistoryRuntime.ts";

test.beforeEach(() => {
  resetDashboardHomeFreezeBrakesForTests();
  resetWorkspaceLauncherForTests();
  resetExecutiveWorkspaceRegistryRuntimeForTests();
  resetExecutiveWorkspaceLifecycleRuntimeForTests();
  resetExecutiveWorkspaceTransitionControllerRuntimeForTests();
  resetExecutiveWorkspaceTransitionControllerForTests();
  resetExecutiveWorkspaceNavigationHistoryForTests();
  resetExecutiveWorkspaceNavigationHistoryRuntimeForTests();
});

test("all frozen contracts marked MVP Approved", () => {
  assert.equal(DASHBOARD_HOME_FROZEN_CONTRACTS.length, 4);
  assert.ok(DASHBOARD_HOME_FROZEN_CONTRACTS.every((entry) => entry.status === DASHBOARD_HOME_MVP_APPROVAL_STATUS));
});

test("frozen hierarchy matches canonical section order", () => {
  const flattened = [
    ...DASHBOARD_HOME_FROZEN_HIERARCHY.executive_status,
    ...DASHBOARD_HOME_FROZEN_HIERARCHY.executive_action,
    ...DASHBOARD_HOME_FROZEN_HIERARCHY.executive_guidance,
    ...DASHBOARD_HOME_FROZEN_HIERARCHY.executive_continuity,
  ];
  assert.deepEqual(flattened, [...DASHBOARD_HOME_CANONICAL_SECTION_ORDER]);
});

test("hierarchy drift detection passes for canonical order", () => {
  const drift = detectDashboardHomeHierarchyDrift(DASHBOARD_HOME_CANONICAL_SECTION_ORDER);
  assert.equal(drift.drifted, false);
});

test("hierarchy drift detection fails on reorder", () => {
  const reordered = [
    "quick_actions",
    ...DASHBOARD_HOME_CANONICAL_SECTION_ORDER.filter((id) => id !== "quick_actions"),
  ] as typeof DASHBOARD_HOME_CANONICAL_SECTION_ORDER;
  const drift = detectDashboardHomeHierarchyDrift(reordered);
  assert.equal(drift.drifted, true);
});

test("hierarchy freeze validation passes", () => {
  const results = validateDashboardHomeHierarchyFreeze();
  assert.ok(results.every((entry) => entry.status === "pass"));
});

test("freeze certification passes", () => {
  const certification = runDashboardHomeFreezeCertification();
  assert.equal(certification.mvpStatus, "MVP Approved");
  assert.equal(certification.failCount, 0);
  assert.ok(certification.verdict === "PASS" || certification.verdict === "PASS_WITH_WARNINGS");
});

test("layout contract lookup resolves", () => {
  const contract = getDashboardHomeFrozenContract("dashboard_home_layout");
  assert.ok(contract);
  assert.equal(contract?.status, "MVP Approved");
});
