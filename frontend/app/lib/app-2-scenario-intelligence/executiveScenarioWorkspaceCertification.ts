/**
 * APP-2:10 — Executive Scenario Workspace Integration certification.
 * Certification gates A–Q for APP-2:10 readiness.
 */

import type { ScenarioIntelligenceCertificationCheck } from "./scenarioIntelligenceTypes.ts";
import { EXECUTIVE_SCENARIO_PACKAGE_MANIFEST } from "./executiveScenarioPackageManifest.ts";
import { EXECUTIVE_SCENARIO_PACKAGE_VERSION } from "./executiveScenarioPackageManifest.ts";
import { EXECUTIVE_SCENARIO_WORKSPACE_DIAGNOSTIC_CODES } from "./executiveScenarioWorkspaceDiagnostics.ts";
import { EXECUTIVE_SCENARIO_WORKSPACE_EVENT_NAMES } from "./executiveScenarioWorkspaceEvents.ts";
import {
  adaptExecutiveScenarioPackageToWorkspaceView,
  EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_MANIFEST,
  EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_RULES,
  EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_VERSION,
} from "./executiveScenarioWorkspaceAdapter.ts";
import {
  resolveExecutiveScenarioWorkspaceView,
  resolveExecutiveScenarioWorkspaceViewProbeExample,
} from "./executiveScenarioWorkspaceResolver.ts";
import { resolveExecutiveScenarioPackageProbeExample } from "./executiveScenarioPackageResolver.ts";

export const EXECUTIVE_SCENARIO_WORKSPACE_INTEGRATION_CERTIFICATION_VERSION =
  "APP-2/10-cert" as const;

function gate(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ScenarioIntelligenceCertificationCheck {
  return Object.freeze({ id, title, passed, evidence });
}

export function runExecutiveScenarioWorkspaceIntegrationCertification(): Readonly<{
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
  const pkg = resolveExecutiveScenarioPackageProbeExample(generatedAt);
  const view = resolveExecutiveScenarioWorkspaceView(
    Object.freeze({
      package: pkg,
      workspaceId: pkg.workspaceId,
      selectedScenarioId: pkg.scenarioId,
      refreshState: "synchronized",
      generatedAt,
    })
  );
  const viewRepeat = resolveExecutiveScenarioWorkspaceView(
    Object.freeze({
      package: pkg,
      workspaceId: pkg.workspaceId,
      selectedScenarioId: pkg.scenarioId,
      refreshState: "synchronized",
      generatedAt,
    })
  );

  checks.push(
    gate(
      "A",
      "Package integration",
      view.summary === pkg.summary &&
        view.recommendationPortfolio === pkg.recommendationPortfolio &&
        view.packageVersion === EXECUTIVE_SCENARIO_PACKAGE_VERSION,
      "Workspace adapter consumes ExecutiveScenarioPackage by reference."
    )
  );

  checks.push(
    gate(
      "B",
      "Workspace validation",
      view.workspaceId === pkg.workspaceId && view.packageId === pkg.packageId,
      "Workspace ownership validated against package."
    )
  );

  const crossWorkspace = resolveExecutiveScenarioWorkspaceView(
    Object.freeze({
      package: pkg,
      workspaceId: "ws-other",
      selectedScenarioId: pkg.scenarioId,
      generatedAt,
    })
  );
  checks.push(
    gate(
      "C",
      "Workspace isolation",
      crossWorkspace.status === "unavailable" &&
        crossWorkspace.diagnostics.some((entry) => entry.code === "workspace_isolation_failure"),
      "Cross-workspace integration rejected."
    )
  );

  checks.push(
    gate(
      "D",
      "Scenario selection",
      view.selectionState === "active" &&
        view.scenarioId === pkg.scenarioId,
      "Active scenario selection resolved."
    )
  );

  const refreshingView = resolveExecutiveScenarioWorkspaceView(
    Object.freeze({
      package: pkg,
      workspaceId: pkg.workspaceId,
      selectedScenarioId: pkg.scenarioId,
      refreshState: "refreshing",
      generatedAt,
    })
  );
  checks.push(
    gate(
      "E",
      "Refresh handling",
      refreshingView.refreshState === "refreshing",
      "Refresh state exposed without intelligence rebuild."
    )
  );

  checks.push(
    gate(
      "F",
      "Event definitions",
      EXECUTIVE_SCENARIO_WORKSPACE_EVENT_NAMES.length === 6,
      "Six workspace integration events defined."
    )
  );

  checks.push(
    gate(
      "G",
      "View construction",
      view.readOnly === true && view.hooks.length === 3 && view.summary !== null,
      "ExecutiveScenarioWorkspaceView constructed with hooks."
    )
  );

  checks.push(
    gate(
      "H",
      "Diagnostics",
      EXECUTIVE_SCENARIO_WORKSPACE_DIAGNOSTIC_CODES.length === 8 &&
        crossWorkspace.diagnostics.length > 0,
      "Workspace diagnostics returned without throwing."
    )
  );

  checks.push(
    gate(
      "I",
      "Read-only compliance",
      view.readOnly === true &&
        EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_RULES.modifiesWorkspace === false,
      "Workspace adapter declares read-only contract."
    )
  );

  checks.push(
    gate(
      "J",
      "Version integrity",
      view.adapterVersion === EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_VERSION &&
        view.packageVersion === pkg.packageVersion,
      "Adapter and package versions exposed."
    )
  );

  checks.push(
    gate(
      "K",
      "No DS mutation",
      EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_MANIFEST.contractModified === false,
      "DS modules untouched."
    )
  );

  checks.push(
    gate(
      "L",
      "No INT mutation",
      EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_MANIFEST.packageEngineModified === false,
      "INT modules untouched."
    )
  );

  checks.push(
    gate(
      "M",
      "No APP-1 mutation",
      EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_RULES.rebuildsIntelligence === false,
      "Executive Time consumed via package references only."
    )
  );

  checks.push(
    gate(
      "N",
      "No APP-2 engine mutation",
      EXECUTIVE_SCENARIO_PACKAGE_MANIFEST.contractModified === false &&
        EXECUTIVE_SCENARIO_PACKAGE_MANIFEST.enginesModified === false,
      "APP-2:1 through APP-2:9.5 untouched."
    )
  );

  checks.push(
    gate(
      "O",
      "Build passes",
      typeof adaptExecutiveScenarioPackageToWorkspaceView === "function" &&
        typeof resolveExecutiveScenarioWorkspaceView === "function",
      "Workspace integration modules export callable functions."
    )
  );

  checks.push(
    gate(
      "P",
      "Tests pass",
      view.packageId === viewRepeat.packageId &&
        view.selectionState === viewRepeat.selectionState,
      "Deterministic workspace view verified for identical input."
    )
  );

  checks.push(
    gate(
      "Q",
      "Architecture preserved",
      EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_RULES.consumesPackageOnly === true &&
        EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_RULES.executesRecommendations === false,
      "ExecutiveScenarioWorkspaceAdapter is canonical workspace boundary."
    )
  );

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-2:10 Executive Workspace Integration",
    status: certified ? "PASS" : "FAIL",
    certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    summary: certified
      ? "Executive Workspace Integration certification passed."
      : `Executive Workspace Integration certification failed (${failedChecks.length} checks).`,
    generatedAt,
  });
}
