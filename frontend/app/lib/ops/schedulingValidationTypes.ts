export type SchedulingValidationCategory =
  | "Foundation"
  | "Registry"
  | "Model"
  | "PublicApi"
  | "Dependency"
  | "Consumer"
  | "Manifest"
  | "Immutability"
  | "Determinism"
  | "Compatibility";

export type SchedulingValidationStatus = "PASS" | "FAIL";

export interface SchedulingValidationEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: SchedulingValidationCategory;
  readonly status: SchedulingValidationStatus;
  readonly metadataOnly: true;
}

export interface SchedulingValidationSummary {
  readonly totalChecks: number;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly status: SchedulingValidationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface SchedulingValidationManifestDescriptor {
  readonly validationId: string;
  readonly validationName: string;
  readonly validationVersion: string;
  readonly consumedPhases: readonly string[];
  readonly compatibilityVersion: string;
  readonly finalValidationState: SchedulingValidationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
