/**
 * Phase 6:1 — Governance context generation from approved decision intelligence feeds.
 */

import type { GovernanceContext, GovernanceContextBuildInput } from "./governanceContextContract.ts";

export function buildGovernanceContext(input: GovernanceContextBuildInput): GovernanceContext {
  const { decisionGuidance, advisorySnapshot, confidenceEvaluation, explanationBundle } = input;
  const { warRoomSnapshot, scenarioSnapshot } = input;

  return Object.freeze({
    decisionGuidance: Object.freeze({
      source: "decision_guidance" as const,
      focus: decisionGuidance.decisionFocus.focus,
      confidenceLevel: decisionGuidance.confidenceSummary.level,
      tradeoffSummary: decisionGuidance.tradeoffSummary.summary,
      contextSummary: decisionGuidance.decisionContext.summary,
    }),
    executiveAdvisory: Object.freeze({
      source: "executive_advisory" as const,
      focus: advisorySnapshot.focus.focus,
      urgency: advisorySnapshot.focus.urgency,
      guidanceSummary: advisorySnapshot.guidanceCandidates.summary,
    }),
    warRoom: Object.freeze({
      source: "war_room" as const,
      decisionFocus: warRoomSnapshot.decisionFocus.label,
      threatLevel: warRoomSnapshot.criticalRisks.exposure,
      actionUrgency: warRoomSnapshot.criticalRisks.urgency,
    }),
    scenario: Object.freeze({
      source: "scenario" as const,
      expectedImpact: scenarioSnapshot.expectedImpact.label,
      confidence: scenarioSnapshot.confidence.label,
      comparisonSummary: scenarioSnapshot.comparisonContract.summary,
    }),
    policy: Object.freeze({
      source: "policy" as const,
      status: "pending_enrichment" as const,
      summary: "Policy intelligence enrichment reserved for future phase",
    }),
    stakeholder: Object.freeze({
      source: "stakeholder" as const,
      status: "pending_enrichment" as const,
      summary: "Stakeholder intelligence enrichment reserved for future phase",
    }),
    consensus: Object.freeze({
      source: "consensus" as const,
      status: "pending_enrichment" as const,
      summary: "Consensus intelligence enrichment reserved for future phase",
    }),
    confidence: Object.freeze({
      level: confidenceEvaluation.overall.level,
      label: confidenceEvaluation.overall.label,
      trend: confidenceEvaluation.overall.trend,
      summary: confidenceEvaluation.explanation.summary,
    }),
    explainability: Object.freeze({
      reasoningPath: explanationBundle.reasoningPath.pathLabel,
      evidenceSummary: explanationBundle.supportingEvidence.summary,
      assumptionsSummary: explanationBundle.assumptionsAndUnknowns.summary,
    }),
    sourceChain: Object.freeze([
      "decision_guidance",
      "executive_advisory",
      "war_room",
      "scenario",
    ] as const),
  });
}
