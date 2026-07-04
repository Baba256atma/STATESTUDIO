import type {
  ExecutiveExplanationMetadata,
  ExecutiveExplanationPayloadType,
  ExecutiveExplanationTarget,
  ExecutiveJudgmentExplanationBridge as ExecutiveJudgmentExplanationBridgeContract,
} from "./executiveJudgmentExplanationBridgeTypes.ts";

export const EXECUTIVE_JUDGMENT_EXPLANATION_BRIDGE_ID = "executive-judgment-explanation-bridge";
export const EXECUTIVE_JUDGMENT_EXPLANATION_BRIDGE_VERSION = "LAY-CONN-4";

export const EXECUTIVE_JUDGMENT_EXPLANATION_PAYLOAD_TYPES: readonly ExecutiveExplanationPayloadType[] = Object.freeze([
  "judgment-result",
  "explanation-request",
  "explanation-context",
  "judgment-rationale",
  "evidence-summary",
  "constraint-summary",
  "tradeoff-summary",
  "confidence-summary",
  "decision-trace",
  "explanation-metadata",
  "validation-metadata",
] as const);

export const EXECUTIVE_JUDGMENT_EXPLANATION_TARGETS: readonly ExecutiveExplanationTarget[] = Object.freeze([
  "Executive",
  "Board",
  "Assistant",
  "Dashboard",
  "Scene",
  "Runtime",
] as const);

export const EXECUTIVE_JUDGMENT_EXPLANATION_BRIDGE_METADATA: ExecutiveExplanationMetadata = Object.freeze({
  bridgeId: EXECUTIVE_JUDGMENT_EXPLANATION_BRIDGE_ID,
  phaseId: "LAY-CONN-4",
  metadataOnly: true,
  immutable: true,
  tags: Object.freeze(["lay-connection", "judgment-to-explanation", "bridge-contract"] as const),
});

export const ExecutiveJudgmentExplanationBridge: ExecutiveJudgmentExplanationBridgeContract = Object.freeze({
  bridgeId: EXECUTIVE_JUDGMENT_EXPLANATION_BRIDGE_ID,
  name: "Executive Judgment to Explanation Bridge",
  lifecycle: "Frozen",
  judgmentInput: Object.freeze({
    inputId: "judgment-explanation-input-contract",
    producerId: "APP-JUDGE",
    judgmentResultId: "judgment-result-metadata",
    payloadType: "judgment-result",
    contractVersion: EXECUTIVE_JUDGMENT_EXPLANATION_BRIDGE_VERSION,
  }),
  explanationRequest: Object.freeze({
    requestId: "explanation-request-contract",
    consumerId: "EXECUTIVE-EXPLANATION",
    target: "Executive",
    payloadType: "explanation-request",
    contractVersion: EXECUTIVE_JUDGMENT_EXPLANATION_BRIDGE_VERSION,
  }),
  context: Object.freeze({
    contextId: "explanation-context-contract",
    judgmentInputId: "judgment-explanation-input-contract",
    explanationRequestId: "explanation-request-contract",
    scopeId: "executive-explanation-scope",
    payloadType: "explanation-context",
  }),
  rationale: Object.freeze({
    rationaleId: "judgment-rationale-contract",
    sourceJudgmentRationaleId: "judgment-rationale-reference",
    targetExplanationRationaleId: "explanation-rationale-reference",
    payloadType: "judgment-rationale",
  }),
  evidence: Object.freeze([
    Object.freeze({
      evidenceSummaryId: "evidence-summary-contract",
      sourceJudgmentEvidenceId: "judgment-evidence-reference",
      targetExplanationEvidenceId: "explanation-evidence-reference",
      payloadType: "evidence-summary",
    }),
  ] as const),
  constraints: Object.freeze([
    Object.freeze({
      constraintSummaryId: "constraint-summary-contract",
      sourceJudgmentConstraintId: "judgment-constraint-reference",
      targetExplanationConstraintId: "explanation-constraint-reference",
      payloadType: "constraint-summary",
    }),
  ] as const),
  tradeoffs: Object.freeze([
    Object.freeze({
      tradeoffSummaryId: "tradeoff-summary-contract",
      sourceJudgmentTradeoffId: "judgment-tradeoff-reference",
      targetExplanationTradeoffId: "explanation-tradeoff-reference",
      payloadType: "tradeoff-summary",
    }),
  ] as const),
  confidence: Object.freeze({
    confidenceSummaryId: "confidence-summary-contract",
    sourceJudgmentConfidenceId: "judgment-confidence-reference",
    targetExplanationConfidenceId: "explanation-confidence-reference",
    payloadType: "confidence-summary",
  }),
  trace: Object.freeze({
    traceId: "decision-trace-contract",
    sourceJudgmentTraceId: "judgment-trace-reference",
    targetExplanationTraceId: "explanation-trace-reference",
    payloadType: "decision-trace",
  }),
  metadata: EXECUTIVE_JUDGMENT_EXPLANATION_BRIDGE_METADATA,
});
