/**
 * NEA-7:4 — Intake Orchestration Validation.
 *
 * Canonical immutable declarative validation architecture for Intake Orchestration.
 * Consumes only NEA-7:3 Intake Orchestration Model public surface.
 * Metadata-only. Runtime-free. Ready for Manifest.
 *
 * Ownership: owned exclusively by NEA-7:4.
 *
 * Public exports (exactly 8):
 *   IntakeOrchestrationValidationId
 *   IntakeOrchestrationValidationVersion
 *   IntakeOrchestrationValidationName
 *   IntakeOrchestrationValidationNamespace
 *   IntakeOrchestrationValidationStatus
 *   IntakeOrchestrationValidationReadiness
 *   IntakeOrchestrationValidationPlatform
 *   getIntakeOrchestrationValidationSummary()
 */

import {
  IntakeOrchestrationModelId,
  IntakeOrchestrationModelPlatform,
  IntakeOrchestrationModelVersion,
} from "./intakeOrchestrationModel.ts";
import { IntakeOrchestrationValidationMetadata } from "./intakeOrchestrationValidationMetadata.ts";
import {
  IntakeOrchestrationValidationBoundaries,
  IntakeOrchestrationValidationOwnership,
} from "./intakeOrchestrationValidationOwnership.ts";
import { IntakeOrchestrationValidationPolicyCatalog } from "./intakeOrchestrationValidationPolicies.ts";
import { IntakeOrchestrationValidationRelationshipCatalog } from "./intakeOrchestrationValidationRelationships.ts";
import { IntakeOrchestrationValidationRuleCatalog } from "./intakeOrchestrationValidationRules.ts";
import type {
  IntakeOrchestrationValidationIdentity,
  IntakeOrchestrationValidationSummary,
} from "./intakeOrchestrationValidationTypes.ts";

/** Canonical validation identity. */
export const IntakeOrchestrationValidationId =
  "NEA-7:4/IntakeOrchestrationValidation" as const;

/** Human-readable validation name. */
export const IntakeOrchestrationValidationName =
  "Intake Orchestration Validation" as const;

/** Semantic version. */
export const IntakeOrchestrationValidationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntakeOrchestrationValidationNamespace =
  "nexora.nea.intake-orchestration.validation" as const;

/** Validation status. */
export const IntakeOrchestrationValidationStatus = "Validation" as const;

/** Immediate next-phase readiness. */
export const IntakeOrchestrationValidationReadiness =
  "ReadyForManifest" as const;

const identity: IntakeOrchestrationValidationIdentity = Object.freeze({
  validationId: IntakeOrchestrationValidationId,
  validationName: IntakeOrchestrationValidationName,
  validationVersion: IntakeOrchestrationValidationVersion,
  validationNamespace: IntakeOrchestrationValidationNamespace,
  layer: "NEA" as const,
  phase: "NEA-7:4" as const,
  stage: "Validation" as const,
  sourcePhase: "NEA-7:4" as const,
  owner: "NEA-7 Intake Orchestration",
  status: IntakeOrchestrationValidationStatus,
  readiness: IntakeOrchestrationValidationReadiness,
  modelId: IntakeOrchestrationModelId,
  modelVersion: IntakeOrchestrationModelVersion,
  description:
    "Immutable declarative validation architecture for Intake Orchestration domain models. Metadata only; no validation engine, runtime orchestration, package assembly, or DKL invocation.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-7:4/Dependency/NEA73Model",
  directPreviousPhaseModule: "intakeOrchestrationModel.ts" as const,
  modelOnly: true as const,
  modelId: IntakeOrchestrationModelId,
  modelVersion: IntakeOrchestrationModelVersion,
  modelPublicSurfaceOnly: true as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  publicIndexDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  reconstructsModel: false as const,
  duplicatesModelValues: false as const,
  canonicalPath:
    "NEA-7:4 → NEA-7:3 IntakeOrchestrationModelPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "categories",
  "rules",
  "relationships",
  "policies",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const validationApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-7:4/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-7:4" as const,
    section: "Validation" as const,
    kind,
    version: IntakeOrchestrationValidationVersion,
    status: IntakeOrchestrationValidationStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "intakeOrchestrationValidation.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const IntakeOrchestrationValidationApiRegistry = Object.freeze([
  validationApi("IntakeOrchestrationValidationId", "IdentityConstant"),
  validationApi("IntakeOrchestrationValidationVersion", "IdentityConstant"),
  validationApi("IntakeOrchestrationValidationName", "IdentityConstant"),
  validationApi("IntakeOrchestrationValidationNamespace", "IdentityConstant"),
  validationApi("IntakeOrchestrationValidationStatus", "MetadataConstant"),
  validationApi("IntakeOrchestrationValidationReadiness", "MetadataConstant"),
  validationApi("IntakeOrchestrationValidationPlatform", "Aggregate"),
  validationApi("getIntakeOrchestrationValidationSummary", "Helper"),
]);

/**
 * Canonical immutable Intake Orchestration Validation platform.
 * Ten ordered sections. Metadata only.
 */
export const IntakeOrchestrationValidationPlatform = Object.freeze({
  identity,
  dependency,
  categories: IntakeOrchestrationValidationRuleCatalog.categories,
  rules: IntakeOrchestrationValidationRuleCatalog,
  relationships: IntakeOrchestrationValidationRelationshipCatalog,
  policies: IntakeOrchestrationValidationPolicyCatalog,
  metadata: IntakeOrchestrationValidationMetadata,
  ownership: IntakeOrchestrationValidationOwnership,
  boundaries: IntakeOrchestrationValidationBoundaries,
  readiness: Object.freeze({
    readinessId: "NEA-7:4/ValidationReadiness",
    readiness: IntakeOrchestrationValidationReadiness,
    nextPhase: IntakeOrchestrationValidationMetadata.nextPhase,
    claimsReadyForManifest: true as const,
    claimsReadyForRuntime: false as const,
    claimsValidationEngine: false as const,
    claimsRuntimeOrchestrationImplemented: false as const,
    claimsRuntimeAssemblyImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: IntakeOrchestrationValidationApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: IntakeOrchestrationValidationStatus,
  nextPhase: IntakeOrchestrationValidationMetadata.nextPhase,
  downstreamReadiness: IntakeOrchestrationValidationReadiness,
  modelPlatform: IntakeOrchestrationModelPlatform,
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  validationEngine: false as const,
  runtimeValidation: false as const,
  implementsRuntimeOrchestration: false as const,
  assemblesRuntimePackage: false as const,
  normalizesMessages: false as const,
  parsesMessages: false as const,
  interpretsBusinessMeaning: false as const,
  implementsRouting: false as const,
  implementsHttp: false as const,
  implementsRest: false as const,
  implementsWebSockets: false as const,
  networkingBehavior: false as const,
  persistenceBehavior: false as const,
  aiReasoning: false as const,
  invokesDkl: false as const,
  invokesEngine: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Intake Orchestration Validation summary.
 * Counts are derived exclusively from canonical validation collections.
 */
export function getIntakeOrchestrationValidationSummary(): IntakeOrchestrationValidationSummary {
  const meta = IntakeOrchestrationValidationMetadata;
  return Object.freeze({
    validationId: IntakeOrchestrationValidationId,
    version: IntakeOrchestrationValidationVersion,
    name: IntakeOrchestrationValidationName,
    namespace: IntakeOrchestrationValidationNamespace,
    layer: "NEA" as const,
    phase: "NEA-7:4" as const,
    status: IntakeOrchestrationValidationStatus,
    readiness: IntakeOrchestrationValidationReadiness,
    modelId: IntakeOrchestrationModelId,
    categoryCount: meta.categoryCount,
    domainCategoryCount: meta.domainCategoryCount,
    ruleCount: meta.ruleCount,
    crossModelRuleCount: meta.crossModelRuleCount,
    platformIntegrityRuleCount: meta.platformIntegrityRuleCount,
    relationshipCount: meta.relationshipCount,
    policyCount: meta.policyCount,
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
