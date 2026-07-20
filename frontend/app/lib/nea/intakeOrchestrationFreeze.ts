/**
 * NEA-7:8 — Intake Orchestration Freeze.
 *
 * Canonical immutable freeze surface for certified Intake Orchestration.
 * Consumes only NEA-7:7 Intake Orchestration Certification public surface.
 * Metadata-only. Runtime-free. Ready for Public Index.
 *
 * Ownership: owned exclusively by NEA-7:8.
 *
 * Public exports (exactly 8):
 *   IntakeOrchestrationFreezeId
 *   IntakeOrchestrationFreezeVersion
 *   IntakeOrchestrationFreezeName
 *   IntakeOrchestrationFreezeNamespace
 *   IntakeOrchestrationFreezeStatus
 *   IntakeOrchestrationFreezeReadiness
 *   IntakeOrchestrationFreezePlatform
 *   getIntakeOrchestrationFreezeSummary()
 */

import {
  IntakeOrchestrationCertificationId,
  IntakeOrchestrationCertificationPlatform,
  IntakeOrchestrationCertificationVersion,
} from "./intakeOrchestrationCertification.ts";
import { IntakeOrchestrationFreezeCompatibilityCatalog } from "./intakeOrchestrationFreezeCompatibility.ts";
import { IntakeOrchestrationFreezeExtensionPolicy } from "./intakeOrchestrationFreezeExtensions.ts";
import { IntakeOrchestrationFreezeLockCatalog } from "./intakeOrchestrationFreezeLocks.ts";
import {
  buildIntakeOrchestrationFreezeSummary,
  IntakeOrchestrationFreezeBoundaries,
  IntakeOrchestrationFreezeMetadata,
  IntakeOrchestrationFreezeOwnership,
  IntakeOrchestrationFreezeReadinessValue,
} from "./intakeOrchestrationFreezeMetadata.ts";
import { IntakeOrchestrationFreezeRegistryCatalog } from "./intakeOrchestrationFreezeRegistry.ts";
import type {
  IntakeOrchestrationFreezeIdentity,
  IntakeOrchestrationFreezeSummary,
} from "./intakeOrchestrationFreezeTypes.ts";

/** Canonical freeze identity. */
export const IntakeOrchestrationFreezeId =
  "NEA-7:8/IntakeOrchestrationFreeze" as const;

/** Human-readable freeze name. */
export const IntakeOrchestrationFreezeName =
  "Intake Orchestration Freeze" as const;

/** Semantic version. */
export const IntakeOrchestrationFreezeVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntakeOrchestrationFreezeNamespace =
  "nexora.nea.intake-orchestration.freeze" as const;

/** Freeze status. */
export const IntakeOrchestrationFreezeStatus = "Freeze" as const;

/** Immediate next-phase readiness. */
export const IntakeOrchestrationFreezeReadiness =
  IntakeOrchestrationFreezeReadinessValue;

const identity: IntakeOrchestrationFreezeIdentity = Object.freeze({
  freezeId: IntakeOrchestrationFreezeId,
  freezeName: IntakeOrchestrationFreezeName,
  freezeVersion: IntakeOrchestrationFreezeVersion,
  freezeNamespace: IntakeOrchestrationFreezeNamespace,
  layer: "NEA" as const,
  phase: "NEA-7:8" as const,
  stage: "Freeze" as const,
  sourcePhase: "NEA-7:8" as const,
  owner: "NEA-7 Intake Orchestration",
  status: IntakeOrchestrationFreezeStatus,
  readiness: IntakeOrchestrationFreezeReadiness,
  certificationId: IntakeOrchestrationCertificationId,
  certificationVersion: IntakeOrchestrationCertificationVersion,
  description:
    "Immutable freeze layer permanently locking the certified Intake Orchestration architecture as the sole frozen baseline for Public Index consumers.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-7:8/Dependency/NEA77Certification",
  directPreviousPhaseModule: "intakeOrchestrationCertification.ts" as const,
  certificationOnly: true as const,
  certificationId: IntakeOrchestrationCertificationId,
  certificationVersion: IntakeOrchestrationCertificationVersion,
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
    "NEA-7:8 → NEA-7:7 IntakeOrchestrationCertificationPlatform (exclusive)",
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
    id: `NEA-7:8/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-7:8" as const,
    section: "Freeze" as const,
    kind,
    version: IntakeOrchestrationFreezeVersion,
    status: IntakeOrchestrationFreezeStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "intakeOrchestrationFreeze.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const IntakeOrchestrationFreezeApiRegistry = Object.freeze([
  freezeApi("IntakeOrchestrationFreezeId", "IdentityConstant"),
  freezeApi("IntakeOrchestrationFreezeVersion", "IdentityConstant"),
  freezeApi("IntakeOrchestrationFreezeName", "IdentityConstant"),
  freezeApi("IntakeOrchestrationFreezeNamespace", "IdentityConstant"),
  freezeApi("IntakeOrchestrationFreezeStatus", "MetadataConstant"),
  freezeApi("IntakeOrchestrationFreezeReadiness", "MetadataConstant"),
  freezeApi("IntakeOrchestrationFreezePlatform", "Aggregate"),
  freezeApi("getIntakeOrchestrationFreezeSummary", "Helper"),
]);

/**
 * Canonical immutable Intake Orchestration Freeze platform.
 * Metadata only. Certified architecture preserved by reference.
 */
export const IntakeOrchestrationFreezePlatform = Object.freeze({
  identity,
  dependency,
  registry: IntakeOrchestrationFreezeRegistryCatalog,
  locks: IntakeOrchestrationFreezeLockCatalog,
  compatibility: IntakeOrchestrationFreezeCompatibilityCatalog,
  extensions: IntakeOrchestrationFreezeExtensionPolicy,
  metadata: IntakeOrchestrationFreezeMetadata,
  ownership: IntakeOrchestrationFreezeOwnership,
  boundaries: IntakeOrchestrationFreezeBoundaries,
  summary: buildIntakeOrchestrationFreezeSummary(),
  readiness: Object.freeze({
    readinessId: "NEA-7:8/FreezeReadiness",
    readiness: IntakeOrchestrationFreezeReadiness,
    nextPhase: IntakeOrchestrationFreezeMetadata.nextPhase,
    allLocksActive: IntakeOrchestrationFreezeLockCatalog.allLocksActive,
    allCompatible: IntakeOrchestrationFreezeCompatibilityCatalog.allCompatible,
    certificationOutcome:
      IntakeOrchestrationCertificationPlatform.metadata.certificationOutcome,
    claimsReadyForPublicIndex: true as const,
    claimsPublicIndexPublished: false as const,
    claimsReadyForProduction: false as const,
    claimsRuntimeReady: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: IntakeOrchestrationFreezeApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: IntakeOrchestrationFreezeStatus,
  nextPhase: IntakeOrchestrationFreezeMetadata.nextPhase,
  downstreamReadiness: IntakeOrchestrationFreezeReadiness,
  certification: IntakeOrchestrationCertificationPlatform,
  certifiedPlatformReference:
    IntakeOrchestrationFreezeRegistryCatalog.certifiedPlatformReference,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
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
  aiReasoning: false as const,
  invokesDkl: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Intake Orchestration Freeze summary.
 * Counts are derived exclusively from Certification and Freeze catalogs.
 */
export function getIntakeOrchestrationFreezeSummary(): IntakeOrchestrationFreezeSummary {
  return buildIntakeOrchestrationFreezeSummary();
}
