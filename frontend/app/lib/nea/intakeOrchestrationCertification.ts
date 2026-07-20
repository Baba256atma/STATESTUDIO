/**
 * NEA-7:7 — Intake Orchestration Certification.
 *
 * Canonical immutable certification surface for the Intake Orchestration Platform.
 * Consumes only NEA-7:6 Intake Orchestration Platform public surface.
 * Metadata-only. Runtime-free. Ready for Freeze.
 *
 * Ownership: owned exclusively by NEA-7:7.
 *
 * Public exports (exactly 8):
 *   IntakeOrchestrationCertificationId
 *   IntakeOrchestrationCertificationVersion
 *   IntakeOrchestrationCertificationName
 *   IntakeOrchestrationCertificationNamespace
 *   IntakeOrchestrationCertificationStatus
 *   IntakeOrchestrationCertificationReadiness
 *   IntakeOrchestrationCertificationPlatform
 *   getIntakeOrchestrationCertificationSummary()
 */

import {
  IntakeOrchestrationPlatform,
  IntakeOrchestrationPlatformId,
  IntakeOrchestrationPlatformVersion,
} from "./intakeOrchestrationPlatform.ts";
import { IntakeOrchestrationCertificationComplianceCatalog } from "./intakeOrchestrationCertificationCompliance.ts";
import { IntakeOrchestrationCertificationGateCatalog } from "./intakeOrchestrationCertificationGates.ts";
import {
  IntakeOrchestrationCertificationMetadata,
  IntakeOrchestrationCertificationReadinessValue,
} from "./intakeOrchestrationCertificationMetadata.ts";
import {
  IntakeOrchestrationCertificationBoundaries,
  IntakeOrchestrationCertificationOwnership,
} from "./intakeOrchestrationCertificationOwnership.ts";
import { buildIntakeOrchestrationCertificationSummary } from "./intakeOrchestrationCertificationSummary.ts";
import type {
  IntakeOrchestrationCertificationIdentity,
  IntakeOrchestrationCertificationSummary,
} from "./intakeOrchestrationCertificationTypes.ts";

/** Canonical certification identity. */
export const IntakeOrchestrationCertificationId =
  "NEA-7:7/IntakeOrchestrationCertification" as const;

/** Human-readable certification name. */
export const IntakeOrchestrationCertificationName =
  "Intake Orchestration Certification" as const;

/** Semantic version. */
export const IntakeOrchestrationCertificationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntakeOrchestrationCertificationNamespace =
  "nexora.nea.intake-orchestration.certification" as const;

/** Certification status. */
export const IntakeOrchestrationCertificationStatus = "Certification" as const;

/** Immediate next-phase readiness. */
export const IntakeOrchestrationCertificationReadiness =
  IntakeOrchestrationCertificationReadinessValue;

const identity: IntakeOrchestrationCertificationIdentity = Object.freeze({
  certificationId: IntakeOrchestrationCertificationId,
  certificationName: IntakeOrchestrationCertificationName,
  certificationVersion: IntakeOrchestrationCertificationVersion,
  certificationNamespace: IntakeOrchestrationCertificationNamespace,
  layer: "NEA" as const,
  phase: "NEA-7:7" as const,
  stage: "Certification" as const,
  sourcePhase: "NEA-7:7" as const,
  owner: "NEA-7 Intake Orchestration",
  status: IntakeOrchestrationCertificationStatus,
  readiness: IntakeOrchestrationCertificationReadiness,
  platformId: IntakeOrchestrationPlatformId,
  platformVersion: IntakeOrchestrationPlatformVersion,
  description:
    "Immutable certification architecture declaring Intake Orchestration Platform compliance across Foundation through Platform.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-7:7/Dependency/NEA76Platform",
  directPreviousPhaseModule: "intakeOrchestrationPlatform.ts" as const,
  platformOnly: true as const,
  platformId: IntakeOrchestrationPlatformId,
  platformVersion: IntakeOrchestrationPlatformVersion,
  platformPublicSurfaceOnly: true as const,
  manifestDirectImport: false as const,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  duplicatesPlatformArchitecture: false as const,
  redefinesPriorPhases: false as const,
  canonicalPath:
    "NEA-7:7 → NEA-7:6 IntakeOrchestrationPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "gates",
  "compliance",
  "metadata",
  "ownership",
  "boundaries",
  "summary",
  "readiness",
] as const);

const certificationApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-7:7/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-7:7" as const,
    section: "Certification" as const,
    kind,
    version: IntakeOrchestrationCertificationVersion,
    status: IntakeOrchestrationCertificationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "intakeOrchestrationCertification.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const IntakeOrchestrationCertificationApiRegistry = Object.freeze([
  certificationApi("IntakeOrchestrationCertificationId", "IdentityConstant"),
  certificationApi(
    "IntakeOrchestrationCertificationVersion",
    "IdentityConstant",
  ),
  certificationApi("IntakeOrchestrationCertificationName", "IdentityConstant"),
  certificationApi(
    "IntakeOrchestrationCertificationNamespace",
    "IdentityConstant",
  ),
  certificationApi(
    "IntakeOrchestrationCertificationStatus",
    "MetadataConstant",
  ),
  certificationApi(
    "IntakeOrchestrationCertificationReadiness",
    "MetadataConstant",
  ),
  certificationApi("IntakeOrchestrationCertificationPlatform", "Aggregate"),
  certificationApi("getIntakeOrchestrationCertificationSummary", "Helper"),
]);

/**
 * Canonical immutable Intake Orchestration Certification platform.
 * Nine ordered sections. Metadata only.
 */
export const IntakeOrchestrationCertificationPlatform = Object.freeze({
  identity,
  dependency,
  gates: IntakeOrchestrationCertificationGateCatalog,
  compliance: IntakeOrchestrationCertificationComplianceCatalog,
  metadata: IntakeOrchestrationCertificationMetadata,
  ownership: IntakeOrchestrationCertificationOwnership,
  boundaries: IntakeOrchestrationCertificationBoundaries,
  summary: buildIntakeOrchestrationCertificationSummary(),
  readiness: Object.freeze({
    readinessId: "NEA-7:7/CertificationReadiness",
    readiness: IntakeOrchestrationCertificationReadiness,
    nextPhase: IntakeOrchestrationCertificationMetadata.nextPhase,
    certificationOutcome:
      IntakeOrchestrationCertificationMetadata.certificationOutcome,
    claimsReadyForPublicIndex: false as const,
    claimsReadyForProduction: false as const,
    claimsRuntimeReady: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: IntakeOrchestrationCertificationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: IntakeOrchestrationCertificationStatus,
  nextPhase: IntakeOrchestrationCertificationMetadata.nextPhase,
  downstreamReadiness: IntakeOrchestrationCertificationReadiness,
  platform: IntakeOrchestrationPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  runtimeCertification: false as const,
  runtimeOrchestration: false as const,
  assemblesRuntimePackage: false as const,
  runtimeValidation: false as const,
  executesValidation: false as const,
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
 * Deterministic frozen Intake Orchestration Certification summary.
 * Counts are derived exclusively from canonical certification collections.
 */
export function getIntakeOrchestrationCertificationSummary(): IntakeOrchestrationCertificationSummary {
  return buildIntakeOrchestrationCertificationSummary();
}
