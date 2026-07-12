export type AutomationValidationStatus = "PASS" | "FAIL";

export type AutomationValidationCategory =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Platform";

export interface AutomationValidationRule {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: AutomationValidationCategory;
  readonly status: AutomationValidationStatus;
  readonly metadataOnly: true;
}

export interface AutomationValidationGroup {
  readonly id: string;
  readonly name: string;
  readonly category: AutomationValidationCategory;
  readonly rules: readonly AutomationValidationRule[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface AutomationValidationResult {
  readonly totalChecks: number;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly status: AutomationValidationStatus;
  readonly checks: readonly AutomationValidationRule[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface AutomationValidationSummary {
  readonly totalChecks: number;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly status: AutomationValidationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface AutomationValidationDescriptor {
  readonly validationId: string;
  readonly validationName: string;
  readonly validationVersion: string;
  readonly consumedPhases: readonly string[];
  readonly compatibilityVersion: string;
  readonly finalValidationState: AutomationValidationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface AutomationValidationManifest {
  readonly validationIdentity: AutomationValidationDescriptor;
  readonly platformIdentity: {
    readonly platformId: string;
    readonly platformName: string;
    readonly platformVersion: string;
    readonly metadataOnly: true;
    readonly immutable: true;
    readonly deterministic: true;
  };
  readonly validationRegistry: {
    readonly validationGroups: readonly AutomationValidationGroup[];
    readonly validationRuleCatalog: readonly AutomationValidationRule[];
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
  readonly validationSummary: AutomationValidationSummary;
  readonly compatibilitySummary: {
    readonly compatibilityStatus: AutomationValidationStatus;
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
