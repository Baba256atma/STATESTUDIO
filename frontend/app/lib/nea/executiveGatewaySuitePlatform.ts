/**
 * NEA-8:6 — Executive Gateway Suite Platform.
 *
 * Canonical immutable composition surface for the complete Executive Gateway Suite.
 * Consumes only NEA-8:5 Executive Gateway Suite Manifest public surface.
 * Metadata-only. Runtime-free. Ready for Certification.
 *
 * Ownership: owned exclusively by NEA-8:6.
 *
 * Public exports (exactly 8):
 *   ExecutiveGatewaySuitePlatformId
 *   ExecutiveGatewaySuitePlatformVersion
 *   ExecutiveGatewaySuitePlatformName
 *   ExecutiveGatewaySuitePlatformNamespace
 *   ExecutiveGatewaySuitePlatformStatus
 *   ExecutiveGatewaySuitePlatformReadiness
 *   ExecutiveGatewaySuitePlatform
 *   getExecutiveGatewaySuitePlatformSummary()
 */

import {
  ExecutiveGatewaySuiteManifestId,
  ExecutiveGatewaySuiteManifestPlatform,
  ExecutiveGatewaySuiteManifestVersion,
} from "./executiveGatewaySuiteManifest.ts";
import { ExecutiveGatewaySuitePlatformMetadata } from "./executiveGatewaySuitePlatformMetadata.ts";
import { ExecutiveGatewaySuitePlatformNamespaceObject } from "./executiveGatewaySuitePlatformNamespace.ts";
import {
  ExecutiveGatewaySuitePlatformBoundaries,
  ExecutiveGatewaySuitePlatformOwnership,
} from "./executiveGatewaySuitePlatformOwnership.ts";
import {
  ExecutiveGatewaySuitePlatformReadinessDeclaration,
  ExecutiveGatewaySuitePlatformReadinessValue,
} from "./executiveGatewaySuitePlatformReadiness.ts";
import { buildExecutiveGatewaySuitePlatformSummary } from "./executiveGatewaySuitePlatformSummary.ts";
import type {
  ExecutiveGatewaySuitePlatformIdentity,
  ExecutiveGatewaySuitePlatformSummary,
} from "./executiveGatewaySuitePlatformTypes.ts";

/** Canonical platform identity. */
export const ExecutiveGatewaySuitePlatformId =
  "NEA-8:6/ExecutiveGatewaySuitePlatform" as const;

/** Human-readable platform name. */
export const ExecutiveGatewaySuitePlatformName =
  "Executive Gateway Suite Platform" as const;

/** Semantic version. */
export const ExecutiveGatewaySuitePlatformVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ExecutiveGatewaySuitePlatformNamespace =
  "nexora.nea.executive-gateway-suite.platform" as const;

/** Platform status. */
export const ExecutiveGatewaySuitePlatformStatus = "Platform" as const;

/** Immediate next-phase readiness. */
export const ExecutiveGatewaySuitePlatformReadiness =
  ExecutiveGatewaySuitePlatformReadinessValue;

const identity: ExecutiveGatewaySuitePlatformIdentity = Object.freeze({
  platformId: ExecutiveGatewaySuitePlatformId,
  platformName: ExecutiveGatewaySuitePlatformName,
  platformVersion: ExecutiveGatewaySuitePlatformVersion,
  platformNamespace: ExecutiveGatewaySuitePlatformNamespace,
  layer: "NEA" as const,
  phase: "NEA-8:6" as const,
  stage: "Platform" as const,
  sourcePhase: "NEA-8:6" as const,
  owner: "NEA-8 Executive Gateway Suite",
  status: ExecutiveGatewaySuitePlatformStatus,
  readiness: ExecutiveGatewaySuitePlatformReadiness,
  manifestId: ExecutiveGatewaySuiteManifestId,
  manifestVersion: ExecutiveGatewaySuiteManifestVersion,
  suiteName: "Executive Gateway Suite" as const,
  description:
    "Immutable canonical composition surface aggregating Foundation, Registry, Model, Validation, and Manifest exclusively through Manifest chain references for the Executive Gateway Suite.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-8:6/Dependency/NEA85Manifest",
  directPreviousPhaseModule: "executiveGatewaySuiteManifest.ts" as const,
  manifestOnly: true as const,
  manifestId: ExecutiveGatewaySuiteManifestId,
  manifestVersion: ExecutiveGatewaySuiteManifestVersion,
  manifestPublicSurfaceOnly: true as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  duplicatesUpstreamArchitecture: false as const,
  redefinesPriorPhases: false as const,
  canonicalPath:
    "NEA-8:6 → NEA-8:5 ManifestPlatform → Validation → Model → Registry → Foundation",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "namespace",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
  "summary",
  "consumer",
] as const);

const platformApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-8:6/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-8:6" as const,
    section: "Platform" as const,
    kind,
    version: ExecutiveGatewaySuitePlatformVersion,
    status: ExecutiveGatewaySuitePlatformStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "executiveGatewaySuitePlatform.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const ExecutiveGatewaySuitePlatformApiRegistry = Object.freeze([
  platformApi("ExecutiveGatewaySuitePlatformId", "IdentityConstant"),
  platformApi("ExecutiveGatewaySuitePlatformVersion", "IdentityConstant"),
  platformApi("ExecutiveGatewaySuitePlatformName", "IdentityConstant"),
  platformApi("ExecutiveGatewaySuitePlatformNamespace", "IdentityConstant"),
  platformApi("ExecutiveGatewaySuitePlatformStatus", "MetadataConstant"),
  platformApi("ExecutiveGatewaySuitePlatformReadiness", "MetadataConstant"),
  platformApi("ExecutiveGatewaySuitePlatform", "Aggregate"),
  platformApi("getExecutiveGatewaySuitePlatformSummary", "Helper"),
]);

const summarySnapshot = buildExecutiveGatewaySuitePlatformSummary();

/**
 * Canonical immutable Executive Gateway Suite Platform.
 * Consumer surface for the complete NEA-8 Suite architecture.
 * Nine ordered sections. Metadata only.
 */
export const ExecutiveGatewaySuitePlatform = Object.freeze({
  identity,
  dependency,
  namespace: ExecutiveGatewaySuitePlatformNamespaceObject,
  metadata: ExecutiveGatewaySuitePlatformMetadata,
  ownership: ExecutiveGatewaySuitePlatformOwnership,
  boundaries: ExecutiveGatewaySuitePlatformBoundaries,
  readiness: ExecutiveGatewaySuitePlatformReadinessDeclaration,
  summary: summarySnapshot,
  consumer: Object.freeze({
    consumerSurfaceId: "NEA-8:6/ConsumerPlatformSurface",
    soleSupportedEntryPoint: "executiveGatewaySuitePlatform.ts" as const,
    accessRule:
      "Consumers shall access NEA-8 through ExecutiveGatewaySuitePlatform only.",
    composedSections: ExecutiveGatewaySuitePlatformNamespaceObject.sectionOrder,
    suiteComponentCount:
      ExecutiveGatewaySuitePlatformNamespaceObject.suiteComponentCount,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: ExecutiveGatewaySuitePlatformApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: ExecutiveGatewaySuitePlatformStatus,
  nextPhase: ExecutiveGatewaySuitePlatformReadinessDeclaration.nextPhase,
  downstreamReadiness: ExecutiveGatewaySuitePlatformReadiness,
  manifestPlatform: ExecutiveGatewaySuiteManifestPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  validationExecution: false as const,
  implementsRuntimeGateway: false as const,
  implementsRuntimeConnectors: false as const,
  implementsRuntimeSessions: false as const,
  implementsRuntimeRouting: false as const,
  implementsRuntimeSecurity: false as const,
  implementsRuntimeMessageNormalization: false as const,
  implementsRuntimeIntakeOrchestration: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  businessLogic: false as const,
  invokesDkl: false as const,
  invokesExecutiveEngine: false as const,
  invokesAssistant: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Executive Gateway Suite Platform summary.
 * Counts are derived exclusively from canonical Manifest and Platform collections.
 */
export function getExecutiveGatewaySuitePlatformSummary(): ExecutiveGatewaySuitePlatformSummary {
  return buildExecutiveGatewaySuitePlatformSummary();
}
