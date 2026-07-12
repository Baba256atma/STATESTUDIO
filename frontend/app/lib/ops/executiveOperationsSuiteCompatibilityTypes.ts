export type ExecutiveOperationsSuiteCompatibilityStatus = "Compatible" | "Pending";

export interface ExecutiveOperationsSuiteCompatibilityRegistryEntry {
  readonly id: string; readonly name: string; readonly category: string;
  readonly description: string; readonly status: ExecutiveOperationsSuiteCompatibilityStatus;
  readonly metadataOnly: true; readonly immutable: true;
}
export interface ExecutiveOperationsSuiteCompatibilityMatrixEntry {
  readonly id: string; readonly source: string; readonly target: string;
  readonly relationship: "CompatibleWith"; readonly order: number;
  readonly status: "Compatible"; readonly metadataOnly: true; readonly immutable: true;
}
export interface ExecutiveOperationsSuiteRegressionEntry {
  readonly id: string; readonly name: string; readonly scope: string;
  readonly description: string; readonly coverageStatus: "Covered";
  readonly metadataOnly: true; readonly immutable: true;
}
export interface ExecutiveOperationsSuiteRegressionSummary {
  readonly regressionStatus: "Covered"; readonly regressionEntryCount: number;
  readonly executionMode: "DescriptiveOnly"; readonly metadataOnly: true;
  readonly immutable: true; readonly deterministic: true;
}
export interface ExecutiveOperationsSuiteCompatibilityStatusDescriptor {
  readonly metadataOnly: true; readonly phase: "Compatibility"; readonly immutable: true;
  readonly deterministic: true; readonly visibility: "Public"; readonly releaseStatus: "Draft";
}
export interface ExecutiveOperationsSuiteCompatibilityManifest {
  readonly metadata: object;
  readonly compatibilityRegistry: readonly ExecutiveOperationsSuiteCompatibilityRegistryEntry[];
  readonly compatibilityMatrix: readonly ExecutiveOperationsSuiteCompatibilityMatrixEntry[];
  readonly regressionInventory: readonly ExecutiveOperationsSuiteRegressionEntry[];
  readonly regressionSummary: ExecutiveOperationsSuiteRegressionSummary;
  readonly compatibilitySummary: object; readonly architecturalPolicy: object;
  readonly publicApiPolicy: object; readonly deterministicPolicy: object; readonly immutablePolicy: object;
  readonly metadataOnly: true; readonly immutable: true; readonly deterministic: true;
}
export interface ExecutiveOperationsSuiteCompatibility {
  readonly metadata: object;
  readonly registry: readonly ExecutiveOperationsSuiteCompatibilityRegistryEntry[];
  readonly matrix: readonly ExecutiveOperationsSuiteCompatibilityMatrixEntry[];
  readonly manifest: ExecutiveOperationsSuiteCompatibilityManifest;
  readonly summary: object;
}
