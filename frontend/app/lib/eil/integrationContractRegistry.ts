/**
 * EIL-1:2 — Integration Contract Registry.
 *
 * Canonical registry for the ten Foundation contracts.
 * References Foundation contract identities without redefining architecture.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-1:2.
 */

import {
  IntegrationFoundationId,
  IntegrationFoundationNamespace,
  IntegrationFoundationPlatform,
} from "./integrationFoundation.ts";
import type {
  IntegrationCompatibilityClassification,
  IntegrationContractRegistryEntry,
} from "./integrationRegistryTypes.ts";

const foundation = IntegrationFoundationPlatform;

const compatibilityFor = (
  contractName: string,
): IntegrationCompatibilityClassification => {
  if (contractName === "CompatibilityContract") return "Compatibility";
  if (contractName === "RoutingContract") return "Routing";
  if (contractName === "CoordinationContract") return "Coordination";
  if (
    contractName === "IntegrationContract" ||
    contractName === "PlatformContract"
  ) {
    return "Canonical";
  }
  return "Interoperability";
};

/**
 * Exactly ten contract registry entries preserving Foundation order.
 */
export const IntegrationContractRegistry: readonly IntegrationContractRegistryEntry[] =
  Object.freeze(
    foundation.contracts.map((contract) =>
      Object.freeze({
        id: `EIL-1:2/Registry/Contract/${contract.contractName}` as const,
        key: contract.contractName,
        contractKey: contract.contractName,
        canonicalName: contract.canonicalName,
        category: "Contract" as const,
        description: contract.description,
        architecturalPurpose: contract.description,
        sourcePhase: "EIL-1:1/IntegrationFoundation" as const,
        sourceNamespace: IntegrationFoundationNamespace,
        ownership: "EIL-1:2" as const,
        status: "Registered" as const,
        lifecycleState: "Verified",
        compatibilityClassification: compatibilityFor(contract.contractName),
        ordinal: contract.deterministicOrder,
        aliases: Object.freeze([contract.contractName, contract.canonicalName]),
        tags: Object.freeze(["contract", "foundation-reference"]),
        sourceReference: `${IntegrationFoundationId}/contracts/${contract.contractName}`,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );

/** Frozen contract-registry catalog with derived count. */
export const IntegrationContractRegistryCatalog = Object.freeze({
  collectionId: "EIL-1:2/Collection/Contracts",
  category: "Contract" as const,
  sourcePhase: "EIL-1:2" as const,
  entries: IntegrationContractRegistry,
  entryCount: IntegrationContractRegistry.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
