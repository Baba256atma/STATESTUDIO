/**
 * DKL-9:2 — Data Knowledge Suite Registry Types.
 *
 * Readonly contracts for Suite-level registry metadata.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by DKL-9:2.
 */

export type DataKnowledgeSuiteRegistryStatus = "RegistryDefined";

export type DataKnowledgeSuiteRegistryReadiness = "ReadyForModel";

export type DataKnowledgeSuiteCapabilityId =
  | "DKL-1"
  | "DKL-2"
  | "DKL-3"
  | "DKL-4"
  | "DKL-5"
  | "DKL-6"
  | "DKL-7"
  | "DKL-8";

export interface DataKnowledgeSuiteRegistryEntryBase {
  readonly id: string;
  readonly name: string;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeBehavior: "None";
}

export interface DataKnowledgeSuiteCapabilityRegistration
  extends DataKnowledgeSuiteRegistryEntryBase {
  readonly capabilityId: DataKnowledgeSuiteCapabilityId;
  readonly capabilityName: string;
  readonly stageId: string;
  readonly publicIndexId: string;
  readonly publicIndexVersion: string;
  readonly publicIndexName: string;
  readonly publicIndexNamespace: string;
  readonly publicApiCount: number;
  readonly publicPlatform: unknown;
  readonly capabilityReference: unknown;
  readonly registrationStatus: "Registered";
  readonly integrationMode: "PublicIndexOnly";
  readonly introducesNewKnowledgeCapability: false;
  readonly reconstructsUpstream: false;
}

export interface DataKnowledgeSuiteCapabilityReferenceRegistration
  extends DataKnowledgeSuiteRegistryEntryBase {
  readonly capabilityId: DataKnowledgeSuiteCapabilityId;
  readonly capabilityReference: unknown;
  readonly preservesCanonicalReference: true;
}

export interface DataKnowledgeSuitePublicPlatformRegistration
  extends DataKnowledgeSuiteRegistryEntryBase {
  readonly capabilityId: DataKnowledgeSuiteCapabilityId;
  readonly publicPlatform: unknown;
  readonly preservesCanonicalReference: true;
}

export interface DataKnowledgeSuitePublicApiRegistryRegistration
  extends DataKnowledgeSuiteRegistryEntryBase {
  readonly capabilityId: DataKnowledgeSuiteCapabilityId;
  readonly publicPlatform: unknown;
  readonly publicApiCount: number;
  readonly registryAccess: "ThroughPublicPlatformOnly";
  readonly reconstructsUpstreamRegistry: false;
  readonly duplicatesUpstreamRegistry: false;
  readonly preservesCanonicalReference: true;
}

export interface DataKnowledgeSuitePublicApiCountRegistration
  extends DataKnowledgeSuiteRegistryEntryBase {
  readonly capabilityId: DataKnowledgeSuiteCapabilityId;
  readonly publicApiCount: number;
  readonly sourcedThroughFoundation: true;
  readonly hardcoded: false;
}

export interface DataKnowledgeSuiteVersionRegistration
  extends DataKnowledgeSuiteRegistryEntryBase {
  readonly capabilityId: DataKnowledgeSuiteCapabilityId;
  readonly publicIndexVersion: string;
}

export interface DataKnowledgeSuiteStatusRegistration
  extends DataKnowledgeSuiteRegistryEntryBase {
  readonly capabilityId: DataKnowledgeSuiteCapabilityId;
  readonly capabilityStatus: "ComposedInSuite";
  readonly suiteFoundationStatus: string;
}

export interface DataKnowledgeSuiteReadinessRegistration
  extends DataKnowledgeSuiteRegistryEntryBase {
  readonly capabilityId: DataKnowledgeSuiteCapabilityId;
  readonly capabilityReadiness: "AvailableThroughPublicIndex";
  readonly suiteFoundationReadiness: string;
}

export interface DataKnowledgeSuiteDependencyRegistration
  extends DataKnowledgeSuiteRegistryEntryBase {
  readonly capabilityId: DataKnowledgeSuiteCapabilityId;
  readonly publicIndexModule: string;
  readonly dependsOnPriorSuiteCapability: boolean;
  readonly priorCapabilityId: DataKnowledgeSuiteCapabilityId | null;
  readonly integrationMode: "PublicIndexOnly";
  readonly preservesCanonicalReferences: true;
}

export interface DataKnowledgeSuiteCompatibilityRegistration
  extends DataKnowledgeSuiteRegistryEntryBase {
  readonly capabilityId: DataKnowledgeSuiteCapabilityId;
  readonly compatibilityStatus: "CompatibleWithinSuite";
  readonly suiteCompositionCompatible: true;
  readonly reconstructsCapability: false;
}

export interface DataKnowledgeSuiteGuarantee {
  readonly guaranteeId: string;
  readonly statement: string;
  readonly status: "Guaranteed";
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

export interface DataKnowledgeSuiteRegistrySummary {
  readonly registryId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly status: DataKnowledgeSuiteRegistryStatus;
  readonly readiness: DataKnowledgeSuiteRegistryReadiness;
  readonly foundationId: string;
  readonly capabilityCount: number;
  readonly capabilityReferenceCount: number;
  readonly publicPlatformCount: number;
  readonly publicApiRegistryRefCount: number;
  readonly publicApiCountEntryCount: number;
  readonly versionCount: number;
  readonly statusCount: number;
  readonly readinessCount: number;
  readonly dependencyCount: number;
  readonly ownershipEntryCount: number;
  readonly boundaryEntryCount: number;
  readonly compatibilityCount: number;
  readonly lifecycleStateCount: number;
  readonly contractCount: number;
  readonly integrationContractCount: number;
  readonly publicApiInventoryTotal: number;
  readonly totalEntryCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
