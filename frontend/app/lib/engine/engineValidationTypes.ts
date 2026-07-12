export type ExecutiveEngineValidationStatus = "PASS" | "FAIL";
export type ExecutiveEngineValidationDomain = "Foundation" | "Registry" | "Model" | "Ownership" | "Dependency" | "AntiDuplication" | "Immutability" | "PublicApi";

export interface ExecutiveEngineValidationCheck {
  readonly id: string; readonly name: string; readonly status: ExecutiveEngineValidationStatus;
  readonly description: string; readonly metadataOnly: true;
}
export interface ExecutiveEngineValidationResult {
  readonly domain: ExecutiveEngineValidationDomain;
  readonly checks: readonly ExecutiveEngineValidationCheck[];
  readonly totalChecks: number; readonly passedChecks: number; readonly failedChecks: number;
  readonly status: ExecutiveEngineValidationStatus;
  readonly metadataOnly: true; readonly immutable: true; readonly deterministic: true;
}
export interface ExecutiveEngineValidationSummary {
  readonly totalDomains: 8; readonly passedDomains: number; readonly failedDomains: number;
  readonly totalChecks: number; readonly passedChecks: number; readonly failedChecks: number;
  readonly status: ExecutiveEngineValidationStatus;
  readonly releaseReadiness: "ReadyForManifest" | "Blocked";
  readonly nextPhase: "ENG-1:5 — Executive Engine Manifest";
  readonly metadataOnly: true; readonly immutable: true; readonly deterministic: true;
}
export interface ExecutiveEngineValidationManifestDescriptor {
  readonly phaseId: "ENG-1:4"; readonly version: "1.0.0";
  readonly validationDomains: readonly ExecutiveEngineValidationResult[];
  readonly validationCounts: object; readonly dependencyCompliance: ExecutiveEngineValidationStatus;
  readonly ownershipCompliance: ExecutiveEngineValidationStatus;
  readonly antiDuplicationCompliance: ExecutiveEngineValidationStatus;
  readonly immutabilityCompliance: ExecutiveEngineValidationStatus;
  readonly publicApiCompliance: ExecutiveEngineValidationStatus;
  readonly releaseReadinessMetadata: object;
  readonly metadataOnly: true; readonly immutable: true; readonly deterministic: true;
}
