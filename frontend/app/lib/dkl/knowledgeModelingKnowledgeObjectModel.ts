/**
 * DKL-4:3 — Knowledge Object and Entity Model descriptors.
 *
 * Canonical immutable field catalogs for Knowledge Object and Entity contracts.
 * No factories, no ID generation, no methods.
 *
 * Ownership: owned exclusively by DKL-4:3.
 */

import { KnowledgeModelingRegistry } from "./knowledgeModelingRegistry.ts";
import type {
  CanonicalModelDescriptor,
  ModelFieldDescriptor,
} from "./knowledgeModelingModelTypes.ts";

const OWNER = "DKL-4 Knowledge Modeling Model";
const PHASE = "DKL-4:3" as const;

const field = (
  fieldName: string,
  fieldKind: string,
  description: string,
): ModelFieldDescriptor =>
  Object.freeze({
    fieldName,
    fieldKind,
    required: true as const,
    readonly: true as const,
    executableBehaviorImplied: false as const,
    description,
  });

const LIFECYCLE = Object.freeze([
  "Defined",
  "Draft",
  "Bound",
  "Structured",
  "Ready",
  "Stable",
  "Deprecated",
  "Superseded",
] as const);

const STATUSES = Object.freeze([
  "Declared",
  "Complete",
  "Incomplete",
  "Blocked",
  "Retired",
] as const);

const KNOWLEDGE_OBJECT_FIELDS: readonly ModelFieldDescriptor[] = Object.freeze([
  field("id", "string", "Stable declared knowledge object identifier."),
  field("type", "registryReference", "Registered knowledge object type."),
  field("name", "string", "Canonical knowledge object name."),
  field("description", "string", "Readonly description."),
  field("identity", "KnowledgeIdentity", "Canonical identity contract."),
  field("metadata", "KnowledgeMetadata", "Attached knowledge metadata."),
  field("owner", "string", "Owning architectural owner."),
  field("lifecycleState", "ModelLifecycleState", "Declared lifecycle state."),
  field("status", "ModelStatus", "Declared model status."),
  field("semanticClassifications", "string[]", "Declared semantic classifications."),
  field("hierarchyReferences", "string[]", "Hierarchy reference identifiers."),
  field("compositionReferences", "string[]", "Composition reference identifiers."),
  field("outgoingRelationshipReferences", "string[]", "Outgoing relationship references."),
  field("incomingRelationshipReferences", "string[]", "Incoming relationship references."),
  field("sourceUnderstandingReferences", "string[]", "Upstream understanding references."),
  field("provenance", "string", "Declared provenance identifier."),
  field("compatibility", "string", "Compatibility metadata."),
  field("extensionMetadata", "string", "Extension policy metadata."),
  field("publicVisibility", "ModelVisibility", "Public or internal visibility."),
]);

const ENTITY_FIELDS: readonly ModelFieldDescriptor[] = Object.freeze([
  field("id", "string", "Stable declared entity identifier."),
  field("entityType", "registryReference", "Registered entity type."),
  field("canonicalIdentity", "KnowledgeIdentity", "Canonical entity identity."),
  field("aliases", "string[]", "Declared aliases only."),
  field("labels", "string[]", "Declared labels."),
  field("classifications", "string[]", "Declared classifications."),
  field("sourceReferences", "string[]", "Source reference identifiers."),
  field("confidenceDeclaration", "ConfidenceDeclaration", "Declared confidence only."),
  field("ambiguityDeclaration", "AmbiguityDeclaration", "Declared ambiguity only."),
  field("provenance", "string", "Declared provenance identifier."),
  field("status", "ModelStatus", "Declared status."),
  field("lifecycleState", "ModelLifecycleState", "Declared lifecycle state."),
  field("ownership", "string", "Ownership declaration."),
  field("linkedObjectReferences", "string[]", "Linked object reference identifiers."),
  field("entityResolutionPerformed", "false", "Entity resolution is forbidden."),
  field("mergePerformed", "false", "Entity merge is forbidden."),
  field("confidenceCalculated", "false", "Confidence calculation is forbidden."),
]);

const KNOWLEDGE_METADATA_FIELDS: readonly ModelFieldDescriptor[] = Object.freeze([
  field("id", "string", "Stable metadata identifier."),
  field("metadataClass", "registryReference", "Registered metadata class."),
  field("labels", "string[]", "Declared labels."),
  field("descriptions", "string[]", "Declared descriptions."),
  field("tags", "string[]", "Declared tags."),
  field("owner", "string", "Owning architectural owner."),
  field("sourcePhase", "string", "Source phase declaration."),
  field("compatibility", "string", "Compatibility metadata."),
  field("extensionPolicy", "string", "Extension policy metadata."),
  field("immutable", "true", "Metadata is immutable."),
]);

/** Canonical Knowledge Object model descriptor. */
export const KnowledgeModelingKnowledgeObjectModel: CanonicalModelDescriptor =
  Object.freeze({
    modelId: "DKL-4:3/KnowledgeObject",
    modelKind: "KnowledgeObject",
    modelName: "Knowledge Object Model",
    namespace: "nexora.dkl.knowledge-modeling.model.knowledge-object",
    description:
      "Canonical immutable Knowledge Object contract. No methods, factories, or dynamic IDs.",
    owner: OWNER,
    sourcePhase: PHASE,
    registryCategoryReferences: Object.freeze([
      "KnowledgeObjectType",
      "IdentityType",
      "MetadataType",
      "ReferenceType",
    ]),
    fields: KNOWLEDGE_OBJECT_FIELDS,
    fieldCount: KNOWLEDGE_OBJECT_FIELDS.length,
    lifecycleStates: LIFECYCLE,
    statuses: STATUSES,
    metadataOnly: true,
    runtimeInstanceForbidden: true,
    factoryForbidden: true,
    graphBehaviorForbidden: true,
    immutable: true,
    allowedObjectTypes: Object.freeze(
      KnowledgeModelingRegistry.collections.knowledgeObjectTypes.map((entry) => entry.name),
    ),
  });

/** Canonical Entity model descriptor. */
export const KnowledgeModelingEntityModel: CanonicalModelDescriptor = Object.freeze({
  modelId: "DKL-4:3/Entity",
  modelKind: "Entity",
  modelName: "Entity Model",
  namespace: "nexora.dkl.knowledge-modeling.model.entity",
  description:
    "Canonical immutable Entity contract. No resolution, merge, or confidence calculation.",
  owner: OWNER,
  sourcePhase: PHASE,
  registryCategoryReferences: Object.freeze(["EntityType", "IdentityType", "ReferenceType"]),
  fields: ENTITY_FIELDS,
  fieldCount: ENTITY_FIELDS.length,
  lifecycleStates: LIFECYCLE,
  statuses: STATUSES,
  metadataOnly: true,
  runtimeInstanceForbidden: true,
  factoryForbidden: true,
  graphBehaviorForbidden: true,
  immutable: true,
  allowedEntityTypes: Object.freeze(
    KnowledgeModelingRegistry.collections.entityTypes.map((entry) => entry.name),
  ),
});

/** Canonical Knowledge Metadata model descriptor. */
export const KnowledgeModelingKnowledgeMetadataModel: CanonicalModelDescriptor =
  Object.freeze({
    modelId: "DKL-4:3/KnowledgeMetadata",
    modelKind: "KnowledgeMetadata",
    modelName: "Knowledge Metadata Model",
    namespace: "nexora.dkl.knowledge-modeling.model.knowledge-metadata",
    description: "Canonical immutable Knowledge Metadata contract.",
    owner: OWNER,
    sourcePhase: PHASE,
    registryCategoryReferences: Object.freeze(["MetadataType"]),
    fields: KNOWLEDGE_METADATA_FIELDS,
    fieldCount: KNOWLEDGE_METADATA_FIELDS.length,
    lifecycleStates: LIFECYCLE,
    statuses: STATUSES,
    metadataOnly: true,
    runtimeInstanceForbidden: true,
    factoryForbidden: true,
    graphBehaviorForbidden: true,
    immutable: true,
    allowedMetadataClasses: Object.freeze(
      KnowledgeModelingRegistry.collections.metadataTypes.map((entry) => entry.name),
    ),
  });
