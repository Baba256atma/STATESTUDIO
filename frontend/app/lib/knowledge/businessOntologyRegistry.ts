/**
 * KNL-2 — Business Ontology metadata registry.
 */

import {
  BUSINESS_ENTITY_TYPE_KEYS,
  BUSINESS_ONTOLOGY_CAPABILITY_KEYS,
  BUSINESS_ONTOLOGY_CATEGORY_KEYS,
  BUSINESS_ONTOLOGY_CONTRACT_VERSION,
  BUSINESS_ONTOLOGY_DEFAULT_LIMITS,
  BUSINESS_ONTOLOGY_ID,
  BUSINESS_ONTOLOGY_NAMESPACE,
  BUSINESS_ONTOLOGY_OWNER,
  BUSINESS_RELATIONSHIP_TYPE_KEYS,
} from "./businessOntologyCatalog.ts";
import type {
  BusinessCapability,
  BusinessCapabilityRegistrationInput,
  BusinessCategoryRegistrationInput,
  BusinessEntity,
  BusinessEntityRegistrationInput,
  BusinessMetadata,
  BusinessMetadataRegistrationInput,
  BusinessOntologyCategory,
  BusinessOntologyResult,
  BusinessOntologySnapshot,
  BusinessOntologyState,
  BusinessRelationship,
  BusinessRelationshipRegistrationInput,
} from "./businessOntologyTypes.ts";
import {
  validateBusinessCapabilityRegistration,
  validateBusinessCategoryRegistration,
  validateBusinessEntityRegistration,
  validateBusinessMetadataRegistration,
  validateBusinessRelationshipRegistration,
} from "./businessOntologyValidation.ts";
import { buildKnowledgeFoundation } from "./knowledgeFoundation.ts";

export const BUSINESS_ONTOLOGY_REGISTRY_VERSION = "KNL/2-REGISTRY-1" as const;

const entityRegistry = new Map<string, BusinessEntity>();
const relationshipRegistry = new Map<string, BusinessRelationship>();
const capabilityRegistry = new Map<string, BusinessCapability>();
const categoryRegistry = new Map<string, BusinessOntologyCategory>();
const metadataRegistry = new Map<string, BusinessMetadata>();

let ontologyInitialized = false;
let lastInitializedAt: string | null = null;

function createResult<T>(success: boolean, reason: string, data: T | null): BusinessOntologyResult<T> {
  return Object.freeze({ success, reason, data, readOnly: true as const });
}

function createMetadata(metadataId: string, timestamp: string, extensions: Readonly<Record<string, string>> = {}) {
  return Object.freeze({
    metadataId,
    metadataVersion: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    namespace: BUSINESS_ONTOLOGY_NAMESPACE,
    owner: BUSINESS_ONTOLOGY_OWNER,
    extensions: Object.freeze({ ...extensions }),
    createdAt: timestamp,
    readOnly: true as const,
  });
}

export function resetBusinessOntologyRegistryForTests(): void {
  entityRegistry.clear();
  relationshipRegistry.clear();
  capabilityRegistry.clear();
  categoryRegistry.clear();
  metadataRegistry.clear();
  ontologyInitialized = false;
  lastInitializedAt = null;
}

export function isBusinessOntologyInitialized(): boolean {
  return ontologyInitialized;
}

export function getBusinessOntologyState(timestamp: string = new Date(0).toISOString()): BusinessOntologyState {
  const snapshot = getBusinessOntologySnapshot();
  return Object.freeze({
    ontologyId: BUSINESS_ONTOLOGY_ID,
    contractVersion: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    foundationDependency: "KNL/1",
    initialized: ontologyInitialized,
    entityCount: snapshot.entityCount,
    relationshipCount: snapshot.relationshipCount,
    capabilityCount: snapshot.capabilityCount,
    supportedEntityTypes: BUSINESS_ENTITY_TYPE_KEYS,
    supportedRelationshipTypes: BUSINESS_RELATIONSHIP_TYPE_KEYS,
    timestamp: lastInitializedAt ?? timestamp,
    readOnly: true as const,
  });
}

export function initializeBusinessOntology(
  timestamp: string = new Date(0).toISOString()
): BusinessOntologyResult<BusinessOntologyState> {
  const foundation = buildKnowledgeFoundation(timestamp);
  if (!foundation.success) {
    return createResult(false, "KNL/1 Knowledge Foundation initialization failed.", null);
  }
  seedDefaultBusinessOntologyCatalog(timestamp);
  ontologyInitialized = true;
  lastInitializedAt = timestamp;
  return createResult(true, "Business ontology initialized.", getBusinessOntologyState(timestamp));
}

export function registerBusinessEntity(
  input: BusinessEntityRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): BusinessOntologyResult<BusinessEntity> {
  const validation = validateBusinessEntityRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (entityRegistry.has(input.entityId)) {
    return createResult(false, `Business entity already registered: ${input.entityId}.`, null);
  }
  const duplicateName = [...entityRegistry.values()].some(
    (entry) => entry.name.trim().toLowerCase() === input.name.trim().toLowerCase()
  );
  if (duplicateName) {
    return createResult(false, `Business entity name already registered: ${input.name}.`, null);
  }
  if (entityRegistry.size >= BUSINESS_ONTOLOGY_DEFAULT_LIMITS.maxRegisteredEntities) {
    return createResult(false, "Business entity registry limit reached.", null);
  }
  const entry = Object.freeze({
    entityId: input.entityId,
    entityType: input.entityType,
    name: input.name.trim(),
    label: input.label.trim(),
    description: input.description.trim(),
    categoryKey: input.categoryKey,
    version: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-entity-${input.entityId}`, timestamp),
    readOnly: true as const,
  });
  entityRegistry.set(entry.entityId, entry);
  return createResult(true, "Business entity registered.", entry);
}

export function registerBusinessRelationship(
  input: BusinessRelationshipRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): BusinessOntologyResult<BusinessRelationship> {
  const validation = validateBusinessRelationshipRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (relationshipRegistry.has(input.relationshipId)) {
    return createResult(false, `Business relationship already registered: ${input.relationshipId}.`, null);
  }
  if (relationshipRegistry.size >= BUSINESS_ONTOLOGY_DEFAULT_LIMITS.maxRegisteredRelationships) {
    return createResult(false, "Business relationship registry limit reached.", null);
  }
  const entry = Object.freeze({
    relationshipId: input.relationshipId,
    relationshipType: input.relationshipType,
    sourceEntityId: input.sourceEntityId,
    targetEntityId: input.targetEntityId,
    label: input.label.trim(),
    description: input.description.trim(),
    version: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-relationship-${input.relationshipId}`, timestamp),
    readOnly: true as const,
  });
  relationshipRegistry.set(entry.relationshipId, entry);
  return createResult(true, "Business relationship registered.", entry);
}

export function registerBusinessCapability(
  input: BusinessCapabilityRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): BusinessOntologyResult<BusinessCapability> {
  const validation = validateBusinessCapabilityRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (capabilityRegistry.has(input.capabilityId)) {
    return createResult(false, `Business capability already registered: ${input.capabilityId}.`, null);
  }
  if (capabilityRegistry.size >= BUSINESS_ONTOLOGY_DEFAULT_LIMITS.maxRegisteredCapabilities) {
    return createResult(false, "Business capability registry limit reached.", null);
  }
  const entry = Object.freeze({
    capabilityId: input.capabilityId,
    capabilityKey: input.capabilityKey,
    label: input.label.trim(),
    description: input.description.trim(),
    version: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-capability-${input.capabilityId}`, timestamp),
    readOnly: true as const,
  });
  capabilityRegistry.set(entry.capabilityId, entry);
  return createResult(true, "Business capability registered.", entry);
}

export function registerBusinessCategory(
  input: BusinessCategoryRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): BusinessOntologyResult<BusinessOntologyCategory> {
  const validation = validateBusinessCategoryRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (categoryRegistry.has(input.categoryId)) {
    return createResult(false, `Business category already registered: ${input.categoryId}.`, null);
  }
  if (categoryRegistry.size >= BUSINESS_ONTOLOGY_DEFAULT_LIMITS.maxRegisteredCategories) {
    return createResult(false, "Business category registry limit reached.", null);
  }
  const entry = Object.freeze({
    categoryId: input.categoryId,
    categoryKey: input.categoryKey,
    label: input.label.trim(),
    description: input.description.trim(),
    version: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    metadata: createMetadata(`metadata-category-${input.categoryId}`, timestamp),
    readOnly: true as const,
  });
  categoryRegistry.set(entry.categoryId, entry);
  return createResult(true, "Business category registered.", entry);
}

export function registerBusinessMetadata(
  input: BusinessMetadataRegistrationInput,
  timestamp: string = new Date(0).toISOString()
): BusinessOntologyResult<BusinessMetadata> {
  const validation = validateBusinessMetadataRegistration(input);
  if (!validation.valid) {
    return createResult(false, validation.issues.map((entry) => entry.message).join("; "), null);
  }
  if (metadataRegistry.has(input.metadataId)) {
    return createResult(false, `Business metadata already registered: ${input.metadataId}.`, null);
  }
  if (metadataRegistry.size >= BUSINESS_ONTOLOGY_DEFAULT_LIMITS.maxRegisteredMetadata) {
    return createResult(false, "Business metadata registry limit reached.", null);
  }
  const entry = createMetadata(input.metadataId, timestamp, input.extensions ?? {});
  metadataRegistry.set(entry.metadataId, entry);
  return createResult(true, "Business metadata registered.", entry);
}

export function getBusinessOntologySnapshot(): BusinessOntologySnapshot {
  return Object.freeze({
    ontologyVersion: BUSINESS_ONTOLOGY_CONTRACT_VERSION,
    entityCount: entityRegistry.size,
    relationshipCount: relationshipRegistry.size,
    capabilityCount: capabilityRegistry.size || BUSINESS_ONTOLOGY_CAPABILITY_KEYS.length,
    categoryCount: categoryRegistry.size || BUSINESS_ONTOLOGY_CATEGORY_KEYS.length,
    metadataCount: metadataRegistry.size,
    readOnly: true as const,
  });
}

export function getBusinessOntologyRegistry(): Readonly<{
  entities: readonly BusinessEntity[];
  relationships: readonly BusinessRelationship[];
  capabilities: readonly BusinessCapability[];
  categories: readonly BusinessOntologyCategory[];
  metadataRecords: readonly BusinessMetadata[];
  snapshot: BusinessOntologySnapshot;
  readOnly: true;
}> {
  return Object.freeze({
    entities: Object.freeze([...entityRegistry.values()].sort((a, b) => a.entityId.localeCompare(b.entityId))),
    relationships: Object.freeze(
      [...relationshipRegistry.values()].sort((a, b) => a.relationshipId.localeCompare(b.relationshipId))
    ),
    capabilities: Object.freeze(
      [...capabilityRegistry.values()].sort((a, b) => a.capabilityId.localeCompare(b.capabilityId))
    ),
    categories: Object.freeze(
      [...categoryRegistry.values()].sort((a, b) => a.categoryId.localeCompare(b.categoryId))
    ),
    metadataRecords: Object.freeze(
      [...metadataRegistry.values()].sort((a, b) => a.metadataId.localeCompare(b.metadataId))
    ),
    snapshot: getBusinessOntologySnapshot(),
    readOnly: true as const,
  });
}

export function seedDefaultBusinessOntologyCatalog(timestamp: string = new Date(0).toISOString()): void {
  if (categoryRegistry.size > 0) {
    return;
  }
  for (const categoryKey of BUSINESS_ONTOLOGY_CATEGORY_KEYS) {
    registerBusinessCategory(
      Object.freeze({
        categoryId: `business-category-${categoryKey}`,
        categoryKey,
        label: categoryKey,
        description: `${categoryKey} ontology category metadata.`,
      }),
      timestamp
    );
  }
  for (const capabilityKey of BUSINESS_ONTOLOGY_CAPABILITY_KEYS) {
    registerBusinessCapability(
      Object.freeze({
        capabilityId: `business-capability-${capabilityKey}`,
        capabilityKey,
        label: capabilityKey,
        description: `${capabilityKey} ontology capability metadata.`,
      }),
      timestamp
    );
  }
  registerBusinessMetadata(
    Object.freeze({
      metadataId: "business-ontology-root-metadata",
      owner: BUSINESS_ONTOLOGY_OWNER,
      extensions: Object.freeze({ catalog: "default" }),
    }),
    timestamp
  );
  for (const relationshipType of BUSINESS_RELATIONSHIP_TYPE_KEYS) {
    registerBusinessEntity(
      Object.freeze({
        entityId: `business-relationship-type-${relationshipType}`,
        entityType: "entity",
        name: relationshipType,
        label: relationshipType,
        description: `Canonical relationship type definition: ${relationshipType}.`,
        categoryKey: "structural",
      }),
      timestamp
    );
  }
}

export const BusinessOntologyRegistry = Object.freeze({
  resetBusinessOntologyRegistryForTests,
  registerBusinessEntity,
  registerBusinessRelationship,
  registerBusinessCapability,
  registerBusinessCategory,
  registerBusinessMetadata,
  getBusinessOntologyRegistry,
  getBusinessOntologySnapshot,
  seedDefaultBusinessOntologyCatalog,
});
