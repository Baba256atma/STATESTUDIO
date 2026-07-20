/**
 * NEA-6:6 — Message Normalization Platform Types.
 *
 * Readonly contracts for the Message Normalization Platform composition surface.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-6:6.
 */

/** Platform status for NEA-6:6. */
export type MessageNormalizationPlatformStatus = "Platform";

/** Immediate downstream readiness — Certification only. */
export type MessageNormalizationPlatformReadiness = "ReadyForCertification";

/** Platform namespace section keys. */
export type MessageNormalizationPlatformNamespaceSection =
  | "foundation"
  | "registry"
  | "model"
  | "validation"
  | "manifest"
  | "platform";

/** Canonical phase composition entry by reference. */
export interface MessageNormalizationPlatformPhaseComposition {
  readonly section: MessageNormalizationPlatformNamespaceSection;
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
export interface MessageNormalizationPlatformIdentity {
  readonly platformId: string;
  readonly platformName: string;
  readonly platformVersion: string;
  readonly platformNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-6:6";
  readonly stage: "Platform";
  readonly sourcePhase: "NEA-6:6";
  readonly owner: string;
  readonly status: MessageNormalizationPlatformStatus;
  readonly readiness: MessageNormalizationPlatformReadiness;
  readonly manifestId: string;
  readonly manifestVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic platform summary. */
export interface MessageNormalizationPlatformSummary {
  readonly platformId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-6:6";
  readonly status: MessageNormalizationPlatformStatus;
  readonly readiness: MessageNormalizationPlatformReadiness;
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
