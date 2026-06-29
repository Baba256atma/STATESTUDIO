/**
 * APP-2:13 — Scenario Intelligence Platform regression.
 * Aggregates phase certifications APP-2:1 through APP-2:12 — no modifications.
 */

import {
  SCENARIO_INTELLIGENCE_FREEZE_RULES,
  SCENARIO_INTELLIGENCE_SELF_MANIFEST,
} from "./scenarioIntelligenceContract.ts";
import { runScenarioStateEngineCertification } from "./scenarioStateEngineCertification.ts";
import { runScenarioContextEngineCertification } from "./scenarioContextEngineCertification.ts";
import { runExecutiveScenarioPriorityEngineCertification } from "./executiveScenarioPriorityCertification.ts";
import { runScenarioDependencyEngineCertification } from "./scenarioDependencyCertification.ts";
import { runExecutiveScenarioConflictEngineCertification } from "./executiveScenarioConflictCertification.ts";
import { runExecutiveScenarioOpportunityEngineCertification } from "./executiveScenarioOpportunityCertification.ts";
import { runExecutiveScenarioSummaryEngineCertification } from "./executiveScenarioSummaryCertification.ts";
import { runExecutiveRecommendationEngineCertification } from "./executiveRecommendationCertification.ts";
import { runExecutiveScenarioPackageCertification } from "./executiveScenarioPackageCertification.ts";
import { runExecutiveScenarioWorkspaceIntegrationCertification } from "./executiveScenarioWorkspaceCertification.ts";
import { runExecutiveScenarioAssistantIntegrationCertification } from "./executiveScenarioAssistantCertification.ts";
import { runExecutiveScenarioDashboardIntegrationCertification } from "./executiveScenarioDashboardCertification.ts";
import type {
  ScenarioIntelligencePlatformPhaseRegressionEntry,
  ScenarioIntelligencePlatformRegressionResult,
} from "./scenarioIntelligencePlatformCertificationContract.ts";

function entry(
  phaseId: string,
  phaseName: string,
  certified: boolean,
  checkCount: number,
  failedCheckCount: number
): ScenarioIntelligencePlatformPhaseRegressionEntry {
  return Object.freeze({
    phaseId,
    phaseName,
    status: certified ? "PASS" : "FAIL",
    certified,
    checkCount,
    failedCheckCount,
  });
}

export function runScenarioIntelligencePlatformRegression(): ScenarioIntelligencePlatformRegressionResult {
  const generatedAt = new Date(0).toISOString();

  const contractCertified =
    SCENARIO_INTELLIGENCE_SELF_MANIFEST.stageId === "APP-2/1" &&
    SCENARIO_INTELLIGENCE_FREEZE_RULES.contractImmutable === true;

  const state = runScenarioStateEngineCertification();
  const context = runScenarioContextEngineCertification();
  const priority = runExecutiveScenarioPriorityEngineCertification();
  const dependency = runScenarioDependencyEngineCertification();
  const conflict = runExecutiveScenarioConflictEngineCertification();
  const opportunity = runExecutiveScenarioOpportunityEngineCertification();
  const summary = runExecutiveScenarioSummaryEngineCertification();
  const recommendation = runExecutiveRecommendationEngineCertification();
  const pkg = runExecutiveScenarioPackageCertification();
  const workspace = runExecutiveScenarioWorkspaceIntegrationCertification();
  const assistant = runExecutiveScenarioAssistantIntegrationCertification();
  const dashboard = runExecutiveScenarioDashboardIntegrationCertification();

  const phases: ScenarioIntelligencePlatformPhaseRegressionEntry[] = [
    entry("APP-2/1", "Scenario Intelligence Contract", contractCertified, 1, contractCertified ? 0 : 1),
    entry("APP-2/2", state.phaseName, state.certified, state.checks.length, state.failedChecks.length),
    entry("APP-2/3", context.phaseName, context.certified, context.checks.length, context.failedChecks.length),
    entry("APP-2/4", priority.phaseName, priority.certified, priority.checks.length, priority.failedChecks.length),
    entry(
      "APP-2/5",
      dependency.phaseName,
      dependency.certified,
      dependency.checks.length,
      dependency.failedChecks.length
    ),
    entry("APP-2/6", conflict.phaseName, conflict.certified, conflict.checks.length, conflict.failedChecks.length),
    entry(
      "APP-2/7",
      opportunity.phaseName,
      opportunity.certified,
      opportunity.checks.length,
      opportunity.failedChecks.length
    ),
    entry("APP-2/8", summary.phaseName, summary.certified, summary.checks.length, summary.failedChecks.length),
    entry(
      "APP-2/9",
      recommendation.phaseName,
      recommendation.certified,
      recommendation.checks.length,
      recommendation.failedChecks.length
    ),
    entry("APP-2/9.5", pkg.phaseName, pkg.certified, pkg.checks.length, pkg.failedChecks.length),
    entry("APP-2/10", workspace.phaseName, workspace.certified, workspace.checks.length, workspace.failedChecks.length),
    entry("APP-2/11", assistant.phaseName, assistant.certified, assistant.checks.length, assistant.failedChecks.length),
    entry("APP-2/12", dashboard.phaseName, dashboard.certified, dashboard.checks.length, dashboard.failedChecks.length),
  ];

  const passedPhaseCount = phases.filter((phase) => phase.certified).length;
  const allPhasesCertified = passedPhaseCount === phases.length;

  return Object.freeze({
    status: allPhasesCertified ? "PASS" : "FAIL",
    allPhasesCertified,
    phaseCount: phases.length,
    passedPhaseCount,
    phases: Object.freeze(phases),
    summary: allPhasesCertified
      ? `All ${phases.length} APP-2 phases passed regression certification.`
      : `APP-2 platform regression failed (${phases.length - passedPhaseCount} phases).`,
    generatedAt,
  });
}
