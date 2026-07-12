import * as foundation from "./dependencyIntelligenceIndex.ts";
import * as registry from "./dependencyRegistryIndex.ts";
import * as model from "./dependencyModelIndex.ts";
import * as validation from "./dependencyValidationIndex.ts";
import * as manifest from "./dependencyManifestIndex.ts";
import * as platform from "./executiveDependencyPlatformIndex.ts";
import * as certification from "./executiveDependencyPlatformCertificationIndex.ts";
import * as freeze from "./executiveDependencyPlatformFreezeIndex.ts";
import { DependencyIntelligenceRegistry } from "./dependencyIntelligenceIndex.ts";
import {
  buildExecutiveDependencyPlatformCertificationManifest,
  getExecutiveDependencyCertificationSummary,
} from "./executiveDependencyPlatformCertificationIndex.ts";
import {
  buildExecutiveDependencyPlatformFreezeManifest,
  getExecutiveDependencyPlatformFreezeStatus,
} from "./executiveDependencyPlatformFreezeIndex.ts";
import { ExecutiveDependencyPlatformRelease } from "./executiveDependencyPlatformIndex.ts";

export const ExecutiveDependencyPublicIndexId = "OPS-7:9" as const;

export const ExecutiveDependencyPublicIndexName =
  "Executive Dependency Public Index" as const;

export const ExecutiveDependencyPublicIndexDescription =
  "Final canonical public release surface for the Executive Dependency Intelligence Platform." as const;

export const ExecutiveDependencyPublicIndexNamespace =
  "nexora.ops.executive-dependency-intelligence.public-index" as const;

export const ExecutiveDependencyPublicIndexVersion = "1.0.0" as const;

export const ExecutiveDependencyPublicIndexStatus = Object.freeze({
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  releaseStatus: "Released",
  metadataOnly: true,
  publicApiStable: true,
  immutable: true,
} as const);

export const ExecutiveDependencyPublicApiRegistry = Object.freeze({
  foundationApis: Object.freeze([
    Object.freeze({ name: "DependencyNodeContract", phaseId: "OPS-7:1", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "DependencyEdgeContract", phaseId: "OPS-7:1", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "DependencyGraphContract", phaseId: "OPS-7:1", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "DependencyIntelligenceContracts", phaseId: "OPS-7:1", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveDependencyIntelligenceFoundation", phaseId: "OPS-7:1", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getExecutiveDependencyFoundation", phaseId: "OPS-7:1", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getExecutiveDependencyMetadata", phaseId: "OPS-7:1", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "DependencyCompatibilityVersion", phaseId: "OPS-7:1", kind: "Constant", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "DependencyIntelligenceMetadata", phaseId: "OPS-7:1", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "DependencyReleaseMetadata", phaseId: "OPS-7:1", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "SupportedDependencyCategories", phaseId: "OPS-7:1", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "DependencyIntelligenceRegistry", phaseId: "OPS-7:1", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "DependencyTypes", phaseId: "OPS-7:1", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "DependencyDirections", phaseId: "OPS-7:1", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "DependencyStrengths", phaseId: "OPS-7:1", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "DependencyPriorities", phaseId: "OPS-7:1", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "DependencyCriticalities", phaseId: "OPS-7:1", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "DependencyStatuses", phaseId: "OPS-7:1", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "DependencyIntelligenceTypes", phaseId: "OPS-7:1", kind: "Object", stability: "Stable", metadataOnly: true }),
  ] as const),
  registryApis: Object.freeze([
    Object.freeze({ name: "ExecutiveDependencyRegistry", phaseId: "OPS-7:2", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getDependencyEntityRegistry", phaseId: "OPS-7:2", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getDependencyLifecycleRegistry", phaseId: "OPS-7:2", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getDependencyRelationshipRegistry", phaseId: "OPS-7:2", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getExecutiveDependencyRegistry", phaseId: "OPS-7:2", kind: "Function", stability: "Stable", metadataOnly: true }),
  ] as const),
  modelApis: Object.freeze([
    Object.freeze({ name: "ExecutiveDependencyModel", phaseId: "OPS-7:3", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getDependencyGraphModel", phaseId: "OPS-7:3", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getDependencyImpactModel", phaseId: "OPS-7:3", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getExecutiveDependencyModel", phaseId: "OPS-7:3", kind: "Function", stability: "Stable", metadataOnly: true }),
  ] as const),
  validationApis: Object.freeze([
    Object.freeze({ name: "buildDependencyValidationManifest", phaseId: "OPS-7:4", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "DependencyValidationRegistry", phaseId: "OPS-7:4", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "DependencyValidationGroups", phaseId: "OPS-7:4", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "DependencyValidationRuleCatalog", phaseId: "OPS-7:4", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getDependencyValidationSummary", phaseId: "OPS-7:4", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "validateDependencyFoundation", phaseId: "OPS-7:4", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "validateDependencyModel", phaseId: "OPS-7:4", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "validateDependencyPlatform", phaseId: "OPS-7:4", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "validateDependencyRegistry", phaseId: "OPS-7:4", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "validateExecutiveDependencyPlatform", phaseId: "OPS-7:4", kind: "Function", stability: "Stable", metadataOnly: true }),
  ] as const),
  manifestApis: Object.freeze([
    Object.freeze({ name: "DependencyPlatformDependencyMap", phaseId: "OPS-7:5", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "DependencyPlatformDependencyMapMetadata", phaseId: "OPS-7:5", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "buildDependencyManifest", phaseId: "OPS-7:5", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "DependencyPlatformPhaseRegistry", phaseId: "OPS-7:5", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "DependencyPlatformPhaseRegistryMetadata", phaseId: "OPS-7:5", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "DependencyPlatformPublicSurface", phaseId: "OPS-7:5", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "DependencyPlatformPublicSurfaceMetadata", phaseId: "OPS-7:5", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "validateDependencyManifest", phaseId: "OPS-7:5", kind: "Function", stability: "Stable", metadataOnly: true }),
  ] as const),
  platformApis: Object.freeze([
    Object.freeze({ name: "ExecutiveDependencyPlatformRegistry", phaseId: "OPS-7:6", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveDependencyPlatformCompatibility", phaseId: "OPS-7:6", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveDependencyPlatformIdentity", phaseId: "OPS-7:6", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveDependencyPlatformMetadata", phaseId: "OPS-7:6", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveDependencyPlatformRelease", phaseId: "OPS-7:6", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveDependencyPlatformSummary", phaseId: "OPS-7:6", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveDependencyPlatform", phaseId: "OPS-7:6", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getExecutiveDependencyPlatform", phaseId: "OPS-7:6", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getExecutiveDependencyPlatformMetadata", phaseId: "OPS-7:6", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getExecutiveDependencyPlatformSummary", phaseId: "OPS-7:6", kind: "Function", stability: "Stable", metadataOnly: true }),
  ] as const),
  certificationApis: Object.freeze([
    Object.freeze({ name: "ExecutiveDependencyPlatformCertificationRegistry", phaseId: "OPS-7:7", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveDependencyPlatformCompatibility", phaseId: "OPS-7:7", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "buildExecutiveDependencyPlatformCertificationManifest", phaseId: "OPS-7:7", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "certifyExecutiveDependencyPlatform", phaseId: "OPS-7:7", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getExecutiveDependencyPlatformCertification", phaseId: "OPS-7:7", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getExecutiveDependencyCertificationSummary", phaseId: "OPS-7:7", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "runExecutiveDependencyPlatformCertification", phaseId: "OPS-7:7", kind: "Function", stability: "Stable", metadataOnly: true }),
  ] as const),
  freezeApis: Object.freeze([
    Object.freeze({ name: "ExecutiveDependencyPlatformFreezeRegistry", phaseId: "OPS-7:8", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveDependencyPlatformCertifiedPhaseRegistry", phaseId: "OPS-7:8", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveDependencyPlatformFreezeCompatibility", phaseId: "OPS-7:8", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "buildExecutiveDependencyPlatformFreezeManifest", phaseId: "OPS-7:8", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveDependencyPlatformRegressionMetadata", phaseId: "OPS-7:8", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveDependencyPlatformRegressionSummary", phaseId: "OPS-7:8", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "validateExecutiveDependencyPlatformFreeze", phaseId: "OPS-7:8", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getExecutiveDependencyPlatformFreezeStatus", phaseId: "OPS-7:8", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getExecutiveDependencyPlatformFreezeSummary", phaseId: "OPS-7:8", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "runExecutiveDependencyPlatformFreeze", phaseId: "OPS-7:8", kind: "Function", stability: "Stable", metadataOnly: true }),
  ] as const),
  publicIndexApis: Object.freeze([
    Object.freeze({ name: "ExecutiveDependencyIntelligencePlatformPublicFoundation", phaseId: "OPS-7:9", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveDependencyPublicApiRegistry", phaseId: "OPS-7:9", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveDependencyPublicIndexId", phaseId: "OPS-7:9", kind: "Constant", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveDependencyPublicIndexName", phaseId: "OPS-7:9", kind: "Constant", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveDependencyPublicIndexDescription", phaseId: "OPS-7:9", kind: "Constant", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveDependencyPublicIndexNamespace", phaseId: "OPS-7:9", kind: "Constant", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveDependencyPublicIndexVersion", phaseId: "OPS-7:9", kind: "Constant", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveDependencyPublicIndexStatus", phaseId: "OPS-7:9", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getExecutiveDependencyPublicFoundation", phaseId: "OPS-7:9", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getExecutiveDependencyPublicMetadata", phaseId: "OPS-7:9", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getExecutiveDependencyPublicApiRegistry", phaseId: "OPS-7:9", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getExecutiveDependencyReleaseSummary", phaseId: "OPS-7:9", kind: "Function", stability: "Stable", metadataOnly: true }),
  ] as const),
  totalExportCount: 19 + 5 + 4 + 10 + 8 + 10 + 7 + 10 + 12,
  publicApiStatus: "Stable",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const publicMetadata = Object.freeze({
  publicIndexId: ExecutiveDependencyPublicIndexId,
  publicIndexName: ExecutiveDependencyPublicIndexName,
  publicIndexDescription: ExecutiveDependencyPublicIndexDescription,
  publicIndexNamespace: ExecutiveDependencyPublicIndexNamespace,
  publicIndexVersion: ExecutiveDependencyPublicIndexVersion,
  platformId: DependencyIntelligenceRegistry.platformId,
  platformName: DependencyIntelligenceRegistry.platformName,
  platformVersion: DependencyIntelligenceRegistry.version,
  status: ExecutiveDependencyPublicIndexStatus,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const releaseSummary = Object.freeze({
  platformId: ExecutiveDependencyPlatformRelease.platformId,
  platformVersion: ExecutiveDependencyPlatformRelease.platformVersion,
  phaseCount:
    buildExecutiveDependencyPlatformCertificationManifest().certifiedPhases.length + 2,
  validationStatus: ExecutiveDependencyPlatformRelease.validationStatus,
  manifestStatus: ExecutiveDependencyPlatformRelease.manifestStatus,
  certificationStatus: getExecutiveDependencyCertificationSummary().certificationStatus,
  freezeStatus: getExecutiveDependencyPlatformFreezeStatus(),
  publicApiStatus: ExecutiveDependencyPlatformRelease.publicApiStatus,
  releaseReadiness: buildExecutiveDependencyPlatformFreezeManifest().releaseReadinessState,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const publicIndex = Object.freeze({
  id: ExecutiveDependencyPublicIndexId,
  name: ExecutiveDependencyPublicIndexName,
  description: ExecutiveDependencyPublicIndexDescription,
  namespace: ExecutiveDependencyPublicIndexNamespace,
  version: ExecutiveDependencyPublicIndexVersion,
  status: ExecutiveDependencyPublicIndexStatus,
  metadata: publicMetadata,
  releaseSummary,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ExecutiveDependencyIntelligencePlatformPublicFoundation = Object.freeze({
  foundation: Object.freeze({ ...foundation }),
  registry: Object.freeze({ ...registry }),
  model: Object.freeze({ ...model }),
  validation: Object.freeze({ ...validation }),
  manifest: Object.freeze({ ...manifest }),
  platform: Object.freeze({ ...platform }),
  certification: Object.freeze({ ...certification }),
  freeze: Object.freeze({ ...freeze }),
  publicIndex,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const getExecutiveDependencyPublicFoundation = () =>
  ExecutiveDependencyIntelligencePlatformPublicFoundation;

export const getExecutiveDependencyPublicMetadata = () => publicMetadata;

export const getExecutiveDependencyPublicApiRegistry = () =>
  ExecutiveDependencyPublicApiRegistry;

export const getExecutiveDependencyReleaseSummary = () => releaseSummary;
