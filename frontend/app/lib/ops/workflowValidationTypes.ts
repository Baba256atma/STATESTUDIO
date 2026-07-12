export type WorkflowValidationCategory =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Stage"
  | "Transition"
  | "Approval"
  | "Trigger"
  | "TaskCompatibility"
  | "PublicApi"
  | "Dependency"
  | "Consumer"
  | "Manifest"
  | "Immutability"
  | "Determinism";

export type WorkflowValidationStatus = "PASS" | "FAIL";

export interface WorkflowValidationEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: WorkflowValidationCategory;
  readonly status: WorkflowValidationStatus;
  readonly metadataOnly: true;
}

export interface WorkflowValidationSummary {
  readonly totalChecks: number;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly status: WorkflowValidationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface WorkflowValidationManifestDescriptor {
  readonly validationId: string;
  readonly validationName: string;
  readonly validationVersion: string;
  readonly consumedPhases: readonly string[];
  readonly compatibilityVersion: string;
  readonly finalValidationState: WorkflowValidationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
