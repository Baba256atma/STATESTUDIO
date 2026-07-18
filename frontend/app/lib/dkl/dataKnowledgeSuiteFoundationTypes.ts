/**
 * DKL-9:1 — Data Knowledge Suite Foundation Types.
 *
 * Readonly contracts and closed vocabularies for the Data Knowledge Suite.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by DKL-9:1.
 */

export type DataKnowledgeSuiteFoundationStatus = "FoundationDefined";

export type DataKnowledgeSuiteFoundationReadiness = "ReadyForRegistry";

export type DataKnowledgeSuiteCapabilityId =
  | "DKL-1"
  | "DKL-2"
  | "DKL-3"
  | "DKL-4"
  | "DKL-5"
  | "DKL-6"
  | "DKL-7"
  | "DKL-8";

export type DataKnowledgeSuiteLifecycleState =
  | "Declared"
  | "Composed"
  | "Catalogued"
  | "Boundaried"
  | "Contracted"
  | "ReadyForRegistry"
  | "Registered"
  | "Modeled"
  | "Validated"
  | "Manifested"
  | "Platformed"
  | "Certified"
  | "Frozen"
  | "Released";

export interface DataKnowledgeSuiteContractDeclaration {
  readonly contractId: string;
  readonly contractName: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

export interface DataKnowledgeSuiteIntegrationContract {
  readonly integrationContractId: string;
  readonly capabilityId: DataKnowledgeSuiteCapabilityId;
  readonly publicIndexModule: string;
  readonly integrationMode: "PublicIndexOnly";
  readonly preservesCanonicalReferences: true;
  readonly reconstructsCapability: false;
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

export interface DataKnowledgeSuiteCapabilityDescriptor {
  readonly capabilityId: DataKnowledgeSuiteCapabilityId;
  readonly capabilityName: string;
  readonly stageId: string;
  readonly publicIndexId: string;
  readonly publicIndexVersion: string;
  readonly publicIndexName: string;
  readonly publicIndexNamespace: string;
  readonly publicApiCount: number;
  readonly publicPlatform: unknown;
  readonly integrationMode: "PublicIndexOnly";
  readonly introducesNewKnowledgeCapability: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

export interface DataKnowledgeSuiteIdentity {
  readonly foundationId: string;
  readonly foundationName: string;
  readonly foundationVersion: string;
  readonly foundationNamespace: string;
  readonly layer: "Data Knowledge Layer";
  readonly phase: "DKL-9";
  readonly stage: "Foundation";
  readonly sourcePhase: "DKL-9:1";
  readonly owner: string;
  readonly status: DataKnowledgeSuiteFoundationStatus;
  readonly readiness: DataKnowledgeSuiteFoundationReadiness;
  readonly suiteName: "Data Knowledge Suite";
  readonly capabilityCount: 8;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DataKnowledgeSuiteFoundationSummary {
  readonly foundationId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly status: DataKnowledgeSuiteFoundationStatus;
  readonly readiness: DataKnowledgeSuiteFoundationReadiness;
  readonly capabilityCount: number;
  readonly contractCount: number;
  readonly integrationContractCount: number;
  readonly ownershipCount: number;
  readonly nonOwnershipCount: number;
  readonly lifecycleStateCount: number;
  readonly prohibitedSurfaceCount: number;
  readonly publicApiInventoryTotal: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
