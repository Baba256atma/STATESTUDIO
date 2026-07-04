import type {
  ExecutiveBridgeMetadata,
  ExecutiveBridgePayloadType,
  ExecutiveReasoningJudgmentBridge as ExecutiveReasoningJudgmentBridgeContract,
} from "./executiveReasoningJudgmentBridgeTypes.ts";

export const EXECUTIVE_REASONING_JUDGMENT_BRIDGE_ID = "executive-reasoning-judgment-bridge";
export const EXECUTIVE_REASONING_JUDGMENT_BRIDGE_VERSION = "LAY-CONN-2";

export const EXECUTIVE_REASONING_JUDGMENT_PAYLOAD_TYPES: readonly ExecutiveBridgePayloadType[] = Object.freeze([
  "reasoning-result",
  "judgment-request",
  "judgment-context",
  "evidence-transfer",
  "constraint-transfer",
  "assumption-transfer",
  "confidence-transfer",
  "traceability",
  "decision-metadata",
  "validation-metadata",
] as const);

export const EXECUTIVE_REASONING_JUDGMENT_BRIDGE_METADATA: ExecutiveBridgeMetadata = Object.freeze({
  bridgeId: EXECUTIVE_REASONING_JUDGMENT_BRIDGE_ID,
  phaseId: "LAY-CONN-2",
  metadataOnly: true,
  immutable: true,
  tags: Object.freeze(["lay-connection", "reasoning-to-judgment", "bridge-contract"] as const),
});

export const ExecutiveReasoningJudgmentBridge: ExecutiveReasoningJudgmentBridgeContract = Object.freeze({
  bridgeId: EXECUTIVE_REASONING_JUDGMENT_BRIDGE_ID,
  name: "Executive Reasoning to Judgment Bridge",
  lifecycle: "Frozen",
  reasoningInput: Object.freeze({
    inputId: "reasoning-input-contract",
    producerId: "APP-REASON",
    reasoningResultId: "reasoning-result-metadata",
    payloadType: "reasoning-result",
    contractVersion: EXECUTIVE_REASONING_JUDGMENT_BRIDGE_VERSION,
  }),
  judgmentRequest: Object.freeze({
    requestId: "judgment-request-contract",
    consumerId: "APP-JUDGE",
    requestedJudgmentType: "executive-judgment-metadata",
    payloadType: "judgment-request",
    contractVersion: EXECUTIVE_REASONING_JUDGMENT_BRIDGE_VERSION,
  }),
  context: Object.freeze({
    contextId: "bridge-context-contract",
    reasoningInputId: "reasoning-input-contract",
    judgmentRequestId: "judgment-request-contract",
    scopeId: "executive-context-scope",
    payloadType: "judgment-context",
  }),
  evidence: Object.freeze([
    Object.freeze({
      evidenceId: "evidence-transfer-contract",
      sourceReasoningNodeId: "reasoning-evidence-reference",
      targetJudgmentEvidenceId: "judgment-evidence-reference",
      payloadType: "evidence-transfer",
    }),
  ] as const),
  constraints: Object.freeze([
    Object.freeze({
      constraintId: "constraint-transfer-contract",
      sourceReasoningConstraintId: "reasoning-constraint-reference",
      targetJudgmentConstraintId: "judgment-constraint-reference",
      payloadType: "constraint-transfer",
    }),
  ] as const),
  assumptions: Object.freeze([
    Object.freeze({
      assumptionId: "assumption-transfer-contract",
      sourceReasoningAssumptionId: "reasoning-assumption-reference",
      targetJudgmentAssumptionId: "judgment-assumption-reference",
      payloadType: "assumption-transfer",
    }),
  ] as const),
  confidence: Object.freeze({
    confidenceId: "confidence-transfer-contract",
    sourceConfidenceId: "reasoning-confidence-reference",
    targetConfidenceId: "judgment-confidence-reference",
    payloadType: "confidence-transfer",
  }),
  trace: Object.freeze({
    traceId: "reasoning-judgment-trace-contract",
    sourcePlatform: "APP-REASON",
    targetPlatform: "APP-JUDGE",
    sourceIds: Object.freeze(["reasoning-result-metadata", "reasoning-evidence-reference", "reasoning-constraint-reference"] as const),
    targetIds: Object.freeze(["judgment-request-contract", "judgment-evidence-reference", "judgment-constraint-reference"] as const),
    payloadType: "traceability",
  }),
  metadata: EXECUTIVE_REASONING_JUDGMENT_BRIDGE_METADATA,
});
