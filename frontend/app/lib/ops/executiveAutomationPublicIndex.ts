import * as foundation from "./automationIndex.ts";
import * as registry from "./automationRegistryIndex.ts";
import * as model from "./automationModelIndex.ts";
import * as validation from "./automationValidationIndex.ts";
import * as manifest from "./automationManifestIndex.ts";
import * as platform from "./executiveAutomationPlatformIndex.ts";
import * as certification from "./executiveAutomationPlatformCertificationIndex.ts";
import * as freeze from "./executiveAutomationPlatformFreezeIndex.ts";
import { AutomationRegistry } from "./automationIndex.ts";
import {
  ExecutiveAutomationPlatformRelease,
} from "./executiveAutomationPlatformIndex.ts";
import {
  buildExecutiveAutomationPlatformCertificationManifest,
  getExecutiveAutomationCertificationSummary,
} from "./executiveAutomationPlatformCertificationIndex.ts";
import {
  buildExecutiveAutomationPlatformFreezeManifest,
  getExecutiveAutomationPlatformFreezeStatus,
} from "./executiveAutomationPlatformFreezeIndex.ts";

export const ExecutiveAutomationPublicIndexId = "OPS-8:9" as const;

export const ExecutiveAutomationPublicIndexName =
  "Executive Automation Public Index" as const;

export const ExecutiveAutomationPublicIndexDescription =
  "Final canonical public release surface for the Executive Automation Platform." as const;

export const ExecutiveAutomationPublicIndexNamespace =
  "nexora.ops.executive-automation.public-index" as const;

export const ExecutiveAutomationPublicIndexVersion = "1.0.0" as const;

export const ExecutiveAutomationPublicIndexStatus = Object.freeze({
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  releaseStatus: "Released",
  metadataOnly: true,
  publicApiStable: true,
  immutable: true,
} as const);

export const ExecutiveAutomationPublicApiRegistry = Object.freeze({
  foundationApis: Object.freeze([
    Object.freeze({ name: "ExecutiveAutomationFoundation", phaseId: "OPS-8:1", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getExecutiveAutomationFoundation", phaseId: "OPS-8:1", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getExecutiveAutomationMetadata", phaseId: "OPS-8:1", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "AutomationContracts", phaseId: "OPS-8:1", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "AutomationRegistry", phaseId: "OPS-8:1", kind: "Object", stability: "Stable", metadataOnly: true }),
  ] as const),
  registryApis: Object.freeze([
    Object.freeze({ name: "ExecutiveAutomationRegistry", phaseId: "OPS-8:2", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getExecutiveAutomationRegistry", phaseId: "OPS-8:2", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getAutomationEventRegistry", phaseId: "OPS-8:2", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getAutomationTriggerRegistry", phaseId: "OPS-8:2", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getAutomationConditionRegistry", phaseId: "OPS-8:2", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getAutomationActionRegistry", phaseId: "OPS-8:2", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getAutomationRuleRegistry", phaseId: "OPS-8:2", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getAutomationPolicyRegistry", phaseId: "OPS-8:2", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getAutomationLifecycleRegistry", phaseId: "OPS-8:2", kind: "Function", stability: "Stable", metadataOnly: true }),
  ] as const),
  modelApis: Object.freeze([
    Object.freeze({ name: "ExecutiveAutomationModel", phaseId: "OPS-8:3", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getExecutiveAutomationModel", phaseId: "OPS-8:3", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getAutomationRuleModel", phaseId: "OPS-8:3", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getAutomationExecutionModel", phaseId: "OPS-8:3", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "AutomationModelMetadata", phaseId: "OPS-8:3", kind: "Object", stability: "Stable", metadataOnly: true }),
  ] as const),
  validationApis: Object.freeze([
    Object.freeze({ name: "buildAutomationValidationManifest", phaseId: "OPS-8:4", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "AutomationValidationRegistry", phaseId: "OPS-8:4", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "validateAutomationFoundation", phaseId: "OPS-8:4", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "validateAutomationRegistry", phaseId: "OPS-8:4", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "validateAutomationModel", phaseId: "OPS-8:4", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "validateAutomationPlatform", phaseId: "OPS-8:4", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "validateExecutiveAutomationPlatform", phaseId: "OPS-8:4", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getAutomationValidationSummary", phaseId: "OPS-8:4", kind: "Function", stability: "Stable", metadataOnly: true }),
  ] as const),
  manifestApis: Object.freeze([
    Object.freeze({ name: "AutomationPlatformPhaseRegistry", phaseId: "OPS-8:5", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "AutomationPlatformDependencyMap", phaseId: "OPS-8:5", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "AutomationPlatformPublicSurface", phaseId: "OPS-8:5", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "buildAutomationManifest", phaseId: "OPS-8:5", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "validateAutomationManifest", phaseId: "OPS-8:5", kind: "Function", stability: "Stable", metadataOnly: true }),
  ] as const),
  platformApis: Object.freeze([
    Object.freeze({ name: "ExecutiveAutomationPlatformRegistry", phaseId: "OPS-8:6", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveAutomationPlatformCompatibility", phaseId: "OPS-8:6", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveAutomationPlatformIdentity", phaseId: "OPS-8:6", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveAutomationPlatformMetadata", phaseId: "OPS-8:6", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveAutomationPlatformRelease", phaseId: "OPS-8:6", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveAutomationPlatformSummary", phaseId: "OPS-8:6", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveAutomationPlatform", phaseId: "OPS-8:6", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getExecutiveAutomationPlatform", phaseId: "OPS-8:6", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getExecutiveAutomationPlatformMetadata", phaseId: "OPS-8:6", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getExecutiveAutomationPlatformSummary", phaseId: "OPS-8:6", kind: "Function", stability: "Stable", metadataOnly: true }),
  ] as const),
  certificationApis: Object.freeze([
    Object.freeze({ name: "ExecutiveAutomationPlatformCertificationRegistry", phaseId: "OPS-8:7", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveAutomationPlatformCompatibility", phaseId: "OPS-8:7", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "buildExecutiveAutomationPlatformCertificationManifest", phaseId: "OPS-8:7", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "runExecutiveAutomationPlatformCertification", phaseId: "OPS-8:7", kind: "Function", stability: "Stable", metadataOnly: true }),
  ] as const),
  freezeApis: Object.freeze([
    Object.freeze({ name: "ExecutiveAutomationPlatformFreezeRegistry", phaseId: "OPS-8:8", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveAutomationPlatformFreezeCompatibility", phaseId: "OPS-8:8", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "buildExecutiveAutomationPlatformFreezeManifest", phaseId: "OPS-8:8", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "runExecutiveAutomationPlatformFreeze", phaseId: "OPS-8:8", kind: "Function", stability: "Stable", metadataOnly: true }),
  ] as const),
  publicIndexApis: Object.freeze([
    Object.freeze({ name: "ExecutiveAutomationPlatformPublicFoundation", phaseId: "OPS-8:9", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveAutomationPublicApiRegistry", phaseId: "OPS-8:9", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveAutomationPublicIndexId", phaseId: "OPS-8:9", kind: "Constant", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveAutomationPublicIndexName", phaseId: "OPS-8:9", kind: "Constant", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveAutomationPublicIndexDescription", phaseId: "OPS-8:9", kind: "Constant", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveAutomationPublicIndexNamespace", phaseId: "OPS-8:9", kind: "Constant", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveAutomationPublicIndexVersion", phaseId: "OPS-8:9", kind: "Constant", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "ExecutiveAutomationPublicIndexStatus", phaseId: "OPS-8:9", kind: "Object", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getExecutiveAutomationPublicFoundation", phaseId: "OPS-8:9", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getExecutiveAutomationPublicMetadata", phaseId: "OPS-8:9", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getExecutiveAutomationPublicApiRegistry", phaseId: "OPS-8:9", kind: "Function", stability: "Stable", metadataOnly: true }),
    Object.freeze({ name: "getExecutiveAutomationReleaseSummary", phaseId: "OPS-8:9", kind: "Function", stability: "Stable", metadataOnly: true }),
  ] as const),
  totalExportCount: 5 + 9 + 5 + 8 + 5 + 10 + 4 + 4 + 12,
  publicApiStatus: "Stable",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const publicMetadata = Object.freeze({
  publicIndexId: ExecutiveAutomationPublicIndexId,
  publicIndexName: ExecutiveAutomationPublicIndexName,
  publicIndexDescription: ExecutiveAutomationPublicIndexDescription,
  publicIndexNamespace: ExecutiveAutomationPublicIndexNamespace,
  publicIndexVersion: ExecutiveAutomationPublicIndexVersion,
  platformId: AutomationRegistry.platformId,
  platformName: AutomationRegistry.platformName,
  platformVersion: AutomationRegistry.version,
  status: ExecutiveAutomationPublicIndexStatus,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const releaseSummary = Object.freeze({
  platformId: ExecutiveAutomationPlatformRelease.platformId,
  platformVersion: ExecutiveAutomationPlatformRelease.platformVersion,
  phaseCount:
    buildExecutiveAutomationPlatformCertificationManifest().certifiedPhases.length + 2,
  validationStatus: ExecutiveAutomationPlatformRelease.validationStatus,
  manifestStatus: ExecutiveAutomationPlatformRelease.manifestStatus,
  certificationStatus:
    getExecutiveAutomationCertificationSummary().certificationStatus,
  freezeStatus: getExecutiveAutomationPlatformFreezeStatus(),
  publicApiStatus: ExecutiveAutomationPlatformRelease.publicApiStatus,
  releaseReadiness: buildExecutiveAutomationPlatformFreezeManifest().releaseReadinessState,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const publicIndex = Object.freeze({
  id: ExecutiveAutomationPublicIndexId,
  name: ExecutiveAutomationPublicIndexName,
  description: ExecutiveAutomationPublicIndexDescription,
  namespace: ExecutiveAutomationPublicIndexNamespace,
  version: ExecutiveAutomationPublicIndexVersion,
  status: ExecutiveAutomationPublicIndexStatus,
  metadata: publicMetadata,
  releaseSummary,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ExecutiveAutomationPlatformPublicFoundation = Object.freeze({
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

export const getExecutiveAutomationPublicFoundation = () =>
  ExecutiveAutomationPlatformPublicFoundation;

export const getExecutiveAutomationPublicMetadata = () => publicMetadata;

export const getExecutiveAutomationPublicApiRegistry = () =>
  ExecutiveAutomationPublicApiRegistry;

export const getExecutiveAutomationReleaseSummary = () => releaseSummary;
