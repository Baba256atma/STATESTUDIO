/**
 * DKL-6:1 — Knowledge Repository Policies.
 *
 * Immutable policy concept declarations. No executable policy logic.
 *
 * Ownership: owned exclusively by DKL-6:1.
 */

import type { RepositoryPolicyDescriptor } from "./knowledgeRepositoryFoundationTypes.ts";

const policy = (
  policyId: string,
  kind: RepositoryPolicyDescriptor["kind"],
  name: string,
  description: string,
): RepositoryPolicyDescriptor =>
  Object.freeze({
    policyId,
    kind,
    name,
    description,
    status: "Declared" as const,
    metadataOnly: true as const,
    executable: false as const,
  });

export const KNOWLEDGE_REPOSITORY_POLICIES: readonly RepositoryPolicyDescriptor[] =
  Object.freeze([
    policy(
      "DKL-6:1/VersionPolicy",
      "VersionPolicy",
      "Version Policy",
      "Declares how repository versions are identified and superseded.",
    ),
    policy(
      "DKL-6:1/SnapshotPolicy",
      "SnapshotPolicy",
      "Snapshot Policy",
      "Declares when and how logical snapshots may be declared.",
    ),
    policy(
      "DKL-6:1/ArchivePolicy",
      "ArchivePolicy",
      "Archive Policy",
      "Declares archival eligibility and archive identity rules.",
    ),
    policy(
      "DKL-6:1/RetentionPolicy",
      "RetentionPolicy",
      "Retention Policy",
      "Declares logical retention expectations without storage enforcement.",
    ),
    policy(
      "DKL-6:1/MetadataPolicy",
      "MetadataPolicy",
      "Metadata Policy",
      "Declares required metadata fields and ownership of metadata surfaces.",
    ),
    policy(
      "DKL-6:1/IdentityPolicy",
      "IdentityPolicy",
      "Identity Policy",
      "Declares immutability and uniqueness rules for repository identity.",
    ),
  ]);

/** Canonical immutable Knowledge Repository policies. */
export const KnowledgeRepositoryPolicies = Object.freeze({
  policiesId: "DKL-6:1/KnowledgeRepositoryPolicies",
  sourcePhase: "DKL-6:1" as const,
  policies: KNOWLEDGE_REPOSITORY_POLICIES,
  policyCount: KNOWLEDGE_REPOSITORY_POLICIES.length,
  requiredKinds: Object.freeze([
    "VersionPolicy",
    "SnapshotPolicy",
    "ArchivePolicy",
    "RetentionPolicy",
    "MetadataPolicy",
    "IdentityPolicy",
  ] as const),
  notes: Object.freeze({
    metadataOnly: true,
    noExecutableLogic: true,
    noEnforcementRuntime: true,
    conceptsOnly: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
