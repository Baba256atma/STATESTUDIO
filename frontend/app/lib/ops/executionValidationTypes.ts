export type ExecutionValidationCategory =
  | "Foundation"
  | "Registry"
  | "Model"
  | "PublicApi"
  | "Dependency"
  | "Consumer"
  | "Manifest"
  | "Immutability"
  | "Determinism";

export type ExecutionValidationStatus = "PASS" | "FAIL";

export interface ExecutionValidationEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: ExecutionValidationCategory;
  readonly status: ExecutionValidationStatus;
  readonly metadataOnly: true;
}

export interface ExecutionValidationSummary {
  readonly totalChecks: number;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly status: ExecutionValidationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutionValidationManifestDescriptor {
  readonly validationId: string;
  readonly validationName: string;
  readonly validationVersion: string;
  readonly consumedPhases: readonly string[];
  readonly compatibilityVersion: string;
  readonly finalValidationState: ExecutionValidationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
