/**
 * NEA-7:6 — Intake Orchestration Platform Types.
 *
 * Readonly contracts for the Intake Orchestration Platform composition surface.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-7:6.
 */

/** Platform status for NEA-7:6. */
export type IntakeOrchestrationPlatformStatus = "Platform";

/** Immediate downstream readiness — Certification only. */
export type IntakeOrchestrationPlatformReadiness = "ReadyForCertification";

/** Platform namespace section keys. */
export type IntakeOrchestrationPlatformNamespaceSection =
  | "foundation"
  | "registry"
  | "model"
  | "validation"
  | "manifest"
  | "platform";

/** Canonical phase composition entry by reference. */
export interface IntakeOrchestrationPlatformPhaseComposition {
  readonly section: IntakeOrchestrationPlatformNamespaceSection;
  readonly phaseId: string;
  readonly phaseName: string;
  readonly version: string;
  readonly namespace: string;
  readonly status: string;
  readonly module: string;
  readonly ownership: "Referenced";
  readonly reconstructsPhase: false;
  readonly duplicatesArchitecture: false;
  readonly deterministicOrder: number;
}

/** Canonical platform identity. */
export interface IntakeOrchestrationPlatformIdentity {
  readonly platformId: string;
  readonly platformName: string;
  readonly platformVersion: string;
  readonly platformNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-7:6";
  readonly stage: "Platform";
  readonly sourcePhase: "NEA-7:6";
  readonly owner: string;
  readonly status: IntakeOrchestrationPlatformStatus;
  readonly readiness: IntakeOrchestrationPlatformReadiness;
  readonly manifestId: string;
  readonly manifestVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic platform summary. */
export interface IntakeOrchestrationPlatformSummary {
  readonly platformId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-7:6";
  readonly status: IntakeOrchestrationPlatformStatus;
  readonly readiness: IntakeOrchestrationPlatformReadiness;
  readonly architectureVersion: string;
  readonly compositionMode: "CanonicalReferenceOnly";
  readonly runtimeBehavior: false;
  readonly manifestId: string;
  readonly composedPhaseCount: number;
  readonly namespaceSectionCount: number;
  readonly phaseReferenceCount: number;
  readonly inventoryEntryCount: number;
  readonly totalArchitectureCount: number;
  readonly ownershipCount: number;
  readonly nonOwnershipCount: number;
  readonly prohibitedSurfaceCount: number;
  readonly publicExportCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly architectureStatus: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
