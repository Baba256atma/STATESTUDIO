/**
 * NEA-7:6 — Intake Orchestration Platform.
 *
 * Canonical immutable composition surface for the complete Intake Orchestration architecture.
 * Consumes only NEA-7:5 Intake Orchestration Manifest public surface.
 * Metadata-only. Runtime-free. Ready for Certification.
 *
 * Ownership: owned exclusively by NEA-7:6.
 *
 * Public exports (exactly 8):
 *   IntakeOrchestrationPlatformId
 *   IntakeOrchestrationPlatformVersion
 *   IntakeOrchestrationPlatformName
 *   IntakeOrchestrationPlatformNamespace
 *   IntakeOrchestrationPlatformStatus
 *   IntakeOrchestrationPlatformReadiness
 *   IntakeOrchestrationPlatform
 *   getIntakeOrchestrationPlatformSummary()
 */

import {
  IntakeOrchestrationManifestId,
  IntakeOrchestrationManifestPlatform,
  IntakeOrchestrationManifestVersion,
} from "./intakeOrchestrationManifest.ts";
import { IntakeOrchestrationPlatformMetadata } from "./intakeOrchestrationPlatformMetadata.ts";
import { IntakeOrchestrationPlatformNamespaceObject } from "./intakeOrchestrationPlatformNamespace.ts";
import {
  IntakeOrchestrationPlatformBoundaries,
  IntakeOrchestrationPlatformOwnership,
} from "./intakeOrchestrationPlatformOwnership.ts";
import {
  IntakeOrchestrationPlatformReadinessDeclaration,
  IntakeOrchestrationPlatformReadinessValue,
} from "./intakeOrchestrationPlatformReadiness.ts";
import { buildIntakeOrchestrationPlatformSummary } from "./intakeOrchestrationPlatformSummary.ts";
import type {
  IntakeOrchestrationPlatformIdentity,
  IntakeOrchestrationPlatformSummary,
} from "./intakeOrchestrationPlatformTypes.ts";

/** Canonical platform identity. */
export const IntakeOrchestrationPlatformId =
  "NEA-7:6/IntakeOrchestrationPlatform" as const;

/** Human-readable platform name. */
export const IntakeOrchestrationPlatformName =
  "Intake Orchestration Platform" as const;

/** Semantic version. */
export const IntakeOrchestrationPlatformVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntakeOrchestrationPlatformNamespace =
  "nexora.nea.intake-orchestration.platform" as const;

/** Platform status. */
export const IntakeOrchestrationPlatformStatus = "Platform" as const;

/** Immediate next-phase readiness. */
export const IntakeOrchestrationPlatformReadiness =
  IntakeOrchestrationPlatformReadinessValue;

const identity: IntakeOrchestrationPlatformIdentity = Object.freeze({
  platformId: IntakeOrchestrationPlatformId,
  platformName: IntakeOrchestrationPlatformName,
  platformVersion: IntakeOrchestrationPlatformVersion,
  platformNamespace: IntakeOrchestrationPlatformNamespace,
  layer: "NEA" as const,
  phase: "NEA-7:6" as const,
  stage: "Platform" as const,
  sourcePhase: "NEA-7:6" as const,
  owner: "NEA-7 Intake Orchestration",
  status: IntakeOrchestrationPlatformStatus,
  readiness: IntakeOrchestrationPlatformReadiness,
  manifestId: IntakeOrchestrationManifestId,
  manifestVersion: IntakeOrchestrationManifestVersion,
  description:
    "Immutable canonical composition surface aggregating Foundation, Registry, Model, Validation, and Manifest exclusively through canonical references.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-7:6/Dependency/NEA75Manifest",
  directPreviousPhaseModule: "intakeOrchestrationManifest.ts" as const,
  manifestOnly: true as const,
  manifestId: IntakeOrchestrationManifestId,
  manifestVersion: IntakeOrchestrationManifestVersion,
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
    "NEA-7:6 → NEA-7:5 ManifestPlatform → Validation → Model → Registry → Foundation",
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
    id: `NEA-7:6/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-7:6" as const,
    section: "Platform" as const,
    kind,
    version: IntakeOrchestrationPlatformVersion,
    status: IntakeOrchestrationPlatformStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "intakeOrchestrationPlatform.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const IntakeOrchestrationPlatformApiRegistry = Object.freeze([
  platformApi("IntakeOrchestrationPlatformId", "IdentityConstant"),
  platformApi("IntakeOrchestrationPlatformVersion", "IdentityConstant"),
  platformApi("IntakeOrchestrationPlatformName", "IdentityConstant"),
  platformApi("IntakeOrchestrationPlatformNamespace", "IdentityConstant"),
  platformApi("IntakeOrchestrationPlatformStatus", "MetadataConstant"),
  platformApi("IntakeOrchestrationPlatformReadiness", "MetadataConstant"),
  platformApi("IntakeOrchestrationPlatform", "Aggregate"),
  platformApi("getIntakeOrchestrationPlatformSummary", "Helper"),
]);

const summarySnapshot = buildIntakeOrchestrationPlatformSummary();

/**
 * Canonical immutable Intake Orchestration Platform.
 * Consumer surface for the complete NEA-7 architecture.
 * Nine ordered sections. Metadata only.
 */
export const IntakeOrchestrationPlatform = Object.freeze({
  identity,
  dependency,
  namespace: IntakeOrchestrationPlatformNamespaceObject,
  metadata: IntakeOrchestrationPlatformMetadata,
  ownership: IntakeOrchestrationPlatformOwnership,
  boundaries: IntakeOrchestrationPlatformBoundaries,
  readiness: IntakeOrchestrationPlatformReadinessDeclaration,
  summary: summarySnapshot,
  consumer: Object.freeze({
    consumerSurfaceId: "NEA-7:6/ConsumerPlatformSurface",
    soleSupportedEntryPoint: "intakeOrchestrationPlatform.ts" as const,
    accessRule:
      "Consumers shall access NEA-7 through IntakeOrchestrationPlatform only.",
    composedSections: IntakeOrchestrationPlatformNamespaceObject.sectionOrder,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: IntakeOrchestrationPlatformApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: IntakeOrchestrationPlatformStatus,
  nextPhase: IntakeOrchestrationPlatformReadinessDeclaration.nextPhase,
  downstreamReadiness: IntakeOrchestrationPlatformReadiness,
  manifestPlatform: IntakeOrchestrationManifestPlatform,
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
  invokesDkl: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Intake Orchestration Platform summary.
 * Counts are derived exclusively from canonical upstream collections.
 */
export function getIntakeOrchestrationPlatformSummary(): IntakeOrchestrationPlatformSummary {
  return buildIntakeOrchestrationPlatformSummary();
}
