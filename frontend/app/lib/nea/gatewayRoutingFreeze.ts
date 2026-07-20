/**
 * NEA-5:8 — Gateway Routing Freeze.
 *
 * Canonical immutable freeze surface for certified Gateway Routing.
 * Consumes only NEA-5:7 Gateway Routing Certification public surface.
 * Metadata-only. Runtime-free. Ready for Public Index.
 *
 * Ownership: owned exclusively by NEA-5:8.
 *
 * Public exports (exactly 8):
 *   GatewayRoutingFreezeId
 *   GatewayRoutingFreezeVersion
 *   GatewayRoutingFreezeName
 *   GatewayRoutingFreezeNamespace
 *   GatewayRoutingFreezeStatus
 *   GatewayRoutingFreezeReadiness
 *   GatewayRoutingFreezePlatform
 *   getGatewayRoutingFreezeSummary()
 */

import {
  GatewayRoutingCertificationId,
  GatewayRoutingCertificationPlatform,
  GatewayRoutingCertificationVersion,
} from "./gatewayRoutingCertification.ts";
import { GatewayRoutingFreezeCompatibilityCatalog } from "./gatewayRoutingFreezeCompatibility.ts";
import { GatewayRoutingFreezeExtensionPolicy } from "./gatewayRoutingFreezeExtensions.ts";
import { GatewayRoutingFreezeLockCatalog } from "./gatewayRoutingFreezeLocks.ts";
import {
  buildGatewayRoutingFreezeSummary,
  GatewayRoutingFreezeBoundaries,
  GatewayRoutingFreezeMetadata,
  GatewayRoutingFreezeOwnership,
  GatewayRoutingFreezeReadinessValue,
} from "./gatewayRoutingFreezeMetadata.ts";
import { GatewayRoutingFreezeRegistryCatalog } from "./gatewayRoutingFreezeRegistry.ts";
import type {
  GatewayRoutingFreezeIdentity,
  GatewayRoutingFreezeSummary,
} from "./gatewayRoutingFreezeTypes.ts";

/** Canonical freeze identity. */
export const GatewayRoutingFreezeId =
  "NEA-5:8/GatewayRoutingFreeze" as const;

/** Human-readable freeze name. */
export const GatewayRoutingFreezeName = "Gateway Routing Freeze" as const;

/** Semantic version. */
export const GatewayRoutingFreezeVersion = "1.0.0" as const;

/** Canonical namespace. */
export const GatewayRoutingFreezeNamespace =
  "nexora.nea.gateway-routing.freeze" as const;

/** Freeze status. */
export const GatewayRoutingFreezeStatus = "Freeze" as const;

/** Immediate next-phase readiness. */
export const GatewayRoutingFreezeReadiness =
  GatewayRoutingFreezeReadinessValue;

const identity: GatewayRoutingFreezeIdentity = Object.freeze({
  freezeId: GatewayRoutingFreezeId,
  freezeName: GatewayRoutingFreezeName,
  freezeVersion: GatewayRoutingFreezeVersion,
  freezeNamespace: GatewayRoutingFreezeNamespace,
  layer: "NEA" as const,
  phase: "NEA-5:8" as const,
  stage: "Freeze" as const,
  sourcePhase: "NEA-5:8" as const,
  owner: "NEA-5 Gateway Routing",
  status: GatewayRoutingFreezeStatus,
  readiness: GatewayRoutingFreezeReadiness,
  certificationId: GatewayRoutingCertificationId,
  certificationVersion: GatewayRoutingCertificationVersion,
  description:
    "Immutable freeze layer permanently locking the certified Gateway Routing architecture as the sole frozen baseline for Public Index consumers.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-5:8/Dependency/NEA57Certification",
  directPreviousPhaseModule: "gatewayRoutingCertification.ts" as const,
  certificationOnly: true as const,
  certificationId: GatewayRoutingCertificationId,
  certificationVersion: GatewayRoutingCertificationVersion,
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
    "NEA-5:8 → NEA-5:7 GatewayRoutingCertificationPlatform (exclusive)",
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
    id: `NEA-5:8/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-5:8" as const,
    section: "Freeze" as const,
    kind,
    version: GatewayRoutingFreezeVersion,
    status: GatewayRoutingFreezeStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "gatewayRoutingFreeze.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const GatewayRoutingFreezeApiRegistry = Object.freeze([
  freezeApi("GatewayRoutingFreezeId", "IdentityConstant"),
  freezeApi("GatewayRoutingFreezeVersion", "IdentityConstant"),
  freezeApi("GatewayRoutingFreezeName", "IdentityConstant"),
  freezeApi("GatewayRoutingFreezeNamespace", "IdentityConstant"),
  freezeApi("GatewayRoutingFreezeStatus", "MetadataConstant"),
  freezeApi("GatewayRoutingFreezeReadiness", "MetadataConstant"),
  freezeApi("GatewayRoutingFreezePlatform", "Aggregate"),
  freezeApi("getGatewayRoutingFreezeSummary", "Helper"),
]);

/**
 * Canonical immutable Gateway Routing Freeze platform.
 * Metadata only. Certified architecture preserved by reference.
 */
export const GatewayRoutingFreezePlatform = Object.freeze({
  identity,
  dependency,
  registry: GatewayRoutingFreezeRegistryCatalog,
  locks: GatewayRoutingFreezeLockCatalog,
  compatibility: GatewayRoutingFreezeCompatibilityCatalog,
  extensions: GatewayRoutingFreezeExtensionPolicy,
  metadata: GatewayRoutingFreezeMetadata,
  ownership: GatewayRoutingFreezeOwnership,
  boundaries: GatewayRoutingFreezeBoundaries,
  summary: buildGatewayRoutingFreezeSummary(),
  readiness: Object.freeze({
    readinessId: "NEA-5:8/FreezeReadiness",
    readiness: GatewayRoutingFreezeReadiness,
    nextPhase: GatewayRoutingFreezeMetadata.nextPhase,
    allLocksActive: GatewayRoutingFreezeLockCatalog.allLocksActive,
    allCompatible: GatewayRoutingFreezeCompatibilityCatalog.allCompatible,
    certificationOutcome:
      GatewayRoutingCertificationPlatform.metadata.certificationOutcome,
    claimsReadyForPublicIndex: true as const,
    claimsPublicIndexPublished: false as const,
    claimsReadyForProduction: false as const,
    claimsRuntimeReady: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: GatewayRoutingFreezeApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: GatewayRoutingFreezeStatus,
  nextPhase: GatewayRoutingFreezeMetadata.nextPhase,
  downstreamReadiness: GatewayRoutingFreezeReadiness,
  certification: GatewayRoutingCertificationPlatform,
  certifiedPlatformReference:
    GatewayRoutingFreezeRegistryCatalog.certifiedPlatformReference,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimeFreezeLogic: false as const,
  runtimeCertification: false as const,
  runtimeValidation: false as const,
  implementsRuntimeRouting: false as const,
  implementsRoutingAlgorithms: false as const,
  executesStrategies: false as const,
  implementsConsumerSelection: false as const,
  processesMessages: false as const,
  executesConnectors: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Gateway Routing Freeze summary.
 * Counts are derived exclusively from Certification and Freeze catalogs.
 */
export function getGatewayRoutingFreezeSummary(): GatewayRoutingFreezeSummary {
  return buildGatewayRoutingFreezeSummary();
}
