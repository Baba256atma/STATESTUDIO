import * as foundation from "./executionMonitoringIndex.ts";
import * as registry from "./executionMonitoringRegistryIndex.ts";
import * as model from "./executionMonitoringModelIndex.ts";
import * as validation from "./executionMonitoringValidationIndex.ts";
import * as manifest from "./executionMonitoringManifestIndex.ts";
import * as platform from "./executiveExecutionMonitoringPlatformIndex.ts";
import * as certification from "./executiveExecutionMonitoringPlatformCertificationIndex.ts";
import * as freeze from "./executiveExecutionMonitoringPlatformFreezeIndex.ts";
import { ExecutionMonitoringRegistry } from "./executionMonitoringIndex.ts";
import { ExecutiveExecutionMonitoringPlatformRelease } from "./executiveExecutionMonitoringPlatformIndex.ts";
import { buildExecutiveExecutionMonitoringPlatformCertificationManifest, getExecutiveExecutionMonitoringCertificationSummary } from "./executiveExecutionMonitoringPlatformCertificationIndex.ts";
import { buildExecutiveExecutionMonitoringPlatformFreezeManifest, getExecutiveExecutionMonitoringPlatformFreezeStatus } from "./executiveExecutionMonitoringPlatformFreezeIndex.ts";

export const ExecutiveExecutionMonitoringPublicIndexId = "OPS-9:9" as const;
export const ExecutiveExecutionMonitoringPublicIndexName = "Executive Execution Monitoring Public Index" as const;
export const ExecutiveExecutionMonitoringPublicIndexDescription = "Final canonical public release surface for the Executive Execution Monitoring Platform." as const;
export const ExecutiveExecutionMonitoringPublicIndexNamespace = "nexora.ops.executive-execution-monitoring.public-index" as const;
export const ExecutiveExecutionMonitoringPublicIndexVersion = "1.0.0" as const;
export const ExecutiveExecutionMonitoringPublicIndexStatus = Object.freeze({
  certificationStatus: "Certified", freezeStatus: "Frozen", releaseStatus: "Released",
  metadataOnly: true, publicApiStable: true, immutable: true,
} as const);

type Category = "foundation" | "registry" | "model" | "validation" | "manifest" | "platform" | "certification" | "freeze" | "publicIndex";
const api = (exportName: string, sourcePhase: string, category: Category) => Object.freeze({
  exportName, sourcePhase, category, status: "Approved", publicStability: "Stable", metadataOnly: true,
} as const);
const group = (names: readonly string[], phase: string, category: Category) => Object.freeze(names.map((name) => api(name, phase, category)));

export const ExecutiveExecutionMonitoringPublicApiRegistry = Object.freeze({
  foundation: group(["ExecutiveExecutionMonitoringFoundation", "getExecutiveExecutionMonitoringFoundation", "getExecutiveExecutionMonitoringMetadata", "ExecutionMonitoringContracts", "ExecutionMonitoringRegistry", "ExecutionMonitoringMetadataCatalog"], "OPS-9:1", "foundation"),
  registry: group(["ExecutiveExecutionMonitoringRegistry", "getExecutiveExecutionMonitoringRegistry", "getExecutionMonitoringTargetRegistry", "getExecutionMonitoringStateRegistry", "getExecutionMonitoringHealthRegistry", "getExecutionMonitoringAlertRegistry", "getExecutionMonitoringMetricRegistry", "getExecutionMonitoringLifecycleRegistry", "getExecutionMonitoringSeverityRegistry"], "OPS-9:2", "registry"),
  model: group(["ExecutiveExecutionMonitoringModel", "getExecutiveExecutionMonitoringModel", "getExecutionMonitoringSnapshotModel", "getExecutionMonitoringPolicyModel"], "OPS-9:3", "model"),
  validation: group(["ExecutionMonitoringValidationCompatibilityMetadata", "ExecutionMonitoringValidationGroups", "ExecutionMonitoringValidationMetadata", "ExecutionMonitoringValidationRegistry", "ExecutionMonitoringValidationRuleCatalog", "buildExecutionMonitoringValidationManifest", "getExecutionMonitoringValidationSummary", "validateExecutionMonitoringFoundation", "validateExecutionMonitoringModel", "validateExecutionMonitoringPlatform", "validateExecutionMonitoringRegistry", "validateExecutiveExecutionMonitoringPlatform"], "OPS-9:4", "validation"),
  manifest: group(["ExecutionMonitoringPlatformDependencyMap", "ExecutionMonitoringPlatformPhaseRegistry", "ExecutionMonitoringPlatformPublicSurface", "buildExecutionMonitoringManifest", "validateExecutionMonitoringManifest"], "OPS-9:5", "manifest"),
  platform: group(["ExecutiveExecutionMonitoringPlatform", "ExecutiveExecutionMonitoringPlatformCompatibility", "ExecutiveExecutionMonitoringPlatformIdentity", "ExecutiveExecutionMonitoringPlatformMetadata", "ExecutiveExecutionMonitoringPlatformRegistry", "ExecutiveExecutionMonitoringPlatformRelease", "ExecutiveExecutionMonitoringPlatformSummary", "getExecutiveExecutionMonitoringPlatform", "getExecutiveExecutionMonitoringPlatformMetadata", "getExecutiveExecutionMonitoringPlatformSummary"], "OPS-9:6", "platform"),
  certification: group(["ExecutiveExecutionMonitoringPlatformCertificationRegistry", "ExecutiveExecutionMonitoringPlatformCompatibility", "buildExecutiveExecutionMonitoringPlatformCertificationManifest", "certifyExecutiveExecutionMonitoringPlatform", "getExecutiveExecutionMonitoringCertificationSummary", "getExecutiveExecutionMonitoringPlatformCertification", "runExecutiveExecutionMonitoringPlatformCertification"], "OPS-9:7", "certification"),
  freeze: group(["ExecutiveExecutionMonitoringPlatformCertifiedPhaseRegistry", "ExecutiveExecutionMonitoringPlatformFreezeCompatibility", "ExecutiveExecutionMonitoringPlatformFreezeRegistry", "ExecutiveExecutionMonitoringPlatformRegressionMetadata", "ExecutiveExecutionMonitoringPlatformRegressionSummary", "buildExecutiveExecutionMonitoringPlatformFreezeManifest", "getExecutiveExecutionMonitoringPlatformFreezeStatus", "getExecutiveExecutionMonitoringPlatformFreezeSummary", "runExecutiveExecutionMonitoringPlatformFreeze", "validateExecutiveExecutionMonitoringPlatformFreeze"], "OPS-9:8", "freeze"),
  publicIndex: group(["ExecutiveExecutionMonitoringPlatformPublicFoundation", "ExecutiveExecutionMonitoringPublicApiRegistry", "ExecutiveExecutionMonitoringPublicIndexId", "ExecutiveExecutionMonitoringPublicIndexName", "ExecutiveExecutionMonitoringPublicIndexDescription", "ExecutiveExecutionMonitoringPublicIndexNamespace", "ExecutiveExecutionMonitoringPublicIndexVersion", "ExecutiveExecutionMonitoringPublicIndexStatus", "getExecutiveExecutionMonitoringPublicFoundation", "getExecutiveExecutionMonitoringPublicMetadata", "getExecutiveExecutionMonitoringPublicApiRegistry", "getExecutiveExecutionMonitoringReleaseSummary"], "OPS-9:9", "publicIndex"),
  totalExportCount: 75, publicApiStatus: "Stable", metadataOnly: true, immutable: true, deterministic: true,
} as const);

const publicMetadata = Object.freeze({
  publicIndexId: ExecutiveExecutionMonitoringPublicIndexId, publicIndexName: ExecutiveExecutionMonitoringPublicIndexName,
  publicIndexDescription: ExecutiveExecutionMonitoringPublicIndexDescription, publicIndexNamespace: ExecutiveExecutionMonitoringPublicIndexNamespace,
  publicIndexVersion: ExecutiveExecutionMonitoringPublicIndexVersion,
  platformId: ExecutionMonitoringRegistry.platformId, platformName: ExecutionMonitoringRegistry.platformName,
  platformVersion: ExecutionMonitoringRegistry.version, status: ExecutiveExecutionMonitoringPublicIndexStatus,
  metadataOnly: true, immutable: true, deterministic: true,
} as const);

const releaseSummary = Object.freeze({
  platformId: ExecutiveExecutionMonitoringPlatformRelease.platformId,
  platformVersion: ExecutiveExecutionMonitoringPlatformRelease.platformVersion,
  phaseCount: buildExecutiveExecutionMonitoringPlatformCertificationManifest().certifiedPhases.length + 2,
  validationStatus: ExecutiveExecutionMonitoringPlatformRelease.validationStatus,
  manifestStatus: ExecutiveExecutionMonitoringPlatformRelease.manifestStatus,
  certificationStatus: getExecutiveExecutionMonitoringCertificationSummary().certificationStatus,
  freezeStatus: getExecutiveExecutionMonitoringPlatformFreezeStatus(),
  releaseReadiness: buildExecutiveExecutionMonitoringPlatformFreezeManifest().releaseReadinessState,
  compatibilitySummary: ExecutiveExecutionMonitoringPlatformRelease.architectureCompleteness,
  publicApiStatus: ExecutiveExecutionMonitoringPlatformRelease.publicApiStatus,
  metadataOnly: true, immutable: true, deterministic: true,
} as const);

const publicIndex = Object.freeze({ id: ExecutiveExecutionMonitoringPublicIndexId, name: ExecutiveExecutionMonitoringPublicIndexName,
  description: ExecutiveExecutionMonitoringPublicIndexDescription, namespace: ExecutiveExecutionMonitoringPublicIndexNamespace,
  version: ExecutiveExecutionMonitoringPublicIndexVersion, status: ExecutiveExecutionMonitoringPublicIndexStatus,
  metadata: publicMetadata, releaseSummary, metadataOnly: true, immutable: true, deterministic: true,
} as const);

export const ExecutiveExecutionMonitoringPlatformPublicFoundation = Object.freeze({
  foundation: Object.freeze({ ...foundation }), registry: Object.freeze({ ...registry }), model: Object.freeze({ ...model }),
  validation: Object.freeze({ ...validation }), manifest: Object.freeze({ ...manifest }), platform: Object.freeze({ ...platform }),
  certification: Object.freeze({ ...certification }), freeze: Object.freeze({ ...freeze }), publicIndex,
} as const);

export const getExecutiveExecutionMonitoringPublicFoundation = () => ExecutiveExecutionMonitoringPlatformPublicFoundation;
export const getExecutiveExecutionMonitoringPublicMetadata = () => publicMetadata;
export const getExecutiveExecutionMonitoringPublicApiRegistry = () => ExecutiveExecutionMonitoringPublicApiRegistry;
export const getExecutiveExecutionMonitoringReleaseSummary = () => releaseSummary;
