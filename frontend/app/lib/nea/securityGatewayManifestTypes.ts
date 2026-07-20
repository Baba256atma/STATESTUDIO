/**
 * NEA-4:5 — Security Gateway Manifest Types.
 *
 * Readonly contracts for the Security Gateway Manifest publication layer.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-4:5.
 */

/** Manifest status for NEA-4:5. */
export type SecurityGatewayManifestStatus = "Manifest";

/** Immediate downstream readiness — Platform only. */
export type SecurityGatewayManifestReadiness = "ReadyForPlatform";

/** Composition mode — canonical references only. */
export type SecurityGatewayManifestCompositionMode = "CanonicalReferenceOnly";

/** Canonical phase reference entry. */
export interface SecurityGatewayManifestPhaseReference {
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
export interface SecurityGatewayManifestInventoryEntry {
  readonly inventoryKey: string;
  readonly label: string;
  readonly count: number;
  readonly sourcePhase: "NEA-4:1" | "NEA-4:2" | "NEA-4:3" | "NEA-4:4";
  readonly ownership: "Referenced";
  readonly hardcoded: false;
  readonly reconstructed: false;
  readonly deterministicOrder: number;
}

/** Canonical manifest identity. */
export interface SecurityGatewayManifestIdentity {
  readonly manifestId: string;
  readonly manifestName: string;
  readonly manifestVersion: string;
  readonly manifestNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-4:5";
  readonly stage: "Manifest";
  readonly sourcePhase: "NEA-4:5";
  readonly owner: string;
  readonly status: SecurityGatewayManifestStatus;
  readonly readiness: SecurityGatewayManifestReadiness;
  readonly validationId: string;
  readonly validationVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic manifest summary. */
export interface SecurityGatewayManifestSummary {
  readonly manifestId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-4:5";
  readonly status: SecurityGatewayManifestStatus;
  readonly readiness: SecurityGatewayManifestReadiness;
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
