export type ExecutiveOrchestrationValidationOwner = "ENG-8";
export type ExecutiveOrchestrationValidationVersion = "1.0.0";
export type ExecutiveOrchestrationValidationPhase = "ENG-8:4";
export type ExecutiveOrchestrationValidationNamespace =
  "nexora.engine.executive.orchestration.validation";

export type ExecutiveOrchestrationValidationSeverity =
  | "Info"
  | "Warning"
  | "Error"
  | "Critical";

export type ExecutiveOrchestrationValidationStatus =
  | "Pass"
  | "Fail"
  | "Skipped"
  | "NotApplicable";

export type ExecutiveOrchestrationValidationCategory =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Ownership"
  | "Dependency"
  | "Lifecycle"
  | "Capability"
  | "Coordination"
  | "ExecutionMode"
  | "PublicApi"
  | "AntiDuplication"
  | "MetadataConsistency";

export interface ExecutiveOrchestrationValidationRule {
  readonly id: string;
  readonly name: string;
  readonly category: ExecutiveOrchestrationValidationCategory;
  readonly severity: ExecutiveOrchestrationValidationSeverity;
  readonly description: string;
  readonly validatedArtifact: string;
  readonly expectedState: string;
  readonly actualMetadataResult: string;
  readonly status: ExecutiveOrchestrationValidationStatus;
  readonly owner: ExecutiveOrchestrationValidationOwner;
  readonly targetPhase: "ENG-8:1" | "ENG-8:2" | "ENG-8:3" | "ENG-8:4";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly runtimeFree: true;
  readonly executesValidation: false;
}

export interface ExecutiveOrchestrationValidationCategoryGroup {
  readonly id: string;
  readonly category: ExecutiveOrchestrationValidationCategory;
  readonly name: string;
  readonly description: string;
  readonly rules: readonly ExecutiveOrchestrationValidationRule[];
  readonly ruleCount: number;
  readonly passCount: number;
  readonly status: ExecutiveOrchestrationValidationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeFree: true;
}

export interface ExecutiveOrchestrationValidationSummary {
  readonly validationId: "ENG-8:4";
  readonly phase: ExecutiveOrchestrationValidationPhase;
  readonly namespace: ExecutiveOrchestrationValidationNamespace;
  readonly owner: ExecutiveOrchestrationValidationOwner;
  readonly totalRules: number;
  readonly passedRules: number;
  readonly failedRules: number;
  readonly skippedRules: number;
  readonly notApplicableRules: number;
  readonly categoryCount: number;
  readonly severityCount: 4;
  readonly status: "Stable";
  readonly architectureMode: "MetadataOnly";
  readonly immutability: "DeeplyFrozen";
  readonly validationStatus: "Pass";
  readonly readiness: "ReadyForManifest";
  readonly nextPhase: "ENG-8:5";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly runtimeFree: true;
}

export interface ExecutiveOrchestrationValidationMetadata {
  readonly id: "ENG-8:4";
  readonly name: "Executive Orchestration Validation Platform";
  readonly namespace: ExecutiveOrchestrationValidationNamespace;
  readonly version: ExecutiveOrchestrationValidationVersion;
  readonly status: "Stable";
  readonly architectureMode: "MetadataOnly";
  readonly immutability: "DeeplyFrozen";
  readonly runtimeBehavior: "None";
  readonly owner: ExecutiveOrchestrationValidationOwner;
  readonly previousPhase: "ENG-8:3";
  readonly nextPhase: "ENG-8:5";
  readonly readiness: "ReadyForManifest";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly runtimeFree: true;
  readonly deeplyFrozen: true;
  readonly readyForManifest: true;
}
