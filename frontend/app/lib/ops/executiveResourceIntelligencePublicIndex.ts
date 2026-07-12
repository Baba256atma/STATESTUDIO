import * as foundation from "./resourceIntelligenceIndex.ts";
import * as metadata from "./resourceMetadataIndex.ts";
import * as model from "./resourceModelIndex.ts";
import * as validation from "./resourceValidationIndex.ts";
import * as manifest from "./resourcePlatformManifestIndex.ts";
import * as platform from "./resourcePlatformIndex.ts";
import * as certification from "./resourcePlatformCertificationIndex.ts";
import * as freeze from "./resourcePlatformFreezeIndex.ts";
import {
  ResourceIntelligenceIdentity,
} from "./resourceIntelligenceIndex.ts";
import {
  ExecutiveResourceIntelligencePlatform,
  ExecutiveResourceIntelligencePlatformPublicRegistry,
  ExecutiveResourceIntelligencePlatformReleaseSummary,
  validateResourcePlatformIndex,
} from "./resourcePlatformIndex.ts";
import {
  buildResourcePlatformCertificationManifest,
  getResourcePlatformCertificationStatus,
} from "./resourcePlatformCertificationIndex.ts";
import {
  buildResourcePlatformFreezeManifest,
  getResourcePlatformFreezeStatus,
} from "./resourcePlatformFreezeIndex.ts";

export * from "./resourceIntelligenceIndex.ts";
export * from "./resourceMetadataIndex.ts";
export * from "./resourceModelIndex.ts";
export * from "./resourceValidationIndex.ts";
export * from "./resourcePlatformManifestIndex.ts";
export * from "./resourcePlatformIndex.ts";
export * from "./resourcePlatformCertificationIndex.ts";
export * from "./resourcePlatformFreezeIndex.ts";

export const ExecutiveResourceIntelligencePublicIndexId = "OPS-5:9" as const;

export const ExecutiveResourceIntelligencePublicIndexVersion = "1.0.0" as const;

export const ExecutiveResourceIntelligencePublicIndexNamespace =
  "nexora.ops.executive-resource-intelligence.public-index" as const;

export const ExecutiveResourceIntelligencePublicIndexName =
  "Executive Resource Intelligence Public Index" as const;

export const ExecutiveResourceIntelligencePublicIndexDescription =
  "Final canonical public entry point for the Resource Intelligence Platform." as const;

export const ExecutiveResourceIntelligencePublicIndexStatus = Object.freeze({
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  releaseStatus: "Released",
  metadataOnly: true,
  publicApiStable: true,
  architectureComplete: true,
  immutable: true,
} as const);

export const ExecutiveResourceIntelligencePublicApiRegistry = Object.freeze({
  foundationApis: Object.freeze(
    ExecutiveResourceIntelligencePlatformPublicRegistry.foundationApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  metadataApis: Object.freeze(
    ExecutiveResourceIntelligencePlatformPublicRegistry.metadataApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  modelApis: Object.freeze(
    ExecutiveResourceIntelligencePlatformPublicRegistry.modelApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  validationApis: Object.freeze(
    ExecutiveResourceIntelligencePlatformPublicRegistry.validationApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  manifestApis: Object.freeze(
    ExecutiveResourceIntelligencePlatformPublicRegistry.manifestApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  platformApis: Object.freeze(
    ExecutiveResourceIntelligencePlatformPublicRegistry.platformIndexApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  certificationApis: Object.freeze([
    Object.freeze({
      name: "ResourcePlatformCertificationRegistry",
      phaseId: "OPS-5:7",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ResourcePlatformCompatibility",
      phaseId: "OPS-5:7",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "buildResourcePlatformCertificationManifest",
      phaseId: "OPS-5:7",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "runResourcePlatformCertification",
      phaseId: "OPS-5:7",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
  ]),
  freezeApis: Object.freeze([
    Object.freeze({
      name: "ResourcePlatformFreezeRegistry",
      phaseId: "OPS-5:8",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ResourcePlatformFreezeCompatibility",
      phaseId: "OPS-5:8",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ResourcePlatformTaskCompatibility",
      phaseId: "OPS-5:8",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ResourcePlatformWorkflowCompatibility",
      phaseId: "OPS-5:8",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ResourcePlatformProjectCompatibility",
      phaseId: "OPS-5:8",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "buildResourcePlatformFreezeManifest",
      phaseId: "OPS-5:8",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "runResourcePlatformFreeze",
      phaseId: "OPS-5:8",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
  ]),
  publicIndexApis: Object.freeze([
    Object.freeze({
      name: "ExecutiveResourceIntelligencePlatformPublicFoundation",
      phaseId: "OPS-5:9",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveResourceIntelligencePublicApiRegistry",
      phaseId: "OPS-5:9",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveResourceIntelligencePublicIndexId",
      phaseId: "OPS-5:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveResourceIntelligencePublicIndexVersion",
      phaseId: "OPS-5:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveResourceIntelligencePublicIndexNamespace",
      phaseId: "OPS-5:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveResourceIntelligencePublicIndexName",
      phaseId: "OPS-5:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveResourceIntelligencePublicIndexDescription",
      phaseId: "OPS-5:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveResourceIntelligencePublicIndexStatus",
      phaseId: "OPS-5:9",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "getExecutiveResourceIntelligencePublicFoundation",
      phaseId: "OPS-5:9",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "getExecutiveResourceIntelligencePublicMetadata",
      phaseId: "OPS-5:9",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "getExecutiveResourceIntelligencePublicApiRegistry",
      phaseId: "OPS-5:9",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "getExecutiveResourceIntelligenceReleaseSummary",
      phaseId: "OPS-5:9",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
  ]),
  totalExportCount:
    ExecutiveResourceIntelligencePlatformPublicRegistry.totalExportCount + 9 + 7 + 12,
  publicApiStatus: "Stable",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const publicMetadata = Object.freeze({
  publicIndexId: ExecutiveResourceIntelligencePublicIndexId,
  publicIndexVersion: ExecutiveResourceIntelligencePublicIndexVersion,
  publicIndexNamespace: ExecutiveResourceIntelligencePublicIndexNamespace,
  publicIndexName: ExecutiveResourceIntelligencePublicIndexName,
  publicIndexDescription: ExecutiveResourceIntelligencePublicIndexDescription,
  platformId: ResourceIntelligenceIdentity.platformId,
  platformName: ResourceIntelligenceIdentity.platformName,
  platformVersion: ResourceIntelligenceIdentity.platformVersion,
  status: ExecutiveResourceIntelligencePublicIndexStatus,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const releaseSummary = Object.freeze({
  platformId: ExecutiveResourceIntelligencePlatformReleaseSummary.platformId,
  platformVersion: ExecutiveResourceIntelligencePlatformReleaseSummary.platformVersion,
  phaseCount: buildResourcePlatformCertificationManifest().certifiedPhases.length + 2,
  validationStatus: ExecutiveResourceIntelligencePlatformReleaseSummary.validationStatus,
  manifestStatus: ExecutiveResourceIntelligencePlatformReleaseSummary.manifestStatus,
  taskCompatibilityStatus:
    ExecutiveResourceIntelligencePlatformReleaseSummary.taskCompatibilityStatus,
  workflowCompatibilityStatus:
    ExecutiveResourceIntelligencePlatformReleaseSummary.workflowCompatibilityStatus,
  projectCompatibilityStatus:
    ExecutiveResourceIntelligencePlatformReleaseSummary.projectCompatibilityStatus,
  certificationStatus: getResourcePlatformCertificationStatus(),
  freezeStatus: getResourcePlatformFreezeStatus(),
  publicApiStatus: ExecutiveResourceIntelligencePlatformReleaseSummary.publicApiStatus,
  releaseReadiness: buildResourcePlatformFreezeManifest().releaseReadinessState,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const publicIndex = Object.freeze({
  id: ExecutiveResourceIntelligencePublicIndexId,
  version: ExecutiveResourceIntelligencePublicIndexVersion,
  namespace: ExecutiveResourceIntelligencePublicIndexNamespace,
  name: ExecutiveResourceIntelligencePublicIndexName,
  description: ExecutiveResourceIntelligencePublicIndexDescription,
  status: ExecutiveResourceIntelligencePublicIndexStatus,
  metadata: publicMetadata,
  releaseSummary,
  platformValidationStatus: validateResourcePlatformIndex().status,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ExecutiveResourceIntelligencePlatformPublicFoundation = Object.freeze({
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

export const getExecutiveResourceIntelligencePublicFoundation = () =>
  ExecutiveResourceIntelligencePlatformPublicFoundation;

export const getExecutiveResourceIntelligencePublicMetadata = () => publicMetadata;

export const getExecutiveResourceIntelligencePublicApiRegistry = () =>
  ExecutiveResourceIntelligencePublicApiRegistry;

export const getExecutiveResourceIntelligenceReleaseSummary = () => releaseSummary;
