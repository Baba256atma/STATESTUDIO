/**
 * NEA-8:5 — Executive Gateway Suite Manifest Types.
 *
 * Readonly contracts for the Executive Gateway Suite Manifest publication layer.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-8:5.
 */

/** Manifest status for NEA-8:5. */
export type ExecutiveGatewaySuiteManifestStatus = "Manifest";

/** Immediate downstream readiness — Platform only. */
export type ExecutiveGatewaySuiteManifestReadiness = "ReadyForPlatform";

/** Composition mode — canonical references only. */
export type ExecutiveGatewaySuiteManifestCompositionMode =
  "CanonicalReferenceOnly";

/** Canonical phase reference entry. */
export interface ExecutiveGatewaySuiteManifestPhaseReference {
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
export interface ExecutiveGatewaySuiteManifestInventoryEntry {
  readonly inventoryKey: string;
  readonly label: string;
  readonly count: number;
  readonly sourcePhase: "NEA-8:1" | "NEA-8:2" | "NEA-8:3" | "NEA-8:4";
  readonly ownership: "Referenced";
  readonly hardcoded: false;
  readonly reconstructed: false;
  readonly deterministicOrder: number;
}

/** Canonical manifest identity. */
export interface ExecutiveGatewaySuiteManifestIdentity {
  readonly manifestId: string;
  readonly manifestName: string;
  readonly manifestVersion: string;
  readonly manifestNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-8:5";
  readonly stage: "Manifest";
  readonly sourcePhase: "NEA-8:5";
  readonly owner: string;
  readonly status: ExecutiveGatewaySuiteManifestStatus;
  readonly readiness: ExecutiveGatewaySuiteManifestReadiness;
  readonly validationId: string;
  readonly validationVersion: string;
  readonly suiteName: "Executive Gateway Suite";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic manifest summary. */
export interface ExecutiveGatewaySuiteManifestSummary {
  readonly manifestId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-8:5";
  readonly status: ExecutiveGatewaySuiteManifestStatus;
  readonly readiness: ExecutiveGatewaySuiteManifestReadiness;
  readonly validationId: string;
  readonly suiteName: "Executive Gateway Suite";
  readonly phaseReferenceCount: number;
  readonly inventoryEntryCount: number;
  readonly totalArchitectureCount: number;
  readonly publicApiInventoryTotal: number;
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
