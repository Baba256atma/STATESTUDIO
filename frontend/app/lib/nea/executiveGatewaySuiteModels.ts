/**
 * NEA-8:3 — Executive Gateway Suite Domain Models.
 *
 * Immutable domain model kind declarations composed from Registry references.
 * Strongly typed structure only. No gateway execution. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-8:3.
 */

import {
  ExecutiveGatewaySuiteRegistryId,
  ExecutiveGatewaySuiteRegistryPlatform,
} from "./executiveGatewaySuiteRegistry.ts";
import type {
  ExecutiveGatewaySuiteModelKindDescriptor,
  SuiteComponentIdentityModel,
  SuiteComponentModel,
  SuitePlatformReferenceModel,
} from "./executiveGatewaySuiteModelTypes.ts";

const registry = ExecutiveGatewaySuiteRegistryPlatform;

const kind = (
  modelKind: ExecutiveGatewaySuiteModelKindDescriptor["modelKind"],
  modelName: string,
  description: string,
  registryCollections: ExecutiveGatewaySuiteModelKindDescriptor["registryCollections"],
  fieldCount: number,
  composesModels: ExecutiveGatewaySuiteModelKindDescriptor["composesModels"],
  order: number,
): ExecutiveGatewaySuiteModelKindDescriptor =>
  Object.freeze({
    modelKind,
    modelName,
    description,
    registryCollections: Object.freeze([...registryCollections]),
    fieldCount,
    composesModels: Object.freeze([...composesModels]),
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly twenty Executive Gateway Suite domain model kinds.
 * Registry collections are referenced, never duplicated.
 */
export const ExecutiveGatewaySuiteDomainModels: readonly ExecutiveGatewaySuiteModelKindDescriptor[] =
  Object.freeze([
    kind(
      "SuiteIdentity",
      "Suite Identity Model",
      "Canonical Executive Gateway Suite identity structure from Registry.",
      Object.freeze(["components", "statuses"]),
      8,
      Object.freeze([]),
      1,
    ),
    kind(
      "SuiteComponent",
      "Suite Component Model",
      "Immutable suite component structure projected from Registry registrations.",
      Object.freeze(["components"]),
      10,
      Object.freeze(["SuiteComponentIdentity", "SuitePlatformReference"]),
      2,
    ),
    kind(
      "SuiteComponentIdentity",
      "Suite Component Identity Model",
      "Immutable component identity structure projected from Registry identities.",
      Object.freeze(["componentIdentities"]),
      8,
      Object.freeze([]),
      3,
    ),
    kind(
      "SuiteComposition",
      "Suite Composition Model",
      "Ordered composition of seven released NEA platforms by Registry reference.",
      Object.freeze(["components"]),
      4,
      Object.freeze(["SuiteComponent"]),
      4,
    ),
    kind(
      "SuiteDependency",
      "Suite Dependency Model",
      "Declarative suite component dependency structure — no runtime resolution.",
      Object.freeze(["dependencies"]),
      5,
      Object.freeze([]),
      5,
    ),
    kind(
      "SuiteCapability",
      "Suite Capability Model",
      "Suite capability structure referenced from Registry capability catalog.",
      Object.freeze(["capabilities"]),
      4,
      Object.freeze([]),
      6,
    ),
    kind(
      "SuiteContract",
      "Suite Contract Model",
      "Suite contract structure referenced from Registry contract catalog.",
      Object.freeze(["contracts"]),
      4,
      Object.freeze([]),
      7,
    ),
    kind(
      "SuiteLifecycle",
      "Suite Lifecycle Model",
      "Suite lifecycle structure referenced from Registry lifecycle entries.",
      Object.freeze(["lifecycleEntries"]),
      3,
      Object.freeze([]),
      8,
    ),
    kind(
      "SuitePolicy",
      "Suite Policy Model",
      "Suite policy structure referenced from Registry policy catalog.",
      Object.freeze(["registryPolicies"]),
      4,
      Object.freeze([]),
      9,
    ),
    kind(
      "SuiteInventory",
      "Suite Inventory Model",
      "Suite inventory structure derived from Registry inventory collections.",
      Object.freeze(["components", "publicApiInventory"]),
      5,
      Object.freeze(["SuitePublicApiInventory"]),
      10,
    ),
    kind(
      "SuiteMetadata",
      "Suite Metadata Model",
      "Suite metadata structure referenced from Registry metadata.",
      Object.freeze(["statuses", "registryPolicies"]),
      5,
      Object.freeze([]),
      11,
    ),
    kind(
      "SuiteStatus",
      "Suite Status Model",
      "Suite status vocabulary structure from Registry status registry.",
      Object.freeze(["statuses"]),
      3,
      Object.freeze([]),
      12,
    ),
    kind(
      "SuiteVersion",
      "Suite Version Model",
      "Suite version structure referenced through Registry identity.",
      Object.freeze(["components", "componentIdentities"]),
      3,
      Object.freeze([]),
      13,
    ),
    kind(
      "SuiteReadiness",
      "Suite Readiness Model",
      "Suite readiness structure — Model readiness only, no runtime claims.",
      Object.freeze(["statuses", "componentIdentities"]),
      3,
      Object.freeze([]),
      14,
    ),
    kind(
      "SuiteRelationship",
      "Suite Relationship Model",
      "Declarative suite relationship structure — no graph traversal runtime.",
      Object.freeze(["components", "dependencies"]),
      4,
      Object.freeze([]),
      15,
    ),
    kind(
      "SuiteValidationTarget",
      "Suite Validation Target Model",
      "Declarative validation target structure preparing NEA-8:4 Validation.",
      Object.freeze(["components", "contracts", "capabilities"]),
      4,
      Object.freeze([]),
      16,
    ),
    kind(
      "SuitePlatformReference",
      "Suite Platform Reference Model",
      "Opaque Public Index platform reference preserved through Registry.",
      Object.freeze(["components"]),
      4,
      Object.freeze([]),
      17,
    ),
    kind(
      "SuitePublicApiInventory",
      "Suite Public API Inventory Model",
      "Public API inventory totals derived exclusively from Registry collections.",
      Object.freeze(["publicApiInventory", "components"]),
      3,
      Object.freeze([]),
      18,
    ),
    kind(
      "SuiteSummary",
      "Suite Summary Model",
      "Immutable aggregate summary metadata for the Executive Gateway Suite.",
      Object.freeze(["components", "publicApiInventory", "statuses"]),
      6,
      Object.freeze(["ExecutiveGatewaySuite", "SuitePublicApiInventory"]),
      19,
    ),
    kind(
      "ExecutiveGatewaySuite",
      "Executive Gateway Suite Model",
      "Canonical suite aggregate composed from Registry references without runtime gateway behavior.",
      Object.freeze([
        "components",
        "componentIdentities",
        "dependencies",
        "contracts",
        "capabilities",
        "statuses",
        "lifecycleEntries",
        "registryPolicies",
        "publicApiInventory",
      ]),
      20,
      Object.freeze([
        "SuiteIdentity",
        "SuiteComposition",
        "SuiteComponent",
        "SuiteCapability",
        "SuiteContract",
        "SuiteLifecycle",
        "SuitePolicy",
        "SuiteInventory",
        "SuiteMetadata",
        "SuiteStatus",
        "SuiteVersion",
        "SuiteReadiness",
        "SuitePublicApiInventory",
        "SuiteValidationTarget",
      ]),
      20,
    ),
  ]);

/**
 * Suite component model instances derived from Registry component registrations.
 * Structure only — no runtime gateway behavior.
 */
export const SuiteComponentModels: readonly SuiteComponentModel[] = Object.freeze(
  registry.collections.components.map((item) =>
    Object.freeze({
      modelKind: "SuiteComponent" as const,
      componentId: item.componentId,
      componentName: item.componentName,
      stageId: item.stageId,
      publicIndexId: item.publicIndexId,
      publicIndexVersion: item.publicIndexVersion,
      publicIndexNamespace: item.publicIndexNamespace,
      publicApiCount: item.publicApiCount,
      publicPlatform: item.publicPlatform,
      registryComponentRef: item.registrationId,
      ownership: "Referenced" as const,
      executesRuntime: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: item.deterministicOrder,
    }),
  ),
);

/**
 * Suite component identity model instances derived from Registry identities.
 */
export const SuiteComponentIdentityModels: readonly SuiteComponentIdentityModel[] =
  Object.freeze(
    registry.collections.componentIdentities.map((item) =>
      Object.freeze({
        modelKind: "SuiteComponentIdentity" as const,
        componentId: item.componentId,
        componentName: item.componentName,
        namespace: item.namespace,
        version: item.version,
        releaseStatus: item.releaseStatus,
        certificationStatus: item.certificationStatus,
        freezeStatus: item.freezeStatus,
        consumerReadiness: item.consumerReadiness,
        registryIdentityRef: item.identityId,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
        deterministicOrder: item.deterministicOrder,
      }),
    ),
  );

/**
 * Suite platform reference models — preserve Public Index platforms by Registry reference.
 */
export const SuitePlatformReferenceModels: readonly SuitePlatformReferenceModel[] =
  Object.freeze(
    registry.collections.components.map((item) =>
      Object.freeze({
        modelKind: "SuitePlatformReference" as const,
        componentId: item.componentId,
        publicIndexId: item.publicIndexId,
        publicPlatform: item.publicPlatform,
        registryComponentRef: item.registrationId,
        preservesCanonicalReference: true as const,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
        deterministicOrder: item.deterministicOrder,
      }),
    ),
  );

/** Registry anchors — counts derived from Registry collections by reference. */
export const ExecutiveGatewaySuiteModelRegistryAnchors = Object.freeze({
  registryId: ExecutiveGatewaySuiteRegistryId,
  sourcePhase: "NEA-8:3" as const,
  componentCount: registry.collections.componentCount,
  componentIdentityCount: registry.collections.componentIdentityCount,
  dependencyCount: registry.collections.dependencyCount,
  statusCount: registry.collections.statusCount,
  contractCount: registry.collections.contractCount,
  lifecycleEntryCount: registry.collections.lifecycleEntryCount,
  capabilityCount: registry.capabilities.capabilityCount,
  registryPolicyCount: registry.policies.policyCount,
  publicApiInventoryTotal: registry.collections.publicApiInventoryTotal,
  duplicatesRegistryValues: false as const,
  preservesCanonicalReferences: true as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/** Canonical immutable domain model catalog. */
export const ExecutiveGatewaySuiteDomainModelCatalog = Object.freeze({
  catalogId: "NEA-8:3/DomainModelCatalog",
  sourcePhase: "NEA-8:3" as const,
  models: ExecutiveGatewaySuiteDomainModels,
  modelCount: ExecutiveGatewaySuiteDomainModels.length,
  suiteComponentModels: SuiteComponentModels,
  suiteComponentModelCount: SuiteComponentModels.length,
  suiteComponentIdentityModels: SuiteComponentIdentityModels,
  suiteComponentIdentityModelCount: SuiteComponentIdentityModels.length,
  suitePlatformReferenceModels: SuitePlatformReferenceModels,
  suitePlatformReferenceModelCount: SuitePlatformReferenceModels.length,
  registryAnchors: ExecutiveGatewaySuiteModelRegistryAnchors,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
