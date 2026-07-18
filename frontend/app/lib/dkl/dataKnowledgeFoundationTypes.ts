/**
 * DKL-1:1 — Data Knowledge Layer Foundation.
 *
 * Metadata-only public type definitions for the Nexora Data Knowledge Layer (DKL).
 * These types describe the *shape* of organizational knowledge metadata only.
 * They contain no runtime behavior, no methods, and no side effects.
 */

// ---------------------------------------------------------------------------
// Dependency vocabulary
// ---------------------------------------------------------------------------

export type DataKnowledgeAllowedDependency = "CORE" | "CORE-TEN" | "BUS" | "OPS" | "NEA";

export type DataKnowledgeFutureDependency = "EXECUTIVE-ENGINE";

export type DataKnowledgeForbiddenDependency =
  | "UI"
  | "ADVISOR"
  | "SCENE"
  | "EXTERNAL-APIS"
  | "DATABASE-DRIVERS"
  | "HTTP-CLIENTS"
  | "AI-MODELS";

// ---------------------------------------------------------------------------
// Ownership vocabulary
// ---------------------------------------------------------------------------

export type DataKnowledgeOwnedResponsibility =
  | "business-objects"
  | "knowledge-objects"
  | "knowledge-relationships"
  | "knowledge-metadata"
  | "knowledge-identity";

export type DataKnowledgeNonOwnedResponsibility =
  | "communication"
  | "decision-logic"
  | "visual-components"
  | "user-sessions";

// ---------------------------------------------------------------------------
// Contract vocabulary
// ---------------------------------------------------------------------------

export type DataKnowledgeContractKind =
  | "knowledge-object"
  | "business-object"
  | "organizational-knowledge"
  | "knowledge-relationship"
  | "knowledge-metadata"
  | "knowledge-identity"
  | "knowledge-ownership";

// ---------------------------------------------------------------------------
// Public metadata-only knowledge types
// ---------------------------------------------------------------------------

/** Immutable identity metadata for any knowledge entity. */
export interface KnowledgeIdentity {
  readonly knowledgeId: string;
  readonly namespace: string;
  readonly kind: string;
  readonly version: string;
}

/** Ownership metadata describing who a knowledge entity belongs to. */
export interface KnowledgeOwner {
  readonly ownerId: string;
  readonly ownerType: string;
  readonly tenantId: string;
}

/** Descriptive metadata attached to a knowledge entity. */
export interface KnowledgeMetadata {
  readonly label: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly createdBy: string;
}

/** Metadata describing the origin of knowledge (always normalized upstream by NEA). */
export interface KnowledgeSource {
  readonly sourceId: string;
  readonly origin: string;
  readonly kind: string;
}

/** Metadata-only representation of a data knowledge object. */
export interface DataKnowledgeObject {
  readonly identity: KnowledgeIdentity;
  readonly owner: KnowledgeOwner;
  readonly metadata: KnowledgeMetadata;
  readonly source: KnowledgeSource;
}

/** Metadata-only representation of an organizational business object. */
export interface BusinessObject {
  readonly identity: KnowledgeIdentity;
  readonly owner: KnowledgeOwner;
  readonly metadata: KnowledgeMetadata;
  readonly domain: string;
}

/** Metadata-only representation of a relationship between knowledge entities. */
export interface KnowledgeRelationship {
  readonly relationshipId: string;
  readonly fromKnowledgeId: string;
  readonly toKnowledgeId: string;
  readonly relationType: string;
  readonly metadata: KnowledgeMetadata;
}

// ---------------------------------------------------------------------------
// Foundation descriptor interfaces
// ---------------------------------------------------------------------------

export interface DataKnowledgeIdentityDescriptor {
  readonly platformName: "Nexora Data Knowledge Layer";
  readonly namespace: "nexora.dkl.foundation";
  readonly layerId: "DKL";
  readonly phaseId: "DKL-1:1";
  readonly version: "1.0.0";
  readonly stability: "Stable";
  readonly releaseStatus: "Certified";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface DataKnowledgeDependencyDescriptor {
  readonly allowed: readonly DataKnowledgeAllowedDependency[];
  readonly future: readonly DataKnowledgeFutureDependency[];
  readonly forbidden: readonly DataKnowledgeForbiddenDependency[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DataKnowledgeOwnershipDescriptor {
  readonly owns: readonly DataKnowledgeOwnedResponsibility[];
  readonly neverOwns: readonly DataKnowledgeNonOwnedResponsibility[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DataKnowledgeContractDescriptor {
  readonly id: string;
  readonly name: string;
  readonly kind: DataKnowledgeContractKind;
  readonly description: string;
  readonly status: "Defined";
  readonly stability: "Stable";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DataKnowledgeExtensionPolicyDescriptor {
  readonly policy: "additive-only";
  readonly allowsNewKnowledgeTypes: true;
  readonly allowsRuntimeBehavior: false;
  readonly requiresBackwardCompatibility: true;
}

export interface DataKnowledgeContractsDescriptor {
  readonly contracts: readonly DataKnowledgeContractDescriptor[];
  readonly responsibilities: readonly string[];
  readonly boundaries: readonly string[];
  readonly extensionPolicy: DataKnowledgeExtensionPolicyDescriptor;
  readonly stability: "Stable";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DataKnowledgeMetadataDescriptor {
  readonly purpose: string;
  readonly architecturalRole: "OrganizationalKnowledgePlatform";
  readonly position: Readonly<{ upstream: "NEA"; downstream: "Executive Engine" }>;
  readonly publicApiSurface: readonly string[];
  readonly foundationStatus: "Certified";
  readonly releaseMetadata: Readonly<{ phase: "DKL-1:1"; stage: "Stable"; nextPhase: "DKL-1:2" }>;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface DataKnowledgeFoundationDescriptor {
  readonly identity: DataKnowledgeIdentityDescriptor;
  readonly ownership: DataKnowledgeOwnershipDescriptor;
  readonly dependencies: DataKnowledgeDependencyDescriptor;
  readonly contracts: DataKnowledgeContractsDescriptor;
  readonly boundaries: readonly string[];
  readonly metadata: DataKnowledgeMetadataDescriptor;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface DataKnowledgeFoundationSummary {
  readonly platformName: "Nexora Data Knowledge Layer";
  readonly layerId: "DKL";
  readonly phaseId: "DKL-1:1";
  readonly version: "1.0.0";
  readonly stability: "Stable";
  readonly releaseStatus: "Certified";
  readonly ownedResponsibilityCount: number;
  readonly allowedDependencyCount: number;
  readonly forbiddenDependencyCount: number;
  readonly contractCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}
