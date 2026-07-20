/**
 * NEA-8:2 — Executive Gateway Suite Registry.
 *
 * Canonical immutable registry for the Executive Gateway Suite.
 * Consumes only NEA-8:1 Executive Gateway Suite Foundation public surface.
 * Metadata-only. Runtime-free. Ready for Model.
 *
 * Ownership: owned exclusively by NEA-8:2.
 *
 * Public exports (exactly 8):
 *   ExecutiveGatewaySuiteRegistryId
 *   ExecutiveGatewaySuiteRegistryVersion
 *   ExecutiveGatewaySuiteRegistryName
 *   ExecutiveGatewaySuiteRegistryNamespace
 *   ExecutiveGatewaySuiteRegistryStatus
 *   ExecutiveGatewaySuiteRegistryReadiness
 *   ExecutiveGatewaySuiteRegistryPlatform
 *   getExecutiveGatewaySuiteRegistrySummary()
 */

import {
  ExecutiveGatewaySuiteFoundationId,
  ExecutiveGatewaySuiteFoundationPlatform,
  ExecutiveGatewaySuiteFoundationVersion,
} from "./executiveGatewaySuiteFoundation.ts";
import { ExecutiveGatewaySuiteCapabilityRegistryCatalog } from "./executiveGatewaySuiteRegistryCapabilities.ts";
import { ExecutiveGatewaySuiteRegistryCollections } from "./executiveGatewaySuiteRegistryCollections.ts";
import { ExecutiveGatewaySuiteRegistryMetadata } from "./executiveGatewaySuiteRegistryMetadata.ts";
import {
  ExecutiveGatewaySuiteRegistryBoundaries,
  ExecutiveGatewaySuiteRegistryOwnership,
} from "./executiveGatewaySuiteRegistryOwnership.ts";
import { ExecutiveGatewaySuiteRegistryPolicyCatalog } from "./executiveGatewaySuiteRegistryPolicies.ts";
import type {
  ExecutiveGatewaySuiteRegistryIdentity,
  ExecutiveGatewaySuiteRegistrySummary,
} from "./executiveGatewaySuiteRegistryTypes.ts";

/** Canonical registry identity. */
export const ExecutiveGatewaySuiteRegistryId =
  "NEA-8:2/ExecutiveGatewaySuiteRegistry" as const;

/** Human-readable registry name. */
export const ExecutiveGatewaySuiteRegistryName =
  "Executive Gateway Suite Registry" as const;

/** Semantic version. */
export const ExecutiveGatewaySuiteRegistryVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ExecutiveGatewaySuiteRegistryNamespace =
  "nexora.nea.executive-gateway-suite.registry" as const;

/** Registry status. */
export const ExecutiveGatewaySuiteRegistryStatus = "Registry" as const;

/** Immediate next-phase readiness. */
export const ExecutiveGatewaySuiteRegistryReadiness =
  "ReadyForModel" as const;

const identity: ExecutiveGatewaySuiteRegistryIdentity = Object.freeze({
  registryId: ExecutiveGatewaySuiteRegistryId,
  registryName: ExecutiveGatewaySuiteRegistryName,
  registryVersion: ExecutiveGatewaySuiteRegistryVersion,
  registryNamespace: ExecutiveGatewaySuiteRegistryNamespace,
  layer: "NEA" as const,
  phase: "NEA-8:2" as const,
  stage: "Registry" as const,
  sourcePhase: "NEA-8:2" as const,
  owner: "NEA-8 Executive Gateway Suite",
  status: ExecutiveGatewaySuiteRegistryStatus,
  readiness: ExecutiveGatewaySuiteRegistryReadiness,
  foundationId: ExecutiveGatewaySuiteFoundationId,
  foundationVersion: ExecutiveGatewaySuiteFoundationVersion,
  suiteName: "Executive Gateway Suite" as const,
  description:
    "Immutable registry of Executive Gateway Suite platforms aggregating NEA-1 through NEA-7 Public Index identities through Suite Foundation without introducing gateway runtime functionality.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-8:2/Dependency/NEA81Foundation",
  directPreviousPhaseModule: "executiveGatewaySuiteFoundation.ts" as const,
  foundationOnly: true as const,
  foundationId: ExecutiveGatewaySuiteFoundationId,
  foundationVersion: ExecutiveGatewaySuiteFoundationVersion,
  foundationPublicSurfaceOnly: true as const,
  publicIndexDirectImport: false as const,
  nea1ThroughNea7InternalImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  reconstructsFoundation: false as const,
  duplicatesFoundationValues: false as const,
  canonicalPath:
    "NEA-8:2 → NEA-8:1 ExecutiveGatewaySuiteFoundationPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "collections",
  "capabilities",
  "policies",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const registryApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-8:2/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-8:2" as const,
    section: "Registry" as const,
    kind,
    version: ExecutiveGatewaySuiteRegistryVersion,
    status: ExecutiveGatewaySuiteRegistryStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "executiveGatewaySuiteRegistry.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const ExecutiveGatewaySuiteRegistryApiRegistry = Object.freeze([
  registryApi("ExecutiveGatewaySuiteRegistryId", "IdentityConstant"),
  registryApi("ExecutiveGatewaySuiteRegistryVersion", "IdentityConstant"),
  registryApi("ExecutiveGatewaySuiteRegistryName", "IdentityConstant"),
  registryApi("ExecutiveGatewaySuiteRegistryNamespace", "IdentityConstant"),
  registryApi("ExecutiveGatewaySuiteRegistryStatus", "MetadataConstant"),
  registryApi("ExecutiveGatewaySuiteRegistryReadiness", "MetadataConstant"),
  registryApi("ExecutiveGatewaySuiteRegistryPlatform", "Aggregate"),
  registryApi("getExecutiveGatewaySuiteRegistrySummary", "Helper"),
]);

/**
 * Canonical immutable Executive Gateway Suite Registry platform.
 * Nine ordered sections. Metadata only.
 */
export const ExecutiveGatewaySuiteRegistryPlatform = Object.freeze({
  identity,
  dependency,
  collections: ExecutiveGatewaySuiteRegistryCollections,
  capabilities: ExecutiveGatewaySuiteCapabilityRegistryCatalog,
  policies: ExecutiveGatewaySuiteRegistryPolicyCatalog,
  metadata: ExecutiveGatewaySuiteRegistryMetadata,
  ownership: ExecutiveGatewaySuiteRegistryOwnership,
  boundaries: ExecutiveGatewaySuiteRegistryBoundaries,
  readiness: Object.freeze({
    readinessId: "NEA-8:2/RegistryReadiness",
    readiness: ExecutiveGatewaySuiteRegistryReadiness,
    nextPhase: ExecutiveGatewaySuiteRegistryMetadata.nextPhase,
    claimsReadyForModel: true as const,
    claimsReadyForRuntime: false as const,
    claimsRuntimeGatewayImplemented: false as const,
    claimsRuntimeConnectorsImplemented: false as const,
    claimsRuntimeSessionsImplemented: false as const,
    claimsRuntimeSecurityImplemented: false as const,
    claimsRuntimeRoutingImplemented: false as const,
    claimsRuntimeOperationsImplemented: false as const,
    claimsAiImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: ExecutiveGatewaySuiteRegistryApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: ExecutiveGatewaySuiteRegistryStatus,
  nextPhase: ExecutiveGatewaySuiteRegistryMetadata.nextPhase,
  downstreamReadiness: ExecutiveGatewaySuiteRegistryReadiness,
  foundationPlatform: ExecutiveGatewaySuiteFoundationPlatform,
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
  invokesExecutiveEngine: false as const,
  invokesAssistant: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Executive Gateway Suite Registry summary.
 * Counts are derived exclusively from canonical registry collections and Foundation.
 */
export function getExecutiveGatewaySuiteRegistrySummary(): ExecutiveGatewaySuiteRegistrySummary {
  const meta = ExecutiveGatewaySuiteRegistryMetadata;
  return Object.freeze({
    registryId: ExecutiveGatewaySuiteRegistryId,
    version: ExecutiveGatewaySuiteRegistryVersion,
    name: ExecutiveGatewaySuiteRegistryName,
    namespace: ExecutiveGatewaySuiteRegistryNamespace,
    layer: "NEA" as const,
    phase: "NEA-8:2" as const,
    status: ExecutiveGatewaySuiteRegistryStatus,
    readiness: ExecutiveGatewaySuiteRegistryReadiness,
    foundationId: ExecutiveGatewaySuiteFoundationId,
    suiteName: "Executive Gateway Suite" as const,
    componentCount: meta.componentCount,
    componentIdentityCount: meta.componentIdentityCount,
    dependencyCount: meta.dependencyCount,
    statusCount: meta.statusCount,
    capabilityCount: meta.capabilityCount,
    contractCount: meta.contractCount,
    lifecycleEntryCount: meta.lifecycleEntryCount,
    registryPolicyCount: meta.registryPolicyCount,
    publicApiInventoryTotal: meta.publicApiInventoryTotal,
    totalRegistryEntryCount: meta.totalEntryCount,
    publicExportCount: 8 as const,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: meta.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
