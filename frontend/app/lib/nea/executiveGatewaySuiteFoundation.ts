/**
 * NEA-8:1 — Executive Gateway Suite Foundation.
 *
 * Immutable architectural foundation for the Executive Gateway Suite.
 * Consumes only NEA-1 through NEA-7 Public Indexes.
 * Metadata-only. Runtime-free. Ready for Registry.
 *
 * Ownership: owned exclusively by NEA-8:1.
 *
 * Public exports (exactly 8):
 *   ExecutiveGatewaySuiteFoundationId
 *   ExecutiveGatewaySuiteFoundationVersion
 *   ExecutiveGatewaySuiteFoundationName
 *   ExecutiveGatewaySuiteFoundationNamespace
 *   ExecutiveGatewaySuiteFoundationStatus
 *   ExecutiveGatewaySuiteFoundationReadiness
 *   ExecutiveGatewaySuiteFoundationPlatform
 *   getExecutiveGatewaySuiteFoundationSummary()
 */

import {
  ExecutiveGatewaySuiteCapabilityCatalog,
  ExecutiveGatewaySuiteCompositionCatalog,
  ExecutiveGatewaySuitePublicApiInventory,
} from "./executiveGatewaySuiteCapabilities.ts";
import { ExecutiveGatewaySuiteBoundaries } from "./executiveGatewaySuiteBoundaries.ts";
import { ExecutiveGatewaySuiteContractCatalog } from "./executiveGatewaySuiteContracts.ts";
import type {
  ExecutiveGatewaySuiteFoundationIdentity,
  ExecutiveGatewaySuiteFoundationSummary,
} from "./executiveGatewaySuiteFoundationTypes.ts";
import { ExecutiveGatewaySuiteLifecycle } from "./executiveGatewaySuiteLifecycle.ts";
import { ExecutiveGatewaySuiteOwnership } from "./executiveGatewaySuiteOwnership.ts";

/** Canonical foundation identity. */
export const ExecutiveGatewaySuiteFoundationId =
  "NEA-8:1/ExecutiveGatewaySuiteFoundation" as const;

/** Human-readable foundation name. */
export const ExecutiveGatewaySuiteFoundationName =
  "Executive Gateway Suite Foundation" as const;

/** Semantic version. */
export const ExecutiveGatewaySuiteFoundationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ExecutiveGatewaySuiteFoundationNamespace =
  "nexora.nea.executive-gateway-suite.foundation" as const;

/** Foundation status. */
export const ExecutiveGatewaySuiteFoundationStatus = "Foundation" as const;

/** Immediate next-phase readiness. */
export const ExecutiveGatewaySuiteFoundationReadiness =
  "ReadyForRegistry" as const;

const identity: ExecutiveGatewaySuiteFoundationIdentity = Object.freeze({
  foundationId: ExecutiveGatewaySuiteFoundationId,
  foundationName: ExecutiveGatewaySuiteFoundationName,
  foundationVersion: ExecutiveGatewaySuiteFoundationVersion,
  foundationNamespace: ExecutiveGatewaySuiteFoundationNamespace,
  layer: "NEA" as const,
  phase: "NEA-8:1" as const,
  stage: "Foundation" as const,
  sourcePhase: "NEA-8:1" as const,
  owner: "NEA-8 Executive Gateway Suite",
  status: ExecutiveGatewaySuiteFoundationStatus,
  readiness: ExecutiveGatewaySuiteFoundationReadiness,
  suiteName: "Executive Gateway Suite" as const,
  componentCount: 7 as const,
  description:
    "Immutable aggregation foundation composing NEA-1 through NEA-7 Public Indexes into the Executive Gateway Suite without introducing gateway runtime functionality.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-8:1/Dependency/PublicIndexes",
  publicIndexOnly: true as const,
  directPreviousPhaseModules: Object.freeze([
    "executiveGatewayPublicIndex.ts",
    "channelConnectorPublicIndex.ts",
    "sessionConversationPublicIndex.ts",
    "securityGatewayPublicIndex.ts",
    "gatewayRoutingPublicIndex.ts",
    "messageNormalizationPublicIndex.ts",
    "intakeOrchestrationPublicIndex.ts",
  ] as const),
  nea1PublicIndex: true as const,
  nea2PublicIndex: true as const,
  nea3PublicIndex: true as const,
  nea4PublicIndex: true as const,
  nea5PublicIndex: true as const,
  nea6PublicIndex: true as const,
  nea7PublicIndex: true as const,
  foundationDirectImport: false as const,
  registryDirectImport: false as const,
  modelDirectImport: false as const,
  validationDirectImport: false as const,
  manifestDirectImport: false as const,
  platformDirectImport: false as const,
  certificationDirectImport: false as const,
  freezeDirectImport: false as const,
  reconstructsUpstream: false as const,
  duplicatesUpstreamMetadata: false as const,
  introducesNewGatewayFunctionality: false as const,
  canonicalPath:
    "NEA-8:1 → NEA-1..NEA-7 Public Indexes (exclusive Public Index composition)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "composition",
  "contracts",
  "capabilities",
  "lifecycle",
  "ownership",
  "boundaries",
  "inventory",
  "readiness",
] as const);

const foundationApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-8:1/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-8:1" as const,
    section: "Foundation" as const,
    kind,
    version: ExecutiveGatewaySuiteFoundationVersion,
    status: ExecutiveGatewaySuiteFoundationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "executiveGatewaySuiteFoundation.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const ExecutiveGatewaySuiteFoundationApiRegistry = Object.freeze([
  foundationApi("ExecutiveGatewaySuiteFoundationId", "IdentityConstant"),
  foundationApi("ExecutiveGatewaySuiteFoundationVersion", "IdentityConstant"),
  foundationApi("ExecutiveGatewaySuiteFoundationName", "IdentityConstant"),
  foundationApi("ExecutiveGatewaySuiteFoundationNamespace", "IdentityConstant"),
  foundationApi("ExecutiveGatewaySuiteFoundationStatus", "MetadataConstant"),
  foundationApi("ExecutiveGatewaySuiteFoundationReadiness", "MetadataConstant"),
  foundationApi("ExecutiveGatewaySuiteFoundationPlatform", "Aggregate"),
  foundationApi("getExecutiveGatewaySuiteFoundationSummary", "Helper"),
]);

/**
 * Canonical immutable Executive Gateway Suite Foundation platform.
 * Ten ordered sections. Metadata only.
 */
export const ExecutiveGatewaySuiteFoundationPlatform = Object.freeze({
  identity,
  dependency,
  composition: ExecutiveGatewaySuiteCompositionCatalog,
  contracts: ExecutiveGatewaySuiteContractCatalog,
  capabilities: ExecutiveGatewaySuiteCapabilityCatalog,
  lifecycle: ExecutiveGatewaySuiteLifecycle,
  ownership: ExecutiveGatewaySuiteOwnership,
  boundaries: ExecutiveGatewaySuiteBoundaries,
  inventory: ExecutiveGatewaySuitePublicApiInventory,
  readiness: Object.freeze({
    readinessId: "NEA-8:1/FoundationReadiness",
    readiness: ExecutiveGatewaySuiteFoundationReadiness,
    nextPhase: "NEA-8:2 — Executive Gateway Suite Registry",
    claimsReadyForRegistry: true as const,
    claimsReadyForRuntime: false as const,
    claimsGatewayRuntimeImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: ExecutiveGatewaySuiteFoundationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: ExecutiveGatewaySuiteFoundationStatus,
  nextPhase: "NEA-8:2 — Executive Gateway Suite Registry",
  downstreamReadiness: ExecutiveGatewaySuiteFoundationReadiness,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  implementsRuntimeGateway: false as const,
  implementsRuntimeConnectors: false as const,
  implementsRuntimeSessions: false as const,
  implementsRuntimeSecurity: false as const,
  implementsRuntimeRouting: false as const,
  implementsRuntimeOperations: false as const,
  implementsHttp: false as const,
  implementsRest: false as const,
  implementsWebSockets: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  invokesDkl: false as const,
  invokesEngine: false as const,
  invokesAssistant: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Executive Gateway Suite Foundation summary.
 * Counts are derived exclusively from canonical suite collections.
 */
export function getExecutiveGatewaySuiteFoundationSummary(): ExecutiveGatewaySuiteFoundationSummary {
  return Object.freeze({
    foundationId: ExecutiveGatewaySuiteFoundationId,
    version: ExecutiveGatewaySuiteFoundationVersion,
    name: ExecutiveGatewaySuiteFoundationName,
    namespace: ExecutiveGatewaySuiteFoundationNamespace,
    layer: "NEA" as const,
    phase: "NEA-8:1" as const,
    status: ExecutiveGatewaySuiteFoundationStatus,
    readiness: ExecutiveGatewaySuiteFoundationReadiness,
    suiteName: "Executive Gateway Suite" as const,
    componentCount: ExecutiveGatewaySuiteCompositionCatalog.componentCount,
    capabilityCount: ExecutiveGatewaySuiteCapabilityCatalog.capabilityCount,
    contractCount: ExecutiveGatewaySuiteContractCatalog.contractCount,
    lifecycleStateCount: ExecutiveGatewaySuiteLifecycle.stateCount,
    ownershipCount: ExecutiveGatewaySuiteOwnership.ownsCount,
    nonOwnershipCount: ExecutiveGatewaySuiteOwnership.doesNotOwnCount,
    prohibitedSurfaceCount:
      ExecutiveGatewaySuiteBoundaries.prohibitedSurfaceCount,
    publicApiInventoryTotal:
      ExecutiveGatewaySuitePublicApiInventory.publicApiInventoryTotal,
    publicExportCount: 8 as const,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: "NEA-8:2 — Executive Gateway Suite Registry",
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
