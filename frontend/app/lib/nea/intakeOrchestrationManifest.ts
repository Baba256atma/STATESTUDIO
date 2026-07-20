/**
 * NEA-7:5 — Intake Orchestration Manifest.
 *
 * Canonical immutable architectural publication of NEA-7 through Validation.
 * Consumes only NEA-7:4 Intake Orchestration Validation public surface.
 * Metadata-only. Runtime-free. Ready for Platform.
 *
 * Ownership: owned exclusively by NEA-7:5.
 *
 * Public exports (exactly 8):
 *   IntakeOrchestrationManifestId
 *   IntakeOrchestrationManifestVersion
 *   IntakeOrchestrationManifestName
 *   IntakeOrchestrationManifestNamespace
 *   IntakeOrchestrationManifestStatus
 *   IntakeOrchestrationManifestReadiness
 *   IntakeOrchestrationManifestPlatform
 *   getIntakeOrchestrationManifestSummary()
 */

import {
  IntakeOrchestrationValidationId,
  IntakeOrchestrationValidationPlatform,
  IntakeOrchestrationValidationVersion,
} from "./intakeOrchestrationValidation.ts";
import { IntakeOrchestrationManifestInventoryCatalog } from "./intakeOrchestrationManifestInventory.ts";
import { IntakeOrchestrationManifestMetadata } from "./intakeOrchestrationManifestMetadata.ts";
import {
  IntakeOrchestrationManifestBoundaries,
  IntakeOrchestrationManifestOwnership,
} from "./intakeOrchestrationManifestOwnership.ts";
import {
  IntakeOrchestrationManifestReadinessDeclaration,
  IntakeOrchestrationManifestReadinessValue,
} from "./intakeOrchestrationManifestReadiness.ts";
import { buildIntakeOrchestrationManifestSummary } from "./intakeOrchestrationManifestSummary.ts";
import type {
  IntakeOrchestrationManifestIdentity,
  IntakeOrchestrationManifestSummary,
} from "./intakeOrchestrationManifestTypes.ts";

/** Canonical manifest identity. */
export const IntakeOrchestrationManifestId =
  "NEA-7:5/IntakeOrchestrationManifest" as const;

/** Human-readable manifest name. */
export const IntakeOrchestrationManifestName =
  "Intake Orchestration Manifest" as const;

/** Semantic version. */
export const IntakeOrchestrationManifestVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntakeOrchestrationManifestNamespace =
  "nexora.nea.intake-orchestration.manifest" as const;

/** Manifest status. */
export const IntakeOrchestrationManifestStatus = "Manifest" as const;

/** Immediate next-phase readiness. */
export const IntakeOrchestrationManifestReadiness =
  IntakeOrchestrationManifestReadinessValue;

const identity: IntakeOrchestrationManifestIdentity = Object.freeze({
  manifestId: IntakeOrchestrationManifestId,
  manifestName: IntakeOrchestrationManifestName,
  manifestVersion: IntakeOrchestrationManifestVersion,
  manifestNamespace: IntakeOrchestrationManifestNamespace,
  layer: "NEA" as const,
  phase: "NEA-7:5" as const,
  stage: "Manifest" as const,
  sourcePhase: "NEA-7:5" as const,
  owner: "NEA-7 Intake Orchestration",
  status: IntakeOrchestrationManifestStatus,
  readiness: IntakeOrchestrationManifestReadiness,
  validationId: IntakeOrchestrationValidationId,
  validationVersion: IntakeOrchestrationValidationVersion,
  description:
    "Immutable architectural publication of Intake Orchestration aggregating Foundation, Registry, Model, and Validation through canonical references only.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-7:5/Dependency/NEA74Validation",
  directPreviousPhaseModule: "intakeOrchestrationValidation.ts" as const,
  validationOnly: true as const,
  validationId: IntakeOrchestrationValidationId,
  validationVersion: IntakeOrchestrationValidationVersion,
  validationPublicSurfaceOnly: true as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  duplicatesUpstreamCollections: false as const,
  redefinesPriorPhases: false as const,
  canonicalPath:
    "NEA-7:5 → NEA-7:4 ValidationPlatform → Model → Registry → Foundation",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "phaseReferences",
  "inventory",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
  "summary",
] as const);

const manifestApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-7:5/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-7:5" as const,
    section: "Manifest" as const,
    kind,
    version: IntakeOrchestrationManifestVersion,
    status: IntakeOrchestrationManifestStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "intakeOrchestrationManifest.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const IntakeOrchestrationManifestApiRegistry = Object.freeze([
  manifestApi("IntakeOrchestrationManifestId", "IdentityConstant"),
  manifestApi("IntakeOrchestrationManifestVersion", "IdentityConstant"),
  manifestApi("IntakeOrchestrationManifestName", "IdentityConstant"),
  manifestApi("IntakeOrchestrationManifestNamespace", "IdentityConstant"),
  manifestApi("IntakeOrchestrationManifestStatus", "MetadataConstant"),
  manifestApi("IntakeOrchestrationManifestReadiness", "MetadataConstant"),
  manifestApi("IntakeOrchestrationManifestPlatform", "Aggregate"),
  manifestApi("getIntakeOrchestrationManifestSummary", "Helper"),
]);

/**
 * Canonical immutable Intake Orchestration Manifest platform.
 * Nine ordered sections. Metadata only.
 */
export const IntakeOrchestrationManifestPlatform = Object.freeze({
  identity,
  dependency,
  phaseReferences: IntakeOrchestrationManifestInventoryCatalog.phaseReferences,
  inventory: IntakeOrchestrationManifestInventoryCatalog,
  metadata: IntakeOrchestrationManifestMetadata,
  ownership: IntakeOrchestrationManifestOwnership,
  boundaries: IntakeOrchestrationManifestBoundaries,
  readiness: IntakeOrchestrationManifestReadinessDeclaration,
  summary: buildIntakeOrchestrationManifestSummary(),
  apiRegistry: IntakeOrchestrationManifestApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: IntakeOrchestrationManifestStatus,
  nextPhase: IntakeOrchestrationManifestReadinessDeclaration.nextPhase,
  downstreamReadiness: IntakeOrchestrationManifestReadiness,
  validationPlatform: IntakeOrchestrationValidationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  validationExecution: false as const,
  implementsRuntimeOrchestration: false as const,
  assemblesRuntimePackage: false as const,
  normalizesMessages: false as const,
  parsesMessages: false as const,
  interpretsBusinessMeaning: false as const,
  implementsRouting: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Intake Orchestration Manifest summary.
 * Counts are derived exclusively from canonical inventory collections.
 */
export function getIntakeOrchestrationManifestSummary(): IntakeOrchestrationManifestSummary {
  return buildIntakeOrchestrationManifestSummary();
}
