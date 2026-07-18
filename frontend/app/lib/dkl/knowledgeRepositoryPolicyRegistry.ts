/**
 * DKL-6:2 — Knowledge Repository Policy Registry.
 *
 * Retention policy types and Foundation-aligned capability, contract,
 * lifecycle, and policy registrations. References DKL-6:1 public surface only.
 *
 * Ownership: owned exclusively by DKL-6:2.
 */

import {
  KnowledgeRepositoryFoundation,
  KnowledgeRepositoryFoundationId,
} from "./knowledgeRepositoryFoundation.ts";
import type {
  KnowledgeRepositoryFoundationAlignedEntry,
  KnowledgeRepositoryRegistryEntry,
} from "./knowledgeRepositoryRegistryTypes.ts";

const entry = (
  id: string,
  name: string,
  group: KnowledgeRepositoryRegistryEntry["group"],
  description: string,
  deterministicOrder: number,
): KnowledgeRepositoryRegistryEntry =>
  Object.freeze({
    id,
    name,
    group,
    description,
    owner: "DKL-6" as const,
    status: "Registered" as const,
    runtimeBehavior: "None" as const,
    deterministicOrder,
  });

const aligned = (
  id: string,
  name: string,
  group: KnowledgeRepositoryFoundationAlignedEntry["group"],
  description: string,
  foundationReference: string,
  deterministicOrder: number,
): KnowledgeRepositoryFoundationAlignedEntry =>
  Object.freeze({
    id,
    name,
    group,
    description,
    owner: "DKL-6" as const,
    status: "Registered" as const,
    runtimeBehavior: "None" as const,
    foundationReference,
    deterministicOrder,
  });

/** Exact retention policy type vocabulary — no duration or deletion logic. */
export const KnowledgeRepositoryRetentionPolicyEntries: readonly KnowledgeRepositoryRegistryEntry[] =
  Object.freeze([
    entry(
      "DKL-6:2/RetentionPolicyType/TemporaryRetention",
      "TemporaryRetention",
      "RetentionPolicyType",
      "Logical retention policy type for temporary repository retention.",
      1,
    ),
    entry(
      "DKL-6:2/RetentionPolicyType/OperationalRetention",
      "OperationalRetention",
      "RetentionPolicyType",
      "Logical retention policy type for operational repository retention.",
      2,
    ),
    entry(
      "DKL-6:2/RetentionPolicyType/HistoricalRetention",
      "HistoricalRetention",
      "RetentionPolicyType",
      "Logical retention policy type for historical repository retention.",
      3,
    ),
    entry(
      "DKL-6:2/RetentionPolicyType/LegalRetention",
      "LegalRetention",
      "RetentionPolicyType",
      "Logical retention policy type for legal repository retention.",
      4,
    ),
    entry(
      "DKL-6:2/RetentionPolicyType/PermanentRetention",
      "PermanentRetention",
      "RetentionPolicyType",
      "Logical retention policy type for permanent repository retention.",
      5,
    ),
    entry(
      "DKL-6:2/RetentionPolicyType/FrozenRetention",
      "FrozenRetention",
      "RetentionPolicyType",
      "Logical retention policy type for frozen repository retention.",
      6,
    ),
  ]);

/** Foundation capabilities registered by canonical reference. */
export const KnowledgeRepositoryCapabilityEntries: readonly KnowledgeRepositoryFoundationAlignedEntry[] =
  Object.freeze(
    KnowledgeRepositoryFoundation.contracts.capabilities.map((capability, index) =>
      aligned(
        `DKL-6:2/Capability/${capability.capabilityId}`,
        capability.name,
        "Capability",
        capability.description,
        `${KnowledgeRepositoryFoundationId}#${capability.capabilityId}`,
        index + 1,
      ),
    ),
  );

/** Foundation contracts registered by canonical reference. */
export const KnowledgeRepositoryContractEntries: readonly KnowledgeRepositoryFoundationAlignedEntry[] =
  Object.freeze(
    KnowledgeRepositoryFoundation.contracts.contracts.map((contract, index) =>
      aligned(
        `DKL-6:2/Contract/${contract.contractId}`,
        contract.contractName,
        "Contract",
        contract.description,
        contract.contractId,
        index + 1,
      ),
    ),
  );

/** Foundation lifecycle states registered by canonical reference. */
export const KnowledgeRepositoryLifecycleEntries: readonly KnowledgeRepositoryFoundationAlignedEntry[] =
  Object.freeze(
    KnowledgeRepositoryFoundation.lifecycle.states.map((state, index) =>
      aligned(
        `DKL-6:2/LifecycleState/${state}`,
        state,
        "LifecycleState",
        `Foundation lifecycle state declaration for ${state}.`,
        `${KnowledgeRepositoryFoundationId}#lifecycle.${state}`,
        index + 1,
      ),
    ),
  );

/** Foundation policies registered by canonical reference. */
export const KnowledgeRepositoryPolicyEntries: readonly KnowledgeRepositoryFoundationAlignedEntry[] =
  Object.freeze(
    KnowledgeRepositoryFoundation.policies.policies.map((policy, index) =>
      aligned(
        `DKL-6:2/Policy/${policy.kind}`,
        policy.name,
        "Policy",
        policy.description,
        policy.policyId,
        index + 1,
      ),
    ),
  );
