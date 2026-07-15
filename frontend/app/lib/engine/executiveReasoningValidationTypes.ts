export type ExecutiveReasoningValidationOwner = "ENG-6";
export type ExecutiveReasoningValidationVersion = "1.0.0";
export type ExecutiveReasoningValidationPhase = "ENG-6:4";
export type ExecutiveReasoningValidationNamespace =
  "nexora.engine.executive.reasoning.validation";

export type ExecutiveReasoningValidationStatus = "PASS" | "WARNING" | "FAIL";

export type ExecutiveReasoningValidationDomainName =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Relationship"
  | "Lifecycle"
  | "Ownership"
  | "Dependency"
  | "PublicApi"
  | "Metadata"
  | "Namespace";

export type ExecutiveReasoningValidationSeverity =
  | "Info"
  | "Warning"
  | "Error"
  | "Critical";

export interface ExecutiveReasoningValidationRule {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly domain: ExecutiveReasoningValidationDomainName;
  readonly severity: ExecutiveReasoningValidationSeverity;
  readonly status: ExecutiveReasoningValidationStatus;
  readonly expectedCondition: string;
  readonly actualMetadataResult: string;
  readonly owner: ExecutiveReasoningValidationOwner;
  readonly targetPhase: "ENG-6:1" | "ENG-6:2" | "ENG-6:3" | "ENG-6:4";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
  readonly runtimeFree: true;
  readonly aiFree: true;
}

export interface ExecutiveReasoningValidationDomain {
  readonly id: string;
  readonly name: ExecutiveReasoningValidationDomainName;
  readonly description: string;
  readonly rules: readonly ExecutiveReasoningValidationRule[];
  readonly status: ExecutiveReasoningValidationStatus;
  readonly owner: ExecutiveReasoningValidationOwner;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
