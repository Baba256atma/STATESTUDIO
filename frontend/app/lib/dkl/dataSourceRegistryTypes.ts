/**
 * DKL-2:2 — Data Source & Knowledge Registry Types.
 *
 * Readonly, metadata-only type contracts and deterministic identifier helpers
 * for the DKL-2:2 registry platform. All category key unions are derived from
 * the DKL-2:1 public foundation metadata (never from internal DKL-2:1 files).
 *
 * Responsibility: registry identity/entry type contracts and id builders.
 * Ownership: owned exclusively by DKL-2:2.
 * Dependency rules: depends only on the DKL-2:1 public foundation API.
 * Architectural purpose: shared immutable shapes for every registry. No runtime
 * behavior, no side effects.
 */

import { DataSourceKnowledgeRegistryMetadata } from "./dataSourceKnowledgeRegistryFoundation.ts";

export type DataSourceCategoryKey =
  (typeof DataSourceKnowledgeRegistryMetadata.dataSourceCategories)[number]["key"];

export type KnowledgeCategoryKey =
  (typeof DataSourceKnowledgeRegistryMetadata.knowledgeCategories)[number]["key"];

export type RegistryEntryKind =
  | "DataSource"
  | "KnowledgeType"
  | "ConnectorType"
  | "ContentType"
  | "MetadataType"
  | "SourceGroup"
  | "CompatibilityRelationship";

export type RegistryStatus = "Draft" | "Active" | "Deprecated" | "Reserved";

export type StructureClassification = "structured" | "semi-structured" | "unstructured";

export type CompatibilityType = "primary" | "secondary";

export type CompatibilityConfidence = "high" | "medium" | "low";

export type SourceGroupKey =
  | "operational-systems"
  | "analytical-systems"
  | "business-applications"
  | "documents-and-files"
  | "communication-channels"
  | "developer-interfaces"
  | "manual-sources"
  | "external-knowledge-sources";

export type ConnectorDefinitionKey =
  | "direct-database"
  | "file-upload"
  | "api"
  | "webhook"
  | "messaging"
  | "email-gateway"
  | "voice-gateway"
  | "sdk"
  | "manual-entry";

export type ContentDefinitionKey =
  | "tabular"
  | "document"
  | "message"
  | "audio-transcript"
  | "structured-payload"
  | "semi-structured-payload"
  | "binary-attachment"
  | "manual-record";

export interface RegistryEntryIdentity {
  readonly registryEntryId: string;
  readonly registryEntryVersion: string;
  readonly registryEntryName: string;
  readonly registryEntryDescription: string;
  readonly registryEntryKind: RegistryEntryKind;
  readonly category: string;
  readonly status: RegistryStatus;
  readonly lifecycle: RegistryStatus;
  readonly owner: string;
  readonly sourcePhase: string;
  readonly tags: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DataSourceRegistryEntry {
  readonly identity: RegistryEntryIdentity;
  readonly sourceCategory: DataSourceCategoryKey;
  readonly sourceGroupId: string;
  readonly supportedContentTypeIds: readonly string[];
  readonly supportedConnectorTypeIds: readonly string[];
  readonly classification: StructureClassification;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeTypeRegistryEntry {
  readonly identity: RegistryEntryIdentity;
  readonly knowledgeCategory: KnowledgeCategoryKey;
  readonly owningPlatform: string;
  readonly allowedSourceGroupIds: readonly string[];
  readonly supportedContentTypeIds: readonly string[];
  readonly relationshipCapability: Readonly<{
    canRelate: boolean;
    directional: boolean;
    symmetric: boolean;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ConnectorTypeRegistryEntry {
  readonly identity: RegistryEntryIdentity;
  readonly connectorKey: ConnectorDefinitionKey;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ContentTypeRegistryEntry {
  readonly identity: RegistryEntryIdentity;
  readonly contentKey: ContentDefinitionKey;
  readonly classification: StructureClassification;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface SourceGroupRegistryEntry {
  readonly identity: RegistryEntryIdentity;
  readonly groupKey: SourceGroupKey;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface CompatibilityRegistryEntry {
  readonly identity: RegistryEntryIdentity;
  readonly sourceCategoryId: string;
  readonly knowledgeCategoryId: string;
  readonly compatibilityType: CompatibilityType;
  readonly confidence: CompatibilityConfidence;
  readonly rationale: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DataSourceRegistryContainer {
  readonly kind: "DataSource";
  readonly entries: readonly DataSourceRegistryEntry[];
  readonly getById: (id: string) => DataSourceRegistryEntry | undefined;
}

export interface KnowledgeTypeRegistryContainer {
  readonly kind: "KnowledgeType";
  readonly entries: readonly KnowledgeTypeRegistryEntry[];
  readonly getById: (id: string) => KnowledgeTypeRegistryEntry | undefined;
}

export interface ConnectorTypeRegistryContainer {
  readonly kind: "ConnectorType";
  readonly entries: readonly ConnectorTypeRegistryEntry[];
  readonly getById: (id: string) => ConnectorTypeRegistryEntry | undefined;
}

export interface ContentTypeRegistryContainer {
  readonly kind: "ContentType";
  readonly entries: readonly ContentTypeRegistryEntry[];
  readonly getById: (id: string) => ContentTypeRegistryEntry | undefined;
}

export interface SourceGroupRegistryContainer {
  readonly kind: "SourceGroup";
  readonly entries: readonly SourceGroupRegistryEntry[];
  readonly getById: (id: string) => SourceGroupRegistryEntry | undefined;
}

export interface CompatibilityRegistryContainer {
  readonly kind: "CompatibilityRelationship";
  readonly entries: readonly CompatibilityRegistryEntry[];
  readonly getById: (id: string) => CompatibilityRegistryEntry | undefined;
  readonly getBySourceId: (sourceCategoryId: string) => readonly CompatibilityRegistryEntry[];
  readonly getByKnowledgeId: (knowledgeCategoryId: string) => readonly CompatibilityRegistryEntry[];
}

export interface RegistryManifestDescriptor {
  readonly platformId: string;
  readonly name: string;
  readonly namespace: string;
  readonly version: string;
  readonly sourcePhase: string;
  readonly dependency: string;
  readonly totalDataSourceEntries: number;
  readonly totalKnowledgeEntries: number;
  readonly totalConnectorEntries: number;
  readonly totalContentEntries: number;
  readonly totalSourceGroups: number;
  readonly totalCompatibilityRelationships: number;
  readonly entryCountsByKind: Readonly<Record<RegistryEntryKind, number>>;
  readonly entryCountsByStatus: Readonly<Record<RegistryStatus, number>>;
  readonly duplicateIdStatus: "none" | "detected";
  readonly completion: readonly string[];
  readonly readiness: "ReadyForModel";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface DataSourceKnowledgeRegistryPlatformDescriptor {
  readonly foundation: typeof DataSourceKnowledgeRegistryMetadata;
  readonly dataSources: DataSourceRegistryContainer;
  readonly knowledgeTypes: KnowledgeTypeRegistryContainer;
  readonly connectors: ConnectorTypeRegistryContainer;
  readonly contentTypes: ContentTypeRegistryContainer;
  readonly sourceGroups: SourceGroupRegistryContainer;
  readonly compatibility: CompatibilityRegistryContainer;
  readonly manifest: RegistryManifestDescriptor;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface RegistryIdentityInput {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly kind: RegistryEntryKind;
  readonly category: string;
  readonly owner: string;
  readonly tags: readonly string[];
  readonly status?: RegistryStatus;
}

/**
 * Build a frozen, deterministic registry identity. Version, source phase, and
 * status default to stable canonical values — no clock, randomness, or
 * generated identifiers are ever used.
 */
export const createRegistryIdentity = (input: RegistryIdentityInput): RegistryEntryIdentity =>
  Object.freeze({
    registryEntryId: input.id,
    registryEntryVersion: "1.0.0",
    registryEntryName: input.name,
    registryEntryDescription: input.description,
    registryEntryKind: input.kind,
    category: input.category,
    status: input.status ?? "Active",
    lifecycle: input.status ?? "Active",
    owner: input.owner,
    sourcePhase: "DKL-2:2",
    tags: Object.freeze([...input.tags]),
    metadataOnly: true,
    immutable: true,
  });

export const REGISTRY_OWNER = "DKL-2 Data Source & Knowledge Registry";

export const dataSourceId = (key: DataSourceCategoryKey): string => `dsk-datasource-${key}`;

export const knowledgeTypeId = (key: KnowledgeCategoryKey): string => `dsk-knowledgetype-${key}`;

export const connectorTypeId = (key: ConnectorDefinitionKey): string => `dsk-connector-type-${key}`;

export const contentTypeId = (key: ContentDefinitionKey): string => `dsk-content-type-${key}`;

export const sourceGroupId = (key: SourceGroupKey): string => `dsk-source-group-${key}`;

export const compatibilityId = (
  sourceKey: DataSourceCategoryKey,
  knowledgeKey: KnowledgeCategoryKey
): string => `dsk-compat-${sourceKey}-${knowledgeKey}`;
