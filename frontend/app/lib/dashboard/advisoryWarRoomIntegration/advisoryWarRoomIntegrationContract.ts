/**
 * Phase 5:6 — Advisory–War Room Integration Layer contract.
 */

import type { AdvisoryContext } from "../executiveAdvisory/aggregation/advisoryContextContract.ts";
import type { AdvisoryConfidenceEvaluation } from "../executiveAdvisory/confidence/advisoryConfidenceContract.ts";
import type { AdvisoryExplanationBundle } from "../executiveAdvisory/explainability/advisoryExplainabilityContract.ts";
import type { DecisionGuidanceSnapshot } from "../decisionGuidance/decisionGuidanceContract.ts";
import type { ExecutiveAdvisoryAggregationInput } from "../executiveAdvisory/executiveAdvisoryContract.ts";

export const ADVISORY_WAR_ROOM_INTEGRATION_VERSION = "5.6.0";

export const CANONICAL_ADVISORY_WAR_ROOM_INTEGRATION_OWNER = "advisoryWarRoomIntegrationRuntime";

export type IntegrationParticipantId = "war_room" | "executive_advisory" | "decision_guidance";

export type IntegrationRegistryEntry = Readonly<{
  participantId: IntegrationParticipantId;
  owner: string;
  role: "intake" | "transformation" | "delivery";
  description: string;
}>;

export type WarRoomIntakeContract = Readonly<{
  situationOverview: string;
  criticalRisks: string;
  timelinePressure: string;
  scenarioComparison: string;
  decisionFocus: string;
  decisionFocusLevel: string;
  readiness: string;
  summary: string;
}>;

export type AdvisoryTransformationLayer = Readonly<{
  advisoryContext: AdvisoryContext;
  sourceChain: readonly string[];
  summary: string;
}>;

export type ConfidencePropagationLayer = Readonly<{
  evaluation: AdvisoryConfidenceEvaluation;
  drivers: readonly string[];
  limiters: readonly string[];
  summary: string;
}>;

export type ExplainabilityPropagationLayer = Readonly<{
  bundle: AdvisoryExplanationBundle;
  reasoningPath: string;
  assumptions: readonly string[];
  summary: string;
}>;

export type TradeoffPropagationEntry = Readonly<{
  domain: "operational" | "risk" | "timeline" | "scenario" | "decision";
  label: string;
  indicator: string;
}>;

export type TradeoffPropagationLayer = Readonly<{
  tradeoffs: readonly TradeoffPropagationEntry[];
  summary: string;
}>;

export type GuidanceDeliveryLayer = Readonly<{
  snapshot: DecisionGuidanceSnapshot;
  summary: string;
}>;

export type IntegrationTraceStep = Readonly<{
  step: string;
  source: IntegrationParticipantId | "confidence_framework" | "explainability_layer";
  detail: string;
}>;

export type IntegrationTraceContract = Readonly<{
  steps: readonly IntegrationTraceStep[];
  pathLabel: string;
  summary: string;
}>;

export type AdvisoryWarRoomIntegrationBundle = Readonly<{
  intake: WarRoomIntakeContract;
  transformation: AdvisoryTransformationLayer;
  confidencePropagation: ConfidencePropagationLayer;
  explainabilityPropagation: ExplainabilityPropagationLayer;
  tradeoffPropagation: TradeoffPropagationLayer;
  guidanceDelivery: GuidanceDeliveryLayer;
  trace: IntegrationTraceContract;
}>;

export type AdvisoryWarRoomIntegrationInput = ExecutiveAdvisoryAggregationInput;

export type IntegrationProtectionWarning = Readonly<{
  code: string;
  message: string;
}>;
