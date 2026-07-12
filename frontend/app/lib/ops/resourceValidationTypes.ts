export type ResourceValidationCategory =
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

export type ResourceValidationStatus = "PASS" | "FAIL";

export interface ResourceValidationEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: ResourceValidationCategory;
  readonly status: ResourceValidationStatus;
  readonly metadataOnly: true;
}

export interface ResourceValidationSummary {
  readonly totalChecks: number;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly status: ResourceValidationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ResourceValidationManifestDescriptor {
  readonly validationId: string;
  readonly validationName: string;
  readonly validationVersion: string;
  readonly consumedPhases: readonly string[];
  readonly compatibilityVersion: string;
  readonly finalValidationState: ResourceValidationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
