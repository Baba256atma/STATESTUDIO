/**
 * DKL-4:2 — Knowledge Modeling Registry Types.
 *
 * Readonly metadata contracts for the canonical Knowledge Modeling Registry.
 * Registry entries describe architecture definitions only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-4:2.
 */

export type RegistryLifecycleStatus = "Registered";
export type RegistryStabilityStatus = "Stable";
export type RegistryCompatibilityStatus =
  | "Compatible"
  | "ForwardCompatible"
  | "Restricted"
  | "Forbidden";
export type RegistryExtensionStatus = "Closed" | "AdditiveAllowed" | "MigrationRequired";
export type RegistryVisibility = "Public";

export type RegistryCategory =
  | "KnowledgeModelType"
  | "KnowledgeObjectType"
  | "BusinessObjectType"
  | "EntityType"
  | "RelationshipType"
  | "IdentityType"
  | "MetadataType"
  | "HierarchyType"
  | "CompositionType"
  | "ReferenceType"
  | "SemanticStructureType"
  | "LifecycleState"
  | "OwnershipDeclaration"
  | "BoundaryDeclaration"
  | "ExtensionPolicy"
  | "CompatibilityPolicy"
  | "DependencyDeclaration"
  | "PublicFoundationApi";

export type RelationshipDirection =
  | "SourceToTarget"
  | "TargetToSource"
  | "Bidirectional";

export type RelationshipCardinality =
  | "OneToOne"
  | "OneToMany"
  | "ManyToOne"
  | "ManyToMany";

export interface KnowledgeModelingRegistryIdentityDescriptor {
  readonly registryId: string;
  readonly registryVersion: string;
  readonly registryName: string;
  readonly registryNamespace: string;
  readonly owner: string;
  readonly sourcePhase: "DKL-4:2";
  readonly platformId: "DKL-4";
  readonly platformVersion: string;
  readonly status: "RegistryComplete";
  readonly readiness: "ReadyForModel";
}

export interface KnowledgeModelingRegistryEntry {
  readonly id: string;
  readonly name: string;
  readonly namespace: string;
  readonly description: string;
  readonly category: RegistryCategory;
  readonly owner: string;
  readonly sourcePhase: string;
  readonly lifecycleStatus: RegistryLifecycleStatus;
  readonly stabilityStatus: RegistryStabilityStatus;
  readonly compatibilityStatus: RegistryCompatibilityStatus;
  readonly extensionStatus: RegistryExtensionStatus;
  readonly publicVisibility: RegistryVisibility;
  readonly tags: readonly string[];
}

export interface BusinessObjectRegistryEntry extends KnowledgeModelingRegistryEntry {
  readonly category: "BusinessObjectType";
  readonly organizationalCategory: string;
  readonly behaviorImplemented: false;
  readonly runtimeInstanceCreated: false;
  readonly persistenceSchemaAssumed: false;
}

export interface RelationshipRegistryEntry extends KnowledgeModelingRegistryEntry {
  readonly category: "RelationshipType";
  readonly direction: RelationshipDirection;
  readonly relationshipCategory: string;
  readonly sourceCompatibility: readonly string[];
  readonly targetCompatibility: readonly string[];
  readonly cardinality: RelationshipCardinality;
  readonly graphBehaviorEnforced: false;
}

export interface KnowledgeModelingRegistryCollectionsDescriptor {
  readonly knowledgeModelTypes: readonly KnowledgeModelingRegistryEntry[];
  readonly knowledgeObjectTypes: readonly KnowledgeModelingRegistryEntry[];
  readonly businessObjectTypes: readonly BusinessObjectRegistryEntry[];
  readonly entityTypes: readonly KnowledgeModelingRegistryEntry[];
  readonly relationshipTypes: readonly RelationshipRegistryEntry[];
  readonly identityTypes: readonly KnowledgeModelingRegistryEntry[];
  readonly metadataTypes: readonly KnowledgeModelingRegistryEntry[];
  readonly hierarchyTypes: readonly KnowledgeModelingRegistryEntry[];
  readonly compositionTypes: readonly KnowledgeModelingRegistryEntry[];
  readonly referenceTypes: readonly KnowledgeModelingRegistryEntry[];
  readonly semanticStructureTypes: readonly KnowledgeModelingRegistryEntry[];
  readonly lifecycleStates: readonly KnowledgeModelingRegistryEntry[];
  readonly ownershipDeclarations: readonly KnowledgeModelingRegistryEntry[];
  readonly boundaryDeclarations: readonly KnowledgeModelingRegistryEntry[];
  readonly extensionPolicies: readonly KnowledgeModelingRegistryEntry[];
  readonly compatibilityPolicies: readonly KnowledgeModelingRegistryEntry[];
  readonly dependencyDeclarations: readonly KnowledgeModelingRegistryEntry[];
  readonly publicFoundationApis: readonly KnowledgeModelingRegistryEntry[];
}

export interface KnowledgeModelingRegistrySummaryDescriptor {
  readonly registryId: string;
  readonly registryVersion: string;
  readonly registryCategoryCount: 18;
  readonly totalEntryCount: number;
  readonly businessObjectTypeCount: number;
  readonly relationshipTypeCount: number;
  readonly lifecycleStateCount: number;
  readonly publicFoundationApiCount: number;
  readonly uniqueIdentifiersGuaranteed: true;
  readonly uniqueNamesWithinRegistryGuaranteed: true;
  readonly deterministicOrderingGuaranteed: true;
  readonly immutableEntriesGuaranteed: true;
  readonly registryCollectionsFrozen: true;
  readonly metadataOnly: true;
  readonly runtimeBehaviorForbidden: true;
  readonly mutableRegistrationForbidden: true;
  readonly dynamicPluginsForbidden: true;
  readonly reflectionForbidden: true;
  readonly autoDiscoveryForbidden: true;
  readonly status: "RegistryComplete";
  readonly readiness: "ReadyForModel";
}
