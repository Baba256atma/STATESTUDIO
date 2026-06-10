/**
 * Phase 6:2 — Strategic context generation from approved feeds.
 */

import type { StrategicContext, StrategicContextBuildInput } from "./strategicContextContract.ts";

export function buildStrategicContext(input: StrategicContextBuildInput): StrategicContext {
  const { decisionGuidance, governanceSnapshot, advisorySnapshot, confidenceEvaluation } = input;
  const { warRoomSnapshot, scenarioSnapshot } = input;

  return Object.freeze({
    decisionGuidance: Object.freeze({
      source: "decision_guidance" as const,
      focus: decisionGuidance.decisionFocus.focus,
      confidenceLevel: decisionGuidance.confidenceSummary.level,
      tradeoffSummary: decisionGuidance.tradeoffSummary.summary,
      guidanceSummary: decisionGuidance.executiveGuidance.summary,
    }),
    governance: Object.freeze({
      source: "governance" as const,
      alignment: governanceSnapshot.governanceAlignment.alignment,
      attention: governanceSnapshot.governanceAttention.level,
      governanceSummary: governanceSnapshot.governanceAlignment.summary,
    }),
    scenario: Object.freeze({
      source: "scenario" as const,
      expectedImpact: scenarioSnapshot.expectedImpact.label,
      confidence: scenarioSnapshot.confidence.label,
      comparisonSummary: scenarioSnapshot.comparisonContract.summary,
    }),
    warRoom: Object.freeze({
      source: "war_room" as const,
      decisionFocus: warRoomSnapshot.decisionFocus.label,
      threatExposure: warRoomSnapshot.criticalRisks.exposure,
      urgency: warRoomSnapshot.criticalRisks.urgency,
    }),
    portfolio: Object.freeze({
      source: "portfolio" as const,
      status: "pending_enrichment" as const,
      summary: "Portfolio context enrichment reserved for future phase",
    }),
    program: Object.freeze({
      source: "program" as const,
      status: "pending_enrichment" as const,
      summary: "Program context enrichment reserved for future phase",
    }),
    enterprise: Object.freeze({
      source: "enterprise" as const,
      status: "pending_enrichment" as const,
      summary: "Enterprise context enrichment reserved for future phase",
    }),
    advisoryFocus: advisorySnapshot.focus.focus,
    confidenceLevel: confidenceEvaluation.overall.level,
    confidenceLabel: confidenceEvaluation.overall.label,
    sourceChain: Object.freeze([
      "decision_guidance",
      "governance",
      "scenario",
      "war_room",
    ] as const),
  });
}
