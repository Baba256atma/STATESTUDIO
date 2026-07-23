/**
 * EIL-3:2 — Integration Routing Contract Registry.
 *
 * Canonical registry for the ten Foundation routing contracts.
 * References Foundation contract identities without redefining architecture.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-3:2.
 */

import { IntegrationRoutingFoundationPlatform } from "./integrationRoutingFoundation.ts";
import type {
  RoutingCompatibilityClassification,
  RoutingContractRegistryEntry,
  RoutingContractType,
} from "./integrationRoutingRegistryTypes.ts";

const foundation = IntegrationRoutingFoundationPlatform;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.foundationNamespace;

const contractTypeFor = (contractName: string): RoutingContractType => {
  if (
    contractName === "RouteContract" ||
    contractName === "RouteIdentityContract"
  ) {
    return "Identity";
  }
  if (contractName === "RoutePathContract") return "Path";
  if (contractName === "RoutePolicyContract") return "Policy";
  if (contractName === "RouteConditionContract") return "Condition";
  if (contractName === "RoutePriorityContract") return "Priority";
  if (contractName === "RouteCompatibilityContract") return "Compatibility";
  if (contractName === "RouteConfigurationContract") return "Configuration";
  if (contractName === "RouteLifecycleContract") return "Lifecycle";
  return "Metadata";
};

const compatibilityFor = (
  contractName: string,
): RoutingCompatibilityClassification => {
  if (contractName === "RouteCompatibilityContract") return "Compatibility";
  if (contractName === "RouteIdentityContract") return "Identity";
  if (contractName === "RoutePathContract") return "Path";
  if (contractName === "RoutePolicyContract") return "Policy";
  if (contractName === "RouteConditionContract") return "Condition";
  if (contractName === "RoutePriorityContract") return "Priority";
  if (contractName === "RouteConfigurationContract") return "Configuration";
  if (contractName === "RouteLifecycleContract") return "Lifecycle";
  if (contractName === "RouteMetadataContract") return "Metadata";
  return "Canonical";
};

/**
 * Exactly ten contract registry entries preserving Foundation order.
 */
export const IntegrationRoutingContractRegistry: readonly RoutingContractRegistryEntry[] =
  Object.freeze(
    foundation.contracts.map((contract) =>
      Object.freeze({
        id: `EIL-3:2/Registry/Contract/${contract.contractName}` as const,
        key: contract.contractName,
        contractKey: contract.contractName,
        canonicalName: contract.canonicalName,
        category: "Contract" as const,
        description: contract.description,
        contractType: contractTypeFor(contract.contractName),
        sourcePhase: "EIL-3:1/IntegrationRoutingFoundation" as const,
        sourceNamespace: foundationNamespace,
        ownership: "EIL-3:2" as const,
        status: "Registered" as const,
        lifecycleState: "Verified",
        compatibilityClassification: compatibilityFor(contract.contractName),
        ordinal: contract.deterministicOrder,
        tags: Object.freeze(["contract", "foundation-reference"]),
        sourceReference: `${foundationId}/contracts/${contract.contractName}`,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );

/** Frozen contract-registry catalog with derived count. */
export const IntegrationRoutingContractRegistryCatalog = Object.freeze({
  collectionId: "EIL-3:2/Collection/Contracts",
  category: "Contract" as const,
  sourcePhase: "EIL-3:2" as const,
  entries: IntegrationRoutingContractRegistry,
  entryCount: IntegrationRoutingContractRegistry.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
