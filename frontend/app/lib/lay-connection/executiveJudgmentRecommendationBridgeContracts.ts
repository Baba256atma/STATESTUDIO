import type {
  ExecutiveJudgmentRecommendationBridge as ExecutiveJudgmentRecommendationBridgeContract,
  ExecutiveRecommendationMetadata,
  ExecutiveRecommendationPayloadType,
} from "./executiveJudgmentRecommendationBridgeTypes.ts";

export const EXECUTIVE_JUDGMENT_RECOMMENDATION_BRIDGE_ID = "executive-judgment-recommendation-bridge";
export const EXECUTIVE_JUDGMENT_RECOMMENDATION_BRIDGE_VERSION = "LAY-CONN-3";

export const EXECUTIVE_JUDGMENT_RECOMMENDATION_PAYLOAD_TYPES: readonly ExecutiveRecommendationPayloadType[] = Object.freeze([
  "judgment-result",
  "recommendation-request",
  "recommendation-context",
  "decision-evidence",
  "decision-constraint",
  "decision-tradeoff",
  "recommendation-confidence",
  "decision-intent",
  "recommendation-metadata",
  "validation-metadata",
] as const);

export const EXECUTIVE_JUDGMENT_RECOMMENDATION_BRIDGE_METADATA: ExecutiveRecommendationMetadata = Object.freeze({
  bridgeId: EXECUTIVE_JUDGMENT_RECOMMENDATION_BRIDGE_ID,
  phaseId: "LAY-CONN-3",
  metadataOnly: true,
  immutable: true,
  tags: Object.freeze(["lay-connection", "judgment-to-recommendation", "bridge-contract"] as const),
});

export const ExecutiveJudgmentRecommendationBridge: ExecutiveJudgmentRecommendationBridgeContract = Object.freeze({
  bridgeId: EXECUTIVE_JUDGMENT_RECOMMENDATION_BRIDGE_ID,
  name: "Executive Judgment to Recommendation Bridge",
  lifecycle: "Frozen",
  judgmentInput: Object.freeze({
    inputId: "judgment-input-contract",
    producerId: "APP-JUDGE",
    judgmentResultId: "judgment-result-metadata",
    payloadType: "judgment-result",
    contractVersion: EXECUTIVE_JUDGMENT_RECOMMENDATION_BRIDGE_VERSION,
  }),
  recommendationRequest: Object.freeze({
    requestId: "recommendation-request-contract",
    consumerId: "APP-RECOMMENDATION",
    requestCategory: "executive-recommendation-metadata",
    payloadType: "recommendation-request",
    contractVersion: EXECUTIVE_JUDGMENT_RECOMMENDATION_BRIDGE_VERSION,
  }),
  context: Object.freeze({
    contextId: "recommendation-context-contract",
    judgmentInputId: "judgment-input-contract",
    recommendationRequestId: "recommendation-request-contract",
    scopeId: "executive-recommendation-scope",
    payloadType: "recommendation-context",
  }),
  evidence: Object.freeze([
    Object.freeze({
      evidenceId: "decision-evidence-contract",
      sourceJudgmentEvidenceId: "judgment-evidence-reference",
      targetRecommendationEvidenceId: "recommendation-evidence-reference",
      payloadType: "decision-evidence",
    }),
  ] as const),
  constraints: Object.freeze([
    Object.freeze({
      constraintId: "decision-constraint-contract",
      sourceJudgmentConstraintId: "judgment-constraint-reference",
      targetRecommendationConstraintId: "recommendation-constraint-reference",
      payloadType: "decision-constraint",
    }),
  ] as const),
  tradeoffs: Object.freeze([
    Object.freeze({
      tradeoffId: "decision-tradeoff-contract",
      sourceJudgmentTradeoffId: "judgment-tradeoff-reference",
      targetRecommendationTradeoffId: "recommendation-tradeoff-reference",
      payloadType: "decision-tradeoff",
    }),
  ] as const),
  confidence: Object.freeze({
    confidenceId: "recommendation-confidence-contract",
    sourceJudgmentConfidenceId: "judgment-confidence-reference",
    targetRecommendationConfidenceId: "recommendation-confidence-reference",
    payloadType: "recommendation-confidence",
  }),
  intent: Object.freeze({
    intentId: "recommendation-intent-contract",
    sourceDecisionIntentId: "judgment-intent-reference",
    targetRecommendationIntentId: "recommendation-intent-reference",
    payloadType: "decision-intent",
  }),
  metadata: EXECUTIVE_JUDGMENT_RECOMMENDATION_BRIDGE_METADATA,
});
