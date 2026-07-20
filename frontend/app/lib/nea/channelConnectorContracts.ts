/**
 * NEA-2:1 — Channel Connector Contracts.
 *
 * Immutable contract declarations for Channel Connectors Foundation surfaces.
 * Declarations only. No runtime enforcement. No real connectors.
 *
 * Ownership: owned exclusively by NEA-2:1.
 */

import type {
  ChannelConnectorContractDeclaration,
  ChannelConnectorFamilyDeclaration,
  ChannelConnectorTypeDeclaration,
} from "./channelConnectorFoundationTypes.ts";

const contract = (
  key: string,
  contractName: string,
  description: string,
  fields: readonly string[],
  order: number,
): ChannelConnectorContractDeclaration =>
  Object.freeze({
    contractId: `NEA-2:1/Contract/${key}`,
    contractName,
    description,
    fields: Object.freeze([...fields]),
    metadataOnly: true as const,
    immutable: true as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

/**
 * Exactly fourteen connector foundation contracts.
 * Order is deterministic and immutable.
 */
export const ChannelConnectorContracts: readonly ChannelConnectorContractDeclaration[] =
  Object.freeze([
    contract(
      "ConnectorIdentity",
      "Connector Identity",
      "Canonical identity fields for a declared channel connector.",
      Object.freeze([
        "connectorId",
        "connectorName",
        "connectorVersion",
        "connectorNamespace",
        "connectorType",
        "connectorFamily",
      ]),
      1,
    ),
    contract(
      "ConnectorDefinition",
      "Connector Definition",
      "Declarative definition binding identity, capabilities, and lifecycle.",
      Object.freeze([
        "definitionId",
        "identityRef",
        "capabilityRefs",
        "configurationRef",
        "lifecycleState",
        "healthStatus",
      ]),
      2,
    ),
    contract(
      "ConnectorType",
      "Connector Type",
      "Closed vocabulary of connector type classifications.",
      Object.freeze(["typeId", "typeName", "family", "implementsConnector"]),
      3,
    ),
    contract(
      "ConnectorFamily",
      "Connector Family",
      "Closed vocabulary of connector family classifications.",
      Object.freeze(["familyId", "familyName", "description"]),
      4,
    ),
    contract(
      "ConnectorCapability",
      "Connector Capability",
      "Declarative capability metadata without runtime execution.",
      Object.freeze([
        "capabilityId",
        "capabilityName",
        "description",
        "executesRuntime",
      ]),
      5,
    ),
    contract(
      "ConnectorConfiguration",
      "Connector Configuration",
      "Configuration metadata references only — no configuration loading.",
      Object.freeze([
        "endpointRef",
        "protocolRef",
        "versionRef",
        "timeoutRef",
        "retryPolicyRef",
        "credentialRef",
        "loadsConfiguration",
      ]),
      6,
    ),
    contract(
      "ConnectorEndpointReference",
      "Connector Endpoint Reference",
      "Opaque endpoint reference metadata — no network resolution.",
      Object.freeze(["endpointRefId", "protocolRef", "addressRef", "resolves"]),
      7,
    ),
    contract(
      "ConnectorCredentialReference",
      "Connector Credential Reference",
      "Opaque credential reference metadata — no secret material.",
      Object.freeze([
        "credentialRefId",
        "credentialKind",
        "storesSecret",
        "authenticates",
      ]),
      8,
    ),
    contract(
      "ConnectorSessionReference",
      "Connector Session Reference",
      "Opaque session reference metadata — no session management.",
      Object.freeze([
        "sessionRefId",
        "connectorId",
        "sessionKind",
        "managesSession",
      ]),
      9,
    ),
    contract(
      "ConnectorHealthStatus",
      "Connector Health Status",
      "Closed vocabulary of declarative health status values.",
      Object.freeze(["healthStatus", "description", "monitorsRuntime"]),
      10,
    ),
    contract(
      "ConnectorLifecycle",
      "Connector Lifecycle",
      "Ordered connector lifecycle states and transition declarations.",
      Object.freeze(["states", "transitions", "executesRuntime"]),
      11,
    ),
    contract(
      "ConnectorOwnership",
      "Connector Ownership",
      "Ownership and non-ownership declarations for connector foundation.",
      Object.freeze(["owns", "doesNotOwn", "ownsRuntimeConnectors"]),
      12,
    ),
    contract(
      "ConnectorBoundaries",
      "Connector Boundaries",
      "Architectural boundary and prohibited surface declarations.",
      Object.freeze([
        "consumes",
        "provides",
        "prohibitedSurfaces",
        "implementsConnectors",
      ]),
      13,
    ),
    contract(
      "ConnectorMetadata",
      "Connector Metadata",
      "Immutable connector foundation metadata and readiness declarations.",
      Object.freeze([
        "foundationId",
        "version",
        "status",
        "readiness",
        "publicIndexId",
        "metadataOnly",
      ]),
      14,
    ),
  ]);

const family = (
  familyId: ChannelConnectorFamilyDeclaration["familyId"],
  familyName: string,
  description: string,
  order: number,
): ChannelConnectorFamilyDeclaration =>
  Object.freeze({
    familyId,
    familyName,
    description,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical connector family catalog. */
export const ChannelConnectorFamilies: readonly ChannelConnectorFamilyDeclaration[] =
  Object.freeze([
    family("Messaging", "Messaging", "Messaging channel connector family.", 1),
    family(
      "Collaboration",
      "Collaboration",
      "Collaboration workspace connector family.",
      2,
    ),
    family("Email", "Email", "Email channel connector family.", 3),
    family("Voice", "Voice", "Voice channel connector family.", 4),
    family("API", "API", "API and webhook connector family.", 5),
    family("SDK", "SDK", "SDK and MCP connector family.", 6),
    family(
      "Enterprise",
      "Enterprise",
      "Enterprise system connector family.",
      7,
    ),
    family("Custom", "Custom", "Approved custom connector family.", 8),
  ]);

const typeDecl = (
  typeId: ChannelConnectorTypeDeclaration["typeId"],
  typeName: string,
  familyId: ChannelConnectorTypeDeclaration["family"],
  description: string,
  order: number,
): ChannelConnectorTypeDeclaration =>
  Object.freeze({
    typeId,
    typeName,
    family: familyId,
    description,
    implementsConnector: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical connector type catalog — classification only. */
export const ChannelConnectorTypes: readonly ChannelConnectorTypeDeclaration[] =
  Object.freeze([
    typeDecl(
      "Telegram",
      "Telegram",
      "Messaging",
      "Telegram messaging connector type classification.",
      1,
    ),
    typeDecl(
      "WhatsApp",
      "WhatsApp",
      "Messaging",
      "WhatsApp messaging connector type classification.",
      2,
    ),
    typeDecl(
      "MicrosoftTeams",
      "Microsoft Teams",
      "Collaboration",
      "Microsoft Teams collaboration connector type classification.",
      3,
    ),
    typeDecl(
      "Slack",
      "Slack",
      "Collaboration",
      "Slack collaboration connector type classification.",
      4,
    ),
    typeDecl(
      "Email",
      "Email",
      "Email",
      "Email connector type classification.",
      5,
    ),
    typeDecl(
      "Voice",
      "Voice",
      "Voice",
      "Voice connector type classification.",
      6,
    ),
    typeDecl(
      "RestApi",
      "REST API",
      "API",
      "REST API connector type classification.",
      7,
    ),
    typeDecl("MCP", "MCP", "SDK", "MCP connector type classification.", 8),
    typeDecl("SDK", "SDK", "SDK", "SDK connector type classification.", 9),
    typeDecl(
      "Webhook",
      "Webhook",
      "API",
      "Webhook connector type classification.",
      10,
    ),
    typeDecl(
      "EnterpriseConnector",
      "Enterprise Connector",
      "Enterprise",
      "Enterprise connector type classification.",
      11,
    ),
    typeDecl(
      "CustomConnector",
      "Custom Connector",
      "Custom",
      "Custom approved connector type classification.",
      12,
    ),
  ]);

/** Canonical immutable contracts catalog. */
export const ChannelConnectorContractCatalog = Object.freeze({
  catalogId: "NEA-2:1/ContractCatalog",
  sourcePhase: "NEA-2:1" as const,
  contracts: ChannelConnectorContracts,
  contractCount: ChannelConnectorContracts.length,
  families: ChannelConnectorFamilies,
  familyCount: ChannelConnectorFamilies.length,
  types: ChannelConnectorTypes,
  typeCount: ChannelConnectorTypes.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
