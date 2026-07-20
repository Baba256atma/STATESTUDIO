/**
 * EIL-1:1 — Executive Integration Foundation Types.
 *
 * Readonly contracts and closed vocabularies for the Executive Integration Layer.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-1:1.
 */

export type ExecutiveIntegrationFoundationStatus = "Foundation";

export type ExecutiveIntegrationFoundationReadiness = "ReadyForRegistry";

export type ExecutiveIntegrationLifecycleState =
  | "Declared"
  | "Identified"
  | "Contracted"
  | "Owned"
  | "Boundaried"
  | "Responsibilized"
  | "ReadyForRegistry"
  | "Registered"
  | "Modeled"
  | "Validated"
  | "Manifested"
  | "Platformed"
  | "Certified"
  | "Frozen"
  | "Released";

export type ExecutiveIntegrationPlatformId =
  | "BUS"
  | "OPS"
  | "ENG"
  | "DKL";

export type ExecutiveIntegrationResponsibilityId =
  | "PlatformCoordination"
  | "CrossPlatformRouting"
  | "IntegrationContracts"
  | "ServiceDiscovery"
  | "PlatformInteroperability"
  | "WorkflowCoordination"
  | "DependencyOrchestration"
  | "EventCoordination";

export type ExecutiveIntegrationExtensionPolicy =
  | "AdditivePublicIndexOnly"
  | "NoInternalPhaseImport"
  | "NoRuntimeIntroduction"
  | "NoBusinessReasoning";

export type ExecutiveIntegrationDependencyRule =
  | "PublicIndexOnly"
  | "CertifiedPlatformsOnly"
  | "NoInternalPhaseImport"
  | "NoReconstruction"
  | "NoCircularPlatformOwnership";

/** Canonical identity for an integrated Nexora platform surface. */
export interface ExecutiveIntegrationPlatform {
  readonly platformId: ExecutiveIntegrationPlatformId;
  readonly platformName: string;
  readonly publicIndexId: string;
  readonly publicIndexVersion: string;
  readonly publicIndexName: string;
  readonly publicIndexNamespace: string;
  readonly publicIndexModule: string;
  readonly certificationRequired: true;
  readonly integrationMode: "PublicIndexOnly";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Declarative node in the executive integration topology. */
export interface IntegrationNode {
  readonly nodeId: string;
  readonly platformId: ExecutiveIntegrationPlatformId;
  readonly publicIndexId: string;
  readonly role: "Producer" | "Consumer" | "Coordinator";
  readonly discoversServices: false;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Declarative route between integration nodes. */
export interface IntegrationRoute {
  readonly routeId: string;
  readonly sourceNodeId: string;
  readonly targetNodeId: string;
  readonly coordinationKind:
    | "PlatformCoordination"
    | "CrossPlatformRouting"
    | "WorkflowCoordination"
    | "DependencyOrchestration"
    | "EventCoordination";
  readonly transportImplemented: false;
  readonly runtimeBehavior: "None";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Declarative integration request contract shape. */
export interface IntegrationRequest {
  readonly requestContractId: string;
  readonly sourcePlatformId: ExecutiveIntegrationPlatformId;
  readonly targetPlatformId: ExecutiveIntegrationPlatformId;
  readonly capabilityRef: string;
  readonly correlationRef: string;
  readonly payloadUnderstanding: false;
  readonly runtimeDispatch: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Declarative integration response contract shape. */
export interface IntegrationResponse {
  readonly responseContractId: string;
  readonly requestContractId: string;
  readonly statusRef: string;
  readonly capabilityRef: string;
  readonly businessReasoning: false;
  readonly runtimeExecution: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Declarative integration capability surface. */
export interface IntegrationCapability {
  readonly capabilityId: string;
  readonly capabilityName: string;
  readonly responsibilityId: ExecutiveIntegrationResponsibilityId;
  readonly ownedByEil: true;
  readonly performsInference: false;
  readonly performsDecision: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical integration identity fields. */
export interface IntegrationIdentity {
  readonly foundationId: string;
  readonly foundationName: string;
  readonly foundationVersion: string;
  readonly foundationNamespace: string;
  readonly layer: "Executive Integration Layer";
  readonly phase: "EIL-1";
  readonly stage: "Foundation";
  readonly sourcePhase: "EIL-1:1";
  readonly owner: string;
  readonly status: ExecutiveIntegrationFoundationStatus;
  readonly readiness: ExecutiveIntegrationFoundationReadiness;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Canonical integration metadata envelope. */
export interface IntegrationMetadata {
  readonly metadataId: string;
  readonly foundationId: string;
  readonly namespace: string;
  readonly version: string;
  readonly status: ExecutiveIntegrationFoundationStatus;
  readonly readiness: ExecutiveIntegrationFoundationReadiness;
  readonly platformCount: number;
  readonly contractCount: number;
  readonly responsibilityCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ExecutiveIntegrationContractDeclaration {
  readonly contractId: string;
  readonly contractName: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

export interface ExecutiveIntegrationFoundationSummary {
  readonly foundationId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly status: ExecutiveIntegrationFoundationStatus;
  readonly readiness: ExecutiveIntegrationFoundationReadiness;
  readonly platformCount: number;
  readonly contractCount: number;
  readonly ownershipCount: number;
  readonly nonOwnershipCount: number;
  readonly responsibilityCount: number;
  readonly lifecycleStateCount: number;
  readonly prohibitedSurfaceCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
