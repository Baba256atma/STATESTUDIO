/**
 * DKL-4:3 — Relationship Model descriptor.
 *
 * Canonical immutable Relationship contract. No rule enforcement, traversal,
 * or strength/confidence calculation.
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

const RELATIONSHIP_FIELDS: readonly ModelFieldDescriptor[] = Object.freeze([
  field("id", "string", "Stable declared relationship identifier."),
  field("type", "registryReference", "Registered relationship type."),
  field("sourceObjectReference", "string", "Source object reference identifier."),
  field("targetObjectReference", "string", "Target object reference identifier."),
  field("direction", "RelationshipDirection", "Declared relationship direction."),
  field("category", "string", "Declared relationship category."),
  field("cardinality", "RelationshipCardinality", "Declared cardinality metadata."),
  field("strengthDeclaration", "StrengthDeclaration", "Declared strength only."),
  field("confidenceDeclaration", "ConfidenceDeclaration", "Declared confidence only."),
  field("provenance", "string", "Declared provenance identifier."),
  field("lifecycleState", "ModelLifecycleState", "Declared lifecycle state."),
  field("status", "ModelStatus", "Declared status."),
  field("ownership", "string", "Ownership declaration."),
  field("semanticLabels", "string[]", "Declared semantic labels."),
  field("compatibility", "string", "Compatibility metadata."),
  field("extensionMetadata", "string", "Extension metadata."),
  field("graphTraversalForbidden", "true", "Graph traversal is forbidden."),
  field("rulesEnforced", "false", "Relationship rule enforcement is forbidden."),
  field("strengthCalculated", "false", "Strength calculation is forbidden."),
  field("confidenceCalculated", "false", "Confidence calculation is forbidden."),
]);

/** Canonical Relationship model descriptor. */
export const KnowledgeModelingRelationshipModel: CanonicalModelDescriptor = Object.freeze({
  modelId: "DKL-4:3/Relationship",
  modelKind: "Relationship",
  modelName: "Relationship Model",
  namespace: "nexora.dkl.knowledge-modeling.model.relationship",
  description:
    "Canonical immutable Relationship contract. No enforcement, traversal, or calculations.",
  owner: OWNER,
  sourcePhase: PHASE,
  registryCategoryReferences: Object.freeze(["RelationshipType", "ReferenceType"]),
  fields: RELATIONSHIP_FIELDS,
  fieldCount: RELATIONSHIP_FIELDS.length,
  lifecycleStates: LIFECYCLE,
  statuses: STATUSES,
  metadataOnly: true,
  runtimeInstanceForbidden: true,
  factoryForbidden: true,
  graphBehaviorForbidden: true,
  immutable: true,
  allowedRelationshipTypes: Object.freeze(
    KnowledgeModelingRegistry.collections.relationshipTypes.map((entry) => entry.name),
  ),
  registeredRelationshipCount:
    KnowledgeModelingRegistry.collections.relationshipTypes.length,
});
