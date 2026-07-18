/**
 * DKL-7:2 — Knowledge Services Registry Types.
 *
 * Readonly contracts for the canonical Knowledge Services Registry.
 * Declaration metadata only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-7:2.
 */

export type KnowledgeServicesRegistryCategory =
  | "service"
  | "capability"
  | "contract"
  | "lifecycle"
  | "ownership"
  | "boundary"
  | "requestCategory"
  | "responseCategory"
  | "accessMode"
  | "relationship";

export type KnowledgeServicesRegistryEntryStatus = "Registered";

export type KnowledgeServicesBoundaryClassification =
  | "runtime"
  | "persistence"
  | "repository"
  | "network"
  | "transport"
  | "security"
  | "reasoning"
  | "visualization"
  | "integration"
  | "infrastructure";

export type KnowledgeServicesProhibitedMutationMode =
  | "create"
  | "update"
  | "delete"
  | "execute"
  | "mutate"
  | "persist"
  | "approve"
  | "decide"
  | "plan"
  | "orchestrate";

export interface KnowledgeServicesRegistryIdentity {
  readonly registryId: "DKL-7:2/KnowledgeServicesRegistry";
  readonly registryName: "Knowledge Services Registry";
  readonly registryVersion: string;
  readonly registryNamespace: "nexora.dkl.knowledge-services.registry";
  readonly layer: "Data Knowledge Layer";
  readonly phase: "DKL-7";
  readonly stage: "Registry";
  readonly sourcePhase: "DKL-7:2";
  readonly owner: string;
  readonly status: "RegistryComplete";
  readonly readiness: "ReadyForModel";
  readonly foundationId: string;
  readonly foundationVersion: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeServicesRegistryMetadata {
  readonly metadataId: "DKL-7:2/KnowledgeServicesRegistryMetadata";
  readonly registryId: "DKL-7:2/KnowledgeServicesRegistry";
  readonly description: string;
  readonly categoryCount: number;
  readonly metadataOnly: true;
  readonly declarationOnly: true;
  readonly runtimeBehavior: false;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface KnowledgeServicesRegistryEntry {
  readonly id: string;
  readonly name: string;
  readonly category: KnowledgeServicesRegistryCategory;
  readonly description: string;
  readonly owner: "DKL-7";
  readonly status: KnowledgeServicesRegistryEntryStatus;
  readonly runtimeBehavior: "None";
  readonly metadataOnly: true;
  readonly deterministicOrder: number;
}

export interface KnowledgeServiceRegistration extends KnowledgeServicesRegistryEntry {
  readonly category: "service";
  readonly serviceKey: string;
  readonly capabilityId: string;
  readonly readOnly: true;
  readonly createsKnowledge: false;
  readonly modifiesKnowledge: false;
  readonly performsExecutiveReasoning: false;
  readonly hasHandler: false;
  readonly hasExecutor: false;
}

export interface KnowledgeServiceCapabilityRegistration
  extends KnowledgeServicesRegistryEntry {
  readonly category: "capability";
  readonly capabilityId: string;
  readonly foundationReference: string;
  readonly readOnly: true;
  readonly declaredOnly: true;
  readonly implemented: false;
  readonly lifecycleAvailability: "Declared";
  readonly supportedServiceIds: readonly string[];
}

export interface KnowledgeServiceContractRegistration
  extends KnowledgeServicesRegistryEntry {
  readonly category: "contract";
  readonly contractId: string;
  readonly foundationReference: string;
  readonly readOnly: true;
  readonly fieldCount: number;
}

export interface KnowledgeServiceLifecycleRegistration
  extends KnowledgeServicesRegistryEntry {
  readonly category: "lifecycle";
  readonly stage: string;
  readonly foundationReference: string;
  readonly orderIndex: number;
  readonly terminal: boolean;
}

export interface KnowledgeServiceOwnershipRegistration
  extends KnowledgeServicesRegistryEntry {
  readonly category: "ownership";
  readonly ownershipKind: "owns" | "doesNotOwn";
  readonly declaration: string;
  readonly foundationReference: string;
}

export interface KnowledgeServiceBoundaryRegistration
  extends KnowledgeServicesRegistryEntry {
  readonly category: "boundary";
  readonly surface: string;
  readonly classification: KnowledgeServicesBoundaryClassification;
  readonly foundationReference: string;
  readonly prohibited: true;
}

export interface KnowledgeServiceRequestCategoryRegistration
  extends KnowledgeServicesRegistryEntry {
  readonly category: "requestCategory";
  readonly requestCategoryKey: string;
  readonly relatedServiceId: string;
  readonly executable: false;
}

export interface KnowledgeServiceResponseCategoryRegistration
  extends KnowledgeServicesRegistryEntry {
  readonly category: "responseCategory";
  readonly responseCategoryKey: string;
  readonly relatedServiceId: string | null;
  readonly transportAware: false;
  readonly executable: false;
}

export interface KnowledgeServiceAccessModeRegistration
  extends KnowledgeServicesRegistryEntry {
  readonly category: "accessMode";
  readonly accessModeKey: string;
  readonly readOnly: true;
  readonly mutationAllowed: false;
}

export interface KnowledgeServiceCapabilityRelationship
  extends KnowledgeServicesRegistryEntry {
  readonly category: "relationship";
  readonly serviceId: string;
  readonly capabilityId: string;
  readonly foundationCapabilityReference: string;
  readonly routing: false;
  readonly dispatching: false;
}

export interface KnowledgeServicesRegistrySummary {
  readonly registryId: "DKL-7:2/KnowledgeServicesRegistry";
  readonly version: string;
  readonly status: "RegistryComplete";
  readonly foundationId: string;
  readonly foundationVersion: string;
  readonly serviceCount: number;
  readonly capabilityCount: number;
  readonly contractCount: number;
  readonly lifecycleCount: number;
  readonly ownedResponsibilityCount: number;
  readonly nonOwnedResponsibilityCount: number;
  readonly prohibitedSurfaceCount: number;
  readonly requestCategoryCount: number;
  readonly responseCategoryCount: number;
  readonly accessModeCount: number;
  readonly relationshipCount: number;
  readonly totalEntryCount: number;
  readonly readiness: "ReadyForModel";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface KnowledgeServicesRegistryInventory {
  readonly inventoryId: "DKL-7:2/KnowledgeServicesRegistryInventory";
  readonly categoryCounts: Readonly<{
    service: number;
    capability: number;
    contract: number;
    lifecycle: number;
    ownership: number;
    boundary: number;
    requestCategory: number;
    responseCategory: number;
    accessMode: number;
    relationship: number;
  }>;
  readonly totalEntryCount: number;
  readonly prohibitedMutationModes: readonly KnowledgeServicesProhibitedMutationMode[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
