import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import { buildProductionReviewRegistry } from "./reviewRegistry.ts";
import { reviewExecutiveWorkflowHardening } from "./workflowReview.ts";
import { verifyRuntimeReliability } from "./reliabilityVerification.ts";
import { auditUXConsistency } from "./uxConsistencyAudit.ts";
import { assessProductionHardening } from "./hardeningAssessment.ts";
import { buildStabilityRiskInventory } from "./riskInventory.ts";
import { verifyExecutiveReadiness } from "./executiveVerification.ts";
import { generateHardeningRecommendations } from "./recommendations.ts";
import { classifyProductionCandidate } from "./classification.ts";
import { generateExecutiveStabilizationSummary } from "./summary.ts";
import { buildHardeningTrendSummary } from "./trend.ts";
import type { ExecutiveFinalHardeningInput, ExecutiveFinalHardeningResult, HardeningTrendPoint } from "./finalHardeningTypes.ts";

function scoreFromHealth(status: string | undefined): number {
  if (status === "healthy") return 0.92;
  if (status === "warning") return 0.68;
  if (status === "degraded") return 0.42;
  return 0.2;
}

export function evaluateExecutiveFinalHardening(input: ExecutiveFinalHardeningInput): ExecutiveFinalHardeningResult {
  const organizationId = input.organizationId?.trim() || input.dashboard?.organizationId || input.launchGate?.organizationId || "nexora-default";
  const generatedAt = input.now ?? Date.now();
  const normalized = { ...input, organizationId, now: generatedAt };
  const reviewRegistry = buildProductionReviewRegistry(normalized);
  const workflowReview = reviewExecutiveWorkflowHardening(normalized);
  const reliabilityVerification = verifyRuntimeReliability(normalized);
  const uxAudit = auditUXConsistency(normalized);
  const assessment = assessProductionHardening(normalized);
  const allFindings = [...workflowReview.findings, ...reliabilityVerification.findings, ...uxAudit.findings, ...assessment.findings];
  const riskInventory = buildStabilityRiskInventory(allFindings);
  const executiveVerification = verifyExecutiveReadiness(normalized);
  const checklist = reviewRegistry.items;
  const recommendations = generateHardeningRecommendations(riskInventory);
  const classification = classifyProductionCandidate({ checklist, risks: riskInventory, verifiedExecutiveCount: executiveVerification.verifiedCount });
  const summary = generateExecutiveStabilizationSummary({ classification, checklist, risks: riskInventory });
  const currentTrend: HardeningTrendPoint = {
    generatedAt,
    stabilityScore: scoreFromHealth(input.dashboard?.interactionStability),
    readinessScore: input.launchGate?.scorecard.readinessScore ?? 0,
    trustScore: scoreFromHealth(input.dashboard?.runtimeTrust),
    validationScore: input.launchGate?.scorecard.validationScore ?? 0,
    issueCount: riskInventory.length,
  };
  const trend = buildHardeningTrendSummary(input.previousTrendPoints ?? [], currentTrend);
  const signature = stableSignature([
    "d10-executive-final-hardening",
    organizationId,
    generatedAt,
    classification,
    reviewRegistry.signature,
    workflowReview.signature,
    reliabilityVerification.signature,
    uxAudit.signature,
    assessment.signature,
    riskInventory.map((risk) => risk.signature),
    executiveVerification.signature,
    recommendations.map((rec) => rec.signature),
    summary.signature,
    trend.signature,
  ]);

  return {
    hardeningId: stableSignature(["d10-executive-final-hardening", organizationId]).slice(0, 56),
    organizationId,
    generatedAt,
    classification,
    reviewRegistry,
    workflowReview,
    reliabilityVerification,
    uxAudit,
    assessment,
    riskInventory,
    executiveVerification,
    checklist,
    recommendations,
    summary,
    trend,
    signature,
  };
}
