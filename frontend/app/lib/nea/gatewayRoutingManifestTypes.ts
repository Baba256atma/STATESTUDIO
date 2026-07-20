/**
 * NEA-5:5 — Gateway Routing Manifest Types.
 *
 * Readonly contracts for the Gateway Routing Manifest publication layer.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-5:5.
 */

/** Manifest status for NEA-5:5. */
export type GatewayRoutingManifestStatus = "Manifest";

/** Immediate downstream readiness — Platform only. */
export type GatewayRoutingManifestReadiness = "ReadyForPlatform";

/** Composition mode — canonical references only. */
export type GatewayRoutingManifestCompositionMode = "CanonicalReferenceOnly";

/** Canonical phase reference entry. */
export interface GatewayRoutingManifestPhaseReference {
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
export interface GatewayRoutingManifestInventoryEntry {
  readonly inventoryKey: string;
  readonly label: string;
  readonly count: number;
  readonly sourcePhase: "NEA-5:1" | "NEA-5:2" | "NEA-5:3" | "NEA-5:4";
  readonly ownership: "Referenced";
  readonly hardcoded: false;
  readonly reconstructed: false;
  readonly deterministicOrder: number;
}

/** Canonical manifest identity. */
export interface GatewayRoutingManifestIdentity {
  readonly manifestId: string;
  readonly manifestName: string;
  readonly manifestVersion: string;
  readonly manifestNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-5:5";
  readonly stage: "Manifest";
  readonly sourcePhase: "NEA-5:5";
  readonly owner: string;
  readonly status: GatewayRoutingManifestStatus;
  readonly readiness: GatewayRoutingManifestReadiness;
  readonly validationId: string;
  readonly validationVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic manifest summary. */
export interface GatewayRoutingManifestSummary {
  readonly manifestId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-5:5";
  readonly status: GatewayRoutingManifestStatus;
  readonly readiness: GatewayRoutingManifestReadiness;
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
