/**
 * NEA-7:8 — Intake Orchestration Freeze Metadata.
 *
 * Immutable freeze metadata and summary helpers.
 * Counts and certification outcome are derived exclusively from Certification.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-7:8.
 */

import {
  IntakeOrchestrationCertificationId,
  IntakeOrchestrationCertificationPlatform,
  getIntakeOrchestrationCertificationSummary,
} from "./intakeOrchestrationCertification.ts";
import { IntakeOrchestrationFreezeCompatibilityCatalog } from "./intakeOrchestrationFreezeCompatibility.ts";
import { IntakeOrchestrationFreezeExtensionPolicy } from "./intakeOrchestrationFreezeExtensions.ts";
import {
  IntakeOrchestrationFreezeAllLocksActive,
  IntakeOrchestrationFreezeLockCatalog,
} from "./intakeOrchestrationFreezeLocks.ts";
import { IntakeOrchestrationFreezeRegistryCatalog } from "./intakeOrchestrationFreezeRegistry.ts";
import type { IntakeOrchestrationFreezeSummary } from "./intakeOrchestrationFreezeTypes.ts";

/** Canonical readiness value. */
export const IntakeOrchestrationFreezeReadinessValue =
  "ReadyForPublicIndex" as const;

/** Ownership surfaces owned by Freeze. */
export const INTAKE_ORCHESTRATION_FREEZE_OWNS = Object.freeze([
  "Freeze Identity",
  "Freeze Metadata",
  "Freeze Registry",
  "Freeze Locks",
  "Compatibility Declarations",
  "Extension Policy",
  "Freeze Summary",
  "Readiness",
] as const);

/** Surfaces Freeze does not own. */
export const INTAKE_ORCHESTRATION_FREEZE_DOES_NOT_OWN = Object.freeze([
  "Contracts",
  "Registries",
  "Models",
  "Validation",
  "Inventories",
  "Certification Gates",
  "Runtime Orchestration",
  "Executive Intake Package Assembly",
  "DKL Invocation",
  "Routing",
  "Normalization",
  "Connectors",
  "Persistence",
  "Networking",
  "AI Execution",
] as const);

/** Prohibited Freeze surfaces. */
export const INTAKE_ORCHESTRATION_FREEZE_PROHIBITED_SURFACES = Object.freeze([
  "Runtime Freeze",
  "Runtime Orchestration",
  "Runtime Intake Package Assembly",
  "Runtime Validation",
  "DKL Invocation",
  "Routing",
  "Normalization",
  "Connector Execution",
  "Networking",
  "Persistence",
  "HTTP",
  "REST",
  "WebSocket",
  "Queues",
  "Event Bus",
  "AI",
  "LLM",
  "Business Objects",
  "Executive Engine Execution",
] as const);

/** Canonical immutable freeze ownership. */
export const IntakeOrchestrationFreezeOwnership = Object.freeze({
  ownershipId: "NEA-7:8/IntakeOrchestrationFreezeOwnership",
  sourcePhase: "NEA-7:8" as const,
  owns: INTAKE_ORCHESTRATION_FREEZE_OWNS,
  doesNotOwn: INTAKE_ORCHESTRATION_FREEZE_DOES_NOT_OWN,
  ownsCount: INTAKE_ORCHESTRATION_FREEZE_OWNS.length,
  doesNotOwnCount: INTAKE_ORCHESTRATION_FREEZE_DOES_NOT_OWN.length,
  ownsCertificationGates: false as const,
  ownsContracts: false as const,
  ownsRegistries: false as const,
  ownsModels: false as const,
  ownsValidation: false as const,
  ownsInventories: false as const,
  ownsRuntimeOrchestration: false as const,
  ownsRuntimeAssembly: false as const,
  ownsDkl: false as const,
  ownsRouting: false as const,
  ownsNormalization: false as const,
  ownsConnectors: false as const,
  ownsPersistence: false as const,
  ownsNetworking: false as const,
  ownsAi: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable freeze boundaries. */
export const IntakeOrchestrationFreezeBoundaries = Object.freeze({
  boundariesId: "NEA-7:8/IntakeOrchestrationFreezeBoundaries",
  sourcePhase: "NEA-7:8" as const,
  consumes: Object.freeze([
    "NEA-7:7 Intake Orchestration Certification",
  ] as const),
  provides: Object.freeze(["Intake Orchestration Freeze"] as const),
  prohibitedSurfaces: INTAKE_ORCHESTRATION_FREEZE_PROHIBITED_SURFACES,
  prohibitedSurfaceCount:
    INTAKE_ORCHESTRATION_FREEZE_PROHIBITED_SURFACES.length,
  runtimeEnforcement: false as const,
  runtimeFreezeLogic: false as const,
  runtimeLocking: false as const,
  runtimeOrchestration: false as const,
  assemblesRuntimePackage: false as const,
  runtimeValidation: false as const,
  implementsRouting: false as const,
  normalizesMessages: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  invokesDkl: false as const,
  invokesExecutiveEngine: false as const,
  duplicatesCertificationMetadata: false as const,
  duplicatesPlatformMetadata: false as const,
  reconstructsInventories: false as const,
  redefinesPriorPhases: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Canonical immutable freeze metadata. */
export const IntakeOrchestrationFreezeMetadata = Object.freeze({
  metadataId: "NEA-7:8/IntakeOrchestrationFreezeMetadata",
  sourcePhase: "NEA-7:8" as const,
  freezeStatus: "Freeze" as const,
  freezeVersion: "1.0.0" as const,
  freezeNamespace: "nexora.nea.intake-orchestration.freeze" as const,
  architectureVersion:
    IntakeOrchestrationCertificationPlatform.platform.metadata
      .architectureVersion,
  certifiedVersion:
    IntakeOrchestrationCertificationPlatform.identity.certificationVersion,
  certifiedPlatformReference:
    IntakeOrchestrationFreezeRegistryCatalog.certifiedPlatformReference
      .referenceId,
  certificationId: IntakeOrchestrationCertificationId,
  certificationOutcome:
    IntakeOrchestrationCertificationPlatform.metadata.certificationOutcome,
  dependencyChain:
    "NEA-7:8 → NEA-7:7 Certification → NEA-7:6 Platform → NEA-7:5 Manifest → NEA-7:4 Validation → NEA-7:3 Model → NEA-7:2 Registry → NEA-7:1 Foundation",
  readiness: IntakeOrchestrationFreezeReadinessValue,
  nextPhase: "NEA-7:9 — Intake Orchestration Public Index",
  lockSummary: Object.freeze({
    lockCount: IntakeOrchestrationFreezeLockCatalog.lockCount,
    lockedLockCount: IntakeOrchestrationFreezeLockCatalog.lockedLockCount,
    allLocksActive: IntakeOrchestrationFreezeAllLocksActive,
  }),
  compatibilitySummary: Object.freeze({
    compatibilityCount:
      IntakeOrchestrationFreezeCompatibilityCatalog.compatibilityCount,
    allCompatible: IntakeOrchestrationFreezeCompatibilityCatalog.allCompatible,
  }),
  extensionSummary: Object.freeze({
    allowedExtensionCount:
      IntakeOrchestrationFreezeExtensionPolicy.allowedExtensionCount,
    forbiddenExtensionCount:
      IntakeOrchestrationFreezeExtensionPolicy.forbiddenExtensionCount,
    additiveOnly: IntakeOrchestrationFreezeExtensionPolicy.additiveOnly,
  }),
  extensionPolicy: IntakeOrchestrationFreezeExtensionPolicy,
  architectureSummary: Object.freeze({
    componentCount: IntakeOrchestrationFreezeRegistryCatalog.componentCount,
    intakeIdentityCount:
      IntakeOrchestrationFreezeRegistryCatalog.intakeIdentityCount,
    referenceTypeCount:
      IntakeOrchestrationFreezeRegistryCatalog.referenceTypeCount,
    canonicalExecutiveIntakePackageCount:
      IntakeOrchestrationFreezeRegistryCatalog
        .canonicalExecutiveIntakePackageCount,
    inventoryEntryCount:
      IntakeOrchestrationCertificationPlatform.platform.metadata
        .inventoryEntryCount,
    totalArchitectureCount:
      IntakeOrchestrationCertificationPlatform.platform.metadata
        .totalArchitectureCount,
    composedPhaseCount:
      IntakeOrchestrationCertificationPlatform.platform.metadata
        .composedPhaseCount,
  }),
  inventorySummary: Object.freeze({
    inventoryEntryCount:
      IntakeOrchestrationCertificationPlatform.platform.metadata
        .inventoryEntryCount,
    totalArchitectureCount:
      IntakeOrchestrationCertificationPlatform.platform.metadata
        .totalArchitectureCount,
    composedPhaseCount:
      IntakeOrchestrationCertificationPlatform.platform.metadata
        .composedPhaseCount,
  }),
  consumerSummary: Object.freeze({
    soleSupportedEntryPoint:
      IntakeOrchestrationCertificationPlatform.platform.consumer
        .soleSupportedEntryPoint,
    consumerReady:
      IntakeOrchestrationCertificationPlatform.platform.readiness
        .consumerReady,
    consumerAccessRule:
      IntakeOrchestrationCertificationPlatform.platform.boundaries
        .consumerAccessRule,
  }),
  componentCount: IntakeOrchestrationFreezeRegistryCatalog.componentCount,
  intakeIdentityCount:
    IntakeOrchestrationFreezeRegistryCatalog.intakeIdentityCount,
  referenceTypeCount:
    IntakeOrchestrationFreezeRegistryCatalog.referenceTypeCount,
  canonicalExecutiveIntakePackageCount:
    IntakeOrchestrationFreezeRegistryCatalog
      .canonicalExecutiveIntakePackageCount,
  inventoryEntryCount:
    IntakeOrchestrationCertificationPlatform.platform.metadata
      .inventoryEntryCount,
  totalArchitectureCount:
    IntakeOrchestrationCertificationPlatform.platform.metadata
      .totalArchitectureCount,
  composedPhaseCount:
    IntakeOrchestrationCertificationPlatform.platform.metadata
      .composedPhaseCount,
  allowedExtensionCount:
    IntakeOrchestrationFreezeExtensionPolicy.allowedExtensionCount,
  forbiddenExtensionCount:
    IntakeOrchestrationFreezeExtensionPolicy.forbiddenExtensionCount,
  ownershipCount: IntakeOrchestrationFreezeOwnership.ownsCount,
  nonOwnershipCount: IntakeOrchestrationFreezeOwnership.doesNotOwnCount,
  prohibitedSurfaceCount:
    IntakeOrchestrationFreezeBoundaries.prohibitedSurfaceCount,
  runtimeBehavior: false as const,
  runtimeFreeze: false as const,
  runtimeLocking: false as const,
  assemblesRuntimePackage: false as const,
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
export const INTAKE_ORCHESTRATION_FREEZE_SUMMARY_IDENTITY = Object.freeze({
  freezeId: "NEA-7:8/IntakeOrchestrationFreeze" as const,
  name: "Intake Orchestration Freeze" as const,
  version: "1.0.0" as const,
  namespace: "nexora.nea.intake-orchestration.freeze" as const,
  publicExportCount: 8 as const,
  sectionCount: 11 as const,
});

/**
 * Build deterministic frozen Freeze summary.
 * Derived exclusively from Certification and Freeze catalogs.
 */
export function buildIntakeOrchestrationFreezeSummary(): IntakeOrchestrationFreezeSummary {
  const identity = INTAKE_ORCHESTRATION_FREEZE_SUMMARY_IDENTITY;
  const meta = IntakeOrchestrationFreezeMetadata;
  const certificationSummary = getIntakeOrchestrationCertificationSummary();
  return Object.freeze({
    freezeId: identity.freezeId,
    version: identity.version,
    name: identity.name,
    namespace: identity.namespace,
    layer: "NEA" as const,
    phase: "NEA-7:8" as const,
    status: "Freeze" as const,
    readiness: meta.readiness,
    certificationId: certificationSummary.certificationId,
    certificationOutcome: certificationSummary.certificationOutcome,
    lockCount: meta.lockSummary.lockCount,
    lockedLockCount: meta.lockSummary.lockedLockCount,
    compatibilityCount: meta.compatibilitySummary.compatibilityCount,
    componentCount: meta.componentCount,
    intakeIdentityCount: meta.intakeIdentityCount,
    referenceTypeCount: meta.referenceTypeCount,
    canonicalExecutiveIntakePackageCount:
      meta.canonicalExecutiveIntakePackageCount,
    inventoryEntryCount: meta.inventoryEntryCount,
    totalArchitectureCount: meta.totalArchitectureCount,
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
