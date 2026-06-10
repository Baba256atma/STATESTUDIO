/**
 * Phase 6:4 — Stakeholder context generation from approved feeds.
 */

import type { StakeholderContext, StakeholderContextBuildInput } from "./stakeholderContextContract.ts";

export function buildStakeholderContext(input: StakeholderContextBuildInput): StakeholderContext {
  const {
    decisionGuidance,
    governanceSnapshot,
    strategicSnapshot,
    policySnapshot,
    scenarioSnapshot,
    warRoomSnapshot,
    confidenceEvaluation,
  } = input;

  return Object.freeze({
    decisionGuidance: Object.freeze({
      source: "decision_guidance" as const,
      focus: decisionGuidance.decisionFocus.focus,
      confidenceLevel: decisionGuidance.confidenceSummary.level,
      guidanceSummary: decisionGuidance.executiveGuidance.summary,
    }),
    governance: Object.freeze({
      source: "governance" as const,
      alignment: governanceSnapshot.governanceAlignment.alignment,
      attention: governanceSnapshot.governanceAttention.level,
      stakeholderSummary: governanceSnapshot.stakeholderImpact.summary,
    }),
    strategicAlignment: Object.freeze({
      source: "strategic_alignment" as const,
      alignmentScore: strategicSnapshot.alignmentScore.score,
      tensionLevel: strategicSnapshot.strategicTension.level,
      strategicAttention: strategicSnapshot.strategicAttention.level,
    }),
    policy: Object.freeze({
      source: "policy_constraint" as const,
      policyAlignment: policySnapshot.policyAlignment.alignment,
      constraintSeverity: policySnapshot.constraintSeverity.level,
      policyAttention: policySnapshot.policyAttention.level,
    }),
    scenario: Object.freeze({
      source: "scenario" as const,
      expectedImpact: scenarioSnapshot.expectedImpact.label,
      confidence: scenarioSnapshot.confidence.label,
    }),
    warRoomUrgency: warRoomSnapshot.criticalRisks.urgency,
    warRoomExposure: warRoomSnapshot.criticalRisks.exposure,
    confidenceLevel: confidenceEvaluation.overall.level,
    confidenceLabel: confidenceEvaluation.overall.label,
    consensus: Object.freeze({
      source: "consensus" as const,
      status: "pending_enrichment" as const,
      summary: "Consensus context enrichment reserved for future phase",
    }),
    enterprise: Object.freeze({
      source: "enterprise" as const,
      status: "pending_enrichment" as const,
      summary: "Enterprise context enrichment reserved for future phase",
    }),
    program: Object.freeze({
      source: "program" as const,
      status: "pending_enrichment" as const,
      summary: "Program context enrichment reserved for future phase",
    }),
    sourceChain: Object.freeze([
      "decision_guidance",
      "governance",
      "strategic_alignment",
      "policy_constraint",
      "scenario",
    ] as const),
  });
}
