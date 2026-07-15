export type ExecutiveDecisionModelOwner = "ENG-7";
export type ExecutiveDecisionModelVersion = "1.0.0";
export type ExecutiveDecisionModelPhase = "ENG-7:3";
export type ExecutiveDecisionModelNamespace =
  "Nexora.Engine.ExecutiveDecision.Model";

export type ExecutiveDecisionModelId = string;

export type ExecutiveDecisionModelStatus =
  | "Defined"
  | "Registered"
  | "Stable";

export interface ExecutiveDecisionModelReference {
  readonly modelId: ExecutiveDecisionModelId;
  readonly phase: string;
  readonly namespace: string;
}

export interface ExecutiveDecisionAlternativeReference {
  readonly alternativeId: string;
  readonly modelId: ExecutiveDecisionModelId;
}

export interface ExecutiveDecisionEvidenceReference {
  readonly evidenceId: string;
  readonly originatingPhase: "ENG-6";
}

export interface ExecutiveDecisionConstraintReference {
  readonly constraintId: string;
  readonly originatingPhase: string;
}

export interface ExecutiveDecisionImpactReference {
  readonly impactId: string;
  readonly modelId: ExecutiveDecisionModelId;
}

export interface ExecutiveDecisionRiskReference {
  readonly riskId: string;
  readonly modelId: ExecutiveDecisionModelId;
}

export interface ExecutiveDecisionTradeoffReference {
  readonly tradeoffId: string;
  readonly modelId: ExecutiveDecisionModelId;
}

export interface ExecutiveDecisionTraceReference {
  readonly traceId: string;
  readonly modelId: ExecutiveDecisionModelId;
}

export interface ExecutiveDecisionRecommendationReference {
  readonly recommendationId: string;
  readonly modelId: ExecutiveDecisionModelId;
}

export interface ExecutiveDecisionPublicationReference {
  readonly publicationId: string;
  readonly modelId: ExecutiveDecisionModelId;
}

export interface ExecutiveDecisionModelDescriptor {
  readonly id: ExecutiveDecisionModelId;
  readonly name: string;
  readonly description: string;
  readonly namespace: ExecutiveDecisionModelNamespace;
  readonly owner: ExecutiveDecisionModelOwner;
  readonly sourcePhase: ExecutiveDecisionModelPhase;
  readonly registryDependencies: readonly string[];
  readonly modelDependencies: readonly string[];
  readonly fields: readonly string[];
  readonly status: ExecutiveDecisionModelStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeFree: true;
}

export interface ExecutiveDecisionModelMetadata {
  readonly id: "ENG-7:3";
  readonly name: "Executive Decision Model Platform";
  readonly namespace: ExecutiveDecisionModelNamespace;
  readonly version: ExecutiveDecisionModelVersion;
  readonly status: "Stable";
  readonly architectureMode: "MetadataOnly";
  readonly immutability: "DeeplyFrozen";
  readonly runtimeBehavior: "None";
  readonly owner: ExecutiveDecisionModelOwner;
  readonly previousPhase: "ENG-7:2";
  readonly nextPhase: "ENG-7:4";
  readonly readiness: "ReadyForDecisionValidation";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly runtimeFree: true;
}

export interface ExecutiveDecisionModelSummary {
  readonly modelPlatformId: "ENG-7:3";
  readonly phase: ExecutiveDecisionModelPhase;
  readonly namespace: ExecutiveDecisionModelNamespace;
  readonly owner: ExecutiveDecisionModelOwner;
  readonly modelCount: number;
  readonly registryEntryCount: number;
  readonly relationshipStepCount: number;
  readonly status: "Stable";
  readonly architectureMode: "MetadataOnly";
  readonly immutability: "DeeplyFrozen";
  readonly ownershipStatus: "OwnershipProtected";
  readonly dependencyStatus: "DependencySafe";
  readonly antiDuplicationStatus: "AntiDuplicationCompliant";
  readonly readiness: "ReadyForDecisionValidation";
  readonly nextPhase: "ENG-7:4";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly runtimeFree: true;
}
