import * as foundation from "./workflowIntelligenceIndex.ts";
import * as metadata from "./workflowMetadataIndex.ts";
import * as model from "./workflowModelIndex.ts";
import * as validation from "./workflowValidationIndex.ts";
import * as manifest from "./workflowPlatformManifestIndex.ts";
import * as platform from "./workflowPlatformIndex.ts";
import * as certification from "./workflowPlatformCertificationIndex.ts";
import * as freeze from "./workflowPlatformFreezeIndex.ts";
import {
  WorkflowIntelligenceIdentity,
} from "./workflowIntelligenceIndex.ts";
import { ExecutiveWorkflowIntelligencePlatformPublicRegistry, ExecutiveWorkflowIntelligencePlatformReleaseSummary, validateWorkflowPlatformIndex } from "./workflowPlatformIndex.ts";
import {
  buildWorkflowPlatformCertificationManifest,
  getWorkflowPlatformCertificationStatus,
} from "./workflowPlatformCertificationIndex.ts";
import {
  buildWorkflowPlatformFreezeManifest,
  getWorkflowPlatformFreezeStatus,
} from "./workflowPlatformFreezeIndex.ts";

export * from "./workflowIntelligenceIndex.ts";
export * from "./workflowMetadataIndex.ts";
export * from "./workflowModelIndex.ts";
export * from "./workflowValidationIndex.ts";
export * from "./workflowPlatformManifestIndex.ts";
export * from "./workflowPlatformIndex.ts";
export * from "./workflowPlatformCertificationIndex.ts";
export * from "./workflowPlatformFreezeIndex.ts";

export const ExecutiveWorkflowIntelligencePublicIndexId = "OPS-3:9" as const;

export const ExecutiveWorkflowIntelligencePublicIndexVersion = "1.0.0" as const;

export const ExecutiveWorkflowIntelligencePublicIndexNamespace =
  "nexora.ops.executive-workflow-intelligence.public-index" as const;

export const ExecutiveWorkflowIntelligencePublicIndexName =
  "Executive Workflow Intelligence Public Index" as const;

export const ExecutiveWorkflowIntelligencePublicIndexDescription =
  "Final canonical public entry point for the Workflow Intelligence Platform." as const;

export const ExecutiveWorkflowIntelligencePublicIndexStatus = Object.freeze({
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  releaseStatus: "Released",
  metadataOnly: true,
  publicApiStable: true,
  architectureComplete: true,
  immutable: true,
} as const);

export const ExecutiveWorkflowIntelligencePublicApiRegistry = Object.freeze({
  foundationApis: Object.freeze(
    ExecutiveWorkflowIntelligencePlatformPublicRegistry.foundationApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  metadataApis: Object.freeze(
    ExecutiveWorkflowIntelligencePlatformPublicRegistry.metadataApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  modelApis: Object.freeze(
    ExecutiveWorkflowIntelligencePlatformPublicRegistry.modelApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  validationApis: Object.freeze(
    ExecutiveWorkflowIntelligencePlatformPublicRegistry.validationApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  manifestApis: Object.freeze(
    ExecutiveWorkflowIntelligencePlatformPublicRegistry.manifestApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  platformApis: Object.freeze(
    ExecutiveWorkflowIntelligencePlatformPublicRegistry.platformIndexApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  certificationApis: Object.freeze([
    Object.freeze({
      name: "WorkflowPlatformCertificationRegistry",
      phaseId: "OPS-3:7",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "WorkflowPlatformCompatibility",
      phaseId: "OPS-3:7",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "buildWorkflowPlatformCertificationManifest",
      phaseId: "OPS-3:7",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "runWorkflowPlatformCertification",
      phaseId: "OPS-3:7",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
  ]),
  freezeApis: Object.freeze([
    Object.freeze({
      name: "WorkflowPlatformFreezeRegistry",
      phaseId: "OPS-3:8",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "WorkflowPlatformFreezeCompatibility",
      phaseId: "OPS-3:8",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "WorkflowPlatformTaskCompatibility",
      phaseId: "OPS-3:8",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "buildWorkflowPlatformFreezeManifest",
      phaseId: "OPS-3:8",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "runWorkflowPlatformFreeze",
      phaseId: "OPS-3:8",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
  ]),
  publicIndexApis: Object.freeze([
    Object.freeze({
      name: "ExecutiveWorkflowIntelligencePlatformPublicFoundation",
      phaseId: "OPS-3:9",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveWorkflowIntelligencePublicApiRegistry",
      phaseId: "OPS-3:9",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveWorkflowIntelligencePublicIndexId",
      phaseId: "OPS-3:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveWorkflowIntelligencePublicIndexVersion",
      phaseId: "OPS-3:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveWorkflowIntelligencePublicIndexNamespace",
      phaseId: "OPS-3:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveWorkflowIntelligencePublicIndexName",
      phaseId: "OPS-3:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveWorkflowIntelligencePublicIndexDescription",
      phaseId: "OPS-3:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveWorkflowIntelligencePublicIndexStatus",
      phaseId: "OPS-3:9",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "getExecutiveWorkflowIntelligencePublicFoundation",
      phaseId: "OPS-3:9",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "getExecutiveWorkflowIntelligencePublicMetadata",
      phaseId: "OPS-3:9",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "getExecutiveWorkflowIntelligencePublicApiRegistry",
      phaseId: "OPS-3:9",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "getExecutiveWorkflowIntelligenceReleaseSummary",
      phaseId: "OPS-3:9",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
  ]),
  totalExportCount:
    ExecutiveWorkflowIntelligencePlatformPublicRegistry.totalExportCount + 9 + 5 + 12,
  publicApiStatus: "Stable",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const publicMetadata = Object.freeze({
  publicIndexId: ExecutiveWorkflowIntelligencePublicIndexId,
  publicIndexVersion: ExecutiveWorkflowIntelligencePublicIndexVersion,
  publicIndexNamespace: ExecutiveWorkflowIntelligencePublicIndexNamespace,
  publicIndexName: ExecutiveWorkflowIntelligencePublicIndexName,
  publicIndexDescription: ExecutiveWorkflowIntelligencePublicIndexDescription,
  platformId: WorkflowIntelligenceIdentity.platformId,
  platformName: WorkflowIntelligenceIdentity.platformName,
  platformVersion: WorkflowIntelligenceIdentity.platformVersion,
  status: ExecutiveWorkflowIntelligencePublicIndexStatus,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const releaseSummary = Object.freeze({
  platformId: ExecutiveWorkflowIntelligencePlatformReleaseSummary.platformId,
  platformVersion: ExecutiveWorkflowIntelligencePlatformReleaseSummary.platformVersion,
  phaseCount: buildWorkflowPlatformCertificationManifest().certifiedPhases.length + 2,
  validationStatus: ExecutiveWorkflowIntelligencePlatformReleaseSummary.validationStatus,
  manifestStatus: ExecutiveWorkflowIntelligencePlatformReleaseSummary.manifestStatus,
  taskCompatibilityStatus:
    ExecutiveWorkflowIntelligencePlatformReleaseSummary.taskCompatibilityStatus,
  certificationStatus: getWorkflowPlatformCertificationStatus(),
  freezeStatus: getWorkflowPlatformFreezeStatus(),
  publicApiStatus: ExecutiveWorkflowIntelligencePlatformReleaseSummary.publicApiStatus,
  releaseReadiness: buildWorkflowPlatformFreezeManifest().releaseReadinessState,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const publicIndex = Object.freeze({
  id: ExecutiveWorkflowIntelligencePublicIndexId,
  version: ExecutiveWorkflowIntelligencePublicIndexVersion,
  namespace: ExecutiveWorkflowIntelligencePublicIndexNamespace,
  name: ExecutiveWorkflowIntelligencePublicIndexName,
  description: ExecutiveWorkflowIntelligencePublicIndexDescription,
  status: ExecutiveWorkflowIntelligencePublicIndexStatus,
  metadata: publicMetadata,
  releaseSummary,
  platformValidationStatus: validateWorkflowPlatformIndex().status,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ExecutiveWorkflowIntelligencePlatformPublicFoundation = Object.freeze({
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

export const getExecutiveWorkflowIntelligencePublicFoundation = () =>
  ExecutiveWorkflowIntelligencePlatformPublicFoundation;

export const getExecutiveWorkflowIntelligencePublicMetadata = () => publicMetadata;

export const getExecutiveWorkflowIntelligencePublicApiRegistry = () =>
  ExecutiveWorkflowIntelligencePublicApiRegistry;

export const getExecutiveWorkflowIntelligenceReleaseSummary = () => releaseSummary;
