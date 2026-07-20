/**
 * NEA-7:3 — Intake Orchestration Model.
 *
 * Canonical immutable domain model layer for Intake Orchestration.
 * Consumes only NEA-7:2 Intake Orchestration Registry public surface.
 * Metadata-only. Runtime-free. Ready for Validation.
 *
 * Ownership: owned exclusively by NEA-7:3.
 *
 * Public exports (exactly 8):
 *   IntakeOrchestrationModelId
 *   IntakeOrchestrationModelVersion
 *   IntakeOrchestrationModelName
 *   IntakeOrchestrationModelNamespace
 *   IntakeOrchestrationModelStatus
 *   IntakeOrchestrationModelReadiness
 *   IntakeOrchestrationModelPlatform
 *   getIntakeOrchestrationModelSummary()
 */

import {
  IntakeOrchestrationRegistryId,
  IntakeOrchestrationRegistryPlatform,
  IntakeOrchestrationRegistryVersion,
} from "./intakeOrchestrationRegistry.ts";
import { IntakeOrchestrationModelLifecycle } from "./intakeOrchestrationModelLifecycle.ts";
import { IntakeOrchestrationModelMetadata } from "./intakeOrchestrationModelMetadata.ts";
import {
  IntakeOrchestrationModelBoundaries,
  IntakeOrchestrationModelOwnership,
} from "./intakeOrchestrationModelOwnership.ts";
import { IntakeOrchestrationDomainModelCatalog } from "./intakeOrchestrationModels.ts";
import { IntakeOrchestrationModelRelationshipCatalog } from "./intakeOrchestrationRelationships.ts";
import type {
  IntakeOrchestrationModelIdentity,
  IntakeOrchestrationModelSummary,
} from "./intakeOrchestrationModelTypes.ts";

/** Canonical model identity. */
export const IntakeOrchestrationModelId =
  "NEA-7:3/IntakeOrchestrationModel" as const;

/** Human-readable model name. */
export const IntakeOrchestrationModelName =
  "Intake Orchestration Model" as const;

/** Semantic version. */
export const IntakeOrchestrationModelVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntakeOrchestrationModelNamespace =
  "nexora.nea.intake-orchestration.model" as const;

/** Model status. */
export const IntakeOrchestrationModelStatus = "Model" as const;

/** Immediate next-phase readiness. */
export const IntakeOrchestrationModelReadiness =
  "ReadyForValidation" as const;

const identity: IntakeOrchestrationModelIdentity = Object.freeze({
  modelId: IntakeOrchestrationModelId,
  modelName: IntakeOrchestrationModelName,
  modelVersion: IntakeOrchestrationModelVersion,
  modelNamespace: IntakeOrchestrationModelNamespace,
  layer: "NEA" as const,
  phase: "NEA-7:3" as const,
  stage: "Model" as const,
  sourcePhase: "NEA-7:3" as const,
  owner: "NEA-7 Intake Orchestration",
  status: IntakeOrchestrationModelStatus,
  readiness: IntakeOrchestrationModelReadiness,
  registryId: IntakeOrchestrationRegistryId,
  registryVersion: IntakeOrchestrationRegistryVersion,
  description:
    "Immutable domain models transforming Registry declarations into strongly typed Executive Intake Package structures without runtime orchestration, assembly, or DKL invocation.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-7:3/Dependency/NEA72Registry",
  directPreviousPhaseModule: "intakeOrchestrationRegistry.ts" as const,
  registryOnly: true as const,
  registryId: IntakeOrchestrationRegistryId,
  registryVersion: IntakeOrchestrationRegistryVersion,
  registryPublicSurfaceOnly: true as const,
  foundationDirectImport: false as const,
  publicIndexDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  reconstructsRegistry: false as const,
  duplicatesRegistryValues: false as const,
  canonicalPath:
    "NEA-7:3 → NEA-7:2 IntakeOrchestrationRegistryPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "domainModels",
  "relationships",
  "lifecycle",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const modelApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-7:3/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-7:3" as const,
    section: "Model" as const,
    kind,
    version: IntakeOrchestrationModelVersion,
    status: IntakeOrchestrationModelStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "intakeOrchestrationModel.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const IntakeOrchestrationModelApiRegistry = Object.freeze([
  modelApi("IntakeOrchestrationModelId", "IdentityConstant"),
  modelApi("IntakeOrchestrationModelVersion", "IdentityConstant"),
  modelApi("IntakeOrchestrationModelName", "IdentityConstant"),
  modelApi("IntakeOrchestrationModelNamespace", "IdentityConstant"),
  modelApi("IntakeOrchestrationModelStatus", "MetadataConstant"),
  modelApi("IntakeOrchestrationModelReadiness", "MetadataConstant"),
  modelApi("IntakeOrchestrationModelPlatform", "Aggregate"),
  modelApi("getIntakeOrchestrationModelSummary", "Helper"),
]);

/**
 * Canonical immutable Intake Orchestration Model platform.
 * Nine ordered sections. Metadata only.
 */
export const IntakeOrchestrationModelPlatform = Object.freeze({
  identity,
  dependency,
  domainModels: IntakeOrchestrationDomainModelCatalog,
  relationships: IntakeOrchestrationModelRelationshipCatalog,
  lifecycle: IntakeOrchestrationModelLifecycle,
  metadata: IntakeOrchestrationModelMetadata,
  ownership: IntakeOrchestrationModelOwnership,
  boundaries: IntakeOrchestrationModelBoundaries,
  readiness: Object.freeze({
    readinessId: "NEA-7:3/ModelReadiness",
    readiness: IntakeOrchestrationModelReadiness,
    nextPhase: IntakeOrchestrationModelMetadata.nextPhase,
    claimsReadyForValidation: true as const,
    claimsReadyForRuntime: false as const,
    claimsRuntimeOrchestrationImplemented: false as const,
    claimsRuntimeAssemblyImplemented: false as const,
    claimsAiImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: IntakeOrchestrationModelApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: IntakeOrchestrationModelStatus,
  nextPhase: IntakeOrchestrationModelMetadata.nextPhase,
  downstreamReadiness: IntakeOrchestrationModelReadiness,
  registryPlatform: IntakeOrchestrationRegistryPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  executesOrchestration: false as const,
  assemblesRuntimePackage: false as const,
  executesRouting: false as const,
  buildsBusinessObjects: false as const,
  interpretsBusinessMeaning: false as const,
  implementsHttp: false as const,
  implementsRest: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  businessLogic: false as const,
  invokesDkl: false as const,
  invokesExecutiveEngine: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Intake Orchestration Model summary.
 * Counts are derived exclusively from canonical model collections.
 */
export function getIntakeOrchestrationModelSummary(): IntakeOrchestrationModelSummary {
  const meta = IntakeOrchestrationModelMetadata;
  return Object.freeze({
    modelId: IntakeOrchestrationModelId,
    version: IntakeOrchestrationModelVersion,
    name: IntakeOrchestrationModelName,
    namespace: IntakeOrchestrationModelNamespace,
    layer: "NEA" as const,
    phase: "NEA-7:3" as const,
    status: IntakeOrchestrationModelStatus,
    readiness: IntakeOrchestrationModelReadiness,
    registryId: IntakeOrchestrationRegistryId,
    domainModelCount: meta.domainModelCount,
    intakeIdentityModelCount: meta.intakeIdentityModelCount,
    relationshipCount: meta.relationshipCount,
    lifecycleStateCount: meta.lifecycleStateCount,
    ownershipCount: meta.ownershipCount,
    nonOwnershipCount: meta.nonOwnershipCount,
    prohibitedSurfaceCount: meta.prohibitedSurfaceCount,
    publicExportCount: 8 as const,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: meta.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
