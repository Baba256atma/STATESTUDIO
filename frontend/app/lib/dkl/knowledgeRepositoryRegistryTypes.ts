/**
 * DKL-6:2 — Knowledge Repository Registry Types.
 *
 * Readonly contracts for the canonical Knowledge Repository Registry.
 * Declaration metadata only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-6:2.
 */

export type KnowledgeRepositoryRegistryGroup =
  | "RepositoryType"
  | "RepositoryComponent"
  | "KnowledgeRecordType"
  | "VersionType"
  | "SnapshotType"
  | "HistoryEventType"
  | "ArchiveState"
  | "RetentionPolicyType"
  | "IndexDeclarationType"
  | "RetrievalDeclarationType"
  | "Capability"
  | "Contract"
  | "LifecycleState"
  | "Policy";

/** Canonical registry entry contract. Metadata only. */
export type KnowledgeRepositoryRegistryEntry = Readonly<{
  id: string;
  name: string;
  group: KnowledgeRepositoryRegistryGroup;
  description: string;
  owner: "DKL-6";
  status: "Registered";
  runtimeBehavior: "None";
  deterministicOrder: number;
}>;

export type KnowledgeRepositoryComponentEntry = KnowledgeRepositoryRegistryEntry &
  Readonly<{
    group: "RepositoryComponent";
    category: string;
    responsibility: string;
  }>;

export type KnowledgeRepositoryFoundationAlignedEntry =
  KnowledgeRepositoryRegistryEntry &
    Readonly<{
      foundationReference: string;
    }>;

export interface KnowledgeRepositoryRegistryIdentityDescriptor {
  readonly registryId: "DKL-6:2/KnowledgeRepositoryRegistry";
  readonly registryName: "Knowledge Repository Registry";
  readonly registryVersion: string;
  readonly registryNamespace: "nexora.dkl.repository.registry";
  readonly phase: "DKL-6:2";
  readonly owner: "DKL-6";
  readonly status: "Registered";
  readonly readiness: "ReadyForDKL6Model";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeRepositoryRegistrySummaryDescriptor {
  readonly registryId: "DKL-6:2/KnowledgeRepositoryRegistry";
  readonly version: string;
  readonly namespace: "nexora.dkl.repository.registry";
  readonly status: "Registered";
  readonly foundationDependencyId: string;
  readonly foundationDependencyVersion: string;
  readonly registryGroupCount: number;
  readonly totalEntryCount: number;
  readonly repositoryTypeCount: number;
  readonly componentCount: number;
  readonly knowledgeRecordTypeCount: number;
  readonly versionTypeCount: number;
  readonly snapshotTypeCount: number;
  readonly historyEventTypeCount: number;
  readonly archiveStateCount: number;
  readonly retentionPolicyCount: number;
  readonly indexDeclarationCount: number;
  readonly retrievalDeclarationCount: number;
  readonly capabilityCount: number;
  readonly contractCount: number;
  readonly lifecycleCount: number;
  readonly policyCount: number;
  readonly readiness: "ReadyForDKL6Model";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
