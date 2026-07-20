/**
 * NEA-8:8 — Executive Gateway Suite Freeze Metadata.
 *
 * Immutable freeze metadata and summary helpers.
 * Counts and certification outcome are derived exclusively from Certification.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-8:8.
 */

import {
  ExecutiveGatewaySuiteCertificationId,
  ExecutiveGatewaySuiteCertificationPlatform,
  getExecutiveGatewaySuiteCertificationSummary,
} from "./executiveGatewaySuiteCertification.ts";
import { ExecutiveGatewaySuiteFreezeCompatibilityCatalog } from "./executiveGatewaySuiteFreezeCompatibility.ts";
import { ExecutiveGatewaySuiteFreezeExtensionPolicy } from "./executiveGatewaySuiteFreezeExtensions.ts";
import {
  ExecutiveGatewaySuiteFreezeAllLocksActive,
  ExecutiveGatewaySuiteFreezeLockCatalog,
} from "./executiveGatewaySuiteFreezeLocks.ts";
import { ExecutiveGatewaySuiteFreezeRegistryCatalog } from "./executiveGatewaySuiteFreezeRegistry.ts";
import type { ExecutiveGatewaySuiteFreezeSummary } from "./executiveGatewaySuiteFreezeTypes.ts";

/** Canonical readiness value. */
export const ExecutiveGatewaySuiteFreezeReadinessValue =
  "ReadyForPublicIndex" as const;

/** Ownership surfaces owned by Freeze. */
export const EXECUTIVE_GATEWAY_SUITE_FREEZE_OWNS = Object.freeze([
  "Freeze Identity",
  "Freeze Registry",
  "Freeze Locks",
  "Freeze Compatibility",
  "Freeze Metadata",
  "Freeze Extension Policy",
  "Freeze Summary",
  "Readiness",
] as const);

/** Surfaces Freeze does not own. */
export const EXECUTIVE_GATEWAY_SUITE_FREEZE_DOES_NOT_OWN = Object.freeze([
  "Foundation",
  "Registry",
  "Model",
  "Validation",
  "Manifest",
  "Platform",
  "Certification",
  "Runtime Gateway",
  "Runtime Connectors",
  "Runtime Sessions",
  "Runtime Routing",
  "Runtime Security",
  "Runtime Message Normalization",
  "Runtime Intake Orchestration",
  "DKL",
  "Executive Engine",
  "Assistant",
  "Advisor",
  "Director",
  "EVE",
] as const);

/** Prohibited Freeze surfaces. */
export const EXECUTIVE_GATEWAY_SUITE_FREEZE_PROHIBITED_SURFACES = Object.freeze([
  "Runtime Freeze",
  "Runtime Gateway",
  "Runtime Connectors",
  "Runtime Sessions",
  "Runtime Routing",
  "Runtime Security",
  "Runtime Message Normalization",
  "Runtime Intake Orchestration",
  "Validation Engine",
  "Certification Engine",
  "HTTP",
  "REST",
  "WebSockets",
  "Database",
  "Queue",
  "Event Bus",
  "Authentication",
  "Authorization",
  "AI",
  "LLM",
  "DKL invocation",
  "Executive Engine invocation",
  "Assistant invocation",
  "React",
  "Next.js",
] as const);

/** Canonical immutable freeze ownership. */
export const ExecutiveGatewaySuiteFreezeOwnership = Object.freeze({
  ownershipId: "NEA-8:8/ExecutiveGatewaySuiteFreezeOwnership",
  sourcePhase: "NEA-8:8" as const,
  owns: EXECUTIVE_GATEWAY_SUITE_FREEZE_OWNS,
  doesNotOwn: EXECUTIVE_GATEWAY_SUITE_FREEZE_DOES_NOT_OWN,
  ownsCount: EXECUTIVE_GATEWAY_SUITE_FREEZE_OWNS.length,
  doesNotOwnCount: EXECUTIVE_GATEWAY_SUITE_FREEZE_DOES_NOT_OWN.length,
  ownsFoundation: false as const,
  ownsRegistry: false as const,
  ownsModel: false as const,
  ownsValidation: false as const,
  ownsManifest: false as const,
  ownsPlatform: false as const,
  ownsCertification: false as const,
  ownsRuntimeGateway: false as const,
  ownsRuntimeConnectors: false as const,
  ownsRuntimeSessions: false as const,
  ownsRuntimeRouting: false as const,
  ownsRuntimeSecurity: false as const,
  ownsRuntimeMessageNormalization: false as const,
  ownsRuntimeIntakeOrchestration: false as const,
  ownsDkl: false as const,
  ownsExecutiveEngine: false as const,
  ownsAssistant: false as const,
  ownsAdvisor: false as const,
  ownsDirector: false as const,
  ownsEve: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable freeze boundaries. */
export const ExecutiveGatewaySuiteFreezeBoundaries = Object.freeze({
  boundariesId: "NEA-8:8/ExecutiveGatewaySuiteFreezeBoundaries",
  sourcePhase: "NEA-8:8" as const,
  consumes: Object.freeze([
    "NEA-8:7 Executive Gateway Suite Certification",
  ] as const),
  provides: Object.freeze(["Executive Gateway Suite Freeze"] as const),
  prohibitedSurfaces: EXECUTIVE_GATEWAY_SUITE_FREEZE_PROHIBITED_SURFACES,
  prohibitedSurfaceCount:
    EXECUTIVE_GATEWAY_SUITE_FREEZE_PROHIBITED_SURFACES.length,
  runtimeEnforcement: false as const,
  runtimeFreezeLogic: false as const,
  runtimeLocking: false as const,
  implementsRuntimeGateway: false as const,
  implementsRuntimeConnectors: false as const,
  implementsRuntimeSessions: false as const,
  implementsRuntimeRouting: false as const,
  implementsRuntimeSecurity: false as const,
  implementsRuntimeMessageNormalization: false as const,
  implementsRuntimeIntakeOrchestration: false as const,
  validationEngine: false as const,
  certificationEngine: false as const,
  implementsHttp: false as const,
  implementsRest: false as const,
  implementsWebSockets: false as const,
  accessesDatabase: false as const,
  implementsQueue: false as const,
  implementsEventBus: false as const,
  executesAuthentication: false as const,
  executesAuthorization: false as const,
  performsAi: false as const,
  callsLlm: false as const,
  invokesDkl: false as const,
  invokesExecutiveEngine: false as const,
  invokesAssistant: false as const,
  reactComponents: false as const,
  nextJsRoutes: false as const,
  duplicatesCertificationMetadata: false as const,
  duplicatesPlatformMetadata: false as const,
  reconstructsInventories: false as const,
  redefinesPriorPhases: false as const,
  platformDirectImport: false as const,
  manifestDirectImport: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable freeze metadata. */
export const ExecutiveGatewaySuiteFreezeMetadata = Object.freeze({
  metadataId: "NEA-8:8/ExecutiveGatewaySuiteFreezeMetadata",
  sourcePhase: "NEA-8:8" as const,
  freezeStatus: "Freeze" as const,
  freezeVersion: "1.0.0" as const,
  freezeNamespace: "nexora.nea.executive-gateway-suite.freeze" as const,
  architectureVersion:
    ExecutiveGatewaySuiteCertificationPlatform.metadata.architectureVersion,
  certifiedVersion:
    ExecutiveGatewaySuiteCertificationPlatform.identity.certificationVersion,
  certifiedPlatformReference:
    ExecutiveGatewaySuiteFreezeRegistryCatalog.certifiedPlatformReference
      .referenceId,
  certificationId: ExecutiveGatewaySuiteCertificationId,
  certificationOutcome:
    ExecutiveGatewaySuiteCertificationPlatform.metadata.certificationOutcome,
  canonicalReferenceMode: "CertificationOnly" as const,
  dependencyChain:
    "NEA-8:8 → NEA-8:7 Certification → NEA-8:6 Platform → NEA-8:5 Manifest → NEA-8:4 Validation → NEA-8:3 Model → NEA-8:2 Registry → NEA-8:1 Foundation",
  readiness: ExecutiveGatewaySuiteFreezeReadinessValue,
  nextPhase: "NEA-8:9 — Executive Gateway Suite Public Index",
  lockSummary: Object.freeze({
    lockCount: ExecutiveGatewaySuiteFreezeLockCatalog.lockCount,
    lockedLockCount: ExecutiveGatewaySuiteFreezeLockCatalog.lockedLockCount,
    allLocksActive: ExecutiveGatewaySuiteFreezeAllLocksActive,
  }),
  compatibilitySummary: Object.freeze({
    compatibilityCount:
      ExecutiveGatewaySuiteFreezeCompatibilityCatalog.compatibilityCount,
    allCompatible: ExecutiveGatewaySuiteFreezeCompatibilityCatalog.allCompatible,
  }),
  extensionSummary: Object.freeze({
    allowedExtensionCount:
      ExecutiveGatewaySuiteFreezeExtensionPolicy.allowedExtensionCount,
    forbiddenExtensionCount:
      ExecutiveGatewaySuiteFreezeExtensionPolicy.forbiddenExtensionCount,
    additiveOnly: ExecutiveGatewaySuiteFreezeExtensionPolicy.additiveOnly,
  }),
  extensionPolicy: ExecutiveGatewaySuiteFreezeExtensionPolicy,
  architectureSummary: Object.freeze({
    componentCount: ExecutiveGatewaySuiteFreezeRegistryCatalog.componentCount,
    suiteComponentCount:
      ExecutiveGatewaySuiteFreezeRegistryCatalog.suiteComponentCount,
    inventoryEntryCount:
      ExecutiveGatewaySuiteCertificationPlatform.metadata.inventoryEntryCount,
    totalArchitectureCount:
      ExecutiveGatewaySuiteCertificationPlatform.metadata.totalArchitectureCount,
    publicApiInventoryTotal:
      ExecutiveGatewaySuiteCertificationPlatform.metadata.publicApiInventoryTotal,
    composedPhaseCount:
      ExecutiveGatewaySuiteCertificationPlatform.metadata.architectureSummary
        .composedPhaseCount,
  }),
  inventorySummary: Object.freeze({
    inventoryEntryCount:
      ExecutiveGatewaySuiteCertificationPlatform.metadata.inventoryEntryCount,
    totalArchitectureCount:
      ExecutiveGatewaySuiteCertificationPlatform.metadata.totalArchitectureCount,
    publicApiInventoryTotal:
      ExecutiveGatewaySuiteCertificationPlatform.metadata.publicApiInventoryTotal,
    composedPhaseCount:
      ExecutiveGatewaySuiteCertificationPlatform.metadata.architectureSummary
        .composedPhaseCount,
  }),
  consumerSummary: Object.freeze({
    soleSupportedEntryPoint:
      ExecutiveGatewaySuiteCertificationPlatform.platform.consumer
        .soleSupportedEntryPoint,
    consumerReady:
      ExecutiveGatewaySuiteCertificationPlatform.platform.readiness
        .consumerReady,
    consumerAccessRule:
      ExecutiveGatewaySuiteCertificationPlatform.platform.boundaries
        .consumerAccessRule,
  }),
  componentCount: ExecutiveGatewaySuiteFreezeRegistryCatalog.componentCount,
  suiteComponentCount:
    ExecutiveGatewaySuiteFreezeRegistryCatalog.suiteComponentCount,
  inventoryEntryCount:
    ExecutiveGatewaySuiteCertificationPlatform.metadata.inventoryEntryCount,
  totalArchitectureCount:
    ExecutiveGatewaySuiteCertificationPlatform.metadata.totalArchitectureCount,
  publicApiInventoryTotal:
    ExecutiveGatewaySuiteCertificationPlatform.metadata.publicApiInventoryTotal,
  composedPhaseCount:
    ExecutiveGatewaySuiteCertificationPlatform.metadata.architectureSummary
      .composedPhaseCount,
  allowedExtensionCount:
    ExecutiveGatewaySuiteFreezeExtensionPolicy.allowedExtensionCount,
  forbiddenExtensionCount:
    ExecutiveGatewaySuiteFreezeExtensionPolicy.forbiddenExtensionCount,
  ownershipCount: ExecutiveGatewaySuiteFreezeOwnership.ownsCount,
  nonOwnershipCount: ExecutiveGatewaySuiteFreezeOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    ExecutiveGatewaySuiteFreezeBoundaries.prohibitedSurfaceCount,
  runtimeBehavior: false as const,
  runtimeFreeze: false as const,
  runtimeLocking: false as const,
  implementsRuntimeGateway: false as const,
  invokesDKL: false as const,
  countsHardcoded: false as const,
  countsReconstructed: false as const,
  duplicatesCertificationMetadata: false as const,
  duplicatesPlatformMetadata: false as const,
  derivedFromCertification: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Freeze identity constants used by summary composition. */
export const EXECUTIVE_GATEWAY_SUITE_FREEZE_SUMMARY_IDENTITY = Object.freeze({
  freezeId: "NEA-8:8/ExecutiveGatewaySuiteFreeze" as const,
  name: "Executive Gateway Suite Freeze" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.executive-gateway-suite.freeze" as const,
  publicExportCount: 8 as const,
  sectionCount: 11 as const,
});

/**
 * Build deterministic frozen Freeze summary.
 * Derived exclusively from Certification and Freeze catalogs.
 */
export function buildExecutiveGatewaySuiteFreezeSummary(): ExecutiveGatewaySuiteFreezeSummary {
  const identity = EXECUTIVE_GATEWAY_SUITE_FREEZE_SUMMARY_IDENTITY;
  const meta = ExecutiveGatewaySuiteFreezeMetadata;
  const certificationSummary = getExecutiveGatewaySuiteCertificationSummary();
  return Object.freeze({
    freezeId: identity.freezeId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-8:8" as const,
    status: "Freeze" as const,
    readiness: meta.readiness,
    certificationId: certificationSummary.certificationId,
    suiteName: "Executive Gateway Suite" as const,
    certificationOutcome: certificationSummary.certificationOutcome,
    lockCount: meta.lockSummary.lockCount,
    lockedLockCount: meta.lockSummary.lockedLockCount,
    compatibilityCount: meta.compatibilitySummary.compatibilityCount,
    componentCount: meta.componentCount,
    suiteComponentCount: meta.suiteComponentCount,
    inventoryEntryCount: meta.inventoryEntryCount,
    totalArchitectureCount: meta.totalArchitectureCount,
    publicApiInventoryTotal: meta.publicApiInventoryTotal,
    composedPhaseCount: meta.composedPhaseCount,
    allowedExtensionCount: meta.allowedExtensionCount,
    forbiddenExtensionCount: meta.forbiddenExtensionCount,
    ownershipCount: meta.ownershipCount,
    nonOwnershipCount: meta.nonOwnershipCount,
    prohibitedSurfaceCount: meta.prohibitedSurfaceCount,
    publicExportCount: identity.publicExportCount,
    sectionCount: identity.sectionCount,
    nextPhase: meta.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
