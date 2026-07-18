/**
 * DKL-1:5 — Data Knowledge Foundation Manifest.
 *
 * Metadata-only type definitions for the canonical DKL Foundation manifest.
 * These types describe an aggregate architectural inventory derived exclusively
 * from the public metadata of DKL-1:1 through DKL-1:4. No runtime behavior.
 */

export type DataKnowledgePhaseId = "DKL-1:1" | "DKL-1:2" | "DKL-1:3" | "DKL-1:4";

// ---------------------------------------------------------------------------
// Phase manifest
// ---------------------------------------------------------------------------

export interface PhaseManifestEntry {
  readonly id: DataKnowledgePhaseId;
  readonly name: string;
  readonly version: string;
  readonly namespace: string;
  readonly status: string;
  readonly stability: string;
  readonly readiness: string;
  readonly publicApiCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DataKnowledgePhaseManifestDescriptor {
  readonly phases: readonly PhaseManifestEntry[];
  readonly phaseCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

// ---------------------------------------------------------------------------
// Inventory manifest
// ---------------------------------------------------------------------------

export interface DataKnowledgeInventoryManifestDescriptor {
  readonly publicApis: Readonly<{
    foundation: number;
    registry: number;
    model: number;
    validation: number;
    total: number;
  }>;
  readonly models: Readonly<{
    names: readonly string[];
    registeredModelCount: number;
    businessObjectTypeCount: number;
    relationshipTypeCount: number;
    metadataFieldCount: number;
  }>;
  readonly registry: Readonly<{
    components: number;
    contracts: number;
    publicApis: number;
    capabilities: number;
  }>;
  readonly validation: Readonly<{
    domains: number;
    rules: number;
    status: string;
    manifestId: string;
  }>;
  readonly ownership: Readonly<{
    owned: readonly string[];
    nonOwned: readonly string[];
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}

// ---------------------------------------------------------------------------
// Dependency manifest
// ---------------------------------------------------------------------------

export interface DataKnowledgeDependencyManifestDescriptor {
  readonly allowed: readonly string[];
  readonly future: readonly string[];
  readonly forbidden: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

// ---------------------------------------------------------------------------
// Compatibility manifest
// ---------------------------------------------------------------------------

export interface DataKnowledgeCompatibilityManifestDescriptor {
  readonly compatibleWith: Readonly<{
    foundation: true;
    registry: true;
    model: true;
    validation: true;
  }>;
  readonly guarantees: Readonly<{
    metadataOnly: true;
    runtimeFree: true;
    deepFrozen: true;
    deterministic: true;
    publicApiStable: true;
    ownershipProtected: true;
    dependencyProtected: true;
  }>;
  readonly metadataOnly: true;
  readonly immutable: true;
}

// ---------------------------------------------------------------------------
// Release + metadata + aggregate + summary
// ---------------------------------------------------------------------------

export interface DataKnowledgeManifestReleaseDescriptor {
  readonly manifestId: "DKL-1:5";
  readonly name: "Data Knowledge Foundation Manifest";
  readonly namespace: "nexora.dkl.foundation.manifest";
  readonly version: "1.0.0";
  readonly buildStatus: "CERTIFIED";
  readonly stability: "STABLE";
  readonly certification: "CERTIFIED";
  readonly readiness: "ReadyForPlatform";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DataKnowledgeManifestMetadataDescriptor {
  readonly manifestId: "DKL-1:5";
  readonly sourcePhases: readonly DataKnowledgePhaseId[];
  readonly authoritative: true;
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly deterministic: true;
  readonly immutable: true;
}

export interface DataKnowledgeFoundationManifestDescriptor {
  readonly foundation: PhaseManifestEntry;
  readonly registry: PhaseManifestEntry;
  readonly model: PhaseManifestEntry;
  readonly validation: PhaseManifestEntry;
  readonly phases: DataKnowledgePhaseManifestDescriptor;
  readonly inventory: DataKnowledgeInventoryManifestDescriptor;
  readonly dependencies: DataKnowledgeDependencyManifestDescriptor;
  readonly compatibility: DataKnowledgeCompatibilityManifestDescriptor;
  readonly release: DataKnowledgeManifestReleaseDescriptor;
  readonly metadata: DataKnowledgeManifestMetadataDescriptor;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface DataKnowledgeFoundationManifestSummary {
  readonly manifestId: "DKL-1:5";
  readonly version: "1.0.0";
  readonly totalPhases: number;
  readonly totalPublicApis: number;
  readonly totalModels: number;
  readonly totalRegistryComponents: number;
  readonly totalValidationRules: number;
  readonly certification: "CERTIFIED";
  readonly readiness: "ReadyForPlatform";
  readonly metadataOnly: true;
  readonly immutable: true;
}
