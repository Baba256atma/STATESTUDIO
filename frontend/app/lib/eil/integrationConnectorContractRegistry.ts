/**
 * EIL-2:2 — Integration Connector Contract Registry.
 *
 * Canonical registry for the ten Foundation connector contracts.
 * References Foundation contract identities without redefining architecture.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-2:2.
 */

import {
  IntegrationConnectorFoundationId,
  IntegrationConnectorFoundationNamespace,
  IntegrationConnectorFoundationPlatform,
} from "./integrationConnectorFoundation.ts";
import type {
  IntegrationConnectorCompatibilityClassification,
  IntegrationConnectorContractRegistryEntry,
  IntegrationConnectorContractType,
} from "./integrationConnectorRegistryTypes.ts";

const foundation = IntegrationConnectorFoundationPlatform;

const contractTypeFor = (
  contractName: string,
): IntegrationConnectorContractType => {
  if (contractName === "ConnectorContract") return "Identity";
  if (contractName === "EndpointContract") return "Endpoint";
  if (contractName === "ProtocolContract") return "Protocol";
  if (
    contractName === "AuthenticationContract" ||
    contractName === "AuthorizationContract"
  ) {
    return "Security";
  }
  if (contractName === "PayloadContract") return "Payload";
  if (contractName === "MappingContract") return "Mapping";
  if (contractName === "CompatibilityContract") return "Compatibility";
  if (contractName === "ConfigurationContract") return "Configuration";
  return "Lifecycle";
};

const compatibilityFor = (
  contractName: string,
): IntegrationConnectorCompatibilityClassification => {
  if (contractName === "CompatibilityContract") return "Compatibility";
  if (contractName === "ProtocolContract") return "Protocol";
  if (
    contractName === "AuthenticationContract" ||
    contractName === "AuthorizationContract"
  ) {
    return "Security";
  }
  if (
    contractName === "PayloadContract" ||
    contractName === "MappingContract"
  ) {
    return "Payload";
  }
  if (contractName === "ConfigurationContract") return "Configuration";
  if (contractName === "LifecycleContract") return "Lifecycle";
  return "Canonical";
};

/**
 * Exactly ten contract registry entries preserving Foundation order.
 */
export const IntegrationConnectorContractRegistry: readonly IntegrationConnectorContractRegistryEntry[] =
  Object.freeze(
    foundation.contracts.map((contract) =>
      Object.freeze({
        id: `EIL-2:2/Registry/Contract/${contract.contractName}` as const,
        key: contract.contractName,
        contractKey: contract.contractName,
        canonicalName: contract.canonicalName,
        category: "Contract" as const,
        description: contract.description,
        contractType: contractTypeFor(contract.contractName),
        sourcePhase: "EIL-2:1/IntegrationConnectorFoundation" as const,
        sourceNamespace: IntegrationConnectorFoundationNamespace,
        ownership: "EIL-2:2" as const,
        status: "Registered" as const,
        lifecycleState: "Verified",
        compatibilityClassification: compatibilityFor(contract.contractName),
        ordinal: contract.deterministicOrder,
        tags: Object.freeze(["contract", "foundation-reference"]),
        sourceReference: `${IntegrationConnectorFoundationId}/contracts/${contract.contractName}`,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );

/** Frozen contract-registry catalog with derived count. */
export const IntegrationConnectorContractRegistryCatalog = Object.freeze({
  collectionId: "EIL-2:2/Collection/Contracts",
  category: "Contract" as const,
  sourcePhase: "EIL-2:2" as const,
  entries: IntegrationConnectorContractRegistry,
  entryCount: IntegrationConnectorContractRegistry.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
