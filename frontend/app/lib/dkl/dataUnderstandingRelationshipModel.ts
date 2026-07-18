/**
 * DKL-3:3 — Understanding Relationship Model.
 *
 * Canonical immutable model schema for provisional understanding relationships.
 * Never represents Business Relationships, Knowledge Graph edges, or Engine
 * dependencies.
 *
 * Ownership: owned exclusively by DKL-3:3.
 */

import type {
  ModelBoundaryMetadata,
  ModelFieldDescriptor,
  ModelOwnershipMetadata,
  UnderstandingRelationshipKind,
} from "./dataUnderstandingModelTypes.ts";

const OWNERSHIP: ModelOwnershipMetadata = Object.freeze({
  owner: "DKL-3 Data Understanding Platform",
  sourcePhase: "DKL-3:3",
  metadataOnly: true,
  modelOnly: true,
});

const BOUNDARIES: ModelBoundaryMetadata = Object.freeze({
  provisionalOnly: true,
  businessObjectForbidden: true,
  knowledgeGraphForbidden: true,
  persistenceForbidden: true,
  aiForbidden: true,
  engineReasoningForbidden: true,
});

const field = (
  fieldName: string,
  fieldKind: string,
  required: boolean,
  cardinality: ModelFieldDescriptor["cardinality"],
  description: string,
): ModelFieldDescriptor =>
  Object.freeze({ fieldName, fieldKind, required, cardinality, description });

const RELATIONSHIP_KINDS: readonly UnderstandingRelationshipKind[] = Object.freeze([
  "supports",
  "suggests",
  "belongsToSubject",
  "derivedFrom",
  "references",
  "requiresClarification",
]);

const RELATIONSHIP_DESCRIPTIONS: Readonly<
  Record<UnderstandingRelationshipKind, string>
> = Object.freeze({
  supports: "Evidence or candidate supports another provisional interpretation.",
  suggests: "One subject suggests a provisional meaning for another.",
  belongsToSubject: "A candidate or evidence belongs to an understanding subject.",
  derivedFrom: "A provisional interpretation is derived from another reference.",
  references: "One understanding element references another.",
  requiresClarification: "A relationship that requires clarification before advancement.",
});

const RELATIONSHIP_FIELDS: readonly ModelFieldDescriptor[] = Object.freeze([
  field("relationshipId", "Identity", true, "one", "Stable relationship identity."),
  field("relationshipKind", "RelationshipKind", true, "one", "Provisional relationship kind."),
  field("fromSubjectId", "SubjectReference", true, "one", "Source subject identity."),
  field("toSubjectId", "SubjectReference", true, "one", "Target subject identity."),
  field("description", "Text", true, "one", "Description of the provisional relationship."),
  field("provisional", "Flag", true, "one", "Always true — relationships are provisional."),
  field("ownership", "OwnershipMetadata", true, "one", "Model ownership metadata."),
  field("boundaries", "BoundaryMetadata", true, "one", "Model boundary metadata."),
]);

const FORBIDDEN_RELATIONSHIP_MEANINGS: readonly string[] = Object.freeze([
  "BusinessRelationships",
  "KnowledgeGraphEdges",
  "OrganizationStructure",
  "EngineDependencies",
]);

/** Canonical immutable Understanding Relationship model schema. */
export const DataUnderstandingRelationshipModel = Object.freeze({
  modelId: "DKL-3:3/UnderstandingRelationship",
  modelKind: "UnderstandingRelationship",
  modelName: "Understanding Relationship Model",
  description:
    "Provisional understanding relationships only. Not knowledge-graph edges.",
  fields: RELATIONSHIP_FIELDS,
  fieldCount: RELATIONSHIP_FIELDS.length,
  relationshipKinds: RELATIONSHIP_KINDS,
  relationshipKindCount: RELATIONSHIP_KINDS.length,
  relationshipDescriptions: RELATIONSHIP_DESCRIPTIONS,
  forbiddenMeanings: FORBIDDEN_RELATIONSHIP_MEANINGS,
  ownership: OWNERSHIP,
  boundaries: BOUNDARIES,
  metadataOnly: true,
  modelOnly: true,
  immutable: true,
});
