/**
 * DKL-7:2 — Knowledge Services Contract Registry.
 *
 * Registers all approved DKL-7:1 contracts by canonical reference.
 * No executable contract methods.
 *
 * Ownership: owned exclusively by DKL-7:2.
 */

import {
  KnowledgeServicesFoundation,
  KnowledgeServicesFoundationId,
} from "./knowledgeServicesFoundation.ts";
import type { KnowledgeServiceContractRegistration } from "./knowledgeServicesRegistryTypes.ts";

/** Foundation contracts registered by canonical reference. */
export const KnowledgeServiceContractRegistrations: readonly KnowledgeServiceContractRegistration[] =
  Object.freeze(
    KnowledgeServicesFoundation.contracts.contracts.map((contract, index) =>
      Object.freeze({
        id: `DKL-7:2/Contract/${contract.contractId.split("/").pop()}`,
        name: contract.contractName,
        category: "contract" as const,
        description: contract.description,
        owner: "DKL-7" as const,
        status: "Registered" as const,
        runtimeBehavior: "None" as const,
        metadataOnly: true as const,
        deterministicOrder: index + 1,
        contractId: contract.contractId,
        foundationReference: contract.contractId,
        readOnly: true as const,
        fieldCount: contract.fields.length,
      }),
    ),
  );

/** Canonical immutable contract registry. */
export const KnowledgeServicesContractRegistry = Object.freeze({
  registryId: "DKL-7:2/KnowledgeServicesContractRegistry",
  sourcePhase: "DKL-7:2" as const,
  foundationId: KnowledgeServicesFoundationId,
  contracts: KnowledgeServiceContractRegistrations,
  contractCount: KnowledgeServiceContractRegistrations.length,
  foundationContractCount: KnowledgeServicesFoundation.contracts.contractCount,
  notes: Object.freeze({
    metadataOnly: true,
    preservesCanonicalIdentity: true,
    preservesReadOnlyOwnership: true,
    preservesFoundationReferences: true,
    noDuplicateContractIds: true,
    noExecutableMethods: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
