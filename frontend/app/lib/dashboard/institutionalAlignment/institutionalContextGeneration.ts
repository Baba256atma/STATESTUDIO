/**
 * Phase 6:6 — Institutional context generation from approved feeds.
 */

import type { InstitutionalContext, InstitutionalContextBuildInput } from "./institutionalContextContract.ts";

export function buildInstitutionalContext(input: InstitutionalContextBuildInput): InstitutionalContext {
  const {
    governanceSnapshot,
    strategicSnapshot,
    policySnapshot,
    stakeholderSnapshot,
    consensusSnapshot,
  } = input;

  return Object.freeze({
    governance: Object.freeze({
      source: "governance" as const,
      alignment: governanceSnapshot.governanceAlignment.alignment,
      attention: governanceSnapshot.governanceAttention.level,
      alignmentSummary: governanceSnapshot.governanceAlignment.summary,
    }),
    strategicAlignment: Object.freeze({
      source: "strategic_alignment" as const,
      alignmentScore: strategicSnapshot.alignmentScore.score,
      strategicAttention: strategicSnapshot.strategicAttention.level,
      alignmentSummary: strategicSnapshot.alignmentScore.summary,
    }),
    policy: Object.freeze({
      source: "policy_constraint" as const,
      policyAlignment: policySnapshot.policyAlignment.alignment,
      constraintSeverity: policySnapshot.constraintSeverity.level,
      policyAttention: policySnapshot.policyAttention.level,
    }),
    stakeholder: Object.freeze({
      source: "stakeholder_intelligence" as const,
      impact: stakeholderSnapshot.stakeholderImpact.impact,
      alignment: stakeholderSnapshot.stakeholderAlignment.alignment,
      tension: stakeholderSnapshot.stakeholderTension.level,
      attention: stakeholderSnapshot.stakeholderAttention.level,
    }),
    consensus: Object.freeze({
      source: "consensus_intelligence" as const,
      consensusLevel: consensusSnapshot.consensusLevel.level,
      institutionalTension: consensusSnapshot.institutionalTension.level,
      consensusAttention: consensusSnapshot.consensusAttention.level,
    }),
    enterprise: Object.freeze({
      source: "enterprise" as const,
      status: "pending_enrichment" as const,
      summary: "Enterprise context enrichment reserved for future phase",
    }),
    portfolio: Object.freeze({
      source: "portfolio" as const,
      status: "pending_enrichment" as const,
      summary: "Portfolio context enrichment reserved for future phase",
    }),
    board: Object.freeze({
      source: "board" as const,
      status: "pending_enrichment" as const,
      summary: "Board intelligence enrichment reserved for future phase",
    }),
    sourceChain: Object.freeze([
      "governance",
      "strategic_alignment",
      "policy_constraint",
      "stakeholder_intelligence",
      "consensus_intelligence",
    ] as const),
  });
}
