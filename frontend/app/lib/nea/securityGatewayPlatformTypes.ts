/**
 * NEA-4:6 — Security Gateway Platform Types.
 *
 * Readonly contracts for the Security Gateway Platform composition surface.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-4:6.
 */

/** Platform status for NEA-4:6. */
export type SecurityGatewayPlatformStatus = "Platform";

/** Immediate downstream readiness — Certification only. */
export type SecurityGatewayPlatformReadiness = "ReadyForCertification";

/** Platform namespace section keys. */
export type SecurityGatewayPlatformNamespaceSection =
  | "foundation"
  | "registry"
  | "model"
  | "validation"
  | "manifest"
  | "platform";

/** Canonical phase composition entry by reference. */
export interface SecurityGatewayPlatformPhaseComposition {
  readonly section: SecurityGatewayPlatformNamespaceSection;
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
export interface SecurityGatewayPlatformIdentity {
  readonly platformId: string;
  readonly platformName: string;
  readonly platformVersion: string;
  readonly platformNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-4:6";
  readonly stage: "Platform";
  readonly sourcePhase: "NEA-4:6";
  readonly owner: string;
  readonly status: SecurityGatewayPlatformStatus;
  readonly readiness: SecurityGatewayPlatformReadiness;
  readonly manifestId: string;
  readonly manifestVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic platform summary. */
export interface SecurityGatewayPlatformSummary {
  readonly platformId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-4:6";
  readonly status: SecurityGatewayPlatformStatus;
  readonly readiness: SecurityGatewayPlatformReadiness;
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
