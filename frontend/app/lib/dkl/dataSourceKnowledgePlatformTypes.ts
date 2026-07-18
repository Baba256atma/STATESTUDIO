/**
 * DKL-2:6 — Data Source & Knowledge Platform Types.
 *
 * Readonly, metadata-only contracts for the DKL-2:6 platform aggregation layer.
 * This module declares the shapes for the canonical platform registry, metadata,
 * summary, readiness, and aggregate platform root.
 *
 * Responsibility: shared immutable platform shapes and canonical constants.
 * Ownership: owned exclusively by DKL-2:6.
 * Dependency rules: pure type/constant module; no phase imports.
 * Architectural purpose: the platform aggregation vocabulary. No runtime
 * behavior, no side effects, no I/O.
 */

export type PlatformPhaseKind = "Foundation" | "Registry" | "Model" | "Validation" | "Manifest";

export type PlatformPhaseStatus = "Complete";

export type PlatformReadinessState = "ReadyForCertification";

export const PLATFORM_OWNER = "DKL-2 Data Source & Knowledge Registry";

export const PLATFORM_VERSION = "1.0.0";

export const PLATFORM_SOURCE_PHASE = "DKL-2:6";

export interface PlatformRegistryEntry {
  readonly phaseId: string;
  readonly phaseName: string;
  readonly phaseKind: PlatformPhaseKind;
  readonly publicModule: string;
  readonly runtimeExportCount: number;
  readonly artifactCount: number;
  readonly status: PlatformPhaseStatus;
  readonly dependencies: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface PlatformRegistryContainer {
  readonly kind: "PlatformRegistry";
  readonly phases: readonly PlatformRegistryEntry[];
  readonly dependencyChain: readonly string[];
  readonly getByPhaseId: (phaseId: string) => PlatformRegistryEntry | undefined;
}

export interface PlatformMetadataDescriptor {
  readonly platformId: string;
  readonly version: string;
  readonly owner: string;
  readonly namespace: string;
  readonly releaseStage: string;
  readonly readiness: PlatformReadinessState;
  readonly dependency: readonly string[];
  readonly artifactCount: number;
  readonly runtimeExportCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface PlatformSummaryDescriptor {
  readonly phaseCount: number;
  readonly completedPhases: readonly string[];
  readonly runtimeExportCount: number;
  readonly artifactCount: number;
  readonly validationStatus: string;
  readonly guaranteeCount: number;
  readonly readiness: PlatformReadinessState;
  readonly metadataOnly: true;
  readonly deterministic: true;
  readonly immutable: true;
}

export interface PlatformReadinessDescriptor {
  readonly status: "PlatformComplete";
  readonly certificationState: PlatformReadinessState;
  readonly readiness: PlatformReadinessState;
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly deterministic: true;
  readonly immutable: true;
  readonly completion: readonly string[];
  readonly nextPhase: "DKL-2:7";
}
