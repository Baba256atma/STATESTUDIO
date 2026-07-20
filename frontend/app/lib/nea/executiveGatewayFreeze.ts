/**
 * NEA-1:8 — Executive Gateway Freeze.
 *
 * Canonical immutable freeze surface for the certified Executive Gateway.
 * Consumes only NEA-1:7 Executive Gateway Certification public surface.
 * Metadata-only. Runtime-free. Ready for Public Index.
 *
 * Ownership: owned exclusively by NEA-1:8.
 *
 * Public exports (exactly 8):
 *   ExecutiveGatewayFreezeId
 *   ExecutiveGatewayFreezeVersion
 *   ExecutiveGatewayFreezeName
 *   ExecutiveGatewayFreezeNamespace
 *   ExecutiveGatewayFreezeStatus
 *   ExecutiveGatewayFreezeReadiness
 *   ExecutiveGatewayFreezePlatform
 *   getExecutiveGatewayFreezeSummary()
 */

import {
  ExecutiveGatewayCertificationId,
  ExecutiveGatewayCertificationPlatform,
  ExecutiveGatewayCertificationVersion,
} from "./executiveGatewayCertification.ts";
import { ExecutiveGatewayFreezeCompatibilityCatalog } from "./executiveGatewayFreezeCompatibility.ts";
import { ExecutiveGatewayFreezeExtensionPolicy } from "./executiveGatewayFreezeExtensions.ts";
import { ExecutiveGatewayFreezeLockCatalog } from "./executiveGatewayFreezeLocks.ts";
import {
  buildExecutiveGatewayFreezeSummary,
  ExecutiveGatewayFreezeBoundaries,
  ExecutiveGatewayFreezeMetadata,
  ExecutiveGatewayFreezeOwnership,
  ExecutiveGatewayFreezeReadinessValue,
} from "./executiveGatewayFreezeMetadata.ts";
import { ExecutiveGatewayFreezeRegistryCatalog } from "./executiveGatewayFreezeRegistry.ts";
import type {
  ExecutiveGatewayFreezeIdentity,
  ExecutiveGatewayFreezeSummary,
} from "./executiveGatewayFreezeTypes.ts";

/** Canonical freeze identity. */
export const ExecutiveGatewayFreezeId =
  "NEA-1:8/ExecutiveGatewayFreeze" as const;

/** Human-readable freeze name. */
export const ExecutiveGatewayFreezeName = "Executive Gateway Freeze" as const;

/** Semantic version. */
export const ExecutiveGatewayFreezeVersion = "1.0.0" as const;

/** Canonical namespace. */
export const ExecutiveGatewayFreezeNamespace =
  "nexora.nea.executive-gateway.freeze" as const;

/** Freeze status. */
export const ExecutiveGatewayFreezeStatus = "Freeze" as const;

/** Immediate next-phase readiness. */
export const ExecutiveGatewayFreezeReadiness =
  ExecutiveGatewayFreezeReadinessValue;

const identity: ExecutiveGatewayFreezeIdentity = Object.freeze({
  freezeId: ExecutiveGatewayFreezeId,
  freezeName: ExecutiveGatewayFreezeName,
  freezeVersion: ExecutiveGatewayFreezeVersion,
  freezeNamespace: ExecutiveGatewayFreezeNamespace,
  layer: "NEA" as const,
  phase: "NEA-1:8" as const,
  stage: "Freeze" as const,
  sourcePhase: "NEA-1:8" as const,
  owner: "NEA-1 Executive Gateway",
  status: ExecutiveGatewayFreezeStatus,
  readiness: ExecutiveGatewayFreezeReadiness,
  certificationId: ExecutiveGatewayCertificationId,
  certificationVersion: ExecutiveGatewayCertificationVersion,
  description:
    "Immutable freeze layer permanently locking the certified Executive Gateway architecture as the sole frozen baseline for Public Index consumers.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-1:8/Dependency/NEA17Certification",
  directPreviousPhaseModule: "executiveGatewayCertification.ts" as const,
  certificationOnly: true as const,
  certificationId: ExecutiveGatewayCertificationId,
  certificationVersion: ExecutiveGatewayCertificationVersion,
  certificationPublicSurfaceOnly: true as const,
  platformDirectImport: false as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  duplicatesCertificationMetadata: false as const,
  duplicatesPlatformMetadata: false as const,
  reconstructsCertification: false as const,
  reconstructsPlatform: false as const,
  redefinesPriorPhases: false as const,
  canonicalPath:
    "NEA-1:8 → NEA-1:7 ExecutiveGatewayCertificationPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "registry",
  "locks",
  "compatibility",
  "extensions",
  "metadata",
  "ownership",
  "boundaries",
  "summary",
  "readiness",
] as const);

const freezeApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-1:8/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-1:8" as const,
    section: "Freeze" as const,
    kind,
    version: ExecutiveGatewayFreezeVersion,
    status: ExecutiveGatewayFreezeStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "executiveGatewayFreeze.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const ExecutiveGatewayFreezeApiRegistry = Object.freeze([
  freezeApi("ExecutiveGatewayFreezeId", "IdentityConstant"),
  freezeApi("ExecutiveGatewayFreezeVersion", "IdentityConstant"),
  freezeApi("ExecutiveGatewayFreezeName", "IdentityConstant"),
  freezeApi("ExecutiveGatewayFreezeNamespace", "IdentityConstant"),
  freezeApi("ExecutiveGatewayFreezeStatus", "MetadataConstant"),
  freezeApi("ExecutiveGatewayFreezeReadiness", "MetadataConstant"),
  freezeApi("ExecutiveGatewayFreezePlatform", "Aggregate"),
  freezeApi("getExecutiveGatewayFreezeSummary", "Helper"),
]);

/**
 * Canonical immutable Executive Gateway Freeze platform.
 * Metadata only. Certified architecture preserved by reference.
 */
export const ExecutiveGatewayFreezePlatform = Object.freeze({
  identity,
  dependency,
  registry: ExecutiveGatewayFreezeRegistryCatalog,
  locks: ExecutiveGatewayFreezeLockCatalog,
  compatibility: ExecutiveGatewayFreezeCompatibilityCatalog,
  extensions: ExecutiveGatewayFreezeExtensionPolicy,
  metadata: ExecutiveGatewayFreezeMetadata,
  ownership: ExecutiveGatewayFreezeOwnership,
  boundaries: ExecutiveGatewayFreezeBoundaries,
  summary: buildExecutiveGatewayFreezeSummary(),
  readiness: Object.freeze({
    readinessId: "NEA-1:8/FreezeReadiness",
    readiness: ExecutiveGatewayFreezeReadiness,
    nextPhase: ExecutiveGatewayFreezeMetadata.nextPhase,
    allLocksActive: ExecutiveGatewayFreezeLockCatalog.allLocksActive,
    allCompatible:
      ExecutiveGatewayFreezeCompatibilityCatalog.allCompatible,
    certificationOutcome:
      ExecutiveGatewayCertificationPlatform.metadata.certificationOutcome,
    claimsReadyForPublicIndex: true as const,
    claimsPublicIndexPublished: false as const,
    claimsReadyForProduction: false as const,
    claimsRuntimeReady: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: ExecutiveGatewayFreezeApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: ExecutiveGatewayFreezeStatus,
  nextPhase: ExecutiveGatewayFreezeMetadata.nextPhase,
  downstreamReadiness: ExecutiveGatewayFreezeReadiness,
  certification: ExecutiveGatewayCertificationPlatform,
  certifiedPlatformReference:
    ExecutiveGatewayFreezeRegistryCatalog.certifiedPlatformReference,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimeFreezeLogic: false as const,
  runtimeCertification: false as const,
  runtimeValidation: false as const,
  authenticationExecution: false as const,
  authorizationExecution: false as const,
  routingExecution: false as const,
  connectorImplementation: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Executive Gateway Freeze summary.
 * Counts are derived exclusively from Certification and Freeze catalogs.
 */
export function getExecutiveGatewayFreezeSummary(): ExecutiveGatewayFreezeSummary {
  return buildExecutiveGatewayFreezeSummary();
}
