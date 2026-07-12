export type ExecutiveOperationsSuiteValidationCategory = "registry" | "platform" | "phase" | "foundation" | "manifest" | "metadata" | "publicApi" | "dependency" | "compatibility" | "immutability" | "architecture";
export type ExecutiveOperationsSuiteValidationSeverity = "info" | "warning" | "error" | "critical";

export interface ExecutiveOperationsSuiteValidationRule {
  readonly id: string;
  readonly name: string;
  readonly category: ExecutiveOperationsSuiteValidationCategory;
  readonly severity: ExecutiveOperationsSuiteValidationSeverity;
  readonly description: string;
  readonly appliesTo: string;
  readonly status: "Defined";
  readonly metadataOnly: true;
}

export interface ExecutiveOperationsSuiteValidationRegistryEntry extends ExecutiveOperationsSuiteValidationRule {
  readonly sourcePhase: "OPS-10:2";
  readonly deterministic: true;
  readonly immutable: true;
}

export interface ExecutiveOperationsSuiteValidationStatusDescriptor {
  readonly metadataOnly: true;
  readonly phase: "Validation";
  readonly immutable: true;
  readonly deterministic: true;
  readonly visibility: "Public";
  readonly releaseStatus: "Draft";
}

export interface ExecutiveOperationsSuiteValidationManifest {
  readonly validationMetadata: object;
  readonly validationRegistry: readonly ExecutiveOperationsSuiteValidationRegistryEntry[];
  readonly categoryInventory: readonly ExecutiveOperationsSuiteValidationCategory[];
  readonly severityInventory: readonly ExecutiveOperationsSuiteValidationSeverity[];
  readonly totalValidationCount: number;
  readonly architectureSummary: object;
  readonly registryCoverage: object;
  readonly publicApiCoverage: object;
  readonly validationPolicy: object;
  readonly deterministicPolicy: object;
  readonly immutablePolicy: object;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
