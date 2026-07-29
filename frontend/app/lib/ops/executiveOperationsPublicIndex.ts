import * as foundation from "./executionIndex.ts";
import * as metadata from "./executionMetadataIndex.ts";
import * as model from "./executionModelIndex.ts";
import * as validation from "./executionValidationIndex.ts";
import * as manifest from "./executionPlatformManifestIndex.ts";
import * as platform from "./executionPlatformIndex.ts";
import * as certification from "./executionPlatformCertificationIndex.ts";
import * as freeze from "./executionPlatformFreezeIndex.ts";
import {
  ExecutionPlatformIdentity,
} from "./executionIndex.ts";
import { ExecutiveOperationsPlatformPublicRegistry, ExecutiveOperationsPlatformReleaseSummary } from "./executionPlatformIndex.ts";
import {
  buildExecutionPlatformCertificationManifest,
  getExecutionPlatformCertificationStatus,
} from "./executionPlatformCertificationIndex.ts";
import {
  buildExecutionPlatformFreezeManifest,
  getExecutionPlatformFreezeStatus,
} from "./executionPlatformFreezeIndex.ts";

export * from "./executionIndex.ts";
export {
  ExecutionCapabilityRegistry,
  ExecutionCapabilityRegistryMetadata,
  ExecutionConsumerRegistry,
  ExecutionConsumerRegistryMetadata,
  ExecutionDependencyRegistry,
  ExecutionDependencyRegistryMetadata,
  buildExecutionMetadataManifest,
  ExecutionPlatformMetadata,
  ExecutionSupportedExecutionDomains,
  ExecutionPublicApiRegistry,
  ExecutionPublicApiRegistryMetadata,
  validateExecutionMetadata,
} from "./executionMetadataIndex.ts";
export * from "./executionModelIndex.ts";
export * from "./executionValidationIndex.ts";
export * from "./executionPlatformManifestIndex.ts";
export * from "./executionPlatformIndex.ts";
export * from "./executionPlatformCertificationIndex.ts";
export * from "./executionPlatformFreezeIndex.ts";

export const ExecutiveOperationsPublicIndexId = "OPS-1:9" as const;

export const ExecutiveOperationsPublicIndexVersion = "1.0.0" as const;

export const ExecutiveOperationsPublicIndexNamespace =
  "nexora.ops.executive-operations.public-index" as const;

export const ExecutiveOperationsPublicIndexName =
  "Executive Operations Public Index" as const;

export const ExecutiveOperationsPublicIndexDescription =
  "Final canonical public entry point for the Executive Operations Platform." as const;

export const ExecutiveOperationsPublicIndexStatus = Object.freeze({
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  releaseStatus: "Released",
  metadataOnly: true,
  publicApiStable: true,
  architectureComplete: true,
  immutable: true,
} as const);

export const ExecutiveOperationsPublicApiRegistry = Object.freeze({
  foundationApis: Object.freeze(
    ExecutiveOperationsPlatformPublicRegistry.foundationApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  metadataApis: Object.freeze(
    ExecutiveOperationsPlatformPublicRegistry.metadataApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  modelApis: Object.freeze(
    ExecutiveOperationsPlatformPublicRegistry.modelApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  validationApis: Object.freeze(
    ExecutiveOperationsPlatformPublicRegistry.validationApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  manifestApis: Object.freeze(
    ExecutiveOperationsPlatformPublicRegistry.manifestApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  platformApis: Object.freeze(
    ExecutiveOperationsPlatformPublicRegistry.platformIndexApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  certificationApis: Object.freeze([
    Object.freeze({
      name: "ExecutionPlatformCertificationRegistry",
      phaseId: "OPS-1:7",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutionPlatformCompatibility",
      phaseId: "OPS-1:7",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "buildExecutionPlatformCertificationManifest",
      phaseId: "OPS-1:7",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "runExecutionPlatformCertification",
      phaseId: "OPS-1:7",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
  ]),
  freezeApis: Object.freeze([
    Object.freeze({
      name: "ExecutionPlatformFreezeRegistry",
      phaseId: "OPS-1:8",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutionPlatformFreezeCompatibility",
      phaseId: "OPS-1:8",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "buildExecutionPlatformFreezeManifest",
      phaseId: "OPS-1:8",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "runExecutionPlatformFreeze",
      phaseId: "OPS-1:8",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
  ]),
  publicIndexApis: Object.freeze([
    Object.freeze({
      name: "ExecutiveOperationsPlatformPublicFoundation",
      phaseId: "OPS-1:9",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveOperationsPublicApiRegistry",
      phaseId: "OPS-1:9",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveOperationsPublicIndexId",
      phaseId: "OPS-1:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveOperationsPublicIndexVersion",
      phaseId: "OPS-1:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveOperationsPublicIndexNamespace",
      phaseId: "OPS-1:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveOperationsPublicIndexName",
      phaseId: "OPS-1:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveOperationsPublicIndexDescription",
      phaseId: "OPS-1:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveOperationsPublicIndexStatus",
      phaseId: "OPS-1:9",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "getExecutiveOperationsPublicFoundation",
      phaseId: "OPS-1:9",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "getExecutiveOperationsPublicMetadata",
      phaseId: "OPS-1:9",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "getExecutiveOperationsPublicApiRegistry",
      phaseId: "OPS-1:9",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "getExecutiveOperationsReleaseSummary",
      phaseId: "OPS-1:9",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
  ]),
  totalExportCount:
    ExecutiveOperationsPlatformPublicRegistry.totalExportCount + 8 + 4 + 12,
  publicApiStatus: "Stable",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const publicMetadata = Object.freeze({
  publicIndexId: ExecutiveOperationsPublicIndexId,
  publicIndexVersion: ExecutiveOperationsPublicIndexVersion,
  publicIndexNamespace: ExecutiveOperationsPublicIndexNamespace,
  publicIndexName: ExecutiveOperationsPublicIndexName,
  publicIndexDescription: ExecutiveOperationsPublicIndexDescription,
  platformId: ExecutionPlatformIdentity.platformId,
  platformName: ExecutionPlatformIdentity.platformName,
  platformVersion: ExecutionPlatformIdentity.platformVersion,
  status: ExecutiveOperationsPublicIndexStatus,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const releaseSummary = Object.freeze({
  platformId: ExecutiveOperationsPlatformReleaseSummary.platformId,
  platformVersion: ExecutiveOperationsPlatformReleaseSummary.platformVersion,
  phaseCount: buildExecutionPlatformCertificationManifest().certifiedPhases.length,
  validationStatus: ExecutiveOperationsPlatformReleaseSummary.validationStatus,
  manifestStatus: ExecutiveOperationsPlatformReleaseSummary.manifestStatus,
  certificationStatus: getExecutionPlatformCertificationStatus(),
  freezeStatus: getExecutionPlatformFreezeStatus(),
  publicApiStatus: ExecutiveOperationsPlatformReleaseSummary.publicApiStatus,
  releaseReadiness: buildExecutionPlatformFreezeManifest().releaseReadinessState,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const publicIndex = Object.freeze({
  id: ExecutiveOperationsPublicIndexId,
  version: ExecutiveOperationsPublicIndexVersion,
  namespace: ExecutiveOperationsPublicIndexNamespace,
  name: ExecutiveOperationsPublicIndexName,
  description: ExecutiveOperationsPublicIndexDescription,
  status: ExecutiveOperationsPublicIndexStatus,
  metadata: publicMetadata,
  releaseSummary,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ExecutiveOperationsPlatformPublicFoundation = Object.freeze({
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

export const getExecutiveOperationsPublicFoundation = () =>
  ExecutiveOperationsPlatformPublicFoundation;

export const getExecutiveOperationsPublicMetadata = () => publicMetadata;

export const getExecutiveOperationsPublicApiRegistry = () =>
  ExecutiveOperationsPublicApiRegistry;

export const getExecutiveOperationsReleaseSummary = () => releaseSummary;
