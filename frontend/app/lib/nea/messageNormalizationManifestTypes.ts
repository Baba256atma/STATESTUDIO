/**
 * NEA-6:5 — Message Normalization Manifest Types.
 *
 * Readonly contracts for the Message Normalization Manifest publication layer.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-6:5.
 */

/** Manifest status for NEA-6:5. */
export type MessageNormalizationManifestStatus = "Manifest";

/** Immediate downstream readiness — Platform only. */
export type MessageNormalizationManifestReadiness = "ReadyForPlatform";

/** Composition mode — canonical references only. */
export type MessageNormalizationManifestCompositionMode =
  "CanonicalReferenceOnly";

/** Canonical phase reference entry. */
export interface MessageNormalizationManifestPhaseReference {
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
export interface MessageNormalizationManifestInventoryEntry {
  readonly inventoryKey: string;
  readonly label: string;
  readonly count: number;
  readonly sourcePhase: "NEA-6:1" | "NEA-6:2" | "NEA-6:3" | "NEA-6:4";
  readonly ownership: "Referenced";
  readonly hardcoded: false;
  readonly reconstructed: false;
  readonly deterministicOrder: number;
}

/** Canonical manifest identity. */
export interface MessageNormalizationManifestIdentity {
  readonly manifestId: string;
  readonly manifestName: string;
  readonly manifestVersion: string;
  readonly manifestNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-6:5";
  readonly stage: "Manifest";
  readonly sourcePhase: "NEA-6:5";
  readonly owner: string;
  readonly status: MessageNormalizationManifestStatus;
  readonly readiness: MessageNormalizationManifestReadiness;
  readonly validationId: string;
  readonly validationVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic manifest summary. */
export interface MessageNormalizationManifestSummary {
  readonly manifestId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-6:5";
  readonly status: MessageNormalizationManifestStatus;
  readonly readiness: MessageNormalizationManifestReadiness;
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
