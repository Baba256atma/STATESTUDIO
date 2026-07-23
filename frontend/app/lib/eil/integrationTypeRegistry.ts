/**
 * EIL-1:2 — Integration Type Registry.
 *
 * Canonical registry for Foundation vocabularies and architectural types.
 * Consumes only the EIL-1:1 Integration Foundation aggregate surface.
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
  IntegrationRegistryCategory,
  IntegrationRegistryEntry,
} from "./integrationRegistryTypes.ts";

const foundation = IntegrationFoundationPlatform;

const typeEntry = (
  key: string,
  canonicalName: string,
  category: IntegrationRegistryCategory,
  description: string,
  sourceReference: string,
  ordinal: number,
  aliases: readonly string[],
  tags: readonly string[],
  lifecycleState: string = "Verified",
): IntegrationRegistryEntry =>
  Object.freeze({
    id: `EIL-1:2/Registry/Type/${key}` as const,
    key,
    canonicalName,
    category,
    description,
    sourcePhase: "EIL-1:1/IntegrationFoundation" as const,
    sourceNamespace: IntegrationFoundationNamespace,
    ownership: "EIL-1:2" as const,
    status: "Registered" as const,
    lifecycleState,
    ordinal,
    aliases: Object.freeze([...aliases]),
    tags: Object.freeze([...tags]),
    sourceReference,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const foundationRef = (path: string): string =>
  `${IntegrationFoundationId}/${path}`;

const INTEGRATION_TYPES = Object.freeze([
  "PlatformIntegration",
  "CrossPlatformCoordination",
  "ExecutiveIntegration",
] as const);

const PLATFORM_ROLES = Object.freeze([
  "Producer",
  "Consumer",
  "Coordinator",
  "Both",
] as const);

const COORDINATION_TYPES = Object.freeze([
  "ExecutiveCoordination",
  "PlatformCoordination",
  "WorkflowCoordinationDeclaration",
] as const);

const ROUTING_TYPES = Object.freeze([
  "DeclarativeRoute",
  "CrossPlatformRoute",
  "MetadataRoute",
] as const);

const COMPATIBILITY_TYPES = Object.freeze([
  "VersionAlignment",
  "ContractCompatibility",
  "BoundaryCompatibility",
] as const);

const OFFSET = Object.freeze({
  integrationTypes: 0,
  platformRoles: 3,
  producerRoles: 7,
  consumerRoles: 8,
  contractTypes: 9,
  coordinationTypes: 19,
  routingTypes: 22,
  compatibilityTypes: 25,
  lifecycleStates: 28,
  ownershipTypes: 36,
} as const);

const integrationTypeEntries = INTEGRATION_TYPES.map((key, index) =>
  typeEntry(
    key,
    key.replace(/([a-z])([A-Z])/g, "$1 $2"),
    "IntegrationType",
    `Foundation integration type vocabulary: ${key}.`,
    foundationRef(`types/integration/${key}`),
    OFFSET.integrationTypes + index + 1,
    Object.freeze([key]),
    Object.freeze(["integration-type", "vocabulary"]),
  ),
);

const platformRoleEntries = PLATFORM_ROLES.map((role, index) =>
  typeEntry(
    `PlatformRole.${role}`,
    role,
    "PlatformRole",
    `Platform role vocabulary inherited from Foundation: ${role}.`,
    foundationRef(`platforms/roles/${role}`),
    OFFSET.platformRoles + index + 1,
    Object.freeze([role]),
    Object.freeze(["platform-role", role.toLowerCase()]),
  ),
);

const producerRoleEntries = Object.freeze([
  typeEntry(
    "ProducerRole.Primary",
    "Primary Producer",
    "PlatformRole",
    "Producer role classification for platforms that emit integration metadata.",
    foundationRef("platforms/roles/Producer"),
    OFFSET.producerRoles + 1,
    Object.freeze(["Producer"]),
    Object.freeze(["producer-role"]),
  ),
]);

const consumerRoleEntries = Object.freeze([
  typeEntry(
    "ConsumerRole.Primary",
    "Primary Consumer",
    "PlatformRole",
    "Consumer role classification for platforms that accept integration metadata.",
    foundationRef("platforms/roles/Consumer"),
    OFFSET.consumerRoles + 1,
    Object.freeze(["Consumer"]),
    Object.freeze(["consumer-role"]),
  ),
]);

const contractTypeEntries = foundation.contracts.map((contract, index) =>
  typeEntry(
    `ContractType.${contract.contractName}`,
    contract.canonicalName,
    "Contract",
    `Contract type vocabulary for ${contract.canonicalName}.`,
    foundationRef(`contracts/${contract.contractName}`),
    OFFSET.contractTypes + index + 1,
    Object.freeze([contract.contractName]),
    Object.freeze(["contract-type"]),
  ),
);

const coordinationTypeEntries = COORDINATION_TYPES.map((key, index) =>
  typeEntry(
    key,
    key.replace(/([a-z])([A-Z])/g, "$1 $2"),
    "Coordination",
    `Coordination type vocabulary: ${key}.`,
    foundationRef(`types/coordination/${key}`),
    OFFSET.coordinationTypes + index + 1,
    Object.freeze([key]),
    Object.freeze(["coordination-type"]),
  ),
);

const routingTypeEntries = ROUTING_TYPES.map((key, index) =>
  typeEntry(
    key,
    key.replace(/([a-z])([A-Z])/g, "$1 $2"),
    "Routing",
    `Routing type vocabulary: ${key}.`,
    foundationRef(`types/routing/${key}`),
    OFFSET.routingTypes + index + 1,
    Object.freeze([key]),
    Object.freeze(["routing-type"]),
  ),
);

const compatibilityTypeEntries = COMPATIBILITY_TYPES.map((key, index) =>
  typeEntry(
    key,
    key.replace(/([a-z])([A-Z])/g, "$1 $2"),
    "Compatibility",
    `Compatibility type vocabulary: ${key}.`,
    foundationRef(`types/compatibility/${key}`),
    OFFSET.compatibilityTypes + index + 1,
    Object.freeze([key]),
    Object.freeze(["compatibility-type"]),
  ),
);

const lifecycleStateEntries = foundation.lifecycle.states.map((state, index) =>
  typeEntry(
    `Lifecycle.${state}`,
    state,
    "Lifecycle",
    `Foundation lifecycle state: ${state}.`,
    foundationRef(`lifecycle/states/${state}`),
    OFFSET.lifecycleStates + index + 1,
    Object.freeze([state]),
    Object.freeze(["lifecycle-state"]),
    state,
  ),
);

const ownershipTypeEntries = foundation.ownership.owns.map((item, index) =>
  typeEntry(
    `Ownership.${item.replaceAll(" ", "")}`,
    item,
    "Ownership",
    `Architectural ownership type: ${item}.`,
    foundationRef(`ownership/owns/${index + 1}`),
    OFFSET.ownershipTypes + index + 1,
    Object.freeze([item]),
    Object.freeze(["ownership-type"]),
  ),
);

/**
 * Canonical immutable type/vocabulary registry derived from Foundation.
 * Ordinals are explicit and deterministic across sections.
 */
export const IntegrationTypeRegistry: readonly IntegrationRegistryEntry[] =
  Object.freeze([
    ...integrationTypeEntries,
    ...platformRoleEntries,
    ...producerRoleEntries,
    ...consumerRoleEntries,
    ...contractTypeEntries,
    ...coordinationTypeEntries,
    ...routingTypeEntries,
    ...compatibilityTypeEntries,
    ...lifecycleStateEntries,
    ...ownershipTypeEntries,
  ]);

/** Frozen type-registry catalog with derived count. */
export const IntegrationTypeRegistryCatalog = Object.freeze({
  collectionId: "EIL-1:2/Collection/Types",
  category: "IntegrationType" as const,
  sourcePhase: "EIL-1:2" as const,
  entries: IntegrationTypeRegistry,
  entryCount: IntegrationTypeRegistry.length,
  lifecycleStateCount: lifecycleStateEntries.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
