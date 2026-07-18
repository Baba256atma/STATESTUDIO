/**
 * DKL-1:3 — Data Knowledge Foundation Model.
 *
 * Immutable metadata model describing the relationship types between
 * organizational knowledge objects. Relationship metadata only — no graph
 * construction, traversal, or runtime behavior.
 */

import type {
  KnowledgeRelationshipKey,
  KnowledgeRelationshipModelDescriptor,
  KnowledgeRelationshipTypeDescriptor,
} from "./dataKnowledgeFoundationModelTypes.ts";

const relationship = (
  relationKey: KnowledgeRelationshipKey,
  name: string,
  description: string,
  directional: boolean
): KnowledgeRelationshipTypeDescriptor =>
  Object.freeze({
    id: `dkl-relationship-${relationKey}`,
    relationKey,
    name,
    description,
    directional,
    metadataOnly: true,
    immutable: true,
  } as const satisfies KnowledgeRelationshipTypeDescriptor);

export const KnowledgeRelationshipModel = Object.freeze({
  id: "dkl-model-knowledge-relationship",
  name: "Knowledge Relationship Model",
  kind: "knowledge-relationship",
  relationships: Object.freeze([
    relationship("owns", "Owns", "Describes an ownership relationship from one object to another.", true),
    relationship("belongsTo", "Belongs To", "Describes a membership relationship to a parent object.", true),
    relationship("references", "References", "Describes a reference relationship to another object.", true),
    relationship("dependsOn", "Depends On", "Describes a dependency relationship on another object.", true),
    relationship("reportsTo", "Reports To", "Describes a reporting relationship to another object.", true),
    relationship("linkedTo", "Linked To", "Describes a symmetric link between two objects.", false),
    relationship("relatedTo", "Related To", "Describes a symmetric relatedness between two objects.", false),
  ]),
  metadataOnly: true,
  immutable: true,
} as const satisfies KnowledgeRelationshipModelDescriptor);
