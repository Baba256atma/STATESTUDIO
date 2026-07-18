/**
 * DKL-2:1 — Data Source & Knowledge Registry Foundation.
 *
 * Metadata-only type definitions for the canonical Data Source & Knowledge
 * Registry foundation. These types describe immutable architecture only — no
 * discovery, ingestion, parsing, synchronization, storage, AI reasoning,
 * validation, transformation, or runtime execution is implied or performed.
 *
 * Responsibility: type contracts for source/knowledge registry metadata.
 * Ownership: owned exclusively by DKL-2:1.
 * Dependency rules: standalone types; the foundation may depend only on the
 * DKL-1 Public Index.
 * Architectural purpose: provide readonly, deterministic shapes for the
 * descriptive registry foundation.
 */

export type RegistryStability = "Stable";

export type DataSourceCategoryKey =
  | "database"
  | "data-warehouse"
  | "data-lake"
  | "spreadsheet"
  | "csv"
  | "json"
  | "xml"
  | "pdf"
  | "word"
  | "presentation"
  | "email"
  | "chat"
  | "voice-transcript"
  | "rest-api"
  | "graphql-api"
  | "mcp"
  | "sdk"
  | "erp"
  | "crm"
  | "file-system"
  | "cloud-storage"
  | "manual-input"
  | "external-knowledge-base";

export type KnowledgeCategoryKey =
  | "customer"
  | "organization"
  | "employee"
  | "project"
  | "task"
  | "meeting"
  | "decision"
  | "goal"
  | "strategy"
  | "kpi"
  | "okr"
  | "risk"
  | "opportunity"
  | "product"
  | "service"
  | "contract"
  | "invoice"
  | "purchase"
  | "revenue"
  | "cost"
  | "document"
  | "conversation"
  | "event";

export type ConnectorTypeKey =
  | "database-connector"
  | "file-connector"
  | "api-connector"
  | "mcp-connector"
  | "sdk-connector"
  | "cloud-storage-connector"
  | "enterprise-system-connector"
  | "messaging-connector"
  | "manual-connector";

export type ContentTypeKey =
  | "structured"
  | "semi-structured"
  | "unstructured"
  | "tabular"
  | "document"
  | "message"
  | "transcript"
  | "binary";

export type MetadataTypeKey =
  | "identity"
  | "descriptive"
  | "structural"
  | "administrative"
  | "provenance"
  | "classification"
  | "relationship";

export type SourceCategoryKey =
  | "structured-data"
  | "document"
  | "communication"
  | "api"
  | "enterprise-system"
  | "storage"
  | "manual"
  | "external-knowledge";

export interface DataSourceCategoryDescriptor {
  readonly id: string;
  readonly key: DataSourceCategoryKey;
  readonly name: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeCategoryDescriptor {
  readonly id: string;
  readonly key: KnowledgeCategoryKey;
  readonly name: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ConnectorTypeDescriptor {
  readonly id: string;
  readonly key: ConnectorTypeKey;
  readonly name: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ContentTypeDescriptor {
  readonly id: string;
  readonly key: ContentTypeKey;
  readonly name: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface MetadataTypeDescriptor {
  readonly id: string;
  readonly key: MetadataTypeKey;
  readonly name: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface SourceCategoryDescriptor {
  readonly id: string;
  readonly key: SourceCategoryKey;
  readonly name: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface RegistryMetadataDescriptor {
  readonly dataSourceCategories: readonly DataSourceCategoryDescriptor[];
  readonly knowledgeCategories: readonly KnowledgeCategoryDescriptor[];
  readonly connectorTypes: readonly ConnectorTypeDescriptor[];
  readonly contentTypes: readonly ContentTypeDescriptor[];
  readonly metadataTypes: readonly MetadataTypeDescriptor[];
  readonly sourceCategories: readonly SourceCategoryDescriptor[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface RegistryContractsDescriptor {
  readonly responsibilities: readonly string[];
  readonly extensionPoints: readonly string[];
  readonly allowedDependencies: readonly string[];
  readonly forbiddenResponsibilities: readonly string[];
  readonly stability: RegistryStability;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface RegistryOwnershipDescriptor {
  readonly owns: readonly string[];
  readonly neverOwns: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface RegistryBoundariesDescriptor {
  readonly mustNeverPerform: readonly string[];
  readonly allowedDependencies: readonly string[];
  readonly forbiddenDependencies: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface RegistryIdentityDescriptor {
  readonly platformName: string;
  readonly namespace: string;
  readonly layerId: string;
  readonly phaseId: string;
  readonly version: string;
  readonly stability: RegistryStability;
  readonly dependsOn: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DataSourceKnowledgeRegistryFoundationDescriptor {
  readonly identity: RegistryIdentityDescriptor;
  readonly contracts: RegistryContractsDescriptor;
  readonly ownership: RegistryOwnershipDescriptor;
  readonly boundaries: RegistryBoundariesDescriptor;
  readonly metadata: RegistryMetadataDescriptor;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface RegistrySummaryDescriptor {
  readonly platformName: string;
  readonly layerId: string;
  readonly phaseId: string;
  readonly version: string;
  readonly stability: RegistryStability;
  readonly dataSourceCategoryCount: number;
  readonly knowledgeCategoryCount: number;
  readonly connectorTypeCount: number;
  readonly contentTypeCount: number;
  readonly metadataTypeCount: number;
  readonly sourceCategoryCount: number;
  readonly ownedResponsibilityCount: number;
  readonly allowedDependencyCount: number;
  readonly forbiddenResponsibilityCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}
