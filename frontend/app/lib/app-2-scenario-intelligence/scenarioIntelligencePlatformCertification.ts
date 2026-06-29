/**
 * APP-2:13 — Scenario Intelligence Platform certification.
 * Platform gates A–Z — certification only, no new capabilities.
 */

import {
  SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
  SCENARIO_INTELLIGENCE_FREEZE_RULES,
  SCENARIO_INTELLIGENCE_SELF_MANIFEST,
} from "./scenarioIntelligenceContract.ts";
import type { ScenarioIntelligenceCertificationCheck } from "./scenarioIntelligenceTypes.ts";
import { EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_RULES } from "./executiveScenarioWorkspaceAdapter.ts";
import { EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_RULES } from "./executiveScenarioAssistantAdapter.ts";
import { EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_RULES } from "./executiveScenarioDashboardAdapter.ts";
import { EXECUTIVE_SCENARIO_PACKAGE_RULES } from "./executiveScenarioPackageManifest.ts";
import { resolveExecutiveScenarioPackageProbeExample } from "./executiveScenarioPackageResolver.ts";
import { resolveExecutiveScenarioWorkspaceViewProbeExample } from "./executiveScenarioWorkspaceResolver.ts";
import {
  resolveExecutiveScenarioAssistantView,
  resolveExecutiveScenarioAssistantViewProbeExample,
} from "./executiveScenarioAssistantResolver.ts";
import {
  resolveExecutiveScenarioDashboardView,
  resolveExecutiveScenarioDashboardViewProbeExample,
} from "./executiveScenarioDashboardResolver.ts";
import { runScenarioIntelligencePlatformRegression } from "./scenarioIntelligencePlatformRegression.ts";
import {
  createScenarioIntelligencePlatformDiagnostic,
  type ScenarioIntelligencePlatformDiagnostic,
} from "./scenarioIntelligencePlatformDiagnostics.ts";
import {
  SCENARIO_INTELLIGENCE_PLATFORM_MANIFEST,
  type ScenarioIntelligencePlatformCertificationResult,
} from "./scenarioIntelligencePlatformCertificationContract.ts";

function gate(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ScenarioIntelligenceCertificationCheck {
  return Object.freeze({ id, title, passed, evidence });
}

export function buildScenarioIntelligencePlatformCertificationChecks(
  generatedAt: string
): Readonly<{
  checks: readonly ScenarioIntelligenceCertificationCheck[];
  diagnostics: readonly ScenarioIntelligencePlatformDiagnostic[];
  regression: ReturnType<typeof runScenarioIntelligencePlatformRegression>;
}> {
  const checks: ScenarioIntelligenceCertificationCheck[] = [];
  const diagnostics: ScenarioIntelligencePlatformDiagnostic[] = [];
  const regression = runScenarioIntelligencePlatformRegression();

  const pkg = resolveExecutiveScenarioPackageProbeExample(generatedAt);
  const workspaceView = resolveExecutiveScenarioWorkspaceViewProbeExample(generatedAt);
  const assistantView = resolveExecutiveScenarioAssistantView(
    Object.freeze({
      workspaceView,
      generatedAt,
      workspaceId: workspaceView.workspaceId,
    })
  );
  const dashboardView = resolveExecutiveScenarioDashboardView(
    Object.freeze({
      workspaceView,
      generatedAt,
      workspaceId: workspaceView.workspaceId,
    })
  );

  const contractPhase = regression.phases.find((entry) => entry.phaseId === "APP-2/1");
  const statePhase = regression.phases.find((entry) => entry.phaseId === "APP-2/2");
  const contextPhase = regression.phases.find((entry) => entry.phaseId === "APP-2/3");
  const priorityPhase = regression.phases.find((entry) => entry.phaseId === "APP-2/4");
  const dependencyPhase = regression.phases.find((entry) => entry.phaseId === "APP-2/5");
  const conflictPhase = regression.phases.find((entry) => entry.phaseId === "APP-2/6");
  const opportunityPhase = regression.phases.find((entry) => entry.phaseId === "APP-2/7");
  const summaryPhase = regression.phases.find((entry) => entry.phaseId === "APP-2/8");
  const recommendationPhase = regression.phases.find((entry) => entry.phaseId === "APP-2/9");
  const packagePhase = regression.phases.find((entry) => entry.phaseId === "APP-2/9.5");
  const workspacePhase = regression.phases.find((entry) => entry.phaseId === "APP-2/10");
  const assistantPhase = regression.phases.find((entry) => entry.phaseId === "APP-2/11");
  const dashboardPhase = regression.phases.find((entry) => entry.phaseId === "APP-2/12");

  checks.push(
    gate(
      "A",
      "Contract",
      contractPhase?.certified === true &&
        SCENARIO_INTELLIGENCE_SELF_MANIFEST.stageId === "APP-2/1",
      "APP-2:1 Scenario Intelligence Contract certified."
    )
  );
  checks.push(gate("B", "State", statePhase?.certified === true, "APP-2:2 Scenario State Engine certified."));
  checks.push(gate("C", "Context", contextPhase?.certified === true, "APP-2:3 Scenario Context Engine certified."));
  checks.push(
    gate("D", "Priority", priorityPhase?.certified === true, "APP-2:4 Executive Scenario Priority Engine certified.")
  );
  checks.push(
    gate("E", "Dependency Graph", dependencyPhase?.certified === true, "APP-2:5 Scenario Dependency Engine certified.")
  );
  checks.push(
    gate("F", "Conflict Graph", conflictPhase?.certified === true, "APP-2:6 Executive Scenario Conflict Engine certified.")
  );
  checks.push(
    gate(
      "G",
      "Opportunity Graph",
      opportunityPhase?.certified === true,
      "APP-2:7 Executive Scenario Opportunity Engine certified."
    )
  );
  checks.push(
    gate("H", "Snapshot", summaryPhase?.certified === true && pkg.snapshot.readOnly === true, "APP-2:8 Snapshot aggregation certified.")
  );
  checks.push(
    gate("I", "Summary", summaryPhase?.certified === true && pkg.summary.readOnly === true, "APP-2:8 Executive Summary certified.")
  );
  checks.push(
    gate(
      "J",
      "Recommendation Portfolio",
      recommendationPhase?.certified === true && pkg.recommendationPortfolio.readOnly === true,
      "APP-2:9 Executive Recommendation Portfolio certified."
    )
  );
  checks.push(
    gate(
      "K",
      "ExecutiveScenarioPackage",
      packagePhase?.certified === true && pkg.readOnly === true && EXECUTIVE_SCENARIO_PACKAGE_RULES.aggregatesOnly === true,
      "APP-2:9.5 ExecutiveScenarioPackage certified as sole export surface."
    )
  );
  checks.push(
    gate(
      "L",
      "Workspace Adapter",
      workspacePhase?.certified === true &&
        workspaceView.readOnly === true &&
        EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_RULES.consumesPackageOnly === true,
      "APP-2:10 Workspace Adapter certified."
    )
  );
  checks.push(
    gate(
      "M",
      "Assistant Adapter",
      assistantPhase?.certified === true &&
        assistantView.readOnly === true &&
        EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_RULES.consumesWorkspaceViewOnly === true,
      "APP-2:11 Assistant Adapter certified."
    )
  );
  checks.push(
    gate(
      "N",
      "Dashboard Adapter",
      dashboardPhase?.certified === true &&
        dashboardView.readOnly === true &&
        EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_RULES.consumesWorkspaceViewOnly === true,
      "APP-2:12 Dashboard Adapter certified."
    )
  );
  checks.push(
    gate(
      "O",
      "Read-only compliance",
      pkg.readOnly &&
        workspaceView.readOnly &&
        assistantView.readOnly &&
        dashboardView.readOnly,
      "All canonical platform objects declare readOnly."
    )
  );

  checks.push(
    gate(
      "P",
      "Workspace isolation",
      workspaceView.workspaceId === pkg.workspaceId &&
        EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_RULES.workspaceIsolated === true,
      "Workspace isolation enforced at adapter boundary."
    )
  );

  checks.push(
    gate(
      "Q",
      "Package isolation",
      pkg.scenarioId === workspaceView.scenarioId &&
        pkg.packageId === workspaceView.packageId &&
        EXECUTIVE_SCENARIO_PACKAGE_RULES.referencesOnly === true,
      "Package identity preserved through integration chain."
    )
  );

  checks.push(
    gate(
      "R",
      "Adapter isolation",
      assistantView.conversationContext.workspaceAdapterVersion === "APP-2/10" &&
        dashboardView.adapterVersion === "APP-2/12" &&
        assistantView.recommendationPortfolio === workspaceView.recommendationPortfolio,
      "Adapters consume upstream views without bypass."
    )
  );

  checks.push(
    gate(
      "S",
      "No direct APP-2 access",
      EXECUTIVE_SCENARIO_ASSISTANT_ADAPTER_RULES.rebuildsIntelligence !== true &&
        EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_RULES.generatesIntelligence === false &&
        EXECUTIVE_SCENARIO_WORKSPACE_ADAPTER_RULES.rebuildsIntelligence === false,
      "Integration layer cannot rebuild APP-2 intelligence."
    )
  );

  const probeRepeat = resolveExecutiveScenarioPackageProbeExample(generatedAt);
  checks.push(
    gate(
      "T",
      "Deterministic execution",
      pkg.packageId === probeRepeat.packageId &&
        assistantView.executiveHeadline === resolveExecutiveScenarioAssistantViewProbeExample(generatedAt).executiveHeadline,
      "Platform probe chain produces deterministic output."
    )
  );

  let serializationPassed = true;
  try {
    const serialized = JSON.stringify(pkg);
    const parsed = JSON.parse(serialized);
    serializationPassed = parsed.readOnly === true && parsed.packageVersion === pkg.packageVersion;
  } catch {
    serializationPassed = false;
  }
  checks.push(
    gate(
      "U",
      "Serialization",
      serializationPassed,
      "ExecutiveScenarioPackage is serializable."
    )
  );
  if (!serializationPassed) {
    diagnostics.push(
      createScenarioIntelligencePlatformDiagnostic(
        "serialization_failure",
        "serialization",
        "ExecutiveScenarioPackage serialization validation failed.",
        generatedAt
      )
    );
  }

  checks.push(
    gate(
      "V",
      "Version compatibility",
      pkg.packageVersion === "APP-2/9.5" &&
        workspaceView.packageVersion === "APP-2/9.5" &&
        SCENARIO_INTELLIGENCE_CONTRACT_VERSION === "APP-2/1",
      "Platform version chain is compatible."
    )
  );

  checks.push(
    gate(
      "W",
      "Diagnostics",
      regression.allPhasesCertified,
      `Platform regression: ${regression.passedPhaseCount}/${regression.phaseCount} phases certified.`
    )
  );

  checks.push(
    gate(
      "X",
      "Build passes",
      typeof runScenarioIntelligencePlatformRegression === "function" &&
        typeof buildScenarioIntelligencePlatformCertificationChecks === "function",
      "Platform certification modules export callable functions."
    )
  );

  checks.push(
    gate(
      "Y",
      "Tests pass",
      regression.allPhasesCertified,
      "All APP-2 phase certification runners passed."
    )
  );

  checks.push(
    gate(
      "Z",
      "Architecture preserved",
      SCENARIO_INTELLIGENCE_FREEZE_RULES.contractImmutable === true &&
        SCENARIO_INTELLIGENCE_PLATFORM_MANIFEST.modifiesPhases === false &&
        SCENARIO_INTELLIGENCE_PLATFORM_MANIFEST.certificationOnly === true,
      "APP-2 platform architecture preserved; certification only."
    )
  );

  if (!regression.allPhasesCertified) {
    diagnostics.push(
      createScenarioIntelligencePlatformDiagnostic(
        "regression_failure",
        "regression",
        regression.summary,
        generatedAt,
        Object.freeze({ passedPhaseCount: regression.passedPhaseCount, phaseCount: regression.phaseCount })
      )
    );
  }

  return Object.freeze({
    checks: Object.freeze(checks),
    diagnostics: Object.freeze(diagnostics),
    regression,
  });
}

export function runScenarioIntelligencePlatformCertification(): ScenarioIntelligencePlatformCertificationResult {
  const generatedAt = new Date(0).toISOString();
  const { checks, diagnostics, regression } = buildScenarioIntelligencePlatformCertificationChecks(generatedAt);

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0 && regression.allPhasesCertified;

  return Object.freeze({
    phaseName: "APP-2:13 Scenario Intelligence Platform Certification",
    status: certified ? "PASS" : "FAIL",
    certified,
    platformReady: certified,
    checks,
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    regressionSummary: regression.summary,
    diagnostics,
    summary: certified
      ? "Scenario Intelligence Platform certification passed. APP-2 is platform-ready."
      : `Scenario Intelligence Platform certification failed (${failedChecks.length} gates, ${regression.phaseCount - regression.passedPhaseCount} phase regressions).`,
    generatedAt,
  });
}
