export type ProjectValidationCategory =
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

export type ProjectValidationStatus = "PASS" | "FAIL";

export interface ProjectValidationEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: ProjectValidationCategory;
  readonly status: ProjectValidationStatus;
  readonly metadataOnly: true;
}

export interface ProjectValidationSummary {
  readonly totalChecks: number;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly status: ProjectValidationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ProjectValidationManifestDescriptor {
  readonly validationId: string;
  readonly validationName: string;
  readonly validationVersion: string;
  readonly consumedPhases: readonly string[];
  readonly compatibilityVersion: string;
  readonly finalValidationState: ProjectValidationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

