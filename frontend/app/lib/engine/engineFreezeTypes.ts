export type ExecutiveEngineFreezeStatus = "Frozen" | "Blocked";
export interface ExecutiveEngineFrozenArtifactEntry {
  readonly artifactId: string; readonly name: string; readonly category: "Phase" | "PublicApi" | "ArchitecturalSection";
  readonly freezeStatus: ExecutiveEngineFreezeStatus; readonly lifecycleStatus: "Locked";
  readonly metadataOnly: true; readonly immutable: true;
}
export interface ExecutiveEngineCompatibilityEntry {
  readonly artifactId: `ENG-COMPATIBILITY-${string}`; readonly target: string;
  readonly scope: "ExternalPublicLayer" | "InternalEngineSection";
  readonly compatibilityStatus: "Compatible"; readonly enforcement: false;
  readonly metadataOnly: true; readonly immutable: true;
}
export interface ExecutiveEngineExtensionPolicyDescriptor {
  readonly artifactId: "ENG-EXTENSION-001"; readonly foundationStatus: "Frozen";
  readonly futureExtensionPoints: readonly string[];
  readonly rules: readonly string[]; readonly runtimeCapabilitiesAllowedInEng1: false;
  readonly metadataOnly: true; readonly immutable: true; readonly deterministic: true;
}
export interface ExecutiveEnginePhaseLockDescriptor {
  readonly artifactId: "ENG-LOCK-001"; readonly lockIdentifier: "ENG-1-LOCKED";
  readonly lockVersion: "1.0.0"; readonly lockScope: "ENG-1 Foundation";
  readonly lockTimestampMetadata: Readonly<{ classification: "DeterministicReleaseMetadata"; value: "ENG-1:8" }>;
  readonly architecturalBaselineVersion: "1.0.0";
  readonly metadataOnly: true; readonly immutable: true;
}
export interface ExecutiveEngineFreezeManifestDescriptor {
  readonly artifactId: "ENG-FREEZE-MANIFEST-001"; readonly freezeRegistry: object;
  readonly compatibilityMatrix: readonly ExecutiveEngineCompatibilityEntry[];
  readonly extensionPolicy: ExecutiveEngineExtensionPolicyDescriptor;
  readonly phaseLockMetadata: ExecutiveEnginePhaseLockDescriptor;
  readonly regressionSummary: object; readonly freezeMetadata: object; readonly releaseReadiness: object;
  readonly metadataOnly: true; readonly immutable: true; readonly deterministic: true;
}
export interface ExecutiveEngineFreezeSummaryDescriptor {
  readonly artifactId: "ENG-FREEZE-SUMMARY-001"; readonly freezeStatus: ExecutiveEngineFreezeStatus;
  readonly readiness: "ReadyForPublicIndex" | "Blocked"; readonly frozenPhaseCount: number;
  readonly frozenPublicApiCount: number; readonly frozenSectionCount: number;
  readonly compatibilityCount: number; readonly extensionPointCount: number;
  readonly certificationStatus: string; readonly validationStatus: string;
  readonly nextPhase: "ENG-1:9 — Executive Engine Public Index";
  readonly metadataOnly: true; readonly immutable: true; readonly deterministic: true;
}
