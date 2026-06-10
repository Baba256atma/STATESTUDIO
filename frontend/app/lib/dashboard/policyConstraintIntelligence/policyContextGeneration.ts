/**
 * Phase 6:3 — Policy context generation from approved feeds.
 */

import type { PolicyContext, PolicyContextBuildInput } from "./policyContextContract.ts";

export function buildPolicyContext(input: PolicyContextBuildInput): PolicyContext {
  const { decisionGuidance, governanceSnapshot, strategicSnapshot, warRoomSnapshot, scenarioSnapshot } =
    input;

  return Object.freeze({
    decisionGuidance: Object.freeze({
      source: "decision_guidance" as const,
      focus: decisionGuidance.decisionFocus.focus,
      confidenceLevel: decisionGuidance.confidenceSummary.level,
      tradeoffSummary: decisionGuidance.tradeoffSummary.summary,
    }),
    governance: Object.freeze({
      source: "governance" as const,
      alignment: governanceSnapshot.governanceAlignment.alignment,
      attention: governanceSnapshot.governanceAttention.level,
      policyReviewStatus: governanceSnapshot.policyAwareness.reviewStatus,
      conflictIndicator: governanceSnapshot.policyAwareness.conflictIndicator,
    }),
    strategicAlignment: Object.freeze({
      source: "strategic_alignment" as const,
      alignmentScore: strategicSnapshot.alignmentScore.score,
      strategicAttention: strategicSnapshot.strategicAttention.level,
      tensionLevel: strategicSnapshot.strategicTension.level,
    }),
    scenario: Object.freeze({
      source: "scenario" as const,
      expectedImpact: scenarioSnapshot.expectedImpact.label,
      confidence: scenarioSnapshot.confidence.label,
    }),
    warRoomUrgency: warRoomSnapshot.criticalRisks.urgency,
    warRoomExposure: warRoomSnapshot.criticalRisks.exposure,
    regulatory: Object.freeze({
      source: "regulatory" as const,
      status: "pending_enrichment" as const,
      summary: "Regulatory context enrichment reserved for future phase",
    }),
    enterprisePolicy: Object.freeze({
      source: "enterprise_policy" as const,
      status: "pending_enrichment" as const,
      summary: "Enterprise policy context enrichment reserved for future phase",
    }),
    stakeholder: Object.freeze({
      source: "stakeholder" as const,
      status: "pending_enrichment" as const,
      summary: "Stakeholder context enrichment reserved for future phase",
    }),
    sourceChain: Object.freeze([
      "decision_guidance",
      "governance",
      "strategic_alignment",
      "scenario",
    ] as const),
  });
}
