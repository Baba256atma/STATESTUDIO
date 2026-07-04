export type ExecutiveExplanationPayloadType =
  | "judgment-result"
  | "explanation-request"
  | "explanation-context"
  | "judgment-rationale"
  | "evidence-summary"
  | "constraint-summary"
  | "tradeoff-summary"
  | "confidence-summary"
  | "decision-trace"
  | "explanation-metadata"
  | "validation-metadata";

export type ExecutiveExplanationTarget = "Executive" | "Board" | "Assistant" | "Dashboard" | "Scene" | "Runtime";

export type ExecutiveExplanationBridgeLifecycle = "Draft" | "Active" | "Frozen";

export type ExecutiveJudgmentExplanationInput = Readonly<{
  readonly inputId: string;
  readonly producerId: string;
  readonly judgmentResultId: string;
  readonly payloadType: "judgment-result";
  readonly contractVersion: string;
}>;

export type ExecutiveExplanationRequest = Readonly<{
  readonly requestId: string;
  readonly consumerId: string;
  readonly target: ExecutiveExplanationTarget;
  readonly payloadType: "explanation-request";
  readonly contractVersion: string;
}>;

export type ExecutiveExplanationContext = Readonly<{
  readonly contextId: string;
  readonly judgmentInputId: string;
  readonly explanationRequestId: string;
  readonly scopeId: string;
  readonly payloadType: "explanation-context";
}>;

export type ExecutiveJudgmentRationale = Readonly<{
  readonly rationaleId: string;
  readonly sourceJudgmentRationaleId: string;
  readonly targetExplanationRationaleId: string;
  readonly payloadType: "judgment-rationale";
}>;

export type ExecutiveExplanationEvidence = Readonly<{
  readonly evidenceSummaryId: string;
  readonly sourceJudgmentEvidenceId: string;
  readonly targetExplanationEvidenceId: string;
  readonly payloadType: "evidence-summary";
}>;

export type ExecutiveExplanationConstraint = Readonly<{
  readonly constraintSummaryId: string;
  readonly sourceJudgmentConstraintId: string;
  readonly targetExplanationConstraintId: string;
  readonly payloadType: "constraint-summary";
}>;

export type ExecutiveExplanationTradeoff = Readonly<{
  readonly tradeoffSummaryId: string;
  readonly sourceJudgmentTradeoffId: string;
  readonly targetExplanationTradeoffId: string;
  readonly payloadType: "tradeoff-summary";
}>;

export type ExecutiveExplanationConfidence = Readonly<{
  readonly confidenceSummaryId: string;
  readonly sourceJudgmentConfidenceId: string;
  readonly targetExplanationConfidenceId: string;
  readonly payloadType: "confidence-summary";
}>;

export type ExecutiveExplanationTrace = Readonly<{
  readonly traceId: string;
  readonly sourceJudgmentTraceId: string;
  readonly targetExplanationTraceId: string;
  readonly payloadType: "decision-trace";
}>;

export type ExecutiveExplanationMetadata = Readonly<{
  readonly bridgeId: string;
  readonly phaseId: "LAY-CONN-4";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
  readonly tags: readonly string[];
}>;

export type ExecutiveExplanationCompatibility = Readonly<{
  readonly platformId: string;
  readonly compatible: boolean;
  readonly required: boolean;
  readonly mode: "certified" | "future-compatible";
  readonly notes: readonly string[];
}>;

export type ExecutiveExplanationValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveExplanationRegistry = Readonly<{
  readonly bridgeId: string;
  readonly supportedProducers: readonly string[];
  readonly supportedConsumers: readonly string[];
  readonly supportedPayloadTypes: readonly ExecutiveExplanationPayloadType[];
  readonly supportedExplanationTargets: readonly ExecutiveExplanationTarget[];
  readonly supportedContractVersions: readonly string[];
  readonly compatibilityMatrix: readonly ExecutiveExplanationCompatibility[];
  readonly extensionPolicy: ExecutiveExplanationMetadata;
  readonly publicApis: readonly string[];
}>;

export type ExecutiveJudgmentExplanationBridge = Readonly<{
  readonly bridgeId: string;
  readonly name: string;
  readonly lifecycle: ExecutiveExplanationBridgeLifecycle;
  readonly judgmentInput: ExecutiveJudgmentExplanationInput;
  readonly explanationRequest: ExecutiveExplanationRequest;
  readonly context: ExecutiveExplanationContext;
  readonly rationale: ExecutiveJudgmentRationale;
  readonly evidence: readonly ExecutiveExplanationEvidence[];
  readonly constraints: readonly ExecutiveExplanationConstraint[];
  readonly tradeoffs: readonly ExecutiveExplanationTradeoff[];
  readonly confidence: ExecutiveExplanationConfidence;
  readonly trace: ExecutiveExplanationTrace;
  readonly metadata: ExecutiveExplanationMetadata;
}>;

export type ExecutiveExplanationManifest = Readonly<{
  readonly platformId: string;
  readonly bridgeId: string;
  readonly bridgeName: string;
  readonly version: string;
  readonly dependencies: readonly string[];
  readonly compatibility: readonly ExecutiveExplanationCompatibility[];
  readonly extensionPolicy: ExecutiveExplanationMetadata;
  readonly releaseMetadata: ExecutiveExplanationMetadata;
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveExplanationCertification = Readonly<{
  readonly status: "PASS" | "FAIL";
  readonly validation: ExecutiveExplanationValidation;
  readonly certifiedBridgeId: string;
}>;

export type ExecutiveJudgmentExplanationBridgeResult<T> = Readonly<{
  readonly ok: boolean;
  readonly value: T;
  readonly validation: ExecutiveExplanationValidation;
}>;
