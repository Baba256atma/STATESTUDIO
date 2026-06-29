import assert from "node:assert/strict";
import test from "node:test";

import { resolveExecutiveScenarioPackageProbeExample } from "./executiveScenarioPackageResolver.ts";
import {
  adaptExecutiveScenarioPackageToWorkspaceView,
  EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_RULES,
  EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_VERSION,
} from "./executiveScenarioWorkspaceAdapter.ts";
import {
  resolveExecutiveScenarioWorkspaceView,
  resolveExecutiveScenarioWorkspaceViewProbeExample,
} from "./executiveScenarioWorkspaceResolver.ts";
import { runExecutiveScenarioWorkspaceIntegrationCertification } from "./executiveScenarioWorkspaceCertification.ts";
import { EXECUTIVE_SCENARIO_WORKSPACE_DIAGNOSTIC_CODES } from "./executiveScenarioWorkspaceDiagnostics.ts";
import { EXECUTIVE_SCENARIO_WORKSPACE_EVENT_NAMES } from "./executiveScenarioWorkspaceEvents.ts";
import {
  EXECUTIVE_SCENARIO_WORKSPACE_HOOK_IDS,
  EXECUTIVE_SCENARIO_WORKSPACE_REFRESH_STATES,
  EXECUTIVE_SCENARIO_WORKSPACE_SELECTION_STATES,
} from "./executiveScenarioWorkspaceView.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test("consumes executive scenario package by reference", () => {
  const pkg = resolveExecutiveScenarioPackageProbeExample(FIXED_TIME);
  const view = resolveExecutiveScenarioWorkspaceView(
    Object.freeze({
      package: pkg,
      workspaceId: pkg.workspaceId,
      selectedScenarioId: pkg.scenarioId,
      refreshState: "synchronized",
      generatedAt: FIXED_TIME,
    })
  );

  assert.equal(view.summary, pkg.summary);
  assert.equal(view.recommendationPortfolio, pkg.recommendationPortfolio);
  assert.equal(view.packageId, pkg.packageId);
  assert.equal(view.readOnly, true);
  assert.equal(view.adapterVersion, "APP-2/10");
});

test("validates workspace ownership and isolation", () => {
  const pkg = resolveExecutiveScenarioPackageProbeExample(FIXED_TIME);
  const view = resolveExecutiveScenarioWorkspaceView(
    Object.freeze({
      package: pkg,
      workspaceId: "ws-other",
      selectedScenarioId: pkg.scenarioId,
      generatedAt: FIXED_TIME,
    })
  );

  assert.equal(view.status, "unavailable");
  assert.equal(view.summary, null);
  assert.ok(view.diagnostics.some((entry) => entry.code === "workspace_isolation_failure"));
});

test("resolves scenario selection states", () => {
  const pkg = resolveExecutiveScenarioPackageProbeExample(FIXED_TIME);

  const active = adaptExecutiveScenarioPackageToWorkspaceView(
    Object.freeze({
      package: pkg,
      workspaceId: pkg.workspaceId,
      selectedScenarioId: pkg.scenarioId,
      generatedAt: FIXED_TIME,
    })
  );
  assert.equal(active.selectionState, "active");

  const none = adaptExecutiveScenarioPackageToWorkspaceView(
    Object.freeze({
      package: pkg,
      workspaceId: pkg.workspaceId,
      generatedAt: FIXED_TIME,
    })
  );
  assert.equal(none.selectionState, "none");

  const invalid = adaptExecutiveScenarioPackageToWorkspaceView(
    Object.freeze({
      package: pkg,
      workspaceId: pkg.workspaceId,
      selectedScenarioId: "scn-other",
      generatedAt: FIXED_TIME,
    })
  );
  assert.equal(invalid.selectionState, "invalid");
});

test("handles refresh states without rebuilding intelligence", () => {
  const pkg = resolveExecutiveScenarioPackageProbeExample(FIXED_TIME);

  const refreshing = adaptExecutiveScenarioPackageToWorkspaceView(
    Object.freeze({
      package: pkg,
      workspaceId: pkg.workspaceId,
      selectedScenarioId: pkg.scenarioId,
      refreshState: "refreshing",
      generatedAt: FIXED_TIME,
    })
  );
  assert.equal(refreshing.refreshState, "refreshing");
  assert.equal(refreshing.summary, pkg.summary);
});

test("exposes workspace hook descriptors", () => {
  const view = resolveExecutiveScenarioWorkspaceViewProbeExample(FIXED_TIME);

  assert.equal(view.hooks.length, 3);
  assert.ok(view.hooks.some((hook) => hook.hookId === EXECUTIVE_SCENARIO_WORKSPACE_HOOK_IDS.refreshPackage));
  assert.ok(view.hooks.some((hook) => hook.hookId === EXECUTIVE_SCENARIO_WORKSPACE_HOOK_IDS.selectScenario));
  assert.ok(view.hooks.some((hook) => hook.hookId === EXECUTIVE_SCENARIO_WORKSPACE_HOOK_IDS.reportStatus));
});

test("produces deterministic workspace view", () => {
  const first = resolveExecutiveScenarioWorkspaceViewProbeExample(FIXED_TIME);
  const second = resolveExecutiveScenarioWorkspaceViewProbeExample(FIXED_TIME);

  assert.equal(first.packageId, second.packageId);
  assert.equal(first.selectionState, second.selectionState);
  assert.equal(first.refreshState, second.refreshState);
});

test("declares read-only adapter rules", () => {
  assert.equal(EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_RULES.consumesPackageOnly, true);
  assert.equal(EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_RULES.rebuildsIntelligence, false);
  assert.equal(EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_RULES.executesRecommendations, false);
  assert.equal(EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_RULES.modifiesWorkspace, false);
  assert.equal(EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_VERSION, "APP-2/10");
});

test("defines refresh selection and event vocabularies", () => {
  assert.equal(EXECUTIVE_SCENARIO_WORKSPACE_REFRESH_STATES.length, 5);
  assert.equal(EXECUTIVE_SCENARIO_WORKSPACE_SELECTION_STATES.length, 5);
  assert.equal(EXECUTIVE_SCENARIO_WORKSPACE_DIAGNOSTIC_CODES.length, 8);
  assert.equal(EXECUTIVE_SCENARIO_WORKSPACE_EVENT_NAMES.length, 6);
});

test("runExecutiveScenarioWorkspaceIntegrationCertification passes all gates", () => {
  const result = runExecutiveScenarioWorkspaceIntegrationCertification();
  assert.equal(result.status, "PASS");
  assert.equal(result.certified, true);
  assert.equal(result.failedChecks.length, 0);
  assert.equal(result.checks.length, 17);
});

test("does not throw for expected boundary cases", () => {
  const pkg = resolveExecutiveScenarioPackageProbeExample(FIXED_TIME);
  assert.doesNotThrow(() =>
    resolveExecutiveScenarioWorkspaceView(
      Object.freeze({
        package: pkg,
        workspaceId: "ws-other",
        generatedAt: FIXED_TIME,
      })
    )
  );
});
