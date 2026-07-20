/**
 * NEA-8:1 — Executive Gateway Suite Foundation Types.
 *
 * Readonly contracts for the Executive Gateway Suite Foundation.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-8:1.
 */

/** Foundation status for NEA-8:1. */
export type ExecutiveGatewaySuiteFoundationStatus = "Foundation";

/** Immediate downstream readiness — Registry only. */
export type ExecutiveGatewaySuiteFoundationReadiness = "ReadyForRegistry";

/** Suite component identifiers — seven released NEA platforms. */
export type ExecutiveGatewaySuiteComponentId =
  | "NEA-1"
  | "NEA-2"
  | "NEA-3"
  | "NEA-4"
  | "NEA-5"
  | "NEA-6"
  | "NEA-7";

/** Architectural suite capability identifiers — exactly eight. */
export type ExecutiveGatewaySuiteCapabilityId =
  | "GatewaySuiteComposition"
  | "CanonicalReferenceAggregation"
  | "PublicPlatformAggregation"
  | "ExecutiveGatewayExposure"
  | "ConsumerPlatformComposition"
  | "InventoryAggregation"
  | "ArchitecturePublication"
  | "SuiteSummaryDeclaration";

/** Suite lifecycle / readiness states. */
export type ExecutiveGatewaySuiteLifecycleState =
  | "Foundation"
  | "ReadyForRegistry"
  | "ReadyForModel"
  | "ReadyForValidation"
  | "ReadyForManifest"
  | "ReadyForPlatform"
  | "ReadyForCertification"
  | "ReadyForFreeze"
  | "ReadyForPublicIndex";

/** Suite contract declaration. */
export interface ExecutiveGatewaySuiteContractDeclaration {
  readonly contractId: string;
  readonly contractName: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

/** Suite composition component — Public Index reference only. */
export interface ExecutiveGatewaySuiteCompositionComponent {
  readonly componentId: ExecutiveGatewaySuiteComponentId;
  readonly componentName: string;
  readonly stageId: string;
  readonly publicIndexId: string;
  readonly publicIndexVersion: string;
  readonly publicIndexName: string;
  readonly publicIndexNamespace: string;
  readonly publicIndexModule: string;
  readonly publicApiCount: number;
  readonly publicPlatform: unknown;
  readonly ownership: "Referenced";
  readonly reconstructsUpstream: false;
  readonly duplicatesArchitecture: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Architectural suite capability declaration. */
export interface ExecutiveGatewaySuiteCapabilityDeclaration {
  readonly capabilityId: ExecutiveGatewaySuiteCapabilityId;
  readonly capabilityName: string;
  readonly description: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical suite foundation identity. */
export interface ExecutiveGatewaySuiteFoundationIdentity {
  readonly foundationId: string;
  readonly foundationName: string;
  readonly foundationVersion: string;
  readonly foundationNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-8:1";
  readonly stage: "Foundation";
  readonly sourcePhase: "NEA-8:1";
  readonly owner: string;
  readonly status: ExecutiveGatewaySuiteFoundationStatus;
  readonly readiness: ExecutiveGatewaySuiteFoundationReadiness;
  readonly suiteName: "Executive Gateway Suite";
  readonly componentCount: 7;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic suite foundation summary. */
export interface ExecutiveGatewaySuiteFoundationSummary {
  readonly foundationId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-8:1";
  readonly status: ExecutiveGatewaySuiteFoundationStatus;
  readonly readiness: ExecutiveGatewaySuiteFoundationReadiness;
  readonly suiteName: "Executive Gateway Suite";
  readonly componentCount: number;
  readonly capabilityCount: number;
  readonly contractCount: number;
  readonly lifecycleStateCount: number;
  readonly ownershipCount: number;
  readonly nonOwnershipCount: number;
  readonly prohibitedSurfaceCount: number;
  readonly publicApiInventoryTotal: number;
  readonly publicExportCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
