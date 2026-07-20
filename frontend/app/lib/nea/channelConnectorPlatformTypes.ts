/**
 * NEA-2:6 — Channel Connectors Platform Types.
 *
 * Readonly contracts for the Channel Connectors Platform composition surface.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-2:6.
 */

/** Platform status for NEA-2:6. */
export type ChannelConnectorPlatformStatus = "Platform";

/** Immediate downstream readiness — Certification only. */
export type ChannelConnectorPlatformReadiness = "ReadyForCertification";

/** Platform namespace section keys. */
export type ChannelConnectorPlatformNamespaceSection =
  | "foundation"
  | "registry"
  | "model"
  | "validation"
  | "manifest"
  | "platform";

/** Canonical phase composition entry by reference. */
export interface ChannelConnectorPlatformPhaseComposition {
  readonly section: ChannelConnectorPlatformNamespaceSection;
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
export interface ChannelConnectorPlatformIdentity {
  readonly platformId: string;
  readonly platformName: string;
  readonly platformVersion: string;
  readonly platformNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-2:6";
  readonly stage: "Platform";
  readonly sourcePhase: "NEA-2:6";
  readonly owner: string;
  readonly status: ChannelConnectorPlatformStatus;
  readonly readiness: ChannelConnectorPlatformReadiness;
  readonly manifestId: string;
  readonly manifestVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic platform summary. */
export interface ChannelConnectorPlatformSummary {
  readonly platformId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-2:6";
  readonly status: ChannelConnectorPlatformStatus;
  readonly readiness: ChannelConnectorPlatformReadiness;
  readonly manifestId: string;
  readonly composedPhaseCount: number;
  readonly namespaceSectionCount: number;
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
