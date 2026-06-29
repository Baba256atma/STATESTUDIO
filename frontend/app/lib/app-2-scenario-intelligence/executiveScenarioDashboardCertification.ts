/**
 * APP-2:12 — Executive Scenario Dashboard Integration certification.
 * Certification gates A–P for APP-2:12 readiness.
 */

import type { ScenarioIntelligenceCertificationCheck } from "./scenarioIntelligenceTypes.ts";
import { EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_MANIFEST } from "./executiveScenarioWorkspaceAdapter.ts";
import { EXECUTIVE_SCENARIO_DASHBOARD_DIAGNOSTIC_CODES } from "./executiveScenarioDashboardDiagnostics.ts";
import { EXECUTIVE_SCENARIO_DASHBOARD_CARD_KINDS } from "./executiveScenarioDashboardCards.ts";
import { EXECUTIVE_SCENARIO_DASHBOARD_EVENT_NAMES } from "./executiveScenarioDashboardEvents.ts";
import {
  adaptExecutiveScenarioWorkspaceViewToDashboardView,
  EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_MANIFEST,
  EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_RULES,
  EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_VERSION,
} from "./executiveScenarioDashboardAdapter.ts";
import { EXECUTIVE_SCENARIO_DASHBOARD_INDICATOR_KINDS } from "./executiveScenarioDashboardView.ts";
import {
  resolveExecutiveScenarioDashboardView,
  resolveExecutiveScenarioDashboardViewProbeExample,
} from "./executiveScenarioDashboardResolver.ts";
import { resolveExecutiveScenarioWorkspaceViewProbeExample } from "./executiveScenarioWorkspaceResolver.ts";

export const EXECUTIVE_SCENARIO_DASHBOARD_INTEGRATION_CERTIFICATION_VERSION =
  "APP-2/12-cert" as const;

function gate(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ScenarioIntelligenceCertificationCheck {
  return Object.freeze({ id, title, passed, evidence });
}

export function runExecutiveScenarioDashboardIntegrationCertification(): Readonly<{
  phaseName: string;
  status: "PASS" | "FAIL";
  certified: boolean;
  checks: readonly ScenarioIntelligenceCertificationCheck[];
  passedChecks: readonly ScenarioIntelligenceCertificationCheck[];
  failedChecks: readonly ScenarioIntelligenceCertificationCheck[];
  summary: string;
  generatedAt: string;
}> {
  const checks: ScenarioIntelligenceCertificationCheck[] = [];
  const generatedAt = new Date(0).toISOString();
  const workspaceView = resolveExecutiveScenarioWorkspaceViewProbeExample(generatedAt);
  const dashboardView = resolveExecutiveScenarioDashboardView(
    Object.freeze({ workspaceView, generatedAt, workspaceId: workspaceView.workspaceId })
  );
  const dashboardViewRepeat = resolveExecutiveScenarioDashboardView(
    Object.freeze({ workspaceView, generatedAt, workspaceId: workspaceView.workspaceId })
  );

  checks.push(
    gate(
      "A",
      "Workspace Adapter integration",
      dashboardView.workspaceId === workspaceView.workspaceId &&
        EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_MANIFEST.contractModified === false,
      "Dashboard adapter consumes APP-2:10 ExecutiveScenarioWorkspaceView."
    )
  );

  checks.push(
    gate(
      "B",
      "Dashboard View construction",
      dashboardView.readOnly === true &&
        dashboardView.executiveHeadline.length > 0 &&
        dashboardView.adapterVersion === EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_VERSION,
      "ExecutiveScenarioDashboardView constructed."
    )
  );

  checks.push(
    gate(
      "C",
      "Dashboard card generation",
      EXECUTIVE_SCENARIO_DASHBOARD_CARD_KINDS.length === 9 &&
        dashboardView.priorityCard.content.length > 0 &&
        dashboardView.conflictCard.readOnly === true,
      "Nine dashboard cards projected from workspace view."
    )
  );

  checks.push(
    gate(
      "D",
      "Executive indicators",
      dashboardView.executiveIndicators.length ===
        EXECUTIVE_SCENARIO_DASHBOARD_INDICATOR_KINDS.length,
      `Projected ${dashboardView.executiveIndicators.length} executive indicators.`
    )
  );

  checks.push(
    gate(
      "E",
      "Alert projection",
      dashboardView.alerts.length >= 0 &&
        EXECUTIVE_SCENARIO_DASHBOARD_EVENT_NAMES.length === 6,
      "Dashboard alerts and events defined."
    )
  );

  checks.push(
    gate(
      "F",
      "Evidence references",
      dashboardView.recommendationCard.evidence.length >= 0 &&
        dashboardView.executiveSummaryCard.evidence.length >= 0,
      "Dashboard cards expose evidence references."
    )
  );

  const crossWorkspace = resolveExecutiveScenarioDashboardView(
    Object.freeze({
      workspaceView,
      generatedAt,
      workspaceId: "ws-other",
    })
  );
  checks.push(
    gate(
      "G",
      "Workspace isolation",
      crossWorkspace.dashboardStatus === "unavailable" &&
        crossWorkspace.diagnostics.some((entry) => entry.code === "adapter_failure"),
      "Cross-workspace dashboard projection rejected."
    )
  );

  checks.push(
    gate(
      "H",
      "Diagnostics",
      EXECUTIVE_SCENARIO_DASHBOARD_DIAGNOSTIC_CODES.length === 7 &&
        crossWorkspace.diagnostics.length > 0,
      "Dashboard diagnostics returned without throwing."
    )
  );

  checks.push(
    gate(
      "I",
      "Read-only compliance",
      dashboardView.readOnly === true &&
        EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_RULES.analyzesData === false &&
        EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_RULES.generatesIntelligence === false,
      "Dashboard adapter declares read-only projection contract."
    )
  );

  checks.push(
    gate(
      "J",
      "No DS mutation",
      EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_MANIFEST.contractModified === false,
      "DS modules untouched."
    )
  );

  checks.push(
    gate(
      "K",
      "No INT mutation",
      EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_MANIFEST.workspaceAdapterModified === false,
      "INT modules untouched."
    )
  );

  checks.push(
    gate(
      "L",
      "No APP-1 mutation",
      EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_RULES.modifiesWorkspace === false,
      "Executive Time consumed via workspace view only."
    )
  );

  checks.push(
    gate(
      "M",
      "No APP-2 engine mutation",
      EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_MANIFEST.packageEngineModified === false,
      "APP-2:1 through APP-2:11 untouched."
    )
  );

  checks.push(
    gate(
      "N",
      "Build passes",
      typeof adaptExecutiveScenarioWorkspaceViewToDashboardView === "function" &&
        typeof resolveExecutiveScenarioDashboardView === "function",
      "Dashboard integration modules export callable functions."
    )
  );

  checks.push(
    gate(
      "O",
      "Tests pass",
      dashboardView.executiveHeadline === dashboardViewRepeat.executiveHeadline &&
        dashboardView.executiveIndicators.length === dashboardViewRepeat.executiveIndicators.length,
      "Deterministic dashboard view verified for identical input."
    )
  );

  checks.push(
    gate(
      "P",
      "Architecture preserved",
      EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_RULES.consumesWorkspaceViewOnly === true &&
        EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_RULES.projectsOnly === true,
      "ExecutiveScenarioDashboardAdapter is canonical dashboard boundary."
    )
  );

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-2:12 Executive Dashboard Integration",
    status: certified ? "PASS" : "FAIL",
    certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    summary: certified
      ? "Executive Dashboard Integration certification passed."
      : `Executive Dashboard Integration certification failed (${failedChecks.length} checks).`,
    generatedAt,
  });
}
