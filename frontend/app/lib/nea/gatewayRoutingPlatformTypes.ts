/**
 * NEA-5:6 — Gateway Routing Platform Types.
 *
 * Readonly contracts for the Gateway Routing Platform composition surface.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-5:6.
 */

/** Platform status for NEA-5:6. */
export type GatewayRoutingPlatformStatus = "Platform";

/** Immediate downstream readiness — Certification only. */
export type GatewayRoutingPlatformReadiness = "ReadyForCertification";

/** Platform namespace section keys. */
export type GatewayRoutingPlatformNamespaceSection =
  | "foundation"
  | "registry"
  | "model"
  | "validation"
  | "manifest"
  | "platform";

/** Canonical phase composition entry by reference. */
export interface GatewayRoutingPlatformPhaseComposition {
  readonly section: GatewayRoutingPlatformNamespaceSection;
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
export interface GatewayRoutingPlatformIdentity {
  readonly platformId: string;
  readonly platformName: string;
  readonly platformVersion: string;
  readonly platformNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-5:6";
  readonly stage: "Platform";
  readonly sourcePhase: "NEA-5:6";
  readonly owner: string;
  readonly status: GatewayRoutingPlatformStatus;
  readonly readiness: GatewayRoutingPlatformReadiness;
  readonly manifestId: string;
  readonly manifestVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic platform summary. */
export interface GatewayRoutingPlatformSummary {
  readonly platformId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-5:6";
  readonly status: GatewayRoutingPlatformStatus;
  readonly readiness: GatewayRoutingPlatformReadiness;
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
