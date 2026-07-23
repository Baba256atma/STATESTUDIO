/**
 * EIL-2:1 — Integration Connector Foundation Contracts.
 *
 * Immutable contract declarations for Integration Connector Foundation surfaces.
 * Declarations only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-2:1.
 */

import type {
  IntegrationConnectorContract,
  IntegrationConnectorContractName,
} from "./integrationConnectorFoundationTypes.ts";

const contract = (
  contractName: IntegrationConnectorContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): IntegrationConnectorContract =>
  Object.freeze({
    contractId: `EIL-2:1/Contract/${contractName}` as const,
    contractName,
    canonicalName,
    description,
    fields: Object.freeze([...fields]),
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly ten public connector contracts.
 * Order is deterministic and immutable.
 */
export const IntegrationConnectorFoundationContracts: readonly IntegrationConnectorContract[] =
  Object.freeze([
    contract(
      "ConnectorContract",
      "Connector Contract",
      "Canonical metadata contract binding a connector identity to category and endpoint references.",
      Object.freeze([
        "connectorId",
        "connectorName",
        "categoryRef",
        "endpointRefs",
        "compatibilityRef",
        "metadataOnly",
      ]),
      1,
    ),
    contract(
      "EndpointContract",
      "Endpoint Contract",
      "Declarative endpoint description metadata without networking or transport.",
      Object.freeze([
        "endpointId",
        "endpointName",
        "direction",
        "protocolRef",
        "runtimeReachable",
      ]),
      2,
    ),
    contract(
      "ProtocolContract",
      "Protocol Contract",
      "Declarative protocol declaration metadata without protocol implementation.",
      Object.freeze([
        "protocolId",
        "protocolName",
        "protocolFamily",
        "implemented",
        "metadataOnly",
      ]),
      3,
    ),
    contract(
      "AuthenticationContract",
      "Authentication Contract",
      "Declarative authentication metadata without credential handling or auth logic.",
      Object.freeze([
        "authenticationId",
        "schemeRef",
        "credentialHandled",
        "runtimeAuth",
      ]),
      4,
    ),
    contract(
      "AuthorizationContract",
      "Authorization Contract",
      "Declarative authorization metadata without policy evaluation or access control runtime.",
      Object.freeze([
        "authorizationId",
        "scopeRef",
        "policyRef",
        "runtimeEnforced",
      ]),
      5,
    ),
    contract(
      "PayloadContract",
      "Payload Contract",
      "Declarative payload shape metadata without serialization or message transport.",
      Object.freeze([
        "payloadId",
        "payloadName",
        "schemaRef",
        "transportImplemented",
      ]),
      6,
    ),
    contract(
      "MappingContract",
      "Mapping Contract",
      "Declarative mapping metadata between connector payloads without transformation runtime.",
      Object.freeze([
        "mappingId",
        "sourcePayloadRef",
        "targetPayloadRef",
        "runtimeTransform",
      ]),
      7,
    ),
    contract(
      "CompatibilityContract",
      "Compatibility Contract",
      "Declarative compatibility and version-alignment metadata for connectors.",
      Object.freeze([
        "compatibilityId",
        "sourceConnectorRef",
        "targetConnectorRef",
        "compatibilityRule",
        "runtimeValidation",
      ]),
      8,
    ),
    contract(
      "ConfigurationContract",
      "Configuration Contract",
      "Declarative configuration metadata for connectors without configuration engines.",
      Object.freeze([
        "configurationId",
        "connectorRef",
        "parameterRefs",
        "runtimeApplied",
      ]),
      9,
    ),
    contract(
      "LifecycleContract",
      "Lifecycle Contract",
      "Declarative connector lifecycle metadata without lifecycle state machines.",
      Object.freeze([
        "lifecycleId",
        "connectorRef",
        "lifecycleState",
        "executesTransitions",
      ]),
      10,
    ),
  ]);

export const IntegrationConnectorFoundationContractNames = Object.freeze([
  "ConnectorContract",
  "EndpointContract",
  "ProtocolContract",
  "AuthenticationContract",
  "AuthorizationContract",
  "PayloadContract",
  "MappingContract",
  "CompatibilityContract",
  "ConfigurationContract",
  "LifecycleContract",
] as const satisfies readonly IntegrationConnectorContractName[]);
