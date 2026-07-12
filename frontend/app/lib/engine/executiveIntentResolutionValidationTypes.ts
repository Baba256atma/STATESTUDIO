export type ExecutiveValidationCategory = "Foundation" | "Registry" | "Model" | "Dependencies" | "Ownership" | "Compatibility" | "Public API" | "Metadata" | "Immutability" | "Release Readiness";
export type ExecutiveValidationSeverity = "Informational" | "Warning" | "Error" | "Critical";
export type ExecutiveValidationStatus = "Pending" | "Passed" | "Failed" | "Certified";

export interface ExecutiveValidationResult {
  readonly status: ExecutiveValidationStatus;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveValidationRule {
  readonly id: `eng-3-validation-${string}`;
  readonly name: string;
  readonly category: ExecutiveValidationCategory;
  readonly severity: ExecutiveValidationSeverity;
  readonly description: string;
  readonly evidenceReference: object;
  readonly result: ExecutiveValidationResult;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveValidationGate {
  readonly id: `eng-3-gate-${string}`;
  readonly name: string;
  readonly category: ExecutiveValidationCategory;
  readonly status: "Passed";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveValidationGroup {
  readonly id: `eng-3-validation-group-${string}`;
  readonly name: string;
  readonly targetPhase: "ENG-3:1" | "ENG-3:2" | "ENG-3:3";
  readonly rules: readonly ExecutiveValidationRule[];
  readonly status: "Passed";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveValidationMetadata {
  readonly platformId: "ENG-3:4";
  readonly name: "Executive Intent Resolution Validation Platform";
  readonly namespace: "nexora.engine.executive.intent-resolution.validation";
  readonly version: "1.0.0";
  readonly owner: "ENG-3";
  readonly status: "Published";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveValidationManifest {
  readonly ownership: "ENG-3";
  readonly scope: readonly ["ENG-3:1", "ENG-3:2", "ENG-3:3"];
  readonly dependencies: readonly Readonly<{ publicIndex: string; artifact: object }>[];
  readonly validationGroups: readonly ExecutiveValidationGroup[];
  readonly validationGates: readonly ExecutiveValidationGate[];
  readonly categories: readonly ExecutiveValidationCategory[];
  readonly severities: readonly ExecutiveValidationSeverity[];
  readonly statuses: readonly ExecutiveValidationStatus[];
  readonly compatibility: Readonly<{ foundation: "Compatible"; registry: "Compatible"; model: "Compatible"; ownershipSafe: true }>;
  readonly version: "1.0.0";
  readonly stability: "Draft";
  readonly certificationState: "ValidationComplete";
  readonly publicationState: "Published";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveValidationPlatform {
  readonly foundationValidation: ExecutiveValidationGroup;
  readonly registryValidation: ExecutiveValidationGroup;
  readonly modelValidation: ExecutiveValidationGroup;
  readonly manifest: ExecutiveValidationManifest;
  readonly metadata: ExecutiveValidationMetadata;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
