import {
  ExecutiveReasoningCertificationPlatform,
} from "./executiveReasoningCertificationIndex.ts";
import {
  ExecutiveReasoningFreezePlatform,
} from "./executiveReasoningFreezeIndex.ts";
import {
  ExecutiveReasoningManifestPlatform,
} from "./executiveReasoningManifestPlatform.ts";
import {
  ExecutiveReasoningModelPlatform,
} from "./executiveReasoningModelIndex.ts";
import {
  ExecutiveConfidenceLevels,
  ExecutiveEvidenceCategories,
  ExecutiveInferenceTypes,
  ExecutiveReasoningDomains,
  ExecutiveReasoningLifecycle,
  ExecutiveReasoningPipelineContracts,
  ExecutiveReasoningPipelineFoundation,
} from "./executiveReasoningPipelineFoundation.ts";
import {
  ExecutiveReasoningPlatform,
} from "./executiveReasoningPlatformIndex.ts";
import {
  ExecutiveReasoningCapabilityRegistry,
  ExecutiveReasoningComponentRegistry,
  ExecutiveReasoningLifecycleRegistry,
  ExecutiveReasoningRegistryMetadata,
  getReasoningCapabilityById,
  getReasoningComponentById,
  getReasoningRegistrySummary,
} from "./executiveReasoningRegistryIndex.ts";
import {
  ExecutiveReasoningValidationPlatform,
} from "./executiveReasoningValidationPlatform.ts";

export const ExecutiveReasoningPublicIndexId = "ENG-6:9" as const;
export const ExecutiveReasoningPublicIndexVersion = "1.0.0" as const;
export const ExecutiveReasoningPublicIndexName = "Executive Reasoning Public Index" as const;
export const ExecutiveReasoningPublicIndexDescription =
  "Canonical immutable public release surface for the complete ENG-6 Executive Reasoning Platform." as const;
export const ExecutiveReasoningPublicIndexNamespace =
  "nexora.engine.executive.reasoning.public" as const;

export const ExecutiveReasoningPublicIndexStatus = Object.freeze({
  released: "Released",
  certified: "Certified",
  frozen: "Frozen",
  stable: "Stable",
  metadataOnly: "MetadataOnly",
  publicApiStable: "Stable",
} as const);

type OwnerPhase =
  | "ENG-6:1"
  | "ENG-6:2"
  | "ENG-6:3"
  | "ENG-6:4"
  | "ENG-6:5"
  | "ENG-6:6"
  | "ENG-6:7"
  | "ENG-6:8"
  | "ENG-6:9";

const namespaces = Object.freeze({
  "ENG-6:1": "nexora.engine.executive.reasoning.foundation",
  "ENG-6:2": "nexora.engine.executive.reasoning.registry",
  "ENG-6:3": "nexora.engine.executive.reasoning.model",
  "ENG-6:4": "nexora.engine.executive.reasoning.validation",
  "ENG-6:5": "nexora.engine.executive.reasoning.manifest",
  "ENG-6:6": "nexora.engine.executive.reasoning.platform",
  "ENG-6:7": "nexora.engine.executive.reasoning.certification",
  "ENG-6:8": "nexora.engine.executive.reasoning.freeze",
  "ENG-6:9": ExecutiveReasoningPublicIndexNamespace,
} as const);

const api = (name: string, originatingPhase: OwnerPhase) => Object.freeze({
  name,
  originatingPhase,
  namespace: namespaces[originatingPhase],
  version: "1.0.0",
  stability: "Stable" as const,
  releaseStatus: "Released" as const,
} as const);

const entries = (names: readonly string[], phase: OwnerPhase) =>
  Object.freeze(names.map((name) => api(name, phase)));

const foundationApis = Object.freeze([
  "ExecutiveReasoningPipelineFoundation",
  "ExecutiveReasoningPipelineContracts",
  "ExecutiveReasoningDomains",
  "ExecutiveReasoningLifecycle",
  "ExecutiveEvidenceCategories",
  "ExecutiveConfidenceLevels",
  "ExecutiveInferenceTypes",
] as const);

const registryApis = Object.freeze([
  "ExecutiveReasoningCapabilityRegistry",
  "getReasoningCapabilityById",
  "ExecutiveReasoningComponentRegistry",
  "getReasoningComponentById",
  "ExecutiveReasoningLifecycleRegistry",
  "ExecutiveReasoningRegistryMetadata",
  "getReasoningRegistrySummary",
] as const);

const modelApis = Object.freeze([
  "ExecutiveReasoningModelMetadata",
  "ExecutiveReasoningModelPlatform",
  "ExecutiveReasoningModelRegistry",
  "ExecutiveReasoningModels",
  "getExecutiveReasoningModels",
  "ExecutiveReasoningRelationshipModel",
  "getExecutiveReasoningModelMetadata",
  "getExecutiveReasoningModelSummary",
] as const);

const validationApis = Object.freeze([
  "ExecutiveReasoningValidationPlatform",
  "ExecutiveReasoningValidationRegistry",
  "ExecutiveReasoningValidationManifest",
  "ExecutiveReasoningValidationRunner",
  "ExecutiveReasoningValidationMetadata",
  "getExecutiveReasoningValidation",
  "getExecutiveReasoningValidationSummary",
  "getExecutiveReasoningValidationStatus",
] as const);

const manifestApis = Object.freeze([
  "ExecutiveReasoningManifestPlatform",
  "ExecutiveReasoningManifest",
  "ExecutiveReasoningDependencyMap",
  "ExecutiveReasoningOwnershipMap",
  "ExecutiveReasoningCompatibility",
  "getExecutiveReasoningManifest",
  "getExecutiveReasoningManifestMetadata",
  "getExecutiveReasoningManifestSummary",
] as const);

const platformApis = Object.freeze([
  "ExecutiveReasoningPlatform",
  "ExecutiveReasoningPlatformMetadata",
  "ExecutiveReasoningPlatformRegistry",
  "ExecutiveReasoningPlatformSummary",
  "getExecutiveReasoningPlatform",
  "getExecutiveReasoningPlatformMetadata",
  "getExecutiveReasoningPlatformRegistry",
  "getExecutiveReasoningPlatformSummary",
] as const);

const certificationApis = Object.freeze([
  "ExecutiveReasoningCertificationPlatform",
  "ExecutiveReasoningCertificationRegistry",
  "ExecutiveReasoningCertificationManifest",
  "ExecutiveReasoningCertificationSummary",
  "getExecutiveReasoningCertification",
  "getExecutiveReasoningCertificationMetadata",
  "getExecutiveReasoningCertificationSummary",
  "getExecutiveReasoningCertificationGateById",
] as const);

/** Compatibility originates in ENG-6:5; freeze adds the remaining approved freeze exports. */
const freezeApis = Object.freeze([
  "ExecutiveReasoningFreezePlatform",
  "ExecutiveReasoningFreezeRegistry",
  "ExecutiveReasoningFreezeMetadata",
  "ExecutiveReasoningExtensionPolicy",
  "getExecutiveReasoningFreeze",
  "getExecutiveReasoningFreezeMetadata",
  "getExecutiveReasoningFreezeSummary",
] as const);

const publicIndexApis = Object.freeze([
  "ExecutiveReasoningPlatformPublicFoundation",
  "ExecutiveReasoningPublicApiRegistry",
  "ExecutiveReasoningPublicIndexId",
  "ExecutiveReasoningPublicIndexVersion",
  "ExecutiveReasoningPublicIndexName",
  "ExecutiveReasoningPublicIndexDescription",
  "ExecutiveReasoningPublicIndexNamespace",
  "ExecutiveReasoningPublicIndexStatus",
  "getExecutiveReasoningPublicFoundation",
  "getExecutiveReasoningPublicMetadata",
  "getExecutiveReasoningPublicApiRegistry",
  "getExecutiveReasoningReleaseSummary",
] as const);

export const ExecutiveReasoningPublicApiRegistry = Object.freeze([
  ...entries(foundationApis, "ENG-6:1"),
  ...entries(registryApis, "ENG-6:2"),
  ...entries(modelApis, "ENG-6:3"),
  ...entries(validationApis, "ENG-6:4"),
  ...entries(manifestApis, "ENG-6:5"),
  ...entries(platformApis, "ENG-6:6"),
  ...entries(certificationApis, "ENG-6:7"),
  ...entries(freezeApis, "ENG-6:8"),
  ...entries(publicIndexApis, "ENG-6:9"),
]);

const foundationSurface = Object.freeze({
  foundation: ExecutiveReasoningPipelineFoundation,
  contracts: ExecutiveReasoningPipelineContracts,
  domains: ExecutiveReasoningDomains,
  lifecycle: ExecutiveReasoningLifecycle,
  evidenceCategories: ExecutiveEvidenceCategories,
  confidenceLevels: ExecutiveConfidenceLevels,
  inferenceTypes: ExecutiveInferenceTypes,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const registrySurface = Object.freeze({
  components: ExecutiveReasoningComponentRegistry,
  capabilities: ExecutiveReasoningCapabilityRegistry,
  lifecycle: ExecutiveReasoningLifecycleRegistry,
  metadata: ExecutiveReasoningRegistryMetadata,
  getComponentById: getReasoningComponentById,
  getCapabilityById: getReasoningCapabilityById,
  getSummary: getReasoningRegistrySummary,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const publicMetadata = Object.freeze({
  publicIndexId: ExecutiveReasoningPublicIndexId,
  version: ExecutiveReasoningPublicIndexVersion,
  name: ExecutiveReasoningPublicIndexName,
  description: ExecutiveReasoningPublicIndexDescription,
  namespace: ExecutiveReasoningPublicIndexNamespace,
  owner: "ENG-6",
  releaseStatus: "Released",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  publicApiStatus: "Stable",
  status: ExecutiveReasoningPublicIndexStatus,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);

const releaseSummary = Object.freeze({
  platformId: "ENG-6",
  publicIndexId: ExecutiveReasoningPublicIndexId,
  version: ExecutiveReasoningPublicIndexVersion,
  name: ExecutiveReasoningPublicIndexName,
  namespace: ExecutiveReasoningPublicIndexNamespace,
  releaseStatus: "Released",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  publicApiStatus: "Stable",
  lockIdentifier: "ENG-6-LOCKED",
  sectionCount: 9,
  publicApiCount: ExecutiveReasoningPublicApiRegistry.length,
  completedPhaseCount: 9,
  ownershipStatus: "Protected",
  nextConsumerPolicy: "executiveReasoningPublicIndex.ts",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);

const publicIndex = Object.freeze({
  metadata: publicMetadata,
  apiRegistry: ExecutiveReasoningPublicApiRegistry,
  releaseSummary,
  status: ExecutiveReasoningPublicIndexStatus,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

/**
 * Official immutable public namespace for the Executive Reasoning Pipeline.
 * Sole supported public entry point for ENG-6.
 */
export const ExecutiveReasoningPlatformPublicFoundation = Object.freeze({
  foundation: foundationSurface,
  registry: registrySurface,
  model: ExecutiveReasoningModelPlatform,
  validation: ExecutiveReasoningValidationPlatform,
  manifest: ExecutiveReasoningManifestPlatform,
  platform: ExecutiveReasoningPlatform,
  certification: ExecutiveReasoningCertificationPlatform,
  freeze: ExecutiveReasoningFreezePlatform,
  publicIndex,
} as const);

export const getExecutiveReasoningPublicFoundation = () => ExecutiveReasoningPlatformPublicFoundation;
export const getExecutiveReasoningPublicMetadata = () => publicMetadata;
export const getExecutiveReasoningPublicApiRegistry = () => ExecutiveReasoningPublicApiRegistry;
export const getExecutiveReasoningReleaseSummary = () => releaseSummary;
