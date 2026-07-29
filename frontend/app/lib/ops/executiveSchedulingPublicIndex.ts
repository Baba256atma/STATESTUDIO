import * as foundation from "./schedulingIntelligenceIndex.ts";
import * as metadata from "./schedulingMetadataIndex.ts";
import * as model from "./schedulingModelIndex.ts";
import * as validation from "./schedulingValidationIndex.ts";
import * as manifest from "./schedulingPlatformManifestIndex.ts";
import * as platform from "./schedulingPlatformIndex.ts";
import * as certification from "./executiveSchedulingPlatformCertificationIndex.ts";
import * as freeze from "./executiveSchedulingPlatformFreezeIndex.ts";
import { SchedulingIntelligenceIdentity } from "./schedulingIntelligenceIndex.ts";
import { ExecutiveSchedulingPlatformPublicRegistry, ExecutiveSchedulingPlatformReleaseSummary, validateSchedulingPlatformIndex } from "./schedulingPlatformIndex.ts";
import {
  buildExecutiveSchedulingPlatformCertificationManifest,
  getExecutiveSchedulingCertificationSummary,
} from "./executiveSchedulingPlatformCertificationIndex.ts";
import {
  buildExecutiveSchedulingPlatformFreezeManifest,
  getExecutiveSchedulingPlatformFreezeStatus,
} from "./executiveSchedulingPlatformFreezeIndex.ts";

export const ExecutiveSchedulingPublicIndexId = "OPS-6:9" as const;

export const ExecutiveSchedulingPublicIndexName =
  "Executive Scheduling Public Index" as const;

export const ExecutiveSchedulingPublicIndexDescription =
  "Final canonical public entry point for the Executive Scheduling Intelligence Platform." as const;

export const ExecutiveSchedulingPublicIndexNamespace =
  "nexora.ops.executive-scheduling-intelligence.public-index" as const;

export const ExecutiveSchedulingPublicIndexVersion = "1.0.0" as const;

export const ExecutiveSchedulingPublicIndexStatus = Object.freeze({
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  releaseStatus: "Released",
  metadataOnly: true,
  publicApiStable: true,
  immutable: true,
} as const);

export const ExecutiveSchedulingPublicApiRegistry = Object.freeze({
  foundationApis: Object.freeze(
    ExecutiveSchedulingPlatformPublicRegistry.foundationApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  metadataApis: Object.freeze(
    ExecutiveSchedulingPlatformPublicRegistry.metadataApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  modelApis: Object.freeze(
    ExecutiveSchedulingPlatformPublicRegistry.modelApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  validationApis: Object.freeze(
    ExecutiveSchedulingPlatformPublicRegistry.validationApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  manifestApis: Object.freeze(
    ExecutiveSchedulingPlatformPublicRegistry.manifestApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  platformApis: Object.freeze(
    ExecutiveSchedulingPlatformPublicRegistry.platformIndexApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  certificationApis: Object.freeze([
    Object.freeze({
      name: "ExecutiveSchedulingPlatformCertificationRegistry",
      phaseId: "OPS-6:7",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveSchedulingPlatformCompatibility",
      phaseId: "OPS-6:7",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "buildExecutiveSchedulingPlatformCertificationManifest",
      phaseId: "OPS-6:7",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "runExecutiveSchedulingPlatformCertification",
      phaseId: "OPS-6:7",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
  ]),
  freezeApis: Object.freeze([
    Object.freeze({
      name: "ExecutiveSchedulingPlatformFreezeRegistry",
      phaseId: "OPS-6:8",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveSchedulingPlatformFreezeCompatibility",
      phaseId: "OPS-6:8",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveSchedulingPlatformTaskCompatibility",
      phaseId: "OPS-6:8",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveSchedulingPlatformWorkflowCompatibility",
      phaseId: "OPS-6:8",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveSchedulingPlatformProjectCompatibility",
      phaseId: "OPS-6:8",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveSchedulingPlatformResourceCompatibility",
      phaseId: "OPS-6:8",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "buildExecutiveSchedulingPlatformFreezeManifest",
      phaseId: "OPS-6:8",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "runExecutiveSchedulingPlatformFreeze",
      phaseId: "OPS-6:8",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
  ]),
  publicIndexApis: Object.freeze([
    Object.freeze({
      name: "ExecutiveSchedulingIntelligencePlatformPublicFoundation",
      phaseId: "OPS-6:9",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveSchedulingPublicApiRegistry",
      phaseId: "OPS-6:9",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveSchedulingPublicIndexId",
      phaseId: "OPS-6:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveSchedulingPublicIndexName",
      phaseId: "OPS-6:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveSchedulingPublicIndexDescription",
      phaseId: "OPS-6:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveSchedulingPublicIndexNamespace",
      phaseId: "OPS-6:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveSchedulingPublicIndexVersion",
      phaseId: "OPS-6:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveSchedulingPublicIndexStatus",
      phaseId: "OPS-6:9",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "getExecutiveSchedulingPublicFoundation",
      phaseId: "OPS-6:9",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "getExecutiveSchedulingPublicMetadata",
      phaseId: "OPS-6:9",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "getExecutiveSchedulingPublicApiRegistry",
      phaseId: "OPS-6:9",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "getExecutiveSchedulingReleaseSummary",
      phaseId: "OPS-6:9",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
  ]),
  totalExportCount:
    ExecutiveSchedulingPlatformPublicRegistry.totalExportCount + 4 + 8 + 12,
  publicApiStatus: "Stable",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const publicMetadata = Object.freeze({
  publicIndexId: ExecutiveSchedulingPublicIndexId,
  publicIndexName: ExecutiveSchedulingPublicIndexName,
  publicIndexDescription: ExecutiveSchedulingPublicIndexDescription,
  publicIndexNamespace: ExecutiveSchedulingPublicIndexNamespace,
  publicIndexVersion: ExecutiveSchedulingPublicIndexVersion,
  platformId: SchedulingIntelligenceIdentity.platformId,
  platformName: SchedulingIntelligenceIdentity.platformName,
  platformVersion: SchedulingIntelligenceIdentity.platformVersion,
  status: ExecutiveSchedulingPublicIndexStatus,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const releaseSummary = Object.freeze({
  platformId: ExecutiveSchedulingPlatformReleaseSummary.platformId,
  platformVersion: ExecutiveSchedulingPlatformReleaseSummary.platformVersion,
  phaseCount:
    buildExecutiveSchedulingPlatformCertificationManifest().certifiedPhases.length + 2,
  validationStatus: ExecutiveSchedulingPlatformReleaseSummary.validationStatus,
  manifestStatus: ExecutiveSchedulingPlatformReleaseSummary.manifestStatus,
  taskCompatibilityStatus:
    ExecutiveSchedulingPlatformReleaseSummary.taskCompatibilityStatus,
  workflowCompatibilityStatus:
    ExecutiveSchedulingPlatformReleaseSummary.workflowCompatibilityStatus,
  projectCompatibilityStatus:
    ExecutiveSchedulingPlatformReleaseSummary.projectCompatibilityStatus,
  resourceCompatibilityStatus:
    ExecutiveSchedulingPlatformReleaseSummary.resourceCompatibilityStatus,
  certificationStatus:
    getExecutiveSchedulingCertificationSummary().certificationStatus,
  freezeStatus: getExecutiveSchedulingPlatformFreezeStatus(),
  publicApiStatus: ExecutiveSchedulingPlatformReleaseSummary.publicApiStatus,
  releaseReadiness: buildExecutiveSchedulingPlatformFreezeManifest().releaseReadinessState,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const publicIndex = Object.freeze({
  id: ExecutiveSchedulingPublicIndexId,
  name: ExecutiveSchedulingPublicIndexName,
  description: ExecutiveSchedulingPublicIndexDescription,
  namespace: ExecutiveSchedulingPublicIndexNamespace,
  version: ExecutiveSchedulingPublicIndexVersion,
  status: ExecutiveSchedulingPublicIndexStatus,
  metadata: publicMetadata,
  releaseSummary,
  platformValidationStatus: validateSchedulingPlatformIndex().status,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ExecutiveSchedulingIntelligencePlatformPublicFoundation = Object.freeze({
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

export const getExecutiveSchedulingPublicFoundation = () =>
  ExecutiveSchedulingIntelligencePlatformPublicFoundation;

export const getExecutiveSchedulingPublicMetadata = () => publicMetadata;

export const getExecutiveSchedulingPublicApiRegistry = () =>
  ExecutiveSchedulingPublicApiRegistry;

export const getExecutiveSchedulingReleaseSummary = () => releaseSummary;
