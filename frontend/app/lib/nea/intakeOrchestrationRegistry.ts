/**
 * NEA-7:2 — Intake Orchestration Registry.
 *
 * Canonical immutable registry for Intake Orchestration vocabularies and lookups.
 * Consumes only NEA-7:1 Intake Orchestration Foundation public surface.
 * Metadata-only. Runtime-free. Ready for Model.
 *
 * Ownership: owned exclusively by NEA-7:2.
 *
 * Public exports (exactly 8):
 *   IntakeOrchestrationRegistryId
 *   IntakeOrchestrationRegistryVersion
 *   IntakeOrchestrationRegistryName
 *   IntakeOrchestrationRegistryNamespace
 *   IntakeOrchestrationRegistryStatus
 *   IntakeOrchestrationRegistryReadiness
 *   IntakeOrchestrationRegistryPlatform
 *   getIntakeOrchestrationRegistrySummary()
 */

import {
  IntakeOrchestrationFoundationId,
  IntakeOrchestrationFoundationPlatform,
  IntakeOrchestrationFoundationVersion,
} from "./intakeOrchestrationFoundation.ts";
import { IntakeOrchestrationCapabilityRegistryCatalog } from "./intakeOrchestrationRegistryCapabilities.ts";
import { IntakeOrchestrationRegistryCollections } from "./intakeOrchestrationRegistryCollections.ts";
import { IntakeOrchestrationRegistryMetadata } from "./intakeOrchestrationRegistryMetadata.ts";
import {
  IntakeOrchestrationRegistryBoundaries,
  IntakeOrchestrationRegistryOwnership,
} from "./intakeOrchestrationRegistryOwnership.ts";
import { IntakeOrchestrationRegistryPolicyCatalog } from "./intakeOrchestrationRegistryPolicies.ts";
import type {
  IntakeOrchestrationRegistryIdentity,
  IntakeOrchestrationRegistrySummary,
} from "./intakeOrchestrationRegistryTypes.ts";

/** Canonical registry identity. */
export const IntakeOrchestrationRegistryId =
  "NEA-7:2/IntakeOrchestrationRegistry" as const;

/** Human-readable registry name. */
export const IntakeOrchestrationRegistryName =
  "Intake Orchestration Registry" as const;

/** Semantic version. */
export const IntakeOrchestrationRegistryVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntakeOrchestrationRegistryNamespace =
  "nexora.nea.intake-orchestration.registry" as const;

/** Registry status. */
export const IntakeOrchestrationRegistryStatus = "Registry" as const;

/** Immediate next-phase readiness. */
export const IntakeOrchestrationRegistryReadiness = "ReadyForModel" as const;

const identity: IntakeOrchestrationRegistryIdentity = Object.freeze({
  registryId: IntakeOrchestrationRegistryId,
  registryName: IntakeOrchestrationRegistryName,
  registryVersion: IntakeOrchestrationRegistryVersion,
  registryNamespace: IntakeOrchestrationRegistryNamespace,
  layer: "NEA" as const,
  phase: "NEA-7:2" as const,
  stage: "Registry" as const,
  sourcePhase: "NEA-7:2" as const,
  owner: "NEA-7 Intake Orchestration",
  status: IntakeOrchestrationRegistryStatus,
  readiness: IntakeOrchestrationRegistryReadiness,
  foundationId: IntakeOrchestrationFoundationId,
  foundationVersion: IntakeOrchestrationFoundationVersion,
  description:
    "Canonical immutable registry of intake identities, categories, priorities, statuses, reference types, metadata fields, policies, and Foundation-referenced contracts, capabilities, and lifecycle.",
  metadataOnly: true as const,
  immutable: true as const,
});

const dependency = Object.freeze({
  dependencyId: "NEA-7:2/Dependency/NEA71Foundation",
  directPreviousPhaseModule: "intakeOrchestrationFoundation.ts" as const,
  foundationOnly: true as const,
  foundationId: IntakeOrchestrationFoundationId,
  foundationVersion: IntakeOrchestrationFoundationVersion,
  foundationPublicSurfaceOnly: true as const,
  publicIndexDirectImport: false as const,
  laterNeaPhaseImport: false as const,
  dklInternalImport: false as const,
  engineInternalImport: false as const,
  assistantInternalImport: false as const,
  reconstructsFoundation: false as const,
  duplicatesFoundationValues: false as const,
  canonicalPath:
    "NEA-7:2 → NEA-7:1 IntakeOrchestrationFoundationPlatform (exclusive)",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "collections",
  "capabilities",
  "policies",
  "metadata",
  "ownership",
  "boundaries",
  "readiness",
] as const);

const registryApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `NEA-7:2/PublicApi/${exportName}`,
    exportName,
    phase: "NEA-7:2" as const,
    section: "Registry" as const,
    kind,
    version: IntakeOrchestrationRegistryVersion,
    status: IntakeOrchestrationRegistryStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "intakeOrchestrationRegistry.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const IntakeOrchestrationRegistryApiRegistry = Object.freeze([
  registryApi("IntakeOrchestrationRegistryId", "IdentityConstant"),
  registryApi("IntakeOrchestrationRegistryVersion", "IdentityConstant"),
  registryApi("IntakeOrchestrationRegistryName", "IdentityConstant"),
  registryApi("IntakeOrchestrationRegistryNamespace", "IdentityConstant"),
  registryApi("IntakeOrchestrationRegistryStatus", "MetadataConstant"),
  registryApi("IntakeOrchestrationRegistryReadiness", "MetadataConstant"),
  registryApi("IntakeOrchestrationRegistryPlatform", "Aggregate"),
  registryApi("getIntakeOrchestrationRegistrySummary", "Helper"),
]);

/**
 * Canonical immutable Intake Orchestration Registry platform.
 * Nine ordered sections. Metadata only.
 */
export const IntakeOrchestrationRegistryPlatform = Object.freeze({
  identity,
  dependency,
  collections: IntakeOrchestrationRegistryCollections,
  capabilities: IntakeOrchestrationCapabilityRegistryCatalog,
  policies: IntakeOrchestrationRegistryPolicyCatalog,
  metadata: IntakeOrchestrationRegistryMetadata,
  ownership: IntakeOrchestrationRegistryOwnership,
  boundaries: IntakeOrchestrationRegistryBoundaries,
  readiness: Object.freeze({
    readinessId: "NEA-7:2/RegistryReadiness",
    readiness: IntakeOrchestrationRegistryReadiness,
    nextPhase: IntakeOrchestrationRegistryMetadata.nextPhase,
    claimsReadyForModel: true as const,
    claimsReadyForRuntime: false as const,
    claimsRuntimeOrchestrationImplemented: false as const,
    claimsRuntimeAssemblyImplemented: false as const,
    claimsAiImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  }),
  apiRegistry: IntakeOrchestrationRegistryApiRegistry,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: IntakeOrchestrationRegistryStatus,
  nextPhase: IntakeOrchestrationRegistryMetadata.nextPhase,
  downstreamReadiness: IntakeOrchestrationRegistryReadiness,
  foundationPlatform: IntakeOrchestrationFoundationPlatform,
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
  invokesDkl: false as const,
  invokesExecutiveEngine: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/**
 * Deterministic frozen Intake Orchestration Registry summary.
 * Counts are derived exclusively from canonical registry collections.
 */
export function getIntakeOrchestrationRegistrySummary(): IntakeOrchestrationRegistrySummary {
  const meta = IntakeOrchestrationRegistryMetadata;
  return Object.freeze({
    registryId: IntakeOrchestrationRegistryId,
    version: IntakeOrchestrationRegistryVersion,
    name: IntakeOrchestrationRegistryName,
    namespace: IntakeOrchestrationRegistryNamespace,
    layer: "NEA" as const,
    phase: "NEA-7:2" as const,
    status: IntakeOrchestrationRegistryStatus,
    readiness: IntakeOrchestrationRegistryReadiness,
    foundationId: IntakeOrchestrationFoundationId,
    intakeIdentityCount: meta.intakeIdentityCount,
    categoryCount: meta.categoryCount,
    priorityCount: meta.priorityCount,
    statusCount: meta.statusCount,
    referenceTypeCount: meta.referenceTypeCount,
    metadataFieldCount: meta.metadataFieldCount,
    registryPolicyCount: meta.registryPolicyCount,
    contractCount: meta.contractCount,
    capabilityCount: meta.capabilityCount,
    lifecycleEntryCount: meta.lifecycleEntryCount,
    totalRegistryEntryCount: meta.totalEntryCount,
    publicExportCount: 8 as const,
    sectionCount: PLATFORM_SECTIONS.length,
    nextPhase: meta.nextPhase,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}
