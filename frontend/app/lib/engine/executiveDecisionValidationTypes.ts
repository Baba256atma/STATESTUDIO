export type ExecutiveDecisionValidationOwner = "ENG-7";
export type ExecutiveDecisionValidationVersion = "1.0.0";
export type ExecutiveDecisionValidationPhase = "ENG-7:4";
export type ExecutiveDecisionValidationNamespace =
  "Nexora.Engine.ExecutiveDecision.Validation";

export type ExecutiveDecisionValidationStatus =
  | "PASS"
  | "WARNING"
  | "FAIL";

export type ExecutiveDecisionValidationCategory =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Ownership"
  | "Dependency"
  | "Public API"
  | "Immutability"
  | "Metadata Compliance";

export type ExecutiveDecisionValidationSeverity =
  | "Info"
  | "Warning"
  | "Error"
  | "Critical";

export interface ExecutiveDecisionValidationRule {
  readonly id: string;
  readonly name: string;
  readonly category: ExecutiveDecisionValidationCategory;
  readonly severity: ExecutiveDecisionValidationSeverity;
  readonly description: string;
  readonly validatedArtifact: string;
  readonly expectedState: string;
  readonly actualMetadataResult: string;
  readonly status: ExecutiveDecisionValidationStatus;
  readonly owner: ExecutiveDecisionValidationOwner;
  readonly targetPhase: "ENG-7:1" | "ENG-7:2" | "ENG-7:3" | "ENG-7:4";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly runtimeFree: true;
  readonly aiFree: true;
}

export interface ExecutiveDecisionValidationResult {
  readonly category: ExecutiveDecisionValidationCategory;
  readonly ruleCount: number;
  readonly passCount: number;
  readonly status: ExecutiveDecisionValidationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveDecisionValidationSummary {
  readonly validationId: "ENG-7:4";
  readonly phase: ExecutiveDecisionValidationPhase;
  readonly namespace: ExecutiveDecisionValidationNamespace;
  readonly owner: ExecutiveDecisionValidationOwner;
  readonly totalRules: number;
  readonly passedRules: number;
  readonly warningCount: number;
  readonly failureCount: number;
  readonly categoryCount: number;
  readonly severityCount: number;
  readonly status: "Stable";
  readonly architectureMode: "MetadataOnly";
  readonly immutability: "DeeplyFrozen";
  readonly ownershipStatus: "OwnershipProtected";
  readonly dependencyStatus: "DependencySafe";
  readonly validationStatus: "ValidationCertified";
  readonly readiness: "ReadyForDecisionManifest";
  readonly nextPhase: "ENG-7:5";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly runtimeFree: true;
}

export interface ExecutiveDecisionValidationMetadata {
  readonly id: "ENG-7:4";
  readonly name: "Executive Decision Validation Platform";
  readonly namespace: ExecutiveDecisionValidationNamespace;
  readonly version: ExecutiveDecisionValidationVersion;
  readonly status: "Stable";
  readonly architectureMode: "MetadataOnly";
  readonly immutability: "DeeplyFrozen";
  readonly runtimeBehavior: "None";
  readonly owner: ExecutiveDecisionValidationOwner;
  readonly previousPhase: "ENG-7:3";
  readonly nextPhase: "ENG-7:5";
  readonly readiness: "ReadyForDecisionManifest";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly runtimeFree: true;
}
