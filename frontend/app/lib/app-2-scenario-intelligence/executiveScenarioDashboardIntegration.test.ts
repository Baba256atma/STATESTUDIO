import assert from "node:assert/strict";
import test from "node:test";

import {
  adaptExecutiveScenarioWorkspaceViewToDashboardView,
  EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_RULES,
  EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_VERSION,
} from "./executiveScenarioDashboardAdapter.ts";
import { EXECUTIVE_SCENARIO_DASHBOARD_CARD_KINDS } from "./executiveScenarioDashboardCards.ts";
import { EXECUTIVE_SCENARIO_DASHBOARD_DIAGNOSTIC_CODES } from "./executiveScenarioDashboardDiagnostics.ts";
import { EXECUTIVE_SCENARIO_DASHBOARD_EVENT_NAMES } from "./executiveScenarioDashboardEvents.ts";
import {
  resolveExecutiveScenarioDashboardView,
  resolveExecutiveScenarioDashboardViewProbeExample,
} from "./executiveScenarioDashboardResolver.ts";
import { runExecutiveScenarioDashboardIntegrationCertification } from "./executiveScenarioDashboardCertification.ts";
import { EXECUTIVE_SCENARIO_DASHBOARD_INDICATOR_KINDS } from "./executiveScenarioDashboardView.ts";
import { resolveExecutiveScenarioWorkspaceViewProbeExample } from "./executiveScenarioWorkspaceResolver.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test("consumes workspace view for dashboard projection", () => {
  const workspaceView = resolveExecutiveScenarioWorkspaceViewProbeExample(FIXED_TIME);
  const dashboardView = resolveExecutiveScenarioDashboardView(
    Object.freeze({ workspaceView, generatedAt: FIXED_TIME, workspaceId: workspaceView.workspaceId })
  );

  assert.equal(dashboardView.workspaceId, workspaceView.workspaceId);
  assert.equal(dashboardView.scenarioId, workspaceView.scenarioId);
  assert.equal(dashboardView.readOnly, true);
  assert.equal(dashboardView.adapterVersion, "APP-2/12");
});

test("generates nine dashboard cards with evidence", () => {
  const dashboardView = resolveExecutiveScenarioDashboardViewProbeExample(FIXED_TIME);

  assert.equal(EXECUTIVE_SCENARIO_DASHBOARD_CARD_KINDS.length, 9);
  assert.ok(dashboardView.executiveHeadline.length > 0);
  assert.ok(dashboardView.executiveSummary.length > 0);
  assert.ok(dashboardView.priorityCard.content.length > 0);
  assert.ok(dashboardView.conflictCard.content.length > 0);
  assert.ok(dashboardView.recommendationCard.content.length > 0);
  assert.equal(dashboardView.priorityCard.readOnly, true);
});

test("projects executive indicators from certified outputs", () => {
  const dashboardView = resolveExecutiveScenarioDashboardViewProbeExample(FIXED_TIME);

  assert.equal(dashboardView.executiveIndicators.length, EXECUTIVE_SCENARIO_DASHBOARD_INDICATOR_KINDS.length);
  assert.ok(dashboardView.executiveIndicators.some((entry) => entry.kind === "overall_status"));
  assert.ok(dashboardView.executiveIndicators.some((entry) => entry.kind === "recommendation_count"));
});

test("generates dashboard alerts when conditions match", () => {
  const dashboardView = resolveExecutiveScenarioDashboardViewProbeExample(FIXED_TIME);

  assert.ok(Array.isArray(dashboardView.alerts));
  for (const alert of dashboardView.alerts) {
    assert.ok(alert.alertId);
    assert.ok(alert.label);
    assert.equal(alert.readOnly, true);
  }
});

test("enforces workspace isolation", () => {
  const workspaceView = resolveExecutiveScenarioWorkspaceViewProbeExample(FIXED_TIME);
  const dashboardView = resolveExecutiveScenarioDashboardView(
    Object.freeze({ workspaceView, generatedAt: FIXED_TIME, workspaceId: "ws-other" })
  );

  assert.equal(dashboardView.dashboardStatus, "unavailable");
  assert.ok(dashboardView.diagnostics.some((entry) => entry.code === "adapter_failure"));
});

test("produces deterministic dashboard projection", () => {
  const first = resolveExecutiveScenarioDashboardViewProbeExample(FIXED_TIME);
  const second = resolveExecutiveScenarioDashboardViewProbeExample(FIXED_TIME);

  assert.equal(first.executiveHeadline, second.executiveHeadline);
  assert.equal(first.executiveIndicators.length, second.executiveIndicators.length);
  assert.equal(first.priorityCard.content, second.priorityCard.content);
});

test("declares projection-only read-only rules", () => {
  assert.equal(EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_RULES.consumesWorkspaceViewOnly, true);
  assert.equal(EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_RULES.generatesIntelligence, false);
  assert.equal(EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_RULES.analyzesData, false);
  assert.equal(EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_RULES.executesRecommendations, false);
  assert.equal(EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_RULES.projectsOnly, true);
  assert.equal(EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_VERSION, "APP-2/12");
});

test("defines dashboard diagnostic and event vocabularies", () => {
  assert.equal(EXECUTIVE_SCENARIO_DASHBOARD_DIAGNOSTIC_CODES.length, 7);
  assert.equal(EXECUTIVE_SCENARIO_DASHBOARD_EVENT_NAMES.length, 6);
});

test("runExecutiveScenarioDashboardIntegrationCertification passes all gates", () => {
  const result = runExecutiveScenarioDashboardIntegrationCertification();
  assert.equal(result.status, "PASS");
  assert.equal(result.certified, true);
  assert.equal(result.failedChecks.length, 0);
  assert.equal(result.checks.length, 16);
});

test("does not throw for expected boundary cases", () => {
  const workspaceView = resolveExecutiveScenarioWorkspaceViewProbeExample(FIXED_TIME);
  assert.doesNotThrow(() =>
    resolveExecutiveScenarioDashboardView(
      Object.freeze({ workspaceView, generatedAt: FIXED_TIME, workspaceId: "ws-other" })
    )
  );
});

test("formats cards without rebuilding intelligence", () => {
  const workspaceView = resolveExecutiveScenarioWorkspaceViewProbeExample(FIXED_TIME);
  const dashboardView = adaptExecutiveScenarioWorkspaceViewToDashboardView(
    Object.freeze({ workspaceView, generatedAt: FIXED_TIME })
  );

  assert.equal(dashboardView.conflictCard.content, workspaceView.summary?.conflictSummary);
  assert.equal(dashboardView.opportunityCard.content, workspaceView.summary?.opportunitySummary);
});
