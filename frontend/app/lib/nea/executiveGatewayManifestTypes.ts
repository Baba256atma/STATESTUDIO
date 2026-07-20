/**
 * NEA-1:5 — Executive Gateway Manifest Types.
 *
 * Readonly contracts for the Executive Gateway Manifest publication layer.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-1:5.
 */

/** Manifest status for NEA-1:5. */
export type ExecutiveGatewayManifestStatus = "Manifest";

/** Immediate downstream readiness — Platform only. */
export type ExecutiveGatewayManifestReadiness = "ReadyForPlatform";

/** Canonical phase reference entry. */
export interface ExecutiveGatewayManifestPhaseReference {
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
export interface ExecutiveGatewayManifestInventoryEntry {
  readonly inventoryKey: string;
  readonly label: string;
  readonly count: number;
  readonly sourcePhase: "NEA-1:1" | "NEA-1:2" | "NEA-1:3" | "NEA-1:4";
  readonly ownership: "Referenced";
  readonly hardcoded: false;
  readonly reconstructed: false;
  readonly deterministicOrder: number;
}

/** Canonical manifest identity. */
export interface ExecutiveGatewayManifestIdentity {
  readonly manifestId: string;
  readonly manifestName: string;
  readonly manifestVersion: string;
  readonly manifestNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-1:5";
  readonly stage: "Manifest";
  readonly sourcePhase: "NEA-1:5";
  readonly owner: string;
  readonly status: ExecutiveGatewayManifestStatus;
  readonly readiness: ExecutiveGatewayManifestReadiness;
  readonly validationId: string;
  readonly validationVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic manifest summary. */
export interface ExecutiveGatewayManifestSummary {
  readonly manifestId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-1:5";
  readonly status: ExecutiveGatewayManifestStatus;
  readonly readiness: ExecutiveGatewayManifestReadiness;
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
