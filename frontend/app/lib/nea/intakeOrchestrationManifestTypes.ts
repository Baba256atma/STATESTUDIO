/**
 * NEA-7:5 — Intake Orchestration Manifest Types.
 *
 * Readonly contracts for the Intake Orchestration Manifest publication layer.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-7:5.
 */

/** Manifest status for NEA-7:5. */
export type IntakeOrchestrationManifestStatus = "Manifest";

/** Immediate downstream readiness — Platform only. */
export type IntakeOrchestrationManifestReadiness = "ReadyForPlatform";

/** Composition mode — canonical references only. */
export type IntakeOrchestrationManifestCompositionMode =
  "CanonicalReferenceOnly";

/** Canonical phase reference entry. */
export interface IntakeOrchestrationManifestPhaseReference {
  readonly phaseId: string;
  readonly phaseName: string;
  readonly version: string;
  readonly namespace: string;
  readonly status: string;
  readonly module: string;
  readonly ownership: "Referenced";
  readonly reconstructsPhase: false;
  readonly duplicatesInventory: false;
  readonly deterministicOrder: number;
}

/** Derived inventory count entry. */
export interface IntakeOrchestrationManifestInventoryEntry {
  readonly inventoryKey: string;
  readonly label: string;
  readonly count: number;
  readonly sourcePhase: "NEA-7:1" | "NEA-7:2" | "NEA-7:3" | "NEA-7:4";
  readonly ownership: "Referenced";
  readonly hardcoded: false;
  readonly reconstructed: false;
  readonly deterministicOrder: number;
}

/** Canonical manifest identity. */
export interface IntakeOrchestrationManifestIdentity {
  readonly manifestId: string;
  readonly manifestName: string;
  readonly manifestVersion: string;
  readonly manifestNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-7:5";
  readonly stage: "Manifest";
  readonly sourcePhase: "NEA-7:5";
  readonly owner: string;
  readonly status: IntakeOrchestrationManifestStatus;
  readonly readiness: IntakeOrchestrationManifestReadiness;
  readonly validationId: string;
  readonly validationVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic manifest summary. */
export interface IntakeOrchestrationManifestSummary {
  readonly manifestId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-7:5";
  readonly status: IntakeOrchestrationManifestStatus;
  readonly readiness: IntakeOrchestrationManifestReadiness;
  readonly validationId: string;
  readonly phaseReferenceCount: number;
  readonly inventoryEntryCount: number;
  readonly totalArchitectureCount: number;
  readonly ownershipCount: number;
  readonly nonOwnershipCount: number;
  readonly prohibitedSurfaceCount: number;
  readonly publicExportCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
