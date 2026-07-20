/**
 * NEA-8:6 — Executive Gateway Suite Platform Types.
 *
 * Readonly contracts for the Executive Gateway Suite Platform composition surface.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-8:6.
 */

/** Platform status for NEA-8:6. */
export type ExecutiveGatewaySuitePlatformStatus = "Platform";

/** Immediate downstream readiness — Certification only. */
export type ExecutiveGatewaySuitePlatformReadiness = "ReadyForCertification";

/** Platform namespace section keys. */
export type ExecutiveGatewaySuitePlatformNamespaceSection =
  | "foundation"
  | "registry"
  | "model"
  | "validation"
  | "manifest"
  | "platform";

/** Canonical phase composition entry by reference. */
export interface ExecutiveGatewaySuitePlatformPhaseComposition {
  readonly section: ExecutiveGatewaySuitePlatformNamespaceSection;
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
export interface ExecutiveGatewaySuitePlatformIdentity {
  readonly platformId: string;
  readonly platformName: string;
  readonly platformVersion: string;
  readonly platformNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-8:6";
  readonly stage: "Platform";
  readonly sourcePhase: "NEA-8:6";
  readonly owner: string;
  readonly status: ExecutiveGatewaySuitePlatformStatus;
  readonly readiness: ExecutiveGatewaySuitePlatformReadiness;
  readonly manifestId: string;
  readonly manifestVersion: string;
  readonly suiteName: "Executive Gateway Suite";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic platform summary. */
export interface ExecutiveGatewaySuitePlatformSummary {
  readonly platformId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-8:6";
  readonly status: ExecutiveGatewaySuitePlatformStatus;
  readonly readiness: ExecutiveGatewaySuitePlatformReadiness;
  readonly architectureVersion: string;
  readonly compositionMode: "CanonicalReferenceOnly";
  readonly canonicalReferenceMode: "ManifestOnly";
  readonly runtimeBehavior: false;
  readonly manifestId: string;
  readonly suiteName: "Executive Gateway Suite";
  readonly composedPhaseCount: number;
  readonly namespaceSectionCount: number;
  readonly suiteComponentCount: number;
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
  readonly architectureStatus: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
