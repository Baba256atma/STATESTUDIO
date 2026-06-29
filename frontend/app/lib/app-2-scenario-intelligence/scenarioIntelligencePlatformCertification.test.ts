import assert from "node:assert/strict";
import test from "node:test";

import {
  SCENARIO_INTELLIGENCE_PLATFORM_GATE_IDS,
  SCENARIO_INTELLIGENCE_PLATFORM_LAYERS,
  SCENARIO_INTELLIGENCE_PLATFORM_MANIFEST,
} from "./scenarioIntelligencePlatformCertificationContract.ts";
import {
  SCENARIO_INTELLIGENCE_PLATFORM_DIAGNOSTIC_CATEGORIES,
  SCENARIO_INTELLIGENCE_PLATFORM_DIAGNOSTIC_CODES,
} from "./scenarioIntelligencePlatformDiagnostics.ts";
import {
  buildScenarioIntelligencePlatformCertificationChecks,
  runScenarioIntelligencePlatformCertification,
} from "./scenarioIntelligencePlatformCertification.ts";
import {
  runScenarioIntelligencePlatformRegression,
  ScenarioIntelligencePlatformCertificationRunner,
} from "./scenarioIntelligencePlatformCertificationRunner.ts";
import { EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_RULES } from "./executiveScenarioAssistantAdapter.ts";
import { EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_RULES } from "./executiveScenarioDashboardAdapter.ts";
import { EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_RULES } from "./executiveScenarioWorkspaceAdapter.ts";
import { EXECUTIVE_SCENARIO_PACKAGE_RULES } from "./executiveScenarioPackageManifest.ts";
import { resolveExecutiveScenarioPackageProbeExample } from "./executiveScenarioPackageResolver.ts";
import { resolveExecutiveScenarioAssistantView } from "./executiveScenarioAssistantResolver.ts";
import { resolveExecutiveScenarioDashboardView } from "./executiveScenarioDashboardResolver.ts";
import { resolveExecutiveScenarioWorkspaceViewProbeExample } from "./executiveScenarioWorkspaceResolver.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test("runs full platform regression across APP-2 phases", () => {
  const regression = runScenarioIntelligencePlatformRegression();

  assert.equal(regression.status, "PASS");
  assert.equal(regression.allPhasesCertified, true);
  assert.equal(regression.phaseCount, 13);
  assert.equal(regression.passedPhaseCount, 13);
});

test("validates end-to-end integration chain without bypass", () => {
  const pkg = resolveExecutiveScenarioPackageProbeExample(FIXED_TIME);
  const workspaceView = resolveExecutiveScenarioWorkspaceViewProbeExample(FIXED_TIME);
  const assistantView = resolveExecutiveScenarioAssistantView(
    Object.freeze({
      workspaceView,
      generatedAt: FIXED_TIME,
      workspaceId: workspaceView.workspaceId,
    })
  );
  const dashboardView = resolveExecutiveScenarioDashboardView(
    Object.freeze({
      workspaceView,
      generatedAt: FIXED_TIME,
      workspaceId: workspaceView.workspaceId,
    })
  );

  assert.equal(workspaceView.packageId, pkg.packageId);
  assert.equal(workspaceView.scenarioId, pkg.scenarioId);
  assert.equal(assistantView.recommendationPortfolio, workspaceView.recommendationPortfolio);
  assert.equal(dashboardView.executiveHeadline, workspaceView.summary?.executiveHeadline);
});

test("runScenarioIntelligencePlatformCertification passes all gates A-Z", () => {
  const result = runScenarioIntelligencePlatformCertification();

  assert.equal(result.status, "PASS");
  assert.equal(result.certified, true);
  assert.equal(result.platformReady, true);
  assert.equal(result.failedChecks.length, 0);
  assert.equal(result.checks.length, 26);
  assert.equal(SCENARIO_INTELLIGENCE_PLATFORM_GATE_IDS.length, 26);
});

test("canonical runner exposes platform certification entry point", () => {
  const result = ScenarioIntelligencePlatformCertificationRunner.runScenarioIntelligencePlatformCertification();

  assert.equal(result.certified, true);
  assert.equal(
    ScenarioIntelligencePlatformCertificationRunner.version,
    "APP-2/13"
  );
  assert.equal(ScenarioIntelligencePlatformCertificationRunner.manifest.certificationOnly, true);
  assert.equal(ScenarioIntelligencePlatformCertificationRunner.manifest.modifiesPhases, false);
});

test("validates adapter isolation rules", () => {
  assert.equal(EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_RULES.consumesPackageOnly, true);
  assert.equal(EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_RULES.consumesWorkspaceViewOnly, true);
  assert.equal(EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_RULES.consumesWorkspaceViewOnly, true);
  assert.equal(EXECUTIVE_SCENARIO_PACKAGE_RULES.aggregatesOnly, true);
});

test("validates platform layers and diagnostic vocabulary", () => {
  assert.equal(SCENARIO_INTELLIGENCE_PLATFORM_LAYERS.length, 4);
  assert.equal(SCENARIO_INTELLIGENCE_PLATFORM_DIAGNOSTIC_CODES.length, 10);
  assert.equal(SCENARIO_INTELLIGENCE_PLATFORM_DIAGNOSTIC_CATEGORIES.length, 10);
});

test("produces deterministic platform certification checks", () => {
  const first = buildScenarioIntelligencePlatformCertificationChecks(FIXED_TIME);
  const second = buildScenarioIntelligencePlatformCertificationChecks(FIXED_TIME);

  assert.equal(first.checks.length, second.checks.length);
  assert.equal(
    first.checks.filter((entry) => entry.passed).length,
    second.checks.filter((entry) => entry.passed).length
  );
});

test("platform manifest declares certification-only scope", () => {
  assert.equal(SCENARIO_INTELLIGENCE_PLATFORM_MANIFEST.stageId, "APP-2/13");
  assert.equal(SCENARIO_INTELLIGENCE_PLATFORM_MANIFEST.introducesCapabilities, false);
  assert.equal(SCENARIO_INTELLIGENCE_PLATFORM_MANIFEST.modifiesPhases, false);
});

test("regression includes all phases from APP-2:1 through APP-2:12", () => {
  const regression = runScenarioIntelligencePlatformRegression();
  const phaseIds = regression.phases.map((entry) => entry.phaseId);

  assert.ok(phaseIds.includes("APP-2/1"));
  assert.ok(phaseIds.includes("APP-2/9.5"));
  assert.ok(phaseIds.includes("APP-2/12"));
});

test("platform certification returns diagnostics on failure path structure", () => {
  const result = runScenarioIntelligencePlatformCertification();
  assert.ok(Array.isArray(result.diagnostics));
  assert.ok(result.regressionSummary.length > 0);
});
