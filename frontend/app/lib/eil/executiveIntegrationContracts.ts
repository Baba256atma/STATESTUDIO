/**
 * EIL-1:1 — Executive Integration Contracts.
 *
 * Immutable contract declarations for Executive Integration Foundation surfaces.
 * Declarations only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-1:1.
 */

import type { ExecutiveIntegrationContractDeclaration } from "./executiveIntegrationFoundationTypes.ts";

const contract = (
  key: string,
  contractName: string,
  description: string,
  fields: readonly string[],
  order: number,
): ExecutiveIntegrationContractDeclaration =>
  Object.freeze({
    contractId: `EIL-1:1/Contract/${key}`,
    contractName,
    description,
    fields: Object.freeze([...fields]),
    metadataOnly: true as const,
    immutable: true as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

/**
 * Exactly eight public integration contracts.
 * Order is deterministic and immutable.
 */
export const ExecutiveIntegrationContracts: readonly ExecutiveIntegrationContractDeclaration[] =
  Object.freeze([
    contract(
      "ExecutiveIntegrationPlatform",
      "Executive Integration Platform",
      "Canonical identity and Public Index binding for a certified Nexora platform.",
      Object.freeze([
        "platformId",
        "platformName",
        "publicIndexId",
        "publicIndexVersion",
        "publicIndexName",
        "publicIndexNamespace",
        "publicIndexModule",
        "certificationRequired",
        "integrationMode",
      ]),
      1,
    ),
    contract(
      "IntegrationNode",
      "Integration Node",
      "Declarative topology node referencing a certified platform Public Index.",
      Object.freeze([
        "nodeId",
        "platformId",
        "publicIndexId",
        "role",
        "discoversServices",
        "executesRuntime",
      ]),
      2,
    ),
    contract(
      "IntegrationRoute",
      "Integration Route",
      "Declarative coordination path between integration nodes without transport.",
      Object.freeze([
        "routeId",
        "sourceNodeId",
        "targetNodeId",
        "coordinationKind",
        "transportImplemented",
        "runtimeBehavior",
      ]),
      3,
    ),
    contract(
      "IntegrationRequest",
      "Integration Request",
      "Declarative request shape for cross-platform coordination metadata.",
      Object.freeze([
        "requestContractId",
        "sourcePlatformId",
        "targetPlatformId",
        "capabilityRef",
        "correlationRef",
        "payloadUnderstanding",
        "runtimeDispatch",
      ]),
      4,
    ),
    contract(
      "IntegrationResponse",
      "Integration Response",
      "Declarative response shape for cross-platform coordination metadata.",
      Object.freeze([
        "responseContractId",
        "requestContractId",
        "statusRef",
        "capabilityRef",
        "businessReasoning",
        "runtimeExecution",
      ]),
      5,
    ),
    contract(
      "IntegrationCapability",
      "Integration Capability",
      "Declarative capability bound to an EIL responsibility without inference.",
      Object.freeze([
        "capabilityId",
        "capabilityName",
        "responsibilityId",
        "ownedByEil",
        "performsInference",
        "performsDecision",
      ]),
      6,
    ),
    contract(
      "IntegrationIdentity",
      "Integration Identity",
      "Canonical foundation identity for the Executive Integration Layer.",
      Object.freeze([
        "foundationId",
        "foundationName",
        "foundationVersion",
        "foundationNamespace",
        "layer",
        "phase",
        "stage",
        "sourcePhase",
        "owner",
        "status",
        "readiness",
      ]),
      7,
    ),
    contract(
      "IntegrationMetadata",
      "Integration Metadata",
      "Canonical metadata envelope for foundation inventory and readiness.",
      Object.freeze([
        "metadataId",
        "foundationId",
        "namespace",
        "version",
        "status",
        "readiness",
        "platformCount",
        "contractCount",
        "responsibilityCount",
      ]),
      8,
    ),
  ]);

export const ExecutiveIntegrationContractNames = Object.freeze([
  "ExecutiveIntegrationPlatform",
  "IntegrationNode",
  "IntegrationRoute",
  "IntegrationRequest",
  "IntegrationResponse",
  "IntegrationCapability",
  "IntegrationIdentity",
  "IntegrationMetadata",
] as const);
