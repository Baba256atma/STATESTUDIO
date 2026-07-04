export type ExecutiveRecommendationPayloadType =
  | "judgment-result"
  | "recommendation-request"
  | "recommendation-context"
  | "decision-evidence"
  | "decision-constraint"
  | "decision-tradeoff"
  | "recommendation-confidence"
  | "decision-intent"
  | "recommendation-metadata"
  | "validation-metadata";

export type ExecutiveRecommendationBridgeLifecycle = "Draft" | "Active" | "Frozen";

export type ExecutiveJudgmentInput = Readonly<{
  readonly inputId: string;
  readonly producerId: string;
  readonly judgmentResultId: string;
  readonly payloadType: "judgment-result";
  readonly contractVersion: string;
}>;

export type ExecutiveRecommendationRequest = Readonly<{
  readonly requestId: string;
  readonly consumerId: string;
  readonly requestCategory: string;
  readonly payloadType: "recommendation-request";
  readonly contractVersion: string;
}>;

export type ExecutiveRecommendationContext = Readonly<{
  readonly contextId: string;
  readonly judgmentInputId: string;
  readonly recommendationRequestId: string;
  readonly scopeId: string;
  readonly payloadType: "recommendation-context";
}>;

export type ExecutiveDecisionEvidence = Readonly<{
  readonly evidenceId: string;
  readonly sourceJudgmentEvidenceId: string;
  readonly targetRecommendationEvidenceId: string;
  readonly payloadType: "decision-evidence";
}>;

export type ExecutiveDecisionConstraint = Readonly<{
  readonly constraintId: string;
  readonly sourceJudgmentConstraintId: string;
  readonly targetRecommendationConstraintId: string;
  readonly payloadType: "decision-constraint";
}>;

export type ExecutiveDecisionTradeoff = Readonly<{
  readonly tradeoffId: string;
  readonly sourceJudgmentTradeoffId: string;
  readonly targetRecommendationTradeoffId: string;
  readonly payloadType: "decision-tradeoff";
}>;

export type ExecutiveRecommendationConfidence = Readonly<{
  readonly confidenceId: string;
  readonly sourceJudgmentConfidenceId: string;
  readonly targetRecommendationConfidenceId: string;
  readonly payloadType: "recommendation-confidence";
}>;

export type ExecutiveRecommendationIntent = Readonly<{
  readonly intentId: string;
  readonly sourceDecisionIntentId: string;
  readonly targetRecommendationIntentId: string;
  readonly payloadType: "decision-intent";
}>;

export type ExecutiveRecommendationMetadata = Readonly<{
  readonly bridgeId: string;
  readonly phaseId: "LAY-CONN-3";
  readonly metadataOnly: boolean;
  readonly immutable: boolean;
  readonly tags: readonly string[];
}>;

export type ExecutiveRecommendationCompatibility = Readonly<{
  readonly platformId: string;
  readonly compatible: boolean;
  readonly required: boolean;
  readonly notes: readonly string[];
}>;

export type ExecutiveRecommendationValidation = Readonly<{
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}>;

export type ExecutiveRecommendationRegistry = Readonly<{
  readonly bridgeId: string;
  readonly supportedProducers: readonly string[];
  readonly supportedConsumers: readonly string[];
  readonly supportedPayloadTypes: readonly ExecutiveRecommendationPayloadType[];
  readonly supportedContractVersions: readonly string[];
  readonly compatibilityMatrix: readonly ExecutiveRecommendationCompatibility[];
  readonly extensionPolicy: ExecutiveRecommendationMetadata;
  readonly publicApis: readonly string[];
}>;

export type ExecutiveJudgmentRecommendationBridge = Readonly<{
  readonly bridgeId: string;
  readonly name: string;
  readonly lifecycle: ExecutiveRecommendationBridgeLifecycle;
  readonly judgmentInput: ExecutiveJudgmentInput;
  readonly recommendationRequest: ExecutiveRecommendationRequest;
  readonly context: ExecutiveRecommendationContext;
  readonly evidence: readonly ExecutiveDecisionEvidence[];
  readonly constraints: readonly ExecutiveDecisionConstraint[];
  readonly tradeoffs: readonly ExecutiveDecisionTradeoff[];
  readonly confidence: ExecutiveRecommendationConfidence;
  readonly intent: ExecutiveRecommendationIntent;
  readonly metadata: ExecutiveRecommendationMetadata;
}>;

export type ExecutiveRecommendationManifest = Readonly<{
  readonly platformId: string;
  readonly bridgeId: string;
  readonly bridgeName: string;
  readonly version: string;
  readonly dependencies: readonly string[];
  readonly compatibility: readonly ExecutiveRecommendationCompatibility[];
  readonly extensionPolicy: ExecutiveRecommendationMetadata;
  readonly releaseMetadata: ExecutiveRecommendationMetadata;
  readonly deterministicFingerprint: string;
}>;

export type ExecutiveRecommendationCertification = Readonly<{
  readonly status: "PASS" | "FAIL";
  readonly validation: ExecutiveRecommendationValidation;
  readonly certifiedBridgeId: string;
}>;

export type ExecutiveRecommendationBridgeResult<T> = Readonly<{
  readonly ok: boolean;
  readonly value: T;
  readonly validation: ExecutiveRecommendationValidation;
}>;
