/**
 * DKL-6:1 — Knowledge Repository Foundation Types.
 *
 * Readonly contracts for the canonical Knowledge Repository Foundation.
 * Metadata only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-6:1.
 */

export type RepositoryLifecycleState =
  | "Created"
  | "Validated"
  | "Stored"
  | "Versioned"
  | "Retrieved"
  | "Archived"
  | "Frozen";

export type RepositoryCapabilityId =
  | "RepositoryIdentity"
  | "RepositoryVersioning"
  | "SnapshotSupport"
  | "ArchiveSupport"
  | "HistorySupport"
  | "MetadataManagement"
  | "RetrievalContract"
  | "RepositoryPolicies"
  | "LifecycleManagement";

export type RepositoryPolicyKind =
  | "VersionPolicy"
  | "SnapshotPolicy"
  | "ArchivePolicy"
  | "RetentionPolicy"
  | "MetadataPolicy"
  | "IdentityPolicy";

export interface KnowledgeRepositoryFoundationIdentityDescriptor {
  readonly foundationId: "DKL-6:1/KnowledgeRepositoryFoundation";
  readonly foundationName: "Knowledge Repository Foundation";
  readonly foundationVersion: string;
  readonly foundationNamespace: "nexora.dkl.repository.foundation";
  readonly phase: "DKL-6:1";
  readonly owner: string;
  readonly architectureType: "KnowledgeRepository";
  readonly status: "Foundation";
  readonly readiness: "ReadyForRegistry";
  readonly metadataOnly: true;
  readonly runtimeBehavior: false;
  readonly persistenceImplementation: false;
  readonly immutable: true;
}

export interface RepositoryCapabilityDescriptor {
  readonly capabilityId: RepositoryCapabilityId;
  readonly name: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly implemented: false;
}

export interface RepositoryContractDescriptor {
  readonly contractId: string;
  readonly contractName: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface RepositoryPolicyDescriptor {
  readonly policyId: string;
  readonly kind: RepositoryPolicyKind;
  readonly name: string;
  readonly description: string;
  readonly status: "Declared";
  readonly metadataOnly: true;
  readonly executable: false;
}

export interface FoundationSummaryDescriptor {
  readonly foundationId: "DKL-6:1/KnowledgeRepositoryFoundation";
  readonly version: string;
  readonly namespace: "nexora.dkl.repository.foundation";
  readonly status: "Foundation";
  readonly readiness: "ReadyForRegistry";
  readonly capabilityCount: number;
  readonly contractCount: number;
  readonly lifecycleStateCount: number;
  readonly policyCount: number;
  readonly ownsCount: number;
  readonly doesNotOwnCount: number;
  readonly upstreamPublicIndexId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
