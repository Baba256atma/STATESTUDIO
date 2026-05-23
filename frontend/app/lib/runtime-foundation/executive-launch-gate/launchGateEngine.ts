import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import { aggregateLaunchEvidence } from "./evidenceAggregation.ts";
import { detectLaunchBlockers } from "./blockerDetection.ts";
import { prioritizeReadinessRisks } from "./riskPrioritization.ts";
import { buildLaunchReadinessScorecard } from "./launchScorecard.ts";
import { classifyLaunchGovernance } from "./governanceClassification.ts";
import { deriveProductionReadinessGateState, generateLaunchRecommendation } from "./launchRecommendation.ts";
import { buildLaunchDecisionExplainability } from "./launchExplainability.ts";
import { generateExecutiveLaunchSummary } from "./executiveLaunchSummary.ts";
import type {
  ExecutiveLaunchGateInput,
  ExecutiveLaunchGateResult,
} from "./executiveLaunchGateTypes.ts";

export function evaluateExecutiveLaunchGate(input: ExecutiveLaunchGateInput): ExecutiveLaunchGateResult {
  const organizationId = input.organizationId?.trim() || input.dashboard?.organizationId || input.validationSuite?.organizationId || "nexora-default";
  const generatedAt = input.now ?? Date.now();
  const evidence = aggregateLaunchEvidence(input);
  const blockers = detectLaunchBlockers(input);
  const risks = prioritizeReadinessRisks(input, blockers);
  const scorecard = buildLaunchReadinessScorecard(input, risks);
  const state = deriveProductionReadinessGateState({
    blockerCount: blockers.length,
    launchConfidence: scorecard.launchConfidence,
    validationPassed: input.validationSuite?.summary.validationPassed === true,
    dashboardAssessment: input.dashboard?.launchAssessment,
  });
  const recommendation = generateLaunchRecommendation(state, scorecard);
  const classifications = classifyLaunchGovernance({ blockers, risks });
  const explainability = buildLaunchDecisionExplainability({ state, evidence, risks, scorecard });
  const summary = generateExecutiveLaunchSummary({ state, recommendation, blockers, risks, explainability });
  const signature = stableSignature([
    "d10-executive-launch-gate",
    organizationId,
    state,
    recommendation,
    scorecard.launchConfidence,
    blockers.map((blocker) => blocker.blockerId),
    evidence.map((item) => item.signature),
  ]);

  return {
    gateId: stableSignature(["d10-executive-launch-gate", organizationId]).slice(0, 56),
    organizationId,
    generatedAt,
    state,
    recommendation,
    advisoryOnly: true,
    scorecard,
    evidence,
    blockers,
    classifications,
    explainability,
    summary,
    signature,
  };
}

