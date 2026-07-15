export type ExecutiveContextValidationSeverity = "Critical" | "High" | "Medium" | "Low" | "Informational";
export type ExecutiveContextValidationStatus = "Pass" | "Fail" | "Warning" | "NotApplicable";
export type ExecutiveContextValidationGroupName =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Ownership"
  | "PublicApi";
export type ExecutiveContextValidationTargetPhase = "ENG-4:1" | "ENG-4:2" | "ENG-4:3" | "ENG-4:4";
export type ExecutiveContextValidationNamespace = "nexora.engine.executive.context-assembly.validation";
export type ExecutiveContextValidationOwner = "ENG-4";

export interface ExecutiveContextValidationResult {
  readonly status: ExecutiveContextValidationStatus;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveContextValidationRule {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly group: ExecutiveContextValidationGroupName;
  readonly severity: ExecutiveContextValidationSeverity;
  readonly status: ExecutiveContextValidationStatus;
  readonly targetPhase: ExecutiveContextValidationTargetPhase;
  readonly expectedCondition: string;
  readonly actualMetadataResult: string;
  readonly ownership: ExecutiveContextValidationOwner;
  readonly runtimeFree: true;
  readonly result: ExecutiveContextValidationResult;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveContextValidationGroup {
  readonly id: string;
  readonly name: string;
  readonly group: ExecutiveContextValidationGroupName;
  readonly targetPhase: ExecutiveContextValidationTargetPhase;
  readonly namespace: ExecutiveContextValidationNamespace;
  readonly owner: ExecutiveContextValidationOwner;
  readonly rules: readonly ExecutiveContextValidationRule[];
  readonly status: ExecutiveContextValidationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveContextValidationGate {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly status: ExecutiveContextValidationStatus;
  readonly requiredRuleGroups: readonly ExecutiveContextValidationGroupName[];
  readonly ownership: ExecutiveContextValidationOwner;
  readonly runtimeFree: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveContextValidationDependency {
  readonly phase: "ENG-1" | "ENG-2" | "ENG-3" | "ENG-4:1" | "ENG-4:2" | "ENG-4:3";
  readonly publicIndex: string;
  readonly consumption: "PublicIndexOnly";
  readonly artifact?: object;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveContextValidationMetadata {
  readonly validationId: "ENG-4:4";
  readonly validationVersion: "1.0.0";
  readonly validationName: "Executive Context Assembly Validation";
  readonly namespace: ExecutiveContextValidationNamespace;
  readonly phase: "ENG-4:4";
  readonly owner: ExecutiveContextValidationOwner;
  readonly description: string;
  readonly ruleCount: number;
  readonly groupCount: 5;
  readonly gateCount: number;
  readonly status: Readonly<{
    validation: "Validation";
    passed: "Passed";
    metadataOnly: "MetadataOnly";
    immutable: "Immutable";
    runtimeFree: "RuntimeFree";
    deterministic: "Deterministic";
    readyForManifest: "ReadyForManifest";
  }>;
  readonly nextPhase: "ENG-4:5";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveContextValidationSummary {
  readonly validationId: "ENG-4:4";
  readonly phase: "ENG-4:4";
  readonly namespace: ExecutiveContextValidationNamespace;
  readonly owner: ExecutiveContextValidationOwner;
  readonly groupCount: 5;
  readonly ruleCount: number;
  readonly passedRuleCount: number;
  readonly gateCount: number;
  readonly passedGateCount: number;
  readonly status: "Passed";
  readonly nextPhase: "ENG-4:5";
  readonly manifestReady: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveContextAssemblyValidationAggregate {
  readonly foundationValidation: ExecutiveContextValidationGroup;
  readonly registryValidation: ExecutiveContextValidationGroup;
  readonly modelValidation: ExecutiveContextValidationGroup;
  readonly ownershipValidation: ExecutiveContextValidationGroup;
  readonly publicApiValidation: ExecutiveContextValidationGroup;
  readonly validationGroups: readonly ExecutiveContextValidationGroup[];
  readonly validationRules: readonly ExecutiveContextValidationRule[];
  readonly validationGates: readonly ExecutiveContextValidationGate[];
  readonly metadata: ExecutiveContextValidationMetadata;
  readonly dependencies: readonly ExecutiveContextValidationDependency[];
  readonly summary: ExecutiveContextValidationSummary;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
