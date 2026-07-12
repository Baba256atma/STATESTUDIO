export type ExecutionMonitoringValidationStatus = "PASS" | "FAIL";
export type ExecutionMonitoringValidationCategory = "Foundation" | "Registry" | "Model" | "Platform";

export interface ExecutionMonitoringValidationRule {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: ExecutionMonitoringValidationCategory;
  readonly status: ExecutionMonitoringValidationStatus;
  readonly metadataOnly: true;
}

export interface ExecutionMonitoringValidationGroup {
  readonly id: string;
  readonly name: string;
  readonly category: ExecutionMonitoringValidationCategory;
  readonly rules: readonly ExecutionMonitoringValidationRule[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutionMonitoringValidationResult {
  readonly totalChecks: number;
  readonly passedChecks: number;
  readonly failedChecks: number;
  readonly status: ExecutionMonitoringValidationStatus;
  readonly checks: readonly ExecutionMonitoringValidationRule[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutionMonitoringValidationSummary extends Omit<ExecutionMonitoringValidationResult, "checks"> {}

export interface ExecutionMonitoringValidationDescriptor {
  readonly validationId: string;
  readonly validationName: string;
  readonly validationVersion: string;
  readonly consumedPhases: readonly string[];
  readonly compatibilityVersion: string;
  readonly finalValidationState: ExecutionMonitoringValidationStatus;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutionMonitoringValidationManifest {
  readonly validationIdentity: ExecutionMonitoringValidationDescriptor;
  readonly platformIdentity: Readonly<Record<string, string | true>>;
  readonly validationRegistry: Readonly<Record<string, unknown>>;
  readonly supportedRuleGroups: readonly string[];
  readonly validationSummary: ExecutionMonitoringValidationSummary;
  readonly compatibilitySummary: Readonly<Record<string, ExecutionMonitoringValidationStatus | true>>;
  readonly deterministicSummary: Readonly<Record<string, true>>;
  readonly metadataOnlySummary: Readonly<Record<string, true>>;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
