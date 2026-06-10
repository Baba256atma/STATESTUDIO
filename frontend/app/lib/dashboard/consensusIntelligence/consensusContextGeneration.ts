/**
 * Phase 6:5 — Consensus context generation from approved feeds.
 */

import type { ConsensusContext, ConsensusContextBuildInput } from "./consensusContextContract.ts";

export function buildConsensusContext(input: ConsensusContextBuildInput): ConsensusContext {
  const {
    stakeholderSnapshot,
    policySnapshot,
    strategicSnapshot,
    governanceSnapshot,
    decisionGuidanceSnapshot,
    confidenceEvaluation,
  } = input;

  return Object.freeze({
    stakeholder: Object.freeze({
      source: "stakeholder_intelligence" as const,
      impact: stakeholderSnapshot.stakeholderImpact.impact,
      alignment: stakeholderSnapshot.stakeholderAlignment.alignment,
      tension: stakeholderSnapshot.stakeholderTension.level,
      supportSummary: stakeholderSnapshot.stakeholderSupport.summary,
    }),
    policy: Object.freeze({
      source: "policy_constraint" as const,
      policyAlignment: policySnapshot.policyAlignment.alignment,
      constraintSeverity: policySnapshot.constraintSeverity.level,
      policyAttention: policySnapshot.policyAttention.level,
    }),
    strategicAlignment: Object.freeze({
      source: "strategic_alignment" as const,
      alignmentScore: strategicSnapshot.alignmentScore.score,
      strategicTension: strategicSnapshot.strategicTension.level,
      strategicAttention: strategicSnapshot.strategicAttention.level,
    }),
    governance: Object.freeze({
      source: "governance" as const,
      governanceAlignment: governanceSnapshot.governanceAlignment.alignment,
      governanceAttention: governanceSnapshot.governanceAttention.level,
    }),
    decisionGuidance: Object.freeze({
      source: "decision_guidance" as const,
      focus: decisionGuidanceSnapshot.decisionFocus.focus,
      confidenceLevel: decisionGuidanceSnapshot.confidenceSummary.level,
    }),
    confidenceLevel: confidenceEvaluation.overall.level,
    confidenceLabel: confidenceEvaluation.overall.label,
    portfolio: Object.freeze({
      source: "portfolio" as const,
      status: "pending_enrichment" as const,
      summary: "Portfolio context enrichment reserved for future phase",
    }),
    enterprise: Object.freeze({
      source: "enterprise" as const,
      status: "pending_enrichment" as const,
      summary: "Enterprise context enrichment reserved for future phase",
    }),
    institutionalAdvisory: Object.freeze({
      source: "institutional_advisory" as const,
      status: "pending_enrichment" as const,
      summary: "Institutional advisory context enrichment reserved for future phase",
    }),
    sourceChain: Object.freeze([
      "stakeholder_intelligence",
      "policy_constraint",
      "strategic_alignment",
      "governance",
      "decision_guidance",
    ] as const),
  });
}
