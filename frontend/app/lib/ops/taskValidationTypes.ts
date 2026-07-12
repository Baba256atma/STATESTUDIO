export type TaskValidationCategory =
  | "Foundation"
  | "Registry"
  | "Model"
  | "PublicApi"
  | "Dependency"
  | "Consumer"
  | "Manifest"
  | "Immutability"
  | "Determinism";

export type TaskValidationStatus = "PASS" | "FAIL";

export interface TaskValidationEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: TaskValidationCategory;
  readonly status: TaskValidationStatus;
  readonly metadataOnly: true;
}

export interface TaskValidationSummary {
  readonly totalChecks: number;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly status: TaskValidationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface TaskValidationManifestDescriptor {
  readonly validationId: string;
  readonly validationName: string;
  readonly validationVersion: string;
  readonly consumedPhases: readonly string[];
  readonly compatibilityVersion: string;
  readonly finalValidationState: TaskValidationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
