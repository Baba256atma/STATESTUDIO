/**
 * DKL-2:3 — Data Source & Knowledge Registry Model Types.
 *
 * Readonly, metadata-only type contracts and deterministic identifier helpers
 * for the DKL-2:3 model platform. All classification unions are derived from the
 * DKL-2:2 public registry platform (never from internal DKL-2:2 files).
 *
 * Responsibility: shared immutable model shapes + id builders.
 * Ownership: owned exclusively by DKL-2:3.
 * Dependency rules: depends only on the DKL-2:2 public registry platform.
 * Architectural purpose: the canonical metadata model vocabulary. No runtime
 * behavior, no side effects.
 */

import {
  ConnectorTypeRegistry,
  DataSourceRegistry,
  SourceKnowledgeCompatibilityRegistry,
} from "./dataSourceKnowledgeRegistryPlatform.ts";

export type StructureClassification = (typeof DataSourceRegistry.entries)[number]["classification"];

export type ConnectorDefinitionKey = (typeof ConnectorTypeRegistry.entries)[number]["connectorKey"];

export type CompatibilityCategory =
  (typeof SourceKnowledgeCompatibilityRegistry.entries)[number]["compatibilityType"];

export type ArchitecturalConfidence =
  (typeof SourceKnowledgeCompatibilityRegistry.entries)[number]["confidence"];

export type ModelLifecycle = "Draft" | "Active" | "Deprecated" | "Reserved";

export type IdentityKind =
  | "RegistryIdentity"
  | "DataSourceIdentity"
  | "KnowledgeIdentity"
  | "ConnectorIdentity"
  | "ContentIdentity"
  | "SourceGroupIdentity"
  | "CompatibilityIdentity";

export type TransportStyle =
  | "connection"
  | "upload"
  | "request-response"
  | "push"
  | "stream"
  | "manual";

export type CommunicationDirection = "inbound" | "outbound" | "bidirectional";

export type AuthenticationCategory = "credentials" | "token" | "key" | "session" | "none";

export type PayloadStyle =
  | "tabular"
  | "document"
  | "message"
  | "structured"
  | "semi-structured"
  | "binary"
  | "manual";

export interface ModelIdentity {
  readonly id: string;
  readonly version: string;
  readonly name: string;
  readonly category: string;
  readonly owner: string;
  readonly lifecycle: ModelLifecycle;
  readonly status: ModelLifecycle;
  readonly tags: readonly string[];
  readonly sourcePhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface IdentityModel {
  readonly identity: ModelIdentity;
  readonly identityKind: IdentityKind;
  readonly requiredFields: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DataSourceModel {
  readonly identity: ModelIdentity;
  readonly registryEntryId: string;
  readonly sourceCategory: string;
  readonly structureClassification: StructureClassification;
  readonly sourceGroupId: string;
  readonly supportedConnectorCategoryIds: readonly string[];
  readonly supportedContentCategoryIds: readonly string[];
  readonly capabilities: readonly string[];
  readonly limitations: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeModel {
  readonly identity: ModelIdentity;
  readonly registryEntryId: string;
  readonly semanticCategory: string;
  readonly businessPurpose: string;
  readonly relationshipCapability: Readonly<{
    canRelate: boolean;
    directional: boolean;
    symmetric: boolean;
  }>;
  readonly supportedSourceGroupIds: readonly string[];
  readonly supportedContentCategoryIds: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ConnectorModel {
  readonly identity: ModelIdentity;
  readonly registryEntryId: string;
  readonly connectorCategory: string;
  readonly transportStyle: TransportStyle;
  readonly communicationDirection: CommunicationDirection;
  readonly authenticationCategory: AuthenticationCategory;
  readonly payloadStyle: PayloadStyle;
  readonly expectedContentCategoryIds: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface CompatibilityModel {
  readonly identity: ModelIdentity;
  readonly registryEntryId: string;
  readonly sourceCategoryId: string;
  readonly knowledgeCategoryId: string;
  readonly compatibilityCategory: CompatibilityCategory;
  readonly architecturalConfidence: ArchitecturalConfidence;
  readonly relationshipType: string;
  readonly rationale: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface IdentityModelsContainer {
  readonly kind: "IdentityModels";
  readonly models: readonly IdentityModel[];
  readonly getById: (id: string) => IdentityModel | undefined;
}

export interface DataSourceModelsContainer {
  readonly kind: "DataSourceModels";
  readonly models: readonly DataSourceModel[];
  readonly getById: (id: string) => DataSourceModel | undefined;
}

export interface KnowledgeModelsContainer {
  readonly kind: "KnowledgeModels";
  readonly models: readonly KnowledgeModel[];
  readonly getById: (id: string) => KnowledgeModel | undefined;
}

export interface ConnectorModelsContainer {
  readonly kind: "ConnectorModels";
  readonly models: readonly ConnectorModel[];
  readonly getById: (id: string) => ConnectorModel | undefined;
}

export interface CompatibilityModelsContainer {
  readonly kind: "CompatibilityModels";
  readonly models: readonly CompatibilityModel[];
  readonly getById: (id: string) => CompatibilityModel | undefined;
}

export interface ModelManifestDescriptor {
  readonly phaseId: string;
  readonly name: string;
  readonly namespace: string;
  readonly version: string;
  readonly dependency: readonly string[];
  readonly identityModelCount: number;
  readonly dataSourceModelCount: number;
  readonly knowledgeModelCount: number;
  readonly connectorModelCount: number;
  readonly compatibilityModelCount: number;
  readonly totalModels: number;
  readonly registryReferences: readonly string[];
  readonly owner: string;
  readonly duplicateIdStatus: "none" | "detected";
  readonly completion: readonly string[];
  readonly readiness: "ReadyForValidation";
  readonly deterministic: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ModelSummaryDescriptor {
  readonly phaseId: string;
  readonly version: string;
  readonly totalModels: number;
  readonly completion: readonly string[];
  readonly readiness: "ReadyForValidation";
  readonly metadataOnly: true;
  readonly deterministic: true;
  readonly immutable: true;
}

export interface DataSourceRegistryModelPlatformDescriptor {
  readonly identityModels: IdentityModelsContainer;
  readonly sourceModels: DataSourceModelsContainer;
  readonly knowledgeModels: KnowledgeModelsContainer;
  readonly connectorModels: ConnectorModelsContainer;
  readonly compatibilityModels: CompatibilityModelsContainer;
  readonly manifest: ModelManifestDescriptor;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface ModelIdentityInput {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly tags: readonly string[];
}

export const MODEL_OWNER = "DKL-2 Data Source & Knowledge Registry";

export const MODEL_VERSION = "1.0.0";

export const MODEL_SOURCE_PHASE = "DKL-2:3";

export const MODEL_IDENTITY_FIELDS: readonly string[] = Object.freeze([
  "id",
  "version",
  "name",
  "category",
  "owner",
  "lifecycle",
  "status",
  "tags",
  "sourcePhase",
]);

/**
 * Build a frozen, deterministic model identity. Version, source phase, lifecycle
 * and status default to stable canonical values — no clock, randomness, or
 * generated identifiers are ever used.
 */
export const createModelIdentity = (input: ModelIdentityInput): ModelIdentity =>
  Object.freeze({
    id: input.id,
    version: MODEL_VERSION,
    name: input.name,
    category: input.category,
    owner: MODEL_OWNER,
    lifecycle: "Active",
    status: "Active",
    tags: Object.freeze([...input.tags]),
    sourcePhase: MODEL_SOURCE_PHASE,
    metadataOnly: true,
    immutable: true,
  });

/** Deterministically derive a model id from a DKL-2:2 registry entry id. */
export const modelIdFor = (registryEntryId: string): string =>
  registryEntryId.replace(/^dsk-/, "dsk-model-");

export const identityModelId = (kind: IdentityKind): string => `dsk-model-identity-${kind}`;
