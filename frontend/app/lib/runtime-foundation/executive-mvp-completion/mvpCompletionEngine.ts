import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import { buildCompletionEvidenceRegistry } from "./evidenceRegistry.ts";
import { verifyExecutiveCapabilities } from "./capabilityVerification.ts";
import { buildMVPCompletionScorecard } from "./scorecard.ts";
import { assessPublishRisks } from "./riskAssessment.ts";
import { verifyFinalGovernance } from "./governanceVerification.ts";
import { assessPublishReadiness } from "./publishAssessment.ts";
import { generatePublicationRecommendation } from "./recommendation.ts";
import { certifyExecutiveIntelligence } from "./certification.ts";
import { classifyMVPCompletion } from "./classification.ts";
import { buildCompletionTrendSummary } from "./trend.ts";
import { generateExecutivePublicationSummary } from "./summary.ts";
import { buildPublishReadyDashboard } from "./dashboard.ts";
import type { CompletionTrendPoint, ExecutiveMVPCompletionInput, ExecutiveMVPCompletionResult } from "./mvpCompletionTypes.ts";

export function evaluateExecutiveMVPCompletion(input: ExecutiveMVPCompletionInput): ExecutiveMVPCompletionResult {
  const organizationId = input.organizationId?.trim() || input.dashboard?.organizationId || input.launchGate?.organizationId || "nexora-default";
  const generatedAt = input.now ?? Date.now();
  const normalized = { ...input, organizationId, now: generatedAt };
  const evidence = buildCompletionEvidenceRegistry(normalized);
  const capabilities = verifyExecutiveCapabilities(normalized);
  const scorecard = buildMVPCompletionScorecard(normalized, capabilities);
  const risks = assessPublishRisks(normalized);
  const governance = verifyFinalGovernance(normalized);
  const assessments = assessPublishReadiness(scorecard, risks);
  const recommendation = generatePublicationRecommendation({ scorecard, assessments, risks });
  const certification = certifyExecutiveIntelligence(normalized, scorecard);
  const state = classifyMVPCompletion({ scorecard, capabilities, governance, risks, certified: certification.certified });
  const currentTrend: CompletionTrendPoint = {
    generatedAt,
    readinessScore: scorecard.readinessScore,
    trustScore: scorecard.trustScore,
    validationScore: scorecard.validationScore,
    stabilityScore: scorecard.stabilityScore,
    completionScore: scorecard.completionScore,
  };
  const trend = buildCompletionTrendSummary(input.previousTrendPoints ?? [], currentTrend);
  const summary = generateExecutivePublicationSummary({ state, recommendation, capabilities, risks });
  const dashboard = buildPublishReadyDashboard({
    organizationId,
    generatedAt,
    state,
    recommendation,
    scorecard,
    risks,
    summary,
    readinessStatus: input.dashboard?.launchAssessment ?? "unknown",
    trustPosture: input.dashboard?.runtimeTrust ?? "unknown",
  });
  const signature = stableSignature([
    "d10-executive-mvp-completion",
    organizationId,
    generatedAt,
    state,
    recommendation,
    evidence.map((item) => item.signature),
    capabilities.map((item) => item.signature),
    scorecard,
    risks.map((item) => item.signature),
    governance.signature,
    certification.signature,
    trend.signature,
    dashboard.signature,
  ]);

  return {
    completionId: stableSignature(["d10-executive-mvp-completion", organizationId]).slice(0, 56),
    organizationId,
    generatedAt,
    state,
    publishAssessments: assessments,
    capabilities,
    scorecard,
    risks,
    evidence,
    governance,
    recommendation,
    certification,
    trend,
    dashboard,
    summary,
    advisoryOnly: true,
    signature,
  };
}
