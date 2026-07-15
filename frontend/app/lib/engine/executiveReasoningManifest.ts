import { ExecutiveReasoningCompatibility } from "./executiveReasoningCompatibility.ts";
import { ExecutiveReasoningDependencyMap } from "./executiveReasoningDependencyMap.ts";
import {
  ExecutiveReasoningManifestMetadata,
  ExecutiveReasoningManifestReleaseMetadata,
} from "./executiveReasoningManifestMetadata.ts";
import { ExecutiveReasoningOwnershipMap } from "./executiveReasoningOwnershipMap.ts";
import { ExecutiveReasoningPipelineFoundation } from "./executiveReasoningPipelineFoundation.ts";
import {
  ExecutiveReasoningModelMetadata,
  getExecutiveReasoningModelSummary,
} from "./executiveReasoningModelIndex.ts";
import {
  ExecutiveReasoningRegistryMetadata,
  getReasoningRegistrySummary,
} from "./executiveReasoningRegistryIndex.ts";
import {
  ExecutiveReasoningValidationMetadata,
  getExecutiveReasoningValidationStatus,
  getExecutiveReasoningValidationSummary,
} from "./executiveReasoningValidationPlatform.ts";

const api = (
  name: string,
  originatingPhase: "ENG-6:1" | "ENG-6:2" | "ENG-6:3" | "ENG-6:4",
  namespace: string,
  version = "1.0.0",
) => Object.freeze({
  name,
  originatingPhase,
  namespace,
  version,
  status: "Published" as const,
  metadataOnly: true,
  immutable: true,
} as const);

export const ExecutiveReasoningPublicSurfaceInventory = Object.freeze([
  api("ExecutiveReasoningPipelineFoundation", "ENG-6:1", ExecutiveReasoningPipelineFoundation.namespace),
  api("ExecutiveReasoningPipelineContracts", "ENG-6:1", ExecutiveReasoningPipelineFoundation.namespace),
  api("ExecutiveReasoningDomains", "ENG-6:1", ExecutiveReasoningPipelineFoundation.namespace),
  api("ExecutiveReasoningLifecycle", "ENG-6:1", ExecutiveReasoningPipelineFoundation.namespace),
  api("ExecutiveEvidenceCategories", "ENG-6:1", ExecutiveReasoningPipelineFoundation.namespace),
  api("ExecutiveConfidenceLevels", "ENG-6:1", ExecutiveReasoningPipelineFoundation.namespace),
  api("ExecutiveInferenceTypes", "ENG-6:1", ExecutiveReasoningPipelineFoundation.namespace),
  api("ExecutiveReasoningCapabilityRegistry", "ENG-6:2", ExecutiveReasoningRegistryMetadata.registryNamespace),
  api("getReasoningCapabilityById", "ENG-6:2", ExecutiveReasoningRegistryMetadata.registryNamespace),
  api("ExecutiveReasoningComponentRegistry", "ENG-6:2", ExecutiveReasoningRegistryMetadata.registryNamespace),
  api("getReasoningComponentById", "ENG-6:2", ExecutiveReasoningRegistryMetadata.registryNamespace),
  api("ExecutiveReasoningLifecycleRegistry", "ENG-6:2", ExecutiveReasoningRegistryMetadata.registryNamespace),
  api("ExecutiveReasoningRegistryMetadata", "ENG-6:2", ExecutiveReasoningRegistryMetadata.registryNamespace),
  api("getReasoningRegistrySummary", "ENG-6:2", ExecutiveReasoningRegistryMetadata.registryNamespace),
  api("ExecutiveReasoningModelMetadata", "ENG-6:3", ExecutiveReasoningModelMetadata.namespace),
  api("ExecutiveReasoningModelPlatform", "ENG-6:3", ExecutiveReasoningModelMetadata.namespace),
  api("ExecutiveReasoningModelRegistry", "ENG-6:3", ExecutiveReasoningModelMetadata.namespace),
  api("ExecutiveReasoningModels", "ENG-6:3", ExecutiveReasoningModelMetadata.namespace),
  api("getExecutiveReasoningModels", "ENG-6:3", ExecutiveReasoningModelMetadata.namespace),
  api("ExecutiveReasoningRelationshipModel", "ENG-6:3", ExecutiveReasoningModelMetadata.namespace),
  api("getExecutiveReasoningModelMetadata", "ENG-6:3", ExecutiveReasoningModelMetadata.namespace),
  api("getExecutiveReasoningModelSummary", "ENG-6:3", ExecutiveReasoningModelMetadata.namespace),
  api("ExecutiveReasoningValidationPlatform", "ENG-6:4", ExecutiveReasoningValidationMetadata.namespace),
  api("ExecutiveReasoningValidationRegistry", "ENG-6:4", ExecutiveReasoningValidationMetadata.namespace),
  api("ExecutiveReasoningValidationManifest", "ENG-6:4", ExecutiveReasoningValidationMetadata.namespace),
  api("ExecutiveReasoningValidationRunner", "ENG-6:4", ExecutiveReasoningValidationMetadata.namespace),
  api("ExecutiveReasoningValidationMetadata", "ENG-6:4", ExecutiveReasoningValidationMetadata.namespace),
  api("getExecutiveReasoningValidation", "ENG-6:4", ExecutiveReasoningValidationMetadata.namespace),
  api("getExecutiveReasoningValidationSummary", "ENG-6:4", ExecutiveReasoningValidationMetadata.namespace),
  api("getExecutiveReasoningValidationStatus", "ENG-6:4", ExecutiveReasoningValidationMetadata.namespace),
] as const);

const registrySummary = getReasoningRegistrySummary();
const modelSummary = getExecutiveReasoningModelSummary();
const validationSummary = getExecutiveReasoningValidationSummary();

export const ExecutiveReasoningManifest = Object.freeze({
  Foundation: Object.freeze({
    phase: "ENG-6:1",
    platformId: ExecutiveReasoningPipelineFoundation.platformId,
    namespace: ExecutiveReasoningPipelineFoundation.namespace,
    version: ExecutiveReasoningPipelineFoundation.version,
    owner: ExecutiveReasoningPipelineFoundation.owner,
    metadataOnly: true,
    immutable: true,
  } as const),
  Registry: Object.freeze({
    phase: "ENG-6:2",
    registryId: ExecutiveReasoningRegistryMetadata.registryId,
    namespace: ExecutiveReasoningRegistryMetadata.registryNamespace,
    version: ExecutiveReasoningRegistryMetadata.registryVersion,
    owner: ExecutiveReasoningRegistryMetadata.owner,
    componentCount: registrySummary.componentCount,
    capabilityCount: registrySummary.capabilityCount,
    lifecycleStageCount: registrySummary.lifecycleStageCount,
    metadataOnly: true,
    immutable: true,
  } as const),
  Model: Object.freeze({
    phase: "ENG-6:3",
    modelPlatformId: ExecutiveReasoningModelMetadata.modelPlatformId,
    namespace: ExecutiveReasoningModelMetadata.namespace,
    version: ExecutiveReasoningModelMetadata.version,
    owner: ExecutiveReasoningModelMetadata.owner,
    modelCount: modelSummary.modelCount,
    registryEntryCount: modelSummary.registryEntryCount,
    metadataOnly: true,
    immutable: true,
  } as const),
  Validation: Object.freeze({
    phase: "ENG-6:4",
    validationId: ExecutiveReasoningValidationMetadata.validationId,
    namespace: ExecutiveReasoningValidationMetadata.namespace,
    version: ExecutiveReasoningValidationMetadata.validationVersion,
    owner: ExecutiveReasoningValidationMetadata.owner,
    status: getExecutiveReasoningValidationStatus(),
    totalRuleCount: validationSummary.totalRuleCount,
    domainCount: validationSummary.domainCount,
    metadataOnly: true,
    immutable: true,
  } as const),
  Manifest: Object.freeze({
    phase: "ENG-6:5",
    manifestId: ExecutiveReasoningManifestMetadata.manifestId,
    namespace: ExecutiveReasoningManifestMetadata.namespace,
    version: ExecutiveReasoningManifestMetadata.version,
    owner: ExecutiveReasoningManifestMetadata.owner,
    sectionCount: ExecutiveReasoningManifestMetadata.sectionCount,
    metadataOnly: true,
    immutable: true,
  } as const),
  DependencyMap: ExecutiveReasoningDependencyMap,
  Ownership: ExecutiveReasoningOwnershipMap,
  Compatibility: ExecutiveReasoningCompatibility,
  PublicSurface: Object.freeze({
    id: "eng-6-public-surface",
    name: "Executive Reasoning Public Surface Inventory",
    apis: ExecutiveReasoningPublicSurfaceInventory,
    apiCount: ExecutiveReasoningPublicSurfaceInventory.length,
    originatingPhases: Object.freeze(["ENG-6:1", "ENG-6:2", "ENG-6:3", "ENG-6:4"] as const),
    exportPolicy: "ApprovedExportsOnly",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const),
  ReleaseMetadata: ExecutiveReasoningManifestReleaseMetadata,
} as const);
