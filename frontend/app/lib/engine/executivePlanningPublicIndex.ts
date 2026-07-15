import {
  ExecutivePlanningCapabilityRegistry,
  ExecutivePlanningContracts,
  ExecutivePlanningFoundation,
  ExecutivePlanningLifecycle,
  ExecutivePlanningMetadata,
  ExecutivePlanningOwnership,
} from "./executivePlanningIndex.ts";
import {
  ExecutivePlanningCertificationPlatform,
} from "./executivePlanningCertificationIndex.ts";
import {
  ExecutivePlanningFreezePlatform,
} from "./executivePlanningFreezeIndex.ts";
import {
  ExecutivePlanningManifestPlatform,
} from "./executivePlanningManifestIndex.ts";
import {
  ExecutivePlanningModelPlatform,
} from "./executivePlanningModelIndex.ts";
import {
  ExecutivePlanningPlatform,
} from "./executivePlanningPlatformIndex.ts";
import {
  ExecutivePlanningRegistryPlatform,
} from "./executivePlanningRegistryIndex.ts";
import {
  ExecutivePlanningValidationPlatform,
} from "./executivePlanningValidationIndex.ts";

export const ExecutivePlanningPublicIndexId = "ENG-5:9" as const;
export const ExecutivePlanningPublicIndexVersion = "1.0.0" as const;
export const ExecutivePlanningPublicIndexName = "Executive Planning Public Index" as const;
export const ExecutivePlanningPublicIndexDescription =
  "Canonical immutable public release surface for the complete ENG-5 Executive Planning Platform." as const;
export const ExecutivePlanningPublicIndexNamespace =
  "nexora.engine.executive.planning.public" as const;

export const ExecutivePlanningPublicIndexStatus = Object.freeze({
  released: "Released",
  certified: "Certified",
  frozen: "Frozen",
  metadataOnly: "MetadataOnly",
  publicApiStable: "PublicApiStable",
} as const);

type OwnerPhase =
  | "ENG-5:1"
  | "ENG-5:2"
  | "ENG-5:3"
  | "ENG-5:4"
  | "ENG-5:5"
  | "ENG-5:6"
  | "ENG-5:7"
  | "ENG-5:8"
  | "ENG-5:9";

type ApiCategory =
  | "Aggregate"
  | "Collection"
  | "Helper"
  | "Metadata"
  | "PublicIndex";

const categorize = (exportName: string, phase: OwnerPhase): ApiCategory => {
  if (phase === "ENG-5:9") return "PublicIndex";
  if (exportName.startsWith("get") || exportName.startsWith("is")) return "Helper";
  if (
    exportName.endsWith("Metadata")
    || exportName.endsWith("Status")
    || exportName.endsWith("Summary")
    || exportName.endsWith("Description")
    || exportName.endsWith("Id")
    || exportName.endsWith("Version")
    || exportName.endsWith("Name")
    || exportName.endsWith("Namespace")
  ) return "Metadata";
  if (
    exportName === "ExecutivePlanningFoundation"
    || exportName === "ExecutivePlanningRegistryPlatform"
    || exportName === "ExecutivePlanningModelPlatform"
    || exportName === "ExecutivePlanningValidationPlatform"
    || exportName === "ExecutivePlanningManifestPlatform"
    || exportName === "ExecutivePlanningPlatform"
    || exportName === "ExecutivePlanningCertificationPlatform"
    || exportName === "ExecutivePlanningFreezePlatform"
  ) return "Aggregate";
  return "Collection";
};

const api = (exportName: string, owningPhase: OwnerPhase) => {
  const category = categorize(exportName, owningPhase);
  return Object.freeze({
    apiId: `${owningPhase}:${exportName}`,
    exportName,
    owningPhase,
    category,
    publicStatus: "Public",
  } as const);
};

const entries = (names: readonly string[], phase: OwnerPhase) =>
  names.map((name) => api(name, phase));

const foundationApis = Object.freeze([
  "ExecutivePlanningCapabilityRegistry",
  "ExecutivePlanningContracts",
  "ExecutivePlanningFoundation",
  "ExecutivePlanningLifecycle",
  "ExecutivePlanningMetadata",
  "ExecutivePlanningOwnership",
] as const);

const registryApis = Object.freeze([
  "ExecutivePlanTypeRegistry",
  "ExecutivePlanningDependencyRegistry",
  "ExecutivePlanningGraphEdgeRegistry",
  "ExecutivePlanningGraphNodeRegistry",
  "ExecutivePlanningParallelModeRegistry",
  "ExecutivePlanningPriorityRegistry",
  "ExecutivePlanningRegistryPlatform",
  "ExecutivePlanningRegistryPlatformDescription",
  "ExecutivePlanningRegistryPlatformId",
  "ExecutivePlanningRegistryPlatformName",
  "ExecutivePlanningRegistryPlatformNamespace",
  "ExecutivePlanningRegistryPlatformStatus",
  "ExecutivePlanningRegistryPlatformVersion",
  "ExecutivePlanningRetryStrategyRegistry",
  "ExecutivePlanningStepRegistry",
  "getExecutivePlanTypeById",
  "getExecutivePlanTypeRegistry",
  "getExecutivePlanningDependencyById",
  "getExecutivePlanningDependencyRegistry",
  "getExecutivePlanningGraphEdgeById",
  "getExecutivePlanningGraphNodeById",
  "getExecutivePlanningGraphRegistries",
  "getExecutivePlanningParallelModeById",
  "getExecutivePlanningPolicyRegistries",
  "getExecutivePlanningPriorityById",
  "getExecutivePlanningRegistryEntryById",
  "getExecutivePlanningRegistryInventory",
  "getExecutivePlanningRegistryPlatform",
  "getExecutivePlanningRegistryPlatformMetadata",
  "getExecutivePlanningRetryStrategyById",
  "getExecutivePlanningStepById",
  "getExecutivePlanningStepRegistry",
] as const);

const modelApis = Object.freeze([
  "ExecutivePlanModels",
  "ExecutivePlanningDependencyModels",
  "ExecutivePlanningGraphModels",
  "ExecutivePlanningModelPlatform",
  "ExecutivePlanningModelPlatformDescription",
  "ExecutivePlanningModelPlatformId",
  "ExecutivePlanningModelPlatformName",
  "ExecutivePlanningModelPlatformNamespace",
  "ExecutivePlanningModelPlatformStatus",
  "ExecutivePlanningModelPlatformVersion",
  "ExecutivePlanningOutcomeModels",
  "ExecutivePlanningStepModels",
  "getExecutivePlanModel",
  "getExecutivePlanModels",
  "getExecutivePlanningDependencyModel",
  "getExecutivePlanningDependencyModels",
  "getExecutivePlanningGraphModel",
  "getExecutivePlanningGraphModels",
  "getExecutivePlanningModelById",
  "getExecutivePlanningModelInventory",
  "getExecutivePlanningModelMetadata",
  "getExecutivePlanningModelPlatform",
  "getExecutivePlanningOutcomeModel",
  "getExecutivePlanningOutcomeModels",
  "getExecutivePlanningStepModel",
  "getExecutivePlanningStepModels",
] as const);

const validationApis = Object.freeze([
  "ExecutivePlanningFoundationValidation",
  "ExecutivePlanningModelValidation",
  "ExecutivePlanningOwnershipValidation",
  "ExecutivePlanningPublicApiValidation",
  "ExecutivePlanningRegistryValidation",
  "ExecutivePlanningValidationPlatform",
  "ExecutivePlanningValidationPlatformDescription",
  "ExecutivePlanningValidationPlatformId",
  "ExecutivePlanningValidationPlatformName",
  "ExecutivePlanningValidationPlatformNamespace",
  "ExecutivePlanningValidationPlatformStatus",
  "ExecutivePlanningValidationPlatformVersion",
  "getExecutivePlanningValidationMetadata",
  "getExecutivePlanningValidationPlatform",
  "getExecutivePlanningValidationRuleById",
  "getExecutivePlanningValidationSummary",
] as const);

const manifestApis = Object.freeze([
  "ExecutivePlanningCompatibilityManifest",
  "ExecutivePlanningComponentManifest",
  "ExecutivePlanningDependencyManifest",
  "ExecutivePlanningManifestPlatform",
  "ExecutivePlanningManifestPlatformDescription",
  "ExecutivePlanningManifestPlatformId",
  "ExecutivePlanningManifestPlatformName",
  "ExecutivePlanningManifestPlatformNamespace",
  "ExecutivePlanningManifestPlatformStatus",
  "ExecutivePlanningManifestPlatformVersion",
  "ExecutivePlanningOwnershipManifest",
  "ExecutivePlanningReleaseManifest",
  "getExecutivePlanningManifestComponentById",
  "getExecutivePlanningManifestInventory",
  "getExecutivePlanningManifestMetadata",
  "getExecutivePlanningManifestPlatform",
  "getExecutivePlanningManifestSummary",
] as const);

const platformApis = Object.freeze([
  "ExecutivePlanningPlatform",
  "ExecutivePlanningPlatformDescription",
  "ExecutivePlanningPlatformId",
  "ExecutivePlanningPlatformMetadata",
  "ExecutivePlanningPlatformName",
  "ExecutivePlanningPlatformNamespace",
  "ExecutivePlanningPlatformRegistry",
  "ExecutivePlanningPlatformStatus",
  "ExecutivePlanningPlatformSummary",
  "ExecutivePlanningPlatformVersion",
  "getExecutivePlanningPlatform",
  "getExecutivePlanningPlatformInventory",
  "getExecutivePlanningPlatformMetadata",
  "getExecutivePlanningPlatformRegistry",
  "getExecutivePlanningPlatformSummary",
] as const);

const certificationApis = Object.freeze([
  "ExecutivePlanningCertificationCategories",
  "ExecutivePlanningCertificationGates",
  "ExecutivePlanningCertificationManifest",
  "ExecutivePlanningCertificationPlatform",
  "ExecutivePlanningCertificationPlatformDescription",
  "ExecutivePlanningCertificationPlatformId",
  "ExecutivePlanningCertificationPlatformName",
  "ExecutivePlanningCertificationPlatformNamespace",
  "ExecutivePlanningCertificationPlatformStatus",
  "ExecutivePlanningCertificationPlatformVersion",
  "ExecutivePlanningCertificationRegistry",
  "ExecutivePlanningCertificationSummary",
  "getExecutivePlanningCertificationGateById",
  "getExecutivePlanningCertificationGateCount",
  "getExecutivePlanningCertificationInventory",
  "getExecutivePlanningCertificationMetadata",
  "getExecutivePlanningCertificationPlatform",
  "getExecutivePlanningCertificationRegistry",
  "getExecutivePlanningCertificationStatus",
  "getExecutivePlanningCertificationSummary",
  "isExecutivePlanningCertified",
  "isExecutivePlanningReadyForFreeze",
] as const);

const freezeApis = Object.freeze([
  "ExecutivePlanningFreezeCompatibility",
  "ExecutivePlanningFreezeManifest",
  "ExecutivePlanningFreezeMetadata",
  "ExecutivePlanningFreezePlatform",
  "ExecutivePlanningFreezePlatformDescription",
  "ExecutivePlanningFreezePlatformId",
  "ExecutivePlanningFreezePlatformName",
  "ExecutivePlanningFreezePlatformNamespace",
  "ExecutivePlanningFreezePlatformStatus",
  "ExecutivePlanningFreezePlatformVersion",
  "ExecutivePlanningFreezeRegistry",
  "getExecutivePlanningFreezeEntryById",
  "getExecutivePlanningFreezeMetadata",
  "getExecutivePlanningFreezePlatform",
  "getExecutivePlanningFreezeRegistry",
  "getExecutivePlanningFreezeSummary",
  "isExecutivePlanningFrozen",
  "isExecutivePlanningReadyForPublicIndex",
] as const);

const publicIndexApis = Object.freeze([
  "ExecutivePlanningPlatformPublicFoundation",
  "ExecutivePlanningPublicApiRegistry",
  "ExecutivePlanningPublicIndexId",
  "ExecutivePlanningPublicIndexVersion",
  "ExecutivePlanningPublicIndexName",
  "ExecutivePlanningPublicIndexNamespace",
  "ExecutivePlanningPublicIndexDescription",
  "ExecutivePlanningPublicIndexStatus",
  "getExecutivePlanningPublicFoundation",
  "getExecutivePlanningPublicMetadata",
  "getExecutivePlanningPublicApiRegistry",
  "getExecutivePlanningReleaseSummary",
] as const);

export const ExecutivePlanningPublicApiRegistry = Object.freeze([
  ...entries(foundationApis, "ENG-5:1"),
  ...entries(registryApis, "ENG-5:2"),
  ...entries(modelApis, "ENG-5:3"),
  ...entries(validationApis, "ENG-5:4"),
  ...entries(manifestApis, "ENG-5:5"),
  ...entries(platformApis, "ENG-5:6"),
  ...entries(certificationApis, "ENG-5:7"),
  ...entries(freezeApis, "ENG-5:8"),
  ...entries(publicIndexApis, "ENG-5:9"),
]);

const foundationSurface = Object.freeze({
  foundation: ExecutivePlanningFoundation,
  contracts: ExecutivePlanningContracts,
  capabilities: ExecutivePlanningCapabilityRegistry,
  lifecycle: ExecutivePlanningLifecycle,
  ownership: ExecutivePlanningOwnership,
  metadata: ExecutivePlanningMetadata,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const publicMetadata = Object.freeze({
  publicIndexId: ExecutivePlanningPublicIndexId,
  version: ExecutivePlanningPublicIndexVersion,
  name: ExecutivePlanningPublicIndexName,
  namespace: ExecutivePlanningPublicIndexNamespace,
  description: ExecutivePlanningPublicIndexDescription,
  owner: "ENG-5",
  status: ExecutivePlanningPublicIndexStatus,
  releaseStatus: "Released",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  metadataOnly: true,
  publicApiStable: "PublicApiStable",
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  executionOwner: "OPS",
} as const);

const releaseSummary = Object.freeze({
  platformId: "ENG-5",
  publicIndexId: ExecutivePlanningPublicIndexId,
  version: ExecutivePlanningPublicIndexVersion,
  releaseStatus: "Released",
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  metadataOnly: "MetadataOnly",
  publicApiStatus: "PublicApiStable",
  lockIdentifier: "ENG-5-LOCKED",
  namespace: ExecutivePlanningPublicIndexNamespace,
  sectionCount: 9,
  publicApiCount: ExecutivePlanningPublicApiRegistry.length,
  completedPhaseCount: 8,
  ownershipStatus: "Protected",
  executionOwner: "OPS",
  nextConsumerPolicy: "executivePlanningPublicIndex.ts",
  metadataOnlyFlag: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const);

const publicIndex = Object.freeze({
  metadata: publicMetadata,
  apiRegistry: ExecutivePlanningPublicApiRegistry,
  releaseSummary,
  status: ExecutivePlanningPublicIndexStatus,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ExecutivePlanningPlatformPublicFoundation = Object.freeze({
  foundation: foundationSurface,
  registry: ExecutivePlanningRegistryPlatform,
  model: ExecutivePlanningModelPlatform,
  validation: ExecutivePlanningValidationPlatform,
  manifest: ExecutivePlanningManifestPlatform,
  platform: ExecutivePlanningPlatform,
  certification: ExecutivePlanningCertificationPlatform,
  freeze: ExecutivePlanningFreezePlatform,
  publicIndex,
} as const);

export const getExecutivePlanningPublicFoundation = () => ExecutivePlanningPlatformPublicFoundation;
export const getExecutivePlanningPublicMetadata = () => publicMetadata;
export const getExecutivePlanningPublicApiRegistry = () => ExecutivePlanningPublicApiRegistry;
export const getExecutivePlanningReleaseSummary = () => releaseSummary;
