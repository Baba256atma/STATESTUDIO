/**
 * DKL-1:3 — Data Knowledge Foundation Model.
 *
 * Metadata-only type definitions for the DKL architectural model platform.
 * These types describe the conceptual vocabulary of the Data Knowledge Layer.
 * They contain no runtime behavior, no I/O, and no side effects.
 */

// ---------------------------------------------------------------------------
// Shared model vocabulary
// ---------------------------------------------------------------------------

export type DataKnowledgeModelKind =
  | "knowledge-object"
  | "business-object"
  | "knowledge-relationship"
  | "knowledge-metadata";

/** A declarative descriptor for a single facet of a model. */
export interface ModelFacetDescriptor {
  readonly facet: string;
  readonly description: string;
  readonly options: readonly string[];
}

// ---------------------------------------------------------------------------
// Knowledge Object Model
// ---------------------------------------------------------------------------

export interface DataKnowledgeObjectModelDescriptor {
  readonly id: "dkl-model-knowledge-object";
  readonly name: "Knowledge Object Model";
  readonly kind: "knowledge-object";
  readonly identifier: ModelFacetDescriptor;
  readonly category: ModelFacetDescriptor;
  readonly source: ModelFacetDescriptor;
  readonly ownership: ModelFacetDescriptor;
  readonly lifecycle: ModelFacetDescriptor;
  readonly visibility: ModelFacetDescriptor;
  readonly stability: ModelFacetDescriptor;
  readonly organizationalKnowledge: ModelFacetDescriptor;
  readonly metadataOnly: true;
  readonly immutable: true;
}

// ---------------------------------------------------------------------------
// Business Object Model
// ---------------------------------------------------------------------------

export type BusinessObjectTypeKey =
  | "customer"
  | "employee"
  | "product"
  | "project"
  | "supplier"
  | "department"
  | "contract"
  | "asset";

export interface BusinessObjectTypeDescriptor {
  readonly id: string;
  readonly typeKey: BusinessObjectTypeKey;
  readonly name: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface BusinessObjectModelDescriptor {
  readonly id: "dkl-model-business-object";
  readonly name: "Business Object Model";
  readonly kind: "business-object";
  readonly types: readonly BusinessObjectTypeDescriptor[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

// ---------------------------------------------------------------------------
// Knowledge Relationship Model
// ---------------------------------------------------------------------------

export type KnowledgeRelationshipKey =
  | "owns"
  | "belongsTo"
  | "references"
  | "dependsOn"
  | "reportsTo"
  | "linkedTo"
  | "relatedTo";

export interface KnowledgeRelationshipTypeDescriptor {
  readonly id: string;
  readonly relationKey: KnowledgeRelationshipKey;
  readonly name: string;
  readonly description: string;
  readonly directional: boolean;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeRelationshipModelDescriptor {
  readonly id: "dkl-model-knowledge-relationship";
  readonly name: "Knowledge Relationship Model";
  readonly kind: "knowledge-relationship";
  readonly relationships: readonly KnowledgeRelationshipTypeDescriptor[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

// ---------------------------------------------------------------------------
// Knowledge Metadata Model
// ---------------------------------------------------------------------------

export type KnowledgeMetadataFieldKey =
  | "createdBy"
  | "modifiedBy"
  | "version"
  | "classification"
  | "confidence"
  | "sourceType"
  | "namespace";

export type KnowledgeMetadataValueType = "string" | "number" | "enum";

export interface KnowledgeMetadataFieldDescriptor {
  readonly id: string;
  readonly fieldKey: KnowledgeMetadataFieldKey;
  readonly name: string;
  readonly description: string;
  readonly valueType: KnowledgeMetadataValueType;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeMetadataModelDescriptor {
  readonly id: "dkl-model-knowledge-metadata";
  readonly name: "Knowledge Metadata Model";
  readonly kind: "knowledge-metadata";
  readonly fields: readonly KnowledgeMetadataFieldDescriptor[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

// ---------------------------------------------------------------------------
// Manifest
// ---------------------------------------------------------------------------

export interface DataKnowledgeFoundationModelManifestDescriptor {
  readonly modelVersion: "1.0.0";
  readonly namespace: "nexora.dkl.foundation.model";
  readonly modelId: "DKL-1:3";
  readonly registeredModels: readonly string[];
  readonly modelCategories: readonly DataKnowledgeModelKind[];
  readonly compatibility: Readonly<{
    foundation: "DKL-1:1";
    registry: "DKL-1:2";
    backwardCompatible: true;
    additiveOnly: true;
  }>;
  readonly foundationCompatibility: Readonly<{
    phase: "DKL-1:1";
    version: "1.0.0";
    compatible: true;
  }>;
  readonly registryCompatibility: Readonly<{
    phase: "DKL-1:2";
    version: "1.0.0";
    compatible: true;
  }>;
  readonly stability: "Stable";
  readonly certificationStatus: "Certified";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

// ---------------------------------------------------------------------------
// Aggregate model platform + summary
// ---------------------------------------------------------------------------

export interface DataKnowledgeFoundationModelDescriptor {
  readonly objectModel: DataKnowledgeObjectModelDescriptor;
  readonly businessModel: BusinessObjectModelDescriptor;
  readonly relationshipModel: KnowledgeRelationshipModelDescriptor;
  readonly metadataModel: KnowledgeMetadataModelDescriptor;
  readonly manifest: DataKnowledgeFoundationModelManifestDescriptor;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface DataKnowledgeFoundationModelSummary {
  readonly modelId: "DKL-1:3";
  readonly modelVersion: "1.0.0";
  readonly registeredModelCount: number;
  readonly businessObjectTypeCount: number;
  readonly relationshipTypeCount: number;
  readonly metadataFieldCount: number;
  readonly foundationPhase: "DKL-1:1";
  readonly registryPhase: "DKL-1:2";
  readonly certificationStatus: "Certified";
  readonly stability: "Stable";
  readonly metadataOnly: true;
  readonly immutable: true;
}
