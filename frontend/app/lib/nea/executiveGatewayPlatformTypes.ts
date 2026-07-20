/**
 * NEA-1:6 — Executive Gateway Platform Types.
 *
 * Readonly contracts for the Executive Gateway Platform composition surface.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-1:6.
 */

/** Platform status for NEA-1:6. */
export type ExecutiveGatewayPlatformStatus = "Platform";

/** Immediate downstream readiness — Certification only. */
export type ExecutiveGatewayPlatformReadiness = "ReadyForCertification";

/** Platform namespace section keys. */
export type ExecutiveGatewayPlatformNamespaceSection =
  | "foundation"
  | "registry"
  | "model"
  | "validation"
  | "manifest"
  | "platform";

/** Canonical phase composition entry by reference. */
export interface ExecutiveGatewayPlatformPhaseComposition {
  readonly section: ExecutiveGatewayPlatformNamespaceSection;
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
export interface ExecutiveGatewayPlatformIdentity {
  readonly platformId: string;
  readonly platformName: string;
  readonly platformVersion: string;
  readonly platformNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-1:6";
  readonly stage: "Platform";
  readonly sourcePhase: "NEA-1:6";
  readonly owner: string;
  readonly status: ExecutiveGatewayPlatformStatus;
  readonly readiness: ExecutiveGatewayPlatformReadiness;
  readonly manifestId: string;
  readonly manifestVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic platform summary. */
export interface ExecutiveGatewayPlatformSummary {
  readonly platformId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-1:6";
  readonly status: ExecutiveGatewayPlatformStatus;
  readonly readiness: ExecutiveGatewayPlatformReadiness;
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
