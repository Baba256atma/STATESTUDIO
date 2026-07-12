export type DependencyValidationStatus = "PASS" | "FAIL";

export type DependencyValidationCategory =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Platform";

export interface DependencyValidationRule {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: DependencyValidationCategory;
  readonly status: DependencyValidationStatus;
  readonly metadataOnly: true;
}

export interface DependencyValidationGroup {
  readonly id: string;
  readonly name: string;
  readonly category: DependencyValidationCategory;
  readonly rules: readonly DependencyValidationRule[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface DependencyValidationResult {
  readonly totalChecks: number;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly status: DependencyValidationStatus;
  readonly checks: readonly DependencyValidationRule[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface DependencyValidationSummary {
  readonly totalChecks: number;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly status: DependencyValidationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface DependencyValidationDescriptor {
  readonly validationId: string;
  readonly validationName: string;
  readonly validationVersion: string;
  readonly consumedPhases: readonly string[];
  readonly compatibilityVersion: string;
  readonly finalValidationState: DependencyValidationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface DependencyValidationManifest {
  readonly validationIdentity: DependencyValidationDescriptor;
  readonly validationRegistry: {
    readonly validationGroups: readonly DependencyValidationGroup[];
    readonly validationRuleCatalog: readonly DependencyValidationRule[];
    readonly validationMetadata: {
      readonly groupCount: number;
      readonly ruleCount: number;
      readonly compatibilityVersion: string;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
    };
    readonly compatibilityMetadata: {
      readonly consumedPhases: readonly string[];
      readonly compatibilityVersion: string;
      readonly metadataOnly: true;
      readonly immutable: true;
      readonly deterministic: true;
    };
    readonly metadataOnly: true;
    readonly immutable: true;
    readonly deterministic: true;
  };
  readonly supportedRuleGroups: readonly string[];
  readonly validationSummary: DependencyValidationSummary;
  readonly compatibilitySummary: {
    readonly compatibilityStatus: DependencyValidationStatus;
    readonly metadataOnly: true;
    readonly immutable: true;
    readonly deterministic: true;
  };
  readonly deterministicSummary: {
    readonly deterministic: true;
    readonly metadataOnly: true;
    readonly immutable: true;
  };
  readonly metadataOnlySummary: {
    readonly metadataOnly: true;
    readonly immutable: true;
    readonly publicApiStable: true;
  };
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
