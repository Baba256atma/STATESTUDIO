/**
 * DKL-4:3 — Structure, Semantic, Provenance, Context, and Model Envelope descriptors.
 *
 * Hierarchy, composition, semantic structure, provenance, context, snapshot,
 * state, sets, boundary, version, summary, and the canonical Knowledge Model.
 *
 * Ownership: owned exclusively by DKL-4:3.
 */

import { KnowledgeModelingFoundation } from "./knowledgeModelingFoundation.ts";
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

const HIERARCHY_FIELDS: readonly ModelFieldDescriptor[] = Object.freeze([
  field("id", "string", "Stable hierarchy identifier."),
  field("hierarchyKind", "HierarchyStructureKind", "ParentChild, Organizational, Semantic, Containment."),
  field("parentIdentityId", "string", "Parent identity reference."),
  field("childIdentityIds", "string[]", "Child identity references."),
  field("description", "string", "Hierarchy description."),
  field("owner", "string", "Owning architectural owner."),
  field("sourcePhase", "string", "Source phase declaration."),
  field("treeTraversalForbidden", "true", "Tree traversal is forbidden."),
  field("recursiveProcessingForbidden", "true", "Recursive processing is forbidden."),
  field("cycleDetectionDeferred", "true", "Cycle detection is deferred."),
  field("immutable", "true", "Hierarchy is immutable."),
]);

const COMPOSITION_FIELDS: readonly ModelFieldDescriptor[] = Object.freeze([
  field("id", "string", "Stable composition identifier."),
  field("compositionKind", "CompositionStructureKind", "Object, Model, Aggregation, Membership, Containment."),
  field("parentIdentityId", "string", "Parent identity reference."),
  field("partIdentityIds", "string[]", "Part identity references."),
  field("description", "string", "Composition description."),
  field("owner", "string", "Owning architectural owner."),
  field("sourcePhase", "string", "Source phase declaration."),
  field("runtimeAssemblyForbidden", "true", "Runtime assembly is forbidden."),
  field("immutable", "true", "Composition is immutable."),
]);

const SEMANTIC_FIELDS: readonly ModelFieldDescriptor[] = Object.freeze([
  field("id", "string", "Stable semantic structure identifier."),
  field("semanticType", "registryReference", "Registered semantic structure type."),
  field("semanticLabels", "string[]", "Declared semantic labels."),
  field("classifications", "string[]", "Declared classifications."),
  field("domains", "string[]", "Declared domains."),
  field("concepts", "string[]", "Declared concepts."),
  field("terms", "string[]", "Declared terms."),
  field("aliases", "string[]", "Declared aliases."),
  field("context", "string", "Declared context."),
  field("sourceUnderstandingReferences", "string[]", "Upstream understanding references."),
  field("registeredSemanticCategoryReferences", "string[]", "Registered semantic categories."),
  field("compatibility", "string", "Compatibility metadata."),
  field("extensionPolicy", "string", "Extension policy metadata."),
  field("inferenceForbidden", "true", "Semantic inference is forbidden."),
  field("aiForbidden", "true", "AI is forbidden."),
  field("immutable", "true", "Semantic structure is immutable."),
]);

const PROVENANCE_FIELDS: readonly ModelFieldDescriptor[] = Object.freeze([
  field("id", "string", "Stable provenance identifier."),
  field("provenanceChain", "string[]", "Declared provenance chain."),
  field("sourcePhase", "string", "Source phase declaration."),
  field("sourceArtifact", "string", "Source artifact declaration."),
  field("sourceUnderstandingCandidate", "string", "Source understanding candidate reference."),
  field("sourceEvidenceReference", "string", "Source evidence reference."),
  field("transformationDeclaration", "string", "Declared transformation metadata."),
  field("timestampsGeneratedAtRuntime", "false", "Runtime timestamps are forbidden."),
  field("transformationLogicForbidden", "true", "Transformation logic is forbidden."),
  field("immutable", "true", "Provenance is immutable."),
]);

const CONTEXT_FIELDS: readonly ModelFieldDescriptor[] = Object.freeze([
  field("id", "string", "Stable context identifier."),
  field("modelContext", "string", "Declared model context."),
  field("organizationalContext", "string", "Declared organizational context."),
  field("temporalContext", "string", "Declared temporal context."),
  field("businessContext", "string", "Declared business context."),
  field("executiveContextReference", "string", "Executive context reference only."),
  field("contextAssemblyForbidden", "true", "Context assembly is forbidden."),
  field("immutable", "true", "Context is immutable."),
]);

const KNOWLEDGE_MODEL_FIELDS: readonly ModelFieldDescriptor[] = Object.freeze([
  field("modelIdentity", "KnowledgeIdentity", "Canonical model identity."),
  field("namespace", "string", "Model namespace."),
  field("version", "string", "Declared model version."),
  field("lifecycleState", "ModelLifecycleState", "Declared lifecycle state."),
  field("status", "ModelStatus", "Declared status."),
  field("ownership", "string", "Ownership declaration."),
  field("provenance", "KnowledgeModelProvenance", "Provenance contract."),
  field("objectCollection", "string[]", "Declared object collection."),
  field("relationshipCollection", "string[]", "Declared relationship collection."),
  field("hierarchy", "string[]", "Hierarchy references."),
  field("composition", "string[]", "Composition references."),
  field("references", "string[]", "Reference identifiers."),
  field("semanticStructures", "string[]", "Semantic structure references."),
  field("metadata", "KnowledgeMetadata", "Model metadata."),
  field("context", "KnowledgeModelContext", "Model context."),
  field("boundaries", "string[]", "Boundary declarations."),
  field("compatibilityMetadata", "string", "Compatibility metadata."),
  field("extensionMetadata", "string", "Extension metadata."),
  field("sourceUnderstandingReferences", "string[]", "Upstream understanding references."),
  field("creationMetadataDeclaredOnly", "true", "Creation metadata is declaration only."),
  field("updateMetadataDeclaredOnly", "true", "Update metadata is declaration only."),
  field("metadataOnly", "true", "Model is metadata only."),
  field("immutable", "true", "Model is immutable."),
]);

export const KnowledgeModelingHierarchyModel: CanonicalModelDescriptor = Object.freeze({
  modelId: "DKL-4:3/KnowledgeHierarchy",
  modelKind: "KnowledgeHierarchy",
  modelName: "Knowledge Hierarchy Model",
  namespace: "nexora.dkl.knowledge-modeling.model.knowledge-hierarchy",
  description: "Parent-child, organizational, semantic, and containment hierarchy declarations.",
  owner: OWNER,
  sourcePhase: PHASE,
  registryCategoryReferences: Object.freeze(["HierarchyType"]),
  fields: HIERARCHY_FIELDS,
  fieldCount: HIERARCHY_FIELDS.length,
  lifecycleStates: LIFECYCLE,
  statuses: STATUSES,
  metadataOnly: true,
  runtimeInstanceForbidden: true,
  factoryForbidden: true,
  graphBehaviorForbidden: true,
  immutable: true,
  hierarchyKinds: Object.freeze(["ParentChild", "Organizational", "Semantic", "Containment"]),
  allowedHierarchyTypes: Object.freeze(
    KnowledgeModelingRegistry.collections.hierarchyTypes.map((entry) => entry.name),
  ),
});

export const KnowledgeModelingCompositionModel: CanonicalModelDescriptor = Object.freeze({
  modelId: "DKL-4:3/KnowledgeComposition",
  modelKind: "KnowledgeComposition",
  modelName: "Knowledge Composition Model",
  namespace: "nexora.dkl.knowledge-modeling.model.knowledge-composition",
  description: "Object/model composition, containment, aggregation, and membership declarations.",
  owner: OWNER,
  sourcePhase: PHASE,
  registryCategoryReferences: Object.freeze(["CompositionType"]),
  fields: COMPOSITION_FIELDS,
  fieldCount: COMPOSITION_FIELDS.length,
  lifecycleStates: LIFECYCLE,
  statuses: STATUSES,
  metadataOnly: true,
  runtimeInstanceForbidden: true,
  factoryForbidden: true,
  graphBehaviorForbidden: true,
  immutable: true,
  compositionKinds: Object.freeze([
    "ObjectComposition",
    "ModelComposition",
    "Aggregation",
    "Membership",
    "Containment",
  ]),
  allowedCompositionTypes: Object.freeze(
    KnowledgeModelingRegistry.collections.compositionTypes.map((entry) => entry.name),
  ),
});

export const KnowledgeModelingSemanticStructureModel: CanonicalModelDescriptor =
  Object.freeze({
    modelId: "DKL-4:3/SemanticStructure",
    modelKind: "SemanticStructure",
    modelName: "Semantic Structure Model",
    namespace: "nexora.dkl.knowledge-modeling.model.semantic-structure",
    description: "Semantic structure contract. No inference or AI.",
    owner: OWNER,
    sourcePhase: PHASE,
    registryCategoryReferences: Object.freeze(["SemanticStructureType"]),
    fields: SEMANTIC_FIELDS,
    fieldCount: SEMANTIC_FIELDS.length,
    lifecycleStates: LIFECYCLE,
    statuses: STATUSES,
    metadataOnly: true,
    runtimeInstanceForbidden: true,
    factoryForbidden: true,
    graphBehaviorForbidden: true,
    immutable: true,
    allowedSemanticStructureTypes: Object.freeze(
      KnowledgeModelingRegistry.collections.semanticStructureTypes.map((entry) => entry.name),
    ),
  });

export const KnowledgeModelingProvenanceModel: CanonicalModelDescriptor = Object.freeze({
  modelId: "DKL-4:3/KnowledgeModelProvenance",
  modelKind: "KnowledgeModelProvenance",
  modelName: "Knowledge Model Provenance Model",
  namespace: "nexora.dkl.knowledge-modeling.model.provenance",
  description: "Provenance chain declarations. No transformation logic or runtime timestamps.",
  owner: OWNER,
  sourcePhase: PHASE,
  registryCategoryReferences: Object.freeze(["ReferenceType", "PublicFoundationApi"]),
  fields: PROVENANCE_FIELDS,
  fieldCount: PROVENANCE_FIELDS.length,
  lifecycleStates: LIFECYCLE,
  statuses: STATUSES,
  metadataOnly: true,
  runtimeInstanceForbidden: true,
  factoryForbidden: true,
  graphBehaviorForbidden: true,
  immutable: true,
  upstreamUnderstandingViaFoundation:
    KnowledgeModelingFoundation.upstream.module === "dataUnderstandingPublicIndex.ts",
});

export const KnowledgeModelingContextModel: CanonicalModelDescriptor = Object.freeze({
  modelId: "DKL-4:3/KnowledgeModelContext",
  modelKind: "KnowledgeModelContext",
  modelName: "Knowledge Model Context Model",
  namespace: "nexora.dkl.knowledge-modeling.model.context",
  description: "Model, organizational, temporal, business, and executive context declarations.",
  owner: OWNER,
  sourcePhase: PHASE,
  registryCategoryReferences: Object.freeze(["MetadataType"]),
  fields: CONTEXT_FIELDS,
  fieldCount: CONTEXT_FIELDS.length,
  lifecycleStates: LIFECYCLE,
  statuses: STATUSES,
  metadataOnly: true,
  runtimeInstanceForbidden: true,
  factoryForbidden: true,
  graphBehaviorForbidden: true,
  immutable: true,
});

export const KnowledgeModelingKnowledgeModel: CanonicalModelDescriptor = Object.freeze({
  modelId: "DKL-4:3/KnowledgeModel",
  modelKind: "KnowledgeModel",
  modelName: "Knowledge Model",
  namespace: "nexora.dkl.knowledge-modeling.model.knowledge-model",
  description:
    "Canonical Knowledge Model envelope for organizational knowledge. Declarations only.",
  owner: OWNER,
  sourcePhase: PHASE,
  registryCategoryReferences: Object.freeze([
    "KnowledgeModelType",
    "KnowledgeObjectType",
    "RelationshipType",
    "HierarchyType",
    "CompositionType",
    "ReferenceType",
    "SemanticStructureType",
    "MetadataType",
  ]),
  fields: KNOWLEDGE_MODEL_FIELDS,
  fieldCount: KNOWLEDGE_MODEL_FIELDS.length,
  lifecycleStates: LIFECYCLE,
  statuses: STATUSES,
  metadataOnly: true,
  runtimeInstanceForbidden: true,
  factoryForbidden: true,
  graphBehaviorForbidden: true,
  immutable: true,
});

export const KnowledgeModelingSnapshotModel: CanonicalModelDescriptor = Object.freeze({
  modelId: "DKL-4:3/KnowledgeModelSnapshot",
  modelKind: "KnowledgeModelSnapshot",
  modelName: "Knowledge Model Snapshot",
  namespace: "nexora.dkl.knowledge-modeling.model.snapshot",
  description: "Declared snapshot envelope. No runtime capture.",
  owner: OWNER,
  sourcePhase: PHASE,
  registryCategoryReferences: Object.freeze(["KnowledgeModelType"]),
  fields: Object.freeze([
    field("id", "string", "Snapshot identifier."),
    field("modelIdentityId", "string", "Referenced model identity."),
    field("capturedFieldNames", "string[]", "Declared captured field names."),
    field("declaredOnly", "true", "Snapshot is declaration only."),
    field("runtimeCaptureForbidden", "true", "Runtime capture is forbidden."),
    field("immutable", "true", "Snapshot is immutable."),
  ]),
  fieldCount: 6,
  lifecycleStates: LIFECYCLE,
  statuses: STATUSES,
  metadataOnly: true,
  runtimeInstanceForbidden: true,
  factoryForbidden: true,
  graphBehaviorForbidden: true,
  immutable: true,
});

export const KnowledgeModelingStateModel: CanonicalModelDescriptor = Object.freeze({
  modelId: "DKL-4:3/KnowledgeModelState",
  modelKind: "KnowledgeModelState",
  modelName: "Knowledge Model State",
  namespace: "nexora.dkl.knowledge-modeling.model.state",
  description: "Declared model state envelope.",
  owner: OWNER,
  sourcePhase: PHASE,
  registryCategoryReferences: Object.freeze(["LifecycleState"]),
  fields: Object.freeze([
    field("id", "string", "State identifier."),
    field("lifecycleState", "ModelLifecycleState", "Declared lifecycle state."),
    field("status", "ModelStatus", "Declared status."),
    field("readiness", "string", "Declared readiness."),
    field("declaredOnly", "true", "State is declaration only."),
    field("immutable", "true", "State is immutable."),
  ]),
  fieldCount: 6,
  lifecycleStates: LIFECYCLE,
  statuses: STATUSES,
  metadataOnly: true,
  runtimeInstanceForbidden: true,
  factoryForbidden: true,
  graphBehaviorForbidden: true,
  immutable: true,
});

export const KnowledgeModelingRelationshipSetModel: CanonicalModelDescriptor = Object.freeze({
  modelId: "DKL-4:3/KnowledgeModelRelationshipSet",
  modelKind: "KnowledgeModelRelationshipSet",
  modelName: "Knowledge Model Relationship Set",
  namespace: "nexora.dkl.knowledge-modeling.model.relationship-set",
  description: "Declared relationship set. No graph operations.",
  owner: OWNER,
  sourcePhase: PHASE,
  registryCategoryReferences: Object.freeze(["RelationshipType"]),
  fields: Object.freeze([
    field("id", "string", "Set identifier."),
    field("relationshipIds", "string[]", "Declared relationship identifiers."),
    field("orderingDeterministic", "true", "Ordering is deterministic."),
    field("graphOperationsForbidden", "true", "Graph operations are forbidden."),
    field("immutable", "true", "Set is immutable."),
  ]),
  fieldCount: 5,
  lifecycleStates: LIFECYCLE,
  statuses: STATUSES,
  metadataOnly: true,
  runtimeInstanceForbidden: true,
  factoryForbidden: true,
  graphBehaviorForbidden: true,
  immutable: true,
});

export const KnowledgeModelingObjectSetModel: CanonicalModelDescriptor = Object.freeze({
  modelId: "DKL-4:3/KnowledgeModelObjectSet",
  modelKind: "KnowledgeModelObjectSet",
  modelName: "Knowledge Model Object Set",
  namespace: "nexora.dkl.knowledge-modeling.model.object-set",
  description: "Declared object set. No construction.",
  owner: OWNER,
  sourcePhase: PHASE,
  registryCategoryReferences: Object.freeze(["KnowledgeObjectType", "BusinessObjectType"]),
  fields: Object.freeze([
    field("id", "string", "Set identifier."),
    field("objectIds", "string[]", "Declared object identifiers."),
    field("orderingDeterministic", "true", "Ordering is deterministic."),
    field("constructionForbidden", "true", "Object construction is forbidden."),
    field("immutable", "true", "Set is immutable."),
  ]),
  fieldCount: 5,
  lifecycleStates: LIFECYCLE,
  statuses: STATUSES,
  metadataOnly: true,
  runtimeInstanceForbidden: true,
  factoryForbidden: true,
  graphBehaviorForbidden: true,
  immutable: true,
});

export const KnowledgeModelingBoundaryModel: CanonicalModelDescriptor = Object.freeze({
  modelId: "DKL-4:3/KnowledgeModelBoundary",
  modelKind: "KnowledgeModelBoundary",
  modelName: "Knowledge Model Boundary",
  namespace: "nexora.dkl.knowledge-modeling.model.boundary",
  description: "Declared model boundary envelope.",
  owner: OWNER,
  sourcePhase: PHASE,
  registryCategoryReferences: Object.freeze(["BoundaryDeclaration"]),
  fields: Object.freeze([
    field("id", "string", "Boundary identifier."),
    field("boundaryName", "string", "Boundary name."),
    field("forbids", "string[]", "Forbidden capabilities."),
    field("allows", "string[]", "Allowed declarations."),
    field("metadataOnly", "true", "Boundary is metadata only."),
    field("immutable", "true", "Boundary is immutable."),
  ]),
  fieldCount: 6,
  lifecycleStates: LIFECYCLE,
  statuses: STATUSES,
  metadataOnly: true,
  runtimeInstanceForbidden: true,
  factoryForbidden: true,
  graphBehaviorForbidden: true,
  immutable: true,
});

export const KnowledgeModelingVersionModel: CanonicalModelDescriptor = Object.freeze({
  modelId: "DKL-4:3/KnowledgeModelVersion",
  modelKind: "KnowledgeModelVersion",
  modelName: "Knowledge Model Version",
  namespace: "nexora.dkl.knowledge-modeling.model.version",
  description: "Declared model version envelope.",
  owner: OWNER,
  sourcePhase: PHASE,
  registryCategoryReferences: Object.freeze(["KnowledgeModelType"]),
  fields: Object.freeze([
    field("id", "string", "Version identifier."),
    field("version", "string", "Declared version."),
    field("previousVersion", "string|null", "Previous version declaration."),
    field("stability", "string", "Stability declaration."),
    field("declaredOnly", "true", "Version is declaration only."),
    field("immutable", "true", "Version is immutable."),
  ]),
  fieldCount: 6,
  lifecycleStates: LIFECYCLE,
  statuses: STATUSES,
  metadataOnly: true,
  runtimeInstanceForbidden: true,
  factoryForbidden: true,
  graphBehaviorForbidden: true,
  immutable: true,
});

export const KnowledgeModelingSummaryModel: CanonicalModelDescriptor = Object.freeze({
  modelId: "DKL-4:3/KnowledgeModelSummary",
  modelKind: "KnowledgeModelSummary",
  modelName: "Knowledge Model Summary",
  namespace: "nexora.dkl.knowledge-modeling.model.summary",
  description: "Declared model summary envelope.",
  owner: OWNER,
  sourcePhase: PHASE,
  registryCategoryReferences: Object.freeze(["KnowledgeModelType"]),
  fields: Object.freeze([
    field("id", "string", "Summary identifier."),
    field("modelKindCount", "number", "Count of canonical model kinds."),
    field("objectFieldCount", "number", "Knowledge Object field count."),
    field("relationshipFieldCount", "number", "Relationship field count."),
    field("businessObjectFieldCount", "number", "Business Object field count."),
    field("metadataOnly", "true", "Summary is metadata only."),
    field("immutable", "true", "Summary is immutable."),
  ]),
  fieldCount: 7,
  lifecycleStates: LIFECYCLE,
  statuses: STATUSES,
  metadataOnly: true,
  runtimeInstanceForbidden: true,
  factoryForbidden: true,
  graphBehaviorForbidden: true,
  immutable: true,
});
