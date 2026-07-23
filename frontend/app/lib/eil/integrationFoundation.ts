/**
 * EIL-1:1 — Integration Foundation.
 *
 * Immutable architectural foundation for the Executive Integration Layer.
 * Local metadata contracts only. Runtime-free. Ready for Registry.
 *
 * Ownership: owned exclusively by EIL-1:1.
 *
 * Public exports (exactly 8):
 *   IntegrationFoundationId
 *   IntegrationFoundationVersion
 *   IntegrationFoundationName
 *   IntegrationFoundationNamespace
 *   IntegrationFoundationStatus
 *   IntegrationFoundationReadiness
 *   IntegrationFoundationPlatform
 *   getIntegrationFoundationSummary()
 */

import {
  IntegrationFoundationCapabilities,
  IntegrationFoundationCapabilityCatalog,
} from "./integrationFoundationCapabilities.ts";
import {
  IntegrationFoundationContractNames,
  IntegrationFoundationContracts,
} from "./integrationFoundationContracts.ts";
import {
  IntegrationFoundationId,
  IntegrationFoundationIdentity,
  IntegrationFoundationName,
  IntegrationFoundationNamespace,
  IntegrationFoundationReadiness,
  IntegrationFoundationStatus,
  IntegrationFoundationVersion,
} from "./integrationFoundationIdentity.ts";
import { IntegrationFoundationLifecycle } from "./integrationFoundationLifecycle.ts";
import {
  IntegrationFoundationResponsibilities,
  IntegrationFoundationResponsibilityCatalog,
} from "./integrationFoundationResponsibilities.ts";
import type {
  IntegrationFoundationSummary,
  IntegrationPlatformId,
  IntegrationPlatformIdentity,
} from "./integrationFoundationTypes.ts";

export {
  IntegrationFoundationId,
  IntegrationFoundationName,
  IntegrationFoundationNamespace,
  IntegrationFoundationReadiness,
  IntegrationFoundationStatus,
  IntegrationFoundationVersion,
};

const platform = (
  platformId: IntegrationPlatformId,
  platformName: string,
  role: IntegrationPlatformIdentity["role"],
  order: number,
): IntegrationPlatformIdentity =>
  Object.freeze({
    platformId,
    platformName,
    role,
    integrationMode: "MetadataDeclarationOnly" as const,
    executesBusinessLogic: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Platforms coordinated by EIL — declarative identities only. */
const IntegrationFoundationPlatforms: readonly IntegrationPlatformIdentity[] =
  Object.freeze([
    platform("ENG", "Executive Orchestration Engine", "Both", 1),
    platform("DKL", "Data Knowledge Layer", "Producer", 2),
    platform("NEA", "Nexora Executive Gateway", "Producer", 3),
    platform("Director", "Director", "Consumer", 4),
    platform("Advisor", "Advisor", "Consumer", 5),
    platform("EVE", "Executive Visualization Environment", "Consumer", 6),
    platform("OPS", "Executive Operations Suite", "Both", 7),
    platform("BUS", "Executive Business Intelligence", "Producer", 8),
    platform("CORE", "Nexora Core", "Coordinator", 9),
    platform("CORE-TEN", "Nexora Core Tenancy", "Coordinator", 10),
  ]);

const INTEGRATION_FOUNDATION_OWNS = Object.freeze([
  "Platform identity",
  "Integration identity",
  "Canonical contracts",
  "Integration responsibilities",
  "Capabilities",
  "Lifecycle",
  "Ownership",
  "Architectural boundaries",
  "Compatibility declarations",
  "Terminology",
] as const);

const INTEGRATION_FOUNDATION_DOES_NOT_OWN = Object.freeze([
  "Runtime",
  "Execution",
  "Workflow",
  "Orchestration engine",
  "Scheduling",
  "Networking",
  "REST",
  "API calls",
  "Persistence",
  "Storage",
  "Cache",
  "Events",
  "Queues",
  "Messaging",
  "Dependency injection",
  "Factories",
  "Services",
  "Adapters",
  "Connectors",
  "UI",
  "Rendering",
  "Visualization",
  "Business logic",
  "AI",
  "LLM",
  "State mutation",
  "Platform internals",
] as const);

const IntegrationFoundationOwnership = Object.freeze({
  ownershipId: "EIL-1:1/IntegrationFoundationOwnership",
  sourcePhase: "EIL-1:1" as const,
  owns: INTEGRATION_FOUNDATION_OWNS,
  doesNotOwn: INTEGRATION_FOUNDATION_DOES_NOT_OWN,
  ownsCount: INTEGRATION_FOUNDATION_OWNS.length,
  doesNotOwnCount: INTEGRATION_FOUNDATION_DOES_NOT_OWN.length,
  ownsPlatformInternals: false as const,
  ownsRuntime: false as const,
  ownsBusinessLogic: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const INTEGRATION_FOUNDATION_PROHIBITED_SURFACES = Object.freeze([
  "Runtime",
  "Execution",
  "Workflow",
  "Orchestration engine",
  "Scheduling",
  "Networking",
  "REST",
  "API calls",
  "Persistence",
  "Storage",
  "Cache",
  "Events",
  "Queues",
  "Messaging",
  "Dependency injection",
  "Factories",
  "Services",
  "Adapters",
  "Connectors",
  "UI",
  "Rendering",
  "Visualization",
  "Business logic",
  "AI",
  "LLM",
  "State mutation",
  "Later EIL phase imports",
  "Downstream platform internals",
] as const);

const IntegrationFoundationBoundaries = Object.freeze({
  boundariesId: "EIL-1:1/IntegrationFoundationBoundaries",
  sourcePhase: "EIL-1:1" as const,
  consumes: Object.freeze(["Approved NPA standards"] as const),
  provides: Object.freeze(["Integration Foundation"] as const),
  prohibitedSurfaces: INTEGRATION_FOUNDATION_PROHIBITED_SURFACES,
  prohibitedSurfaceCount: INTEGRATION_FOUNDATION_PROHIBITED_SURFACES.length,
  dependencyRules: Object.freeze([
    "NoDownstreamDependencies",
    "ApprovedNpaStandardsOnly",
    "NoLaterEilPhaseImport",
    "NoPlatformInternalImport",
    "NoCircularPlatformOwnership",
  ] as const),
  layerSeparation: Object.freeze({
    eilOwnsIntegrationMetadataOnly: true as const,
    platformsOwnBusinessLogic: true as const,
    runtimeLayersDeferred: true as const,
  }),
  runtimeEnforcement: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const IntegrationFoundationCompatibility = Object.freeze({
  compatibilityId: "EIL-1:1/IntegrationFoundationCompatibility",
  sourcePhase: "EIL-1:1" as const,
  declarations: Object.freeze([
    "Platforms remain independently versioned",
    "EIL coordinates via metadata contracts only",
    "Compatibility is declarative, never runtime-validated here",
    "No illegal coupling across platform boundaries",
    "Dependency direction is preserved and one-way at declaration time",
  ] as const),
  runtimeValidation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const IntegrationFoundationTerminology = Object.freeze({
  terminologyId: "EIL-1:1/IntegrationFoundationTerminology",
  sourcePhase: "EIL-1:1" as const,
  terms: Object.freeze([
    Object.freeze({
      term: "EIL",
      definition:
        "Executive Integration Layer — coordinates platform interaction metadata without implementing business logic.",
    }),
    Object.freeze({
      term: "Integration Foundation",
      definition:
        "Immutable metadata foundation establishing identities, contracts, capabilities, responsibilities, and boundaries.",
    }),
    Object.freeze({
      term: "Platform Contract",
      definition:
        "Declarative identity and role metadata for a coordinated Nexora platform.",
    }),
    Object.freeze({
      term: "Coordination",
      definition:
        "Metadata-level orchestration of platform interactions without an orchestration engine.",
    }),
    Object.freeze({
      term: "Compatibility Declaration",
      definition:
        "Declarative compatibility rule between platforms without runtime validation.",
    }),
    Object.freeze({
      term: "ReadyForRegistry",
      definition:
        "Foundation readiness indicating the phase may advance to EIL-1:2 Registry.",
    }),
  ]),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

const dependency = Object.freeze({
  dependencyId: "EIL-1:1/Dependency/None",
  upstreamDependencies: Object.freeze([] as const),
  downstreamDependencies: Object.freeze([] as const),
  laterEilPhaseImport: false as const,
  platformInternalImport: false as const,
  circularDependency: false as const,
  prefersLocalContracts: true as const,
  approvedNpaStandardsOnly: true as const,
  canonicalPath: "EIL-1:1 → local foundation contracts only",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "platforms",
  "contracts",
  "capabilities",
  "responsibilities",
  "lifecycle",
  "ownership",
  "boundaries",
  "compatibility",
  "terminology",
  "readiness",
] as const);

const foundationApi = (
  exportName: string,
  kind: "Aggregate" | "IdentityConstant" | "MetadataConstant" | "Helper",
) =>
  Object.freeze({
    id: `EIL-1:1/PublicApi/${exportName}`,
    exportName,
    phase: "EIL-1:1" as const,
    section: "Foundation" as const,
    kind,
    version: IntegrationFoundationVersion,
    status: IntegrationFoundationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "integrationFoundation.ts" as const,
  });

const IntegrationFoundationApiRegistry = Object.freeze([
  foundationApi("IntegrationFoundationId", "IdentityConstant"),
  foundationApi("IntegrationFoundationVersion", "IdentityConstant"),
  foundationApi("IntegrationFoundationName", "IdentityConstant"),
  foundationApi("IntegrationFoundationNamespace", "IdentityConstant"),
  foundationApi("IntegrationFoundationStatus", "MetadataConstant"),
  foundationApi("IntegrationFoundationReadiness", "MetadataConstant"),
  foundationApi("IntegrationFoundationPlatform", "Aggregate"),
  foundationApi("getIntegrationFoundationSummary", "Helper"),
]);

/**
 * Canonical immutable Integration Foundation platform.
 * Twelve ordered sections. Metadata only.
 */
export const IntegrationFoundationPlatform = Object.freeze({
  identity: IntegrationFoundationIdentity,
  dependency,
  platforms: IntegrationFoundationPlatforms,
  contracts: IntegrationFoundationContracts,
  capabilities: IntegrationFoundationCapabilityCatalog,
  responsibilities: IntegrationFoundationResponsibilityCatalog,
  lifecycle: IntegrationFoundationLifecycle,
  ownership: IntegrationFoundationOwnership,
  boundaries: IntegrationFoundationBoundaries,
  compatibility: IntegrationFoundationCompatibility,
  terminology: IntegrationFoundationTerminology,
  readiness: IntegrationFoundationReadiness,
  contractNames: IntegrationFoundationContractNames,
  capabilityDeclarations: IntegrationFoundationCapabilities,
  responsibilityDeclarations: IntegrationFoundationResponsibilities,
  apiRegistry: IntegrationFoundationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: IntegrationFoundationStatus,
  nextPhase: "EIL-1:2 — Integration Registry",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  executionBehavior: false as const,
  workflowBehavior: false as const,
  orchestrationEngine: false as const,
  schedulingBehavior: false as const,
  networkingBehavior: false as const,
  restBehavior: false as const,
  apiCallBehavior: false as const,
  persistenceBehavior: false as const,
  storageBehavior: false as const,
  cacheBehavior: false as const,
  eventBehavior: false as const,
  queueBehavior: false as const,
  messagingBehavior: false as const,
  dependencyInjection: false as const,
  factoryBehavior: false as const,
  serviceBehavior: false as const,
  adapterBehavior: false as const,
  connectorBehavior: false as const,
  uiBehavior: false as const,
  renderingBehavior: false as const,
  visualizationBehavior: false as const,
  businessLogicBehavior: false as const,
  aiBehavior: false as const,
  llmBehavior: false as const,
  stateMutation: false as const,
  importsLaterEilPhases: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic frozen Integration Foundation summary. */
export function getIntegrationFoundationSummary(): IntegrationFoundationSummary {
  return Object.freeze({
    foundationId: IntegrationFoundationId,
    version: IntegrationFoundationVersion,
    name: IntegrationFoundationName,
    namespace: IntegrationFoundationNamespace,
    status: IntegrationFoundationStatus,
    readiness: IntegrationFoundationReadiness,
    platformCount: IntegrationFoundationPlatforms.length,
    contractCount: IntegrationFoundationContracts.length,
    capabilityCount: IntegrationFoundationCapabilities.length,
    responsibilityCount: IntegrationFoundationResponsibilities.length,
    lifecycleStateCount: IntegrationFoundationLifecycle.stateCount,
    ownershipCount: IntegrationFoundationOwnership.ownsCount,
    nonOwnershipCount: IntegrationFoundationOwnership.doesNotOwnCount,
    terminologyCount: IntegrationFoundationTerminology.terms.length,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: "EIL-1:2 — Integration Registry",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
