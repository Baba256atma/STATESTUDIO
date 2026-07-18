import { ExecutiveOrchestrationDependencyManifest } from "./executiveOrchestrationDependencyManifest.ts";
import { ExecutiveOrchestrationFoundationManifest } from "./executiveOrchestrationFoundationManifest.ts";
import { ExecutiveOrchestrationModelManifest } from "./executiveOrchestrationModelManifest.ts";
import { ExecutiveOrchestrationRegistryManifest } from "./executiveOrchestrationRegistryManifest.ts";
import { ExecutiveOrchestrationValidationManifestSummary } from "./executiveOrchestrationValidationManifestSummary.ts";
import {
  ExecutiveOrchestrationComponentRegistry,
  ExecutiveOrchestrationRegistryPlatform,
} from "./executiveOrchestrationRegistryPlatform.ts";
import type {
  ExecutiveOrchestrationManifestMetadata as ExecutiveOrchestrationManifestMetadataDescriptor,
  ExecutiveOrchestrationManifestSection,
  ExecutiveOrchestrationManifestSectionId,
  ExecutiveOrchestrationManifestSummary as ExecutiveOrchestrationManifestSummaryDescriptor,
  ExecutiveOrchestrationReleaseReadiness,
} from "./executiveOrchestrationManifestTypes.ts";

const section = (
  id: ExecutiveOrchestrationManifestSectionId,
  name: string,
  description: string,
  order: number,
) => Object.freeze({
  id,
  name,
  description,
  order,
  status: "Complete",
  metadataOnly: true,
  immutable: true,
} as const satisfies ExecutiveOrchestrationManifestSection);

const sections = Object.freeze([
  section("Foundation", "Foundation", "ENG-8:1 foundation summary.", 1),
  section("Registry", "Registry", "ENG-8:2 registry inventory.", 2),
  section("Model", "Model", "ENG-8:3 model inventory.", 3),
  section("Validation", "Validation", "ENG-8:4 validation summary.", 4),
  section("DependencyMap", "Dependency Map", "Approved public dependency map.", 5),
  section("Ownership", "Ownership", "Primary and supporting ownership declarations.", 6),
  section("PublicSurface", "Public Surface", "Manifest public API and namespace visibility.", 7),
  section("ManifestMetadata", "Manifest Metadata", "Canonical ENG-8:5 metadata.", 8),
  section("ReleaseReadiness", "Release Readiness", "ReadyForPlatform declarations.", 9),
] as const);

const ExecutiveOrchestrationManifestMetadata = Object.freeze({
  id: "ENG-8:5",
  name: "Executive Orchestration Manifest Platform",
  version: "1.0.0",
  namespace: "nexora.engine.executive.orchestration.manifest",
  description:
    "Canonical immutable metadata manifest aggregating ENG-8:1 through ENG-8:4 public architecture for platform assembly readiness.",
  status: "Stable",
  architectureMode: "MetadataOnly",
  immutability: "DeeplyFrozen",
  runtimeBehavior: "None",
  owner: "ENG-8",
  previousPhase: "ENG-8:4",
  nextPhase: "ENG-8:6",
  readiness: "ReadyForPlatform",
  metadataOnly: true,
  runtimeFree: true,
  immutable: true,
  deeplyFrozen: true,
  deterministic: true,
} as const satisfies ExecutiveOrchestrationManifestMetadataDescriptor);

const releaseReadiness = Object.freeze({
  foundationComplete: true,
  registryComplete: true,
  modelComplete: true,
  validationComplete: true,
  manifestComplete: true,
  readyForPlatform: true,
  status: "ReadyForPlatform",
  declarations: Object.freeze([
    "FoundationComplete",
    "RegistryComplete",
    "ModelComplete",
    "ValidationComplete",
    "ManifestComplete",
    "ReadyForPlatform",
  ] as const),
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const satisfies ExecutiveOrchestrationReleaseReadiness);

const ownership = Object.freeze({
  id: "eng-8-manifest-ownership",
  section: "Ownership",
  name: "Executive Orchestration Ownership Map",
  description:
    "Descriptive ownership map confirming one PrimaryOwner per responsibility and no BUS/OPS/Advisor leakage.",
  responsibilities: Object.freeze(
    ExecutiveOrchestrationRegistryPlatform.responsibilities.map((entry) => Object.freeze({
      responsibilityId: entry.responsibilityId,
      primaryOwnerComponentId: entry.primaryOwnerComponentId,
      supportingComponentIds: entry.supportingComponentIds,
      primaryOwnerCount: 1,
      metadataOnly: true,
      immutable: true,
    } as const)),
  ),
  antiDuplication: Object.freeze({
    everyResponsibilityHasOnePrimaryOwner: true,
    supportingParticipantsExplicit: true,
    noDuplicatedOwnership: true,
    noBusOwnershipLeakage: true,
    noOpsOwnershipLeakage: true,
    noAdvisorOwnershipLeakage: true,
  } as const),
  supportingGateways: Object.freeze(
    ExecutiveOrchestrationComponentRegistry
      .filter(({ componentId }) =>
        componentId === "bus-coordination-gateway"
        || componentId === "ops-coordination-gateway"
      )
      .map(({ componentId, name, ownedResponsibilities }) => Object.freeze({
        componentId,
        name,
        roles: Object.freeze(ownedResponsibilities.map(({ role }) => role)),
      } as const)),
  ),
  status: "Complete",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  deeplyFrozen: true,
} as const);

const publicSurface = Object.freeze({
  id: "eng-8-manifest-public-surface",
  section: "PublicSurface",
  name: "Executive Orchestration Manifest Public Surface",
  description:
    "Immutable metadata describing ENG-8:5 public exports, helpers, namespaces, and release visibility.",
  publicExports: Object.freeze([
    "ExecutiveOrchestrationManifestPlatform",
    "ExecutiveOrchestrationFoundationManifest",
    "ExecutiveOrchestrationRegistryManifest",
    "ExecutiveOrchestrationModelManifest",
    "ExecutiveOrchestrationValidationManifestSummary",
    "ExecutiveOrchestrationDependencyManifest",
    "getExecutiveOrchestrationManifestPlatform",
    "getExecutiveOrchestrationManifestSummary",
  ] as const),
  publicHelperApis: Object.freeze([
    "getExecutiveOrchestrationManifestPlatform",
    "getExecutiveOrchestrationManifestSummary",
  ] as const),
  publicNamespaces: Object.freeze([
    "nexora.engine.executive.orchestration.foundation",
    "nexora.engine.executive.orchestration.registry",
    "nexora.engine.executive.orchestration.model",
    "nexora.engine.executive.orchestration.validation",
    "nexora.engine.executive.orchestration.manifest",
  ] as const),
  releaseVisibility: "ReadyForPlatform",
  status: "Complete",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  deeplyFrozen: true,
} as const);

const ExecutiveOrchestrationManifestSummary = Object.freeze({
  manifestId: "ENG-8:5",
  phase: "ENG-8:5",
  namespace: "nexora.engine.executive.orchestration.manifest",
  owner: "ENG-8",
  sectionCount: 9,
  foundationResponsibilityCount:
    ExecutiveOrchestrationFoundationManifest.responsibilities.count,
  registryComponentCount: ExecutiveOrchestrationRegistryManifest.inventory.components,
  modelCount: ExecutiveOrchestrationModelManifest.inventory.modelCount,
  validationRuleCount:
    ExecutiveOrchestrationValidationManifestSummary.inventory.ruleCount,
  dependencyCount: ExecutiveOrchestrationDependencyManifest.dependencyCount,
  status: "Stable",
  architectureMode: "MetadataOnly",
  immutability: "DeeplyFrozen",
  readiness: "ReadyForPlatform",
  nextPhase: "ENG-8:6",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const satisfies ExecutiveOrchestrationManifestSummaryDescriptor);

/**
 * Canonical ENG-8:5 Executive Orchestration Manifest Platform.
 * Aggregates ENG-8:1 through ENG-8:4 through approved public APIs only.
 */
export const ExecutiveOrchestrationManifestPlatform = Object.freeze({
  foundation: ExecutiveOrchestrationFoundationManifest,
  registry: ExecutiveOrchestrationRegistryManifest,
  model: ExecutiveOrchestrationModelManifest,
  validation: ExecutiveOrchestrationValidationManifestSummary,
  dependencyMap: ExecutiveOrchestrationDependencyManifest,
  ownership,
  publicSurface,
  manifestMetadata: ExecutiveOrchestrationManifestMetadata,
  releaseReadiness,
  sections,
  summary: ExecutiveOrchestrationManifestSummary,
  compatibility: Object.freeze({
    eng81: "Compatible",
    eng82: "Compatible",
    eng83: "Compatible",
    eng84: "Compatible",
    status: "Compatible",
    metadataOnly: true,
    immutable: true,
  } as const),
  status: Object.freeze({
    stable: "Stable",
    metadataOnly: "MetadataOnly",
    runtimeFree: "RuntimeFree",
    deeplyFrozen: "DeeplyFrozen",
    readyForPlatform: "ReadyForPlatform",
  } as const),
  consumedSurfaces: Object.freeze({
    foundation: "executiveOrchestrationFoundation.ts",
    registry: "executiveOrchestrationRegistryPlatform.ts",
    model: "executiveOrchestrationModelPlatform.ts",
    validation: "executiveOrchestrationValidationRunner.ts",
  } as const),
  metadataOnly: true,
  runtimeFree: true,
  immutable: true,
  deeplyFrozen: true,
  deterministic: true,
  readyForPlatform: true,
} as const);

export const getExecutiveOrchestrationManifestPlatform = () =>
  ExecutiveOrchestrationManifestPlatform;

export const getExecutiveOrchestrationManifestSummary = () =>
  ExecutiveOrchestrationManifestSummary;

export {
  ExecutiveOrchestrationDependencyManifest,
  ExecutiveOrchestrationFoundationManifest,
  ExecutiveOrchestrationModelManifest,
  ExecutiveOrchestrationRegistryManifest,
  ExecutiveOrchestrationValidationManifestSummary,
};
