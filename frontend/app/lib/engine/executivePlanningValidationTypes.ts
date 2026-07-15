export type ExecutivePlanningValidationOwner = "ENG-5";
export type ExecutivePlanningValidationVersion = "1.0.0";
export type ExecutivePlanningValidationPhase = "ENG-5:4";
export type ExecutivePlanningValidationNamespace = "nexora.engine.executive.planning.validation";

export type ExecutivePlanningValidationSeverity = "Info" | "Warning" | "Error" | "Critical";
export type ExecutivePlanningValidationStatus = "Pass" | "Fail" | "Skipped";

export type ExecutivePlanningValidationCategory =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Ownership"
  | "PublicApi";

export type ExecutivePlanningValidationTargetPhase =
  | "ENG-5:1"
  | "ENG-5:2"
  | "ENG-5:3"
  | "ENG-5:4";

export interface ExecutivePlanningValidationResult {
  readonly status: ExecutivePlanningValidationStatus;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutivePlanningValidationRule {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: ExecutivePlanningValidationCategory;
  readonly severity: ExecutivePlanningValidationSeverity;
  readonly status: ExecutivePlanningValidationStatus;
  readonly targetPhase: ExecutivePlanningValidationTargetPhase;
  readonly expectedCondition: string;
  readonly actualMetadataResult: string;
  readonly owner: ExecutivePlanningValidationOwner;
  readonly result: ExecutivePlanningValidationResult;
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutivePlanningValidationGroup {
  readonly id: string;
  readonly name: string;
  readonly category: ExecutivePlanningValidationCategory;
  readonly targetPhase: ExecutivePlanningValidationTargetPhase;
  readonly namespace: ExecutivePlanningValidationNamespace;
  readonly owner: ExecutivePlanningValidationOwner;
  readonly rules: readonly ExecutivePlanningValidationRule[];
  readonly status: ExecutivePlanningValidationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutivePlanningValidationSummary {
  readonly validationId: "ENG-5:4";
  readonly phase: ExecutivePlanningValidationPhase;
  readonly namespace: ExecutivePlanningValidationNamespace;
  readonly owner: ExecutivePlanningValidationOwner;
  readonly categoryCount: 5;
  readonly ruleCount: 44;
  readonly passedRuleCount: number;
  readonly foundationRuleCount: 8;
  readonly registryRuleCount: 10;
  readonly modelRuleCount: 10;
  readonly ownershipRuleCount: 8;
  readonly publicApiRuleCount: 8;
  readonly status: "Pass";
  readonly nextPhase: "ENG-5:5";
  readonly manifestReady: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly runtimeFree: true;
}

export interface ExecutivePlanningValidationPlatformMetadata {
  readonly platformId: "ENG-5:4";
  readonly name: "Executive Planning Validation Platform";
  readonly version: ExecutivePlanningValidationVersion;
  readonly namespace: ExecutivePlanningValidationNamespace;
  readonly description: string;
  readonly status: Readonly<{
    validation: "Validation";
    passed: "Pass";
    metadataOnly: "MetadataOnly";
    runtimeFree: "RuntimeFree";
    immutable: "Immutable";
    deterministic: "Deterministic";
    readyForManifest: "ReadyForManifest";
  }>;
  readonly dependencyOnFoundation: "executivePlanningIndex.ts";
  readonly dependencyOnRegistry: "executivePlanningRegistryIndex.ts";
  readonly dependencyOnModel: "executivePlanningModelIndex.ts";
  readonly ownership: "ENG-5";
  readonly ruleCount: 44;
  readonly categoryCount: 5;
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly deterministic: true;
  readonly nextPhase: "ENG-5:5";
}
