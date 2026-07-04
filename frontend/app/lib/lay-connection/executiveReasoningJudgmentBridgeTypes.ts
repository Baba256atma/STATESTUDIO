export type ExecutiveBridgePayloadType =
  | "reasoning-result"
  | "judgment-request"
  | "judgment-context"
  | "evidence-transfer"
  | "constraint-transfer"
  | "assumption-transfer"
  | "confidence-transfer"
  | "traceability"
  | "decision-metadata"
  | "validation-metadata";

export type ExecutiveBridgeLifecycle = "Draft" | "Active" | "Frozen";

export type ExecutiveReasoningInput = Readonly<{
  readonly inputId: string;
  readonly producerId: string;
  readonly reasoningResultId: string;
  readonly payloadType: "reasoning-result";
  readonly contractVersion: string;
}>;

export type ExecutiveJudgmentRequest = Readonly<{
  readonly requestId: string;
  readonly consumerId: string;
  readonly requestedJudgmentType: string;
  readonly payloadType: "judgment-request";
  readonly contractVersion: string;
}>;

export type ExecutiveBridgeContext = Readonly<{
  readonly contextId: string;
  readonly reasoningInputId: string;
  readonly judgmentRequestId: string;
  readonly scopeId: string;
  readonly payloadType: "judgment-context";
}>;

export type ExecutiveBridgeEvidence = Readonly<{
  readonly evidenceId: string;
  readonly sourceReasoningNodeId: string;
  readonly targetJudgmentEvidenceId: string;
  readonly payloadType: "evidence-transfer";
}>;

export type ExecutiveBridgeConstraint = Readonly<{
  readonly constraintId: string;
  readonly sourceReasoningConstraintId: string;
  readonly targetJudgmentConstraintId: string;
  readonly payloadType: "constraint-transfer";
}>;

export type ExecutiveBridgeAssumption = Readonly<{
  readonly assumptionId: string;
  readonly sourceReasoningAssumptionId: string;
  readonly targetJudgmentAssumptionId: string;
  readonly payloadType: "assumption-transfer";
}>;

export type ExecutiveBridgeConfidence = Readonly<{
  readonly confidenceId: string;
  readonly sourceConfidenceId: string;
  readonly targetConfidenceId: string;
  readonly payloadType: "confidence-transfer";
}>;

export type ExecutiveBridgeTrace = Readonly<{
  readonly traceId: string;
  readonly sourcePlatform: "APP-REASON";
  readonly targetPlatform: "APP-JUDGE";
  readonly sourceIds: readonly string[];
  readonly targetIds: readonly string[];
  readonly payloadType: "traceability";
}>;

export type ExecutiveBridgeMetadata = Readonly<{
  readonly bridgeId: string;
  readonly phaseId: "LAY-CONN-2";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
  readonly tags: readonly string[];
}>;

export type ExecutiveBridgeCompatibility = Readonly<{
  readonly platformId: string;
  readonly compatible: boolean;
  readonly required: boolean;
  readonly notes: readonly string[];
}>;

export type ExecutiveBridgeValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveBridgeRegistry = Readonly<{
  readonly bridgeId: string;
  readonly supportedProducers: readonly string[];
  readonly supportedConsumers: readonly string[];
  readonly supportedPayloadTypes: readonly ExecutiveBridgePayloadType[];
  readonly supportedContractVersions: readonly string[];
  readonly compatibilityMatrix: readonly ExecutiveBridgeCompatibility[];
  readonly extensionPolicy: ExecutiveBridgeMetadata;
  readonly publicApis: readonly string[];
}>;

export type ExecutiveReasoningJudgmentBridge = Readonly<{
  readonly bridgeId: string;
  readonly name: string;
  readonly lifecycle: ExecutiveBridgeLifecycle;
  readonly reasoningInput: ExecutiveReasoningInput;
  readonly judgmentRequest: ExecutiveJudgmentRequest;
  readonly context: ExecutiveBridgeContext;
  readonly evidence: readonly ExecutiveBridgeEvidence[];
  readonly constraints: readonly ExecutiveBridgeConstraint[];
  readonly assumptions: readonly ExecutiveBridgeAssumption[];
  readonly confidence: ExecutiveBridgeConfidence;
  readonly trace: ExecutiveBridgeTrace;
  readonly metadata: ExecutiveBridgeMetadata;
}>;

export type ExecutiveBridgeManifest = Readonly<{
  readonly platformId: string;
  readonly bridgeId: string;
  readonly bridgeName: string;
  readonly supportedVersions: readonly string[];
  readonly dependencies: readonly string[];
  readonly compatibility: readonly ExecutiveBridgeCompatibility[];
  readonly extensionPolicy: ExecutiveBridgeMetadata;
  readonly releaseMetadata: ExecutiveBridgeMetadata;
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveBridgeCertification = Readonly<{
  readonly status: "PASS" | "FAIL";
  readonly validation: ExecutiveBridgeValidation;
  readonly certifiedBridgeId: string;
}>;

export type ExecutiveBridgeResult<T> = Readonly<{
  readonly ok: boolean;
  readonly value: T;
  readonly validation: ExecutiveBridgeValidation;
}>;
