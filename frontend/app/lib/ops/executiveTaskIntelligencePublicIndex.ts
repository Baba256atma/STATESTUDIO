import * as foundation from "./taskIntelligenceIndex.ts";
import * as metadata from "./taskMetadataIndex.ts";
import * as model from "./taskModelIndex.ts";
import * as validation from "./taskValidationIndex.ts";
import * as manifest from "./taskPlatformManifestIndex.ts";
import * as platform from "./taskPlatformIndex.ts";
import * as certification from "./taskPlatformCertificationIndex.ts";
import * as freeze from "./taskPlatformFreezeIndex.ts";
import {
  TaskIntelligenceIdentity,
} from "./taskIntelligenceIndex.ts";
import {
  ExecutiveTaskIntelligencePlatform,
  ExecutiveTaskIntelligencePlatformPublicRegistry,
  ExecutiveTaskIntelligencePlatformReleaseSummary,
  validateTaskPlatformIndex,
} from "./taskPlatformIndex.ts";
import {
  buildTaskPlatformCertificationManifest,
  getTaskPlatformCertificationStatus,
} from "./taskPlatformCertificationIndex.ts";
import {
  buildTaskPlatformFreezeManifest,
  getTaskPlatformFreezeStatus,
} from "./taskPlatformFreezeIndex.ts";

export * from "./taskIntelligenceIndex.ts";
export * from "./taskMetadataIndex.ts";
export * from "./taskModelIndex.ts";
export * from "./taskValidationIndex.ts";
export * from "./taskPlatformManifestIndex.ts";
export * from "./taskPlatformIndex.ts";
export * from "./taskPlatformCertificationIndex.ts";
export * from "./taskPlatformFreezeIndex.ts";

export const ExecutiveTaskIntelligencePublicIndexId = "OPS-2:9" as const;

export const ExecutiveTaskIntelligencePublicIndexVersion = "1.0.0" as const;

export const ExecutiveTaskIntelligencePublicIndexNamespace =
  "nexora.ops.executive-task-intelligence.public-index" as const;

export const ExecutiveTaskIntelligencePublicIndexName =
  "Executive Task Intelligence Public Index" as const;

export const ExecutiveTaskIntelligencePublicIndexDescription =
  "Final canonical public entry point for the Task Intelligence Platform." as const;

export const ExecutiveTaskIntelligencePublicIndexStatus = Object.freeze({
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  releaseStatus: "Released",
  metadataOnly: true,
  publicApiStable: true,
  architectureComplete: true,
  immutable: true,
} as const);

export const ExecutiveTaskIntelligencePublicApiRegistry = Object.freeze({
  foundationApis: Object.freeze(
    ExecutiveTaskIntelligencePlatformPublicRegistry.foundationApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  metadataApis: Object.freeze(
    ExecutiveTaskIntelligencePlatformPublicRegistry.metadataApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  modelApis: Object.freeze(
    ExecutiveTaskIntelligencePlatformPublicRegistry.modelApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  validationApis: Object.freeze(
    ExecutiveTaskIntelligencePlatformPublicRegistry.validationApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  manifestApis: Object.freeze(
    ExecutiveTaskIntelligencePlatformPublicRegistry.manifestApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  platformApis: Object.freeze(
    ExecutiveTaskIntelligencePlatformPublicRegistry.platformIndexApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  certificationApis: Object.freeze([
    Object.freeze({
      name: "TaskPlatformCertificationRegistry",
      phaseId: "OPS-2:7",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "TaskPlatformCompatibility",
      phaseId: "OPS-2:7",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "buildTaskPlatformCertificationManifest",
      phaseId: "OPS-2:7",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "runTaskPlatformCertification",
      phaseId: "OPS-2:7",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
  ]),
  freezeApis: Object.freeze([
    Object.freeze({
      name: "TaskPlatformFreezeRegistry",
      phaseId: "OPS-2:8",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "TaskPlatformFreezeCompatibility",
      phaseId: "OPS-2:8",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "buildTaskPlatformFreezeManifest",
      phaseId: "OPS-2:8",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "runTaskPlatformFreeze",
      phaseId: "OPS-2:8",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
  ]),
  publicIndexApis: Object.freeze([
    Object.freeze({
      name: "ExecutiveTaskIntelligencePlatformPublicFoundation",
      phaseId: "OPS-2:9",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveTaskIntelligencePublicApiRegistry",
      phaseId: "OPS-2:9",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveTaskIntelligencePublicIndexId",
      phaseId: "OPS-2:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveTaskIntelligencePublicIndexVersion",
      phaseId: "OPS-2:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveTaskIntelligencePublicIndexNamespace",
      phaseId: "OPS-2:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveTaskIntelligencePublicIndexName",
      phaseId: "OPS-2:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveTaskIntelligencePublicIndexDescription",
      phaseId: "OPS-2:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveTaskIntelligencePublicIndexStatus",
      phaseId: "OPS-2:9",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "getExecutiveTaskIntelligencePublicFoundation",
      phaseId: "OPS-2:9",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "getExecutiveTaskIntelligencePublicMetadata",
      phaseId: "OPS-2:9",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "getExecutiveTaskIntelligencePublicApiRegistry",
      phaseId: "OPS-2:9",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "getExecutiveTaskIntelligenceReleaseSummary",
      phaseId: "OPS-2:9",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
  ]),
  totalExportCount:
    ExecutiveTaskIntelligencePlatformPublicRegistry.totalExportCount + 8 + 4 + 12,
  publicApiStatus: "Stable",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const publicMetadata = Object.freeze({
  publicIndexId: ExecutiveTaskIntelligencePublicIndexId,
  publicIndexVersion: ExecutiveTaskIntelligencePublicIndexVersion,
  publicIndexNamespace: ExecutiveTaskIntelligencePublicIndexNamespace,
  publicIndexName: ExecutiveTaskIntelligencePublicIndexName,
  publicIndexDescription: ExecutiveTaskIntelligencePublicIndexDescription,
  platformId: TaskIntelligenceIdentity.platformId,
  platformName: TaskIntelligenceIdentity.platformName,
  platformVersion: TaskIntelligenceIdentity.platformVersion,
  status: ExecutiveTaskIntelligencePublicIndexStatus,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const releaseSummary = Object.freeze({
  platformId: ExecutiveTaskIntelligencePlatformReleaseSummary.platformId,
  platformVersion: ExecutiveTaskIntelligencePlatformReleaseSummary.platformVersion,
  phaseCount: buildTaskPlatformCertificationManifest().certifiedPhases.length + 2,
  validationStatus: ExecutiveTaskIntelligencePlatformReleaseSummary.validationStatus,
  manifestStatus: ExecutiveTaskIntelligencePlatformReleaseSummary.manifestStatus,
  certificationStatus: getTaskPlatformCertificationStatus(),
  freezeStatus: getTaskPlatformFreezeStatus(),
  publicApiStatus: ExecutiveTaskIntelligencePlatformReleaseSummary.publicApiStatus,
  releaseReadiness: buildTaskPlatformFreezeManifest().releaseReadinessState,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const publicIndex = Object.freeze({
  id: ExecutiveTaskIntelligencePublicIndexId,
  version: ExecutiveTaskIntelligencePublicIndexVersion,
  namespace: ExecutiveTaskIntelligencePublicIndexNamespace,
  name: ExecutiveTaskIntelligencePublicIndexName,
  description: ExecutiveTaskIntelligencePublicIndexDescription,
  status: ExecutiveTaskIntelligencePublicIndexStatus,
  metadata: publicMetadata,
  releaseSummary,
  platformValidationStatus: validateTaskPlatformIndex().status,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ExecutiveTaskIntelligencePlatformPublicFoundation = Object.freeze({
  foundation: Object.freeze({ ...foundation }),
  metadata: Object.freeze({ ...metadata }),
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

export const getExecutiveTaskIntelligencePublicFoundation = () =>
  ExecutiveTaskIntelligencePlatformPublicFoundation;

export const getExecutiveTaskIntelligencePublicMetadata = () => publicMetadata;

export const getExecutiveTaskIntelligencePublicApiRegistry = () =>
  ExecutiveTaskIntelligencePublicApiRegistry;

export const getExecutiveTaskIntelligenceReleaseSummary = () => releaseSummary;
