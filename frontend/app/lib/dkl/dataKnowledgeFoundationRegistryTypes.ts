/**
 * DKL-1:2 — Data Knowledge Foundation Registry.
 *
 * Metadata-only type definitions for the DKL Foundation Registry platform.
 * The registry publishes certified architectural metadata about the DKL-1:1
 * Foundation. It contains no runtime behavior, no I/O, and no side effects.
 */

import type {
  DataKnowledgeContractKind,
  DataKnowledgeDependencyDescriptor,
  DataKnowledgeIdentityDescriptor,
  DataKnowledgeOwnershipDescriptor,
} from "./dataKnowledgeFoundationTypes.ts";

// ---------------------------------------------------------------------------
// Component registry
// ---------------------------------------------------------------------------

export type DataKnowledgeComponentKind =
  | "identity"
  | "ownership"
  | "dependencies"
  | "contracts"
  | "foundation-object";

export interface DataKnowledgeComponentDescriptor {
  readonly id: string;
  readonly name: string;
  readonly kind: DataKnowledgeComponentKind;
  readonly description: string;
  readonly publicApi: string;
  readonly stability: "Stable";
  readonly metadataOnly: true;
  readonly immutable: true;
}

// ---------------------------------------------------------------------------
// Contract registry
// ---------------------------------------------------------------------------

export interface DataKnowledgeContractRegistryEntry {
  readonly id: string;
  readonly name: string;
  readonly kind: DataKnowledgeContractKind;
  readonly description: string;
  readonly stability: "Stable";
  readonly metadataOnly: true;
  readonly immutable: true;
}

// ---------------------------------------------------------------------------
// Public API registry
// ---------------------------------------------------------------------------

export type DataKnowledgePublicApiKind = "value" | "function";

export type DataKnowledgePublicApiCategory = "object" | "collection" | "accessor";

export interface DataKnowledgePublicApiDescriptor {
  readonly id: string;
  readonly name: string;
  readonly kind: DataKnowledgePublicApiKind;
  readonly category: DataKnowledgePublicApiCategory;
  readonly phase: "DKL-1:1";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

// ---------------------------------------------------------------------------
// Architectural capabilities (declarations only)
// ---------------------------------------------------------------------------

export type DataKnowledgeCapabilityKey =
  | "knowledge-modeling"
  | "business-object-ownership"
  | "knowledge-metadata"
  | "relationship-modeling"
  | "organizational-knowledge";

export interface DataKnowledgeCapabilityDescriptor {
  readonly id: string;
  readonly key: DataKnowledgeCapabilityKey;
  readonly name: string;
  readonly description: string;
  readonly declarationOnly: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

// ---------------------------------------------------------------------------
// Manifest
// ---------------------------------------------------------------------------

export interface DataKnowledgeRegistryManifestDescriptor {
  readonly registryVersion: "1.0.0";
  readonly registryNamespace: "nexora.dkl.foundation.registry";
  readonly registryId: "DKL-1:2";
  readonly categories: readonly string[];
  readonly registeredComponentCount: number;
  readonly publicApiInventory: readonly string[];
  readonly foundationCompatibility: Readonly<{
    phase: "DKL-1:1";
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
// Registry platform + summary
// ---------------------------------------------------------------------------

export interface DataKnowledgeFoundationRegistryDescriptor {
  readonly components: readonly DataKnowledgeComponentDescriptor[];
  readonly contracts: readonly DataKnowledgeContractRegistryEntry[];
  readonly publicApis: readonly DataKnowledgePublicApiDescriptor[];
  readonly capabilities: readonly DataKnowledgeCapabilityDescriptor[];
  readonly dependencies: DataKnowledgeDependencyDescriptor;
  readonly ownership: DataKnowledgeOwnershipDescriptor;
  readonly identity: DataKnowledgeIdentityDescriptor;
  readonly manifest: DataKnowledgeRegistryManifestDescriptor;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface DataKnowledgeFoundationRegistrySummary {
  readonly registryId: "DKL-1:2";
  readonly registryVersion: "1.0.0";
  readonly componentCount: number;
  readonly contractCount: number;
  readonly publicApiCount: number;
  readonly capabilityCount: number;
  readonly foundationPhase: "DKL-1:1";
  readonly certificationStatus: "Certified";
  readonly stability: "Stable";
  readonly metadataOnly: true;
  readonly immutable: true;
}
