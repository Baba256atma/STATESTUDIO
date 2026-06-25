import assert from "node:assert/strict";
import test from "node:test";

import {
  isExecutiveIntelligencePlatformFrozen,
  resetExecutiveIntelligencePlatformFreezeForTests,
} from "./executiveIntelligencePlatformArchitectureFreeze.ts";
import {
  EXECUTIVE_INTELLIGENCE_PLATFORM_TAGS,
  EXECUTIVE_INTELLIGENCE_REGRESSION_TEST_FILES,
  EXECUTIVE_INTELLIGENCE_PLATFORM_CERTIFICATION_VERSION,
  NEXORA_EXECUTIVE_INTELLIGENCE_PLATFORM_LOG_PREFIX,
} from "./executiveIntelligencePlatformCertificationContract.ts";
import { runExecutiveIntelligencePlatformCertification } from "./executiveIntelligencePlatformCertificationRunner.ts";
import { buildExecutiveIntelligencePlatformDiagnosticsReport } from "./executiveIntelligencePlatformDiagnosticsReport.ts";
import { runExecutiveIntelligenceEndToEndScenarios } from "./executiveIntelligencePlatformEndToEndScenarios.ts";
import {
  createPlatformCertificationWorkspace,
  ensurePlatformCertificationBrowserStorage,
  resetExecutiveIntelligencePlatformForCertification,
  seedPlatformCertificationWorkspace,
} from "./executiveIntelligencePlatformCertificationHarness.ts";

test.beforeEach(() => {
  ensurePlatformCertificationBrowserStorage();
  if (typeof window !== "undefined") window.localStorage.clear();
  resetExecutiveIntelligencePlatformFreezeForTests();
  resetExecutiveIntelligencePlatformForCertification();
});

test("exports INT-5 platform certification tags and version", () => {
  assert.equal(NEXORA_EXECUTIVE_INTELLIGENCE_PLATFORM_LOG_PREFIX, "[NexoraExecutiveIntelligencePlatform]");
  assert.equal(EXECUTIVE_INTELLIGENCE_PLATFORM_CERTIFICATION_VERSION, "INT-5");
  assert.ok(EXECUTIVE_INTELLIGENCE_PLATFORM_TAGS.includes("[INT5_COMPLETE]"));
  assert.equal(EXECUTIVE_INTELLIGENCE_REGRESSION_TEST_FILES.length, 7);
});

test("end-to-end scenarios cover workspace, selection, and time states", () => {
  const workspaceId = createPlatformCertificationWorkspace("E2E Scenario Workspace");
  seedPlatformCertificationWorkspace(workspaceId);

  const scenarios = runExecutiveIntelligenceEndToEndScenarios({
    workspaceId,
    objectIdA: "obj_delivery",
    objectIdB: "obj_inventory",
  });

  assert.equal(scenarios.length, 5);
  assert.ok(scenarios.every((entry) => entry.passed));
});

test("platform certification passes all groups and freezes architecture", () => {
  const result = runExecutiveIntelligencePlatformCertification({
    skipRegression: true,
    skipBuildInRegression: true,
  });

  assert.equal(result.certified, true);
  assert.equal(result.architectureFrozen, true);
  assert.ok(isExecutiveIntelligencePlatformFrozen());
  assert.ok(result.checks.every((entry) => entry.passed));
  assert.ok(result.scenarios.every((entry) => entry.passed));
  assert.ok(result.diagnosticsReport.gatewayDiagnostics > 0);
  assert.ok(result.checks.some((entry) => entry.id === "H1" && entry.passed));

  const groups = new Set(result.checks.map((entry) => entry.group));
  for (const group of ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]) {
    assert.ok(groups.has(group as "A"), `Missing group ${group}`);
  }
});

test("diagnostics report aggregates all platform channels", () => {
  const workspaceId = createPlatformCertificationWorkspace("Diagnostics Workspace");
  seedPlatformCertificationWorkspace(workspaceId);
  runExecutiveIntelligencePlatformCertification({
    workspaceId,
    skipRegression: true,
    skipBuildInRegression: true,
  });

  const report = buildExecutiveIntelligencePlatformDiagnosticsReport();
  assert.ok(report.gatewayDiagnostics > 0);
  assert.ok(report.runtimeDiagnostics > 0);
  assert.ok(report.assistantDiagnostics > 0);
  assert.ok(report.executiveSummaryDiagnostics > 0);
  assert.ok(report.objectPanelDiagnostics > 0);
  assert.ok(report.contextDiagnostics > 0);
  assert.ok(report.timeDiagnostics > 0);
});
