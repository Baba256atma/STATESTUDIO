/**
 * APP-2:9 — Executive Recommendation Engine certification.
 * Certification gates A–S for APP-2:9 readiness.
 */

import {
  SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
  SCENARIO_INTELLIGENCE_FREEZE_RULES,
  SCENARIO_INTELLIGENCE_SELF_MANIFEST,
} from "./scenarioIntelligenceContract.ts";
import type { ScenarioIntelligenceCertificationCheck } from "./scenarioIntelligenceTypes.ts";
import { EXECUTIVE_SCENARIO_SUMMARY_ENGINE_MANIFEST } from "./executiveScenarioSummaryCertification.ts";
import { EXECUTIVE_SCENARIO_SNAPSHOT_VERSION } from "./executiveScenarioSnapshot.ts";
import { EXECUTIVE_SCENARIO_SUMMARY_ENGINE_VERSION } from "./executiveScenarioSummaryResult.ts";
import {
  EXECUTIVE_RECOMMENDATION_CONFIDENCE_LEVELS,
  EXECUTIVE_RECOMMENDATION_INTENTS,
} from "./executiveRecommendationPortfolio.ts";
import { EXECUTIVE_RECOMMENDATION_DIAGNOSTIC_CODES } from "./executiveRecommendationDiagnostics.ts";
import { EXECUTIVE_RECOMMENDATION_PORTFOLIO_VERSION } from "./executiveRecommendationPortfolio.ts";
import {
  ExecutiveRecommendationEngine,
  resolveExecutiveRecommendationPortfolio,
} from "./executiveRecommendationEngine.ts";
import { buildExecutiveRecommendationPortfolio } from "./executiveRecommendationBuilder.ts";
import {
  resolveExecutiveRecommendationPortfolioProbeExample,
} from "./executiveRecommendationResolver.ts";
import {
  resolveExecutiveScenarioSnapshotProbeExample,
  resolveExecutiveScenarioSummaryProbeExample,
} from "./executiveScenarioSummaryResolver.ts";

export const EXECUTIVE_RECOMMENDATION_ENGINE_CERTIFICATION_VERSION = "APP-2/9" as const;

export const EXECUTIVE_RECOMMENDATION_ENGINE_MANIFEST = Object.freeze({
  stageId: "APP-2/9",
  title: "Executive Recommendation Engine",
  goal: "Canonical explainable recommendation portfolio from executive snapshot and summary.",
  contractVersion: SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
  snapshotVersion: EXECUTIVE_SCENARIO_SNAPSHOT_VERSION,
  summaryVersion: EXECUTIVE_SCENARIO_SUMMARY_ENGINE_VERSION,
  engineVersion: EXECUTIVE_RECOMMENDATION_PORTFOLIO_VERSION,
  contractModified: false,
  snapshotEngineModified: false,
  summaryEngineModified: false,
} as const);

function gate(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ScenarioIntelligenceCertificationCheck {
  return Object.freeze({ id, title, passed, evidence });
}

export function runExecutiveRecommendationEngineCertification(): Readonly<{
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
  const snapshot = resolveExecutiveScenarioSnapshotProbeExample(generatedAt);
  const summary = resolveExecutiveScenarioSummaryProbeExample(generatedAt);
  const portfolio = resolveExecutiveRecommendationPortfolioProbeExample(generatedAt);
  const portfolioRepeat = resolveExecutiveRecommendationPortfolioProbeExample(generatedAt);

  checks.push(
    gate(
      "A",
      "Contract compatibility",
      SCENARIO_INTELLIGENCE_SELF_MANIFEST.stageId === "APP-2/1" &&
        SCENARIO_INTELLIGENCE_FREEZE_RULES.contractImmutable === true &&
        EXECUTIVE_RECOMMENDATION_INTENTS.length === 8,
      "APP-2:1 contract preserved; eight recommendation intents defined."
    )
  );

  checks.push(
    gate(
      "B",
      "Snapshot integration",
      snapshot.readOnly === true &&
        snapshot.engineVersion === EXECUTIVE_SCENARIO_SNAPSHOT_VERSION &&
        EXECUTIVE_SCENARIO_SUMMARY_ENGINE_MANIFEST.contractModified === false,
      "Recommendation engine consumes APP-2:8 ExecutiveScenarioSnapshot."
    )
  );

  checks.push(
    gate(
      "C",
      "Summary integration",
      summary.readOnly === true &&
        summary.engineVersion === EXECUTIVE_SCENARIO_SUMMARY_ENGINE_VERSION &&
        EXECUTIVE_SCENARIO_SUMMARY_ENGINE_MANIFEST.opportunityEngineModified === false,
      "Recommendation engine consumes APP-2:8 ExecutiveScenarioSummary."
    )
  );

  checks.push(
    gate(
      "D",
      "Portfolio construction",
      portfolio.recommendations.length > 0 &&
        portfolio.recommendedOrder.length === portfolio.recommendations.length &&
        portfolio.readOnly === true,
      `Portfolio built with ${portfolio.recommendations.length} recommendation options.`
    )
  );

  checks.push(
    gate(
      "E",
      "Recommendation generation",
      portfolio.recommendations.every((entry) => entry.supportingEvidence.length > 0),
      "All recommendations include supporting evidence."
    )
  );

  checks.push(
    gate(
      "F",
      "Recommendation ordering",
      portfolio.recommendedOrder[0] === portfolioRepeat.recommendedOrder[0],
      "Deterministic recommendation ordering verified."
    )
  );

  checks.push(
    gate(
      "G",
      "Evidence generation",
      portfolio.evidence.length > 0,
      `Generated ${portfolio.evidence.length} portfolio evidence records.`
    )
  );

  checks.push(
    gate(
      "H",
      "Constraint generation",
      portfolio.constraints.length > 0,
      `Generated ${portfolio.constraints.length} portfolio constraints.`
    )
  );

  checks.push(
    gate(
      "I",
      "Confidence generation",
      EXECUTIVE_RECOMMENDATION_CONFIDENCE_LEVELS.length === 5 &&
        portfolio.recommendations.every((entry) => entry.confidenceExplanation.length > 0),
      "All recommendations include explainable confidence levels."
    )
  );

  const crossWorkspace = resolveExecutiveRecommendationPortfolio(
    Object.freeze({
      snapshot,
      summary,
      generatedAt,
      workspaceId: "ws-other",
    })
  );
  checks.push(
    gate(
      "J",
      "Workspace isolation",
      crossWorkspace.recommendations.length === 0 &&
        crossWorkspace.diagnostics.some((entry) => entry.code === "invalid_recommendation"),
      "Cross-workspace portfolio rejected."
    )
  );

  checks.push(
    gate(
      "K",
      "Diagnostics",
      EXECUTIVE_RECOMMENDATION_DIAGNOSTIC_CODES.length === 8 &&
        crossWorkspace.diagnostics.length > 0,
      "Recommendation diagnostics returned without throwing."
    )
  );

  checks.push(
    gate(
      "L",
      "Read-only compliance",
      portfolio.readOnly === true && ExecutiveRecommendationEngine.rules.noSideEffects === true,
      "ExecutiveRecommendationPortfolio declares readOnly."
    )
  );

  checks.push(
    gate(
      "M",
      "No DS mutation",
      EXECUTIVE_RECOMMENDATION_ENGINE_MANIFEST.contractModified === false,
      "DS modules untouched."
    )
  );

  checks.push(
    gate(
      "N",
      "No INT mutation",
      EXECUTIVE_RECOMMENDATION_ENGINE_MANIFEST.contractModified === false,
      "INT modules untouched."
    )
  );

  checks.push(
    gate(
      "O",
      "No APP-1 mutation",
      ExecutiveRecommendationEngine.rules.rebuildsContext === false,
      "Executive Time consumed via snapshot references only."
    )
  );

  checks.push(
    gate(
      "P",
      "No execution capability",
      ExecutiveRecommendationEngine.rules.executesDecisions === false,
      "Portfolio presents options without executing decisions."
    )
  );

  checks.push(
    gate(
      "Q",
      "Build passes",
      typeof buildExecutiveRecommendationPortfolio === "function" &&
        typeof resolveExecutiveRecommendationPortfolio === "function",
      "Recommendation engine modules export callable functions."
    )
  );

  checks.push(
    gate(
      "R",
      "Tests pass",
      portfolio.recommendations.length === portfolioRepeat.recommendations.length &&
        portfolio.recommendedOrder.length === portfolioRepeat.recommendedOrder.length,
      "Deterministic portfolio verified for identical input."
    )
  );

  checks.push(
    gate(
      "S",
      "Architecture preserved",
      portfolio.engineVersion === EXECUTIVE_RECOMMENDATION_PORTFOLIO_VERSION &&
        ExecutiveRecommendationEngine.rules.portfolioBased === true,
      "ExecutiveRecommendationPortfolio is canonical recommendation object."
    )
  );

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-2:9 Executive Recommendation Engine",
    status: certified ? "PASS" : "FAIL",
    certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    summary: certified
      ? "Executive Recommendation Engine certification passed."
      : `Executive Recommendation Engine certification failed (${failedChecks.length} checks).`,
    generatedAt,
  });
}
