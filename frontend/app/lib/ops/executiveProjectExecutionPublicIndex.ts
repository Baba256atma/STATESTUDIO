import * as foundation from "./projectExecutionIndex.ts";
import * as metadata from "./projectMetadataIndex.ts";
import * as model from "./projectModelIndex.ts";
import * as validation from "./projectValidationIndex.ts";
import * as manifest from "./projectPlatformManifestIndex.ts";
import * as platform from "./projectPlatformIndex.ts";
import * as certification from "./projectPlatformCertificationIndex.ts";
import * as freeze from "./projectPlatformFreezeIndex.ts";
import {
  ProjectExecutionIdentity,
} from "./projectExecutionIndex.ts";
import {
  ExecutiveProjectExecutionPlatform,
  ExecutiveProjectExecutionPlatformPublicRegistry,
  ExecutiveProjectExecutionPlatformReleaseSummary,
  validateProjectPlatformIndex,
} from "./projectPlatformIndex.ts";
import {
  buildProjectPlatformCertificationManifest,
  getProjectPlatformCertificationStatus,
} from "./projectPlatformCertificationIndex.ts";
import {
  buildProjectPlatformFreezeManifest,
  getProjectPlatformFreezeStatus,
} from "./projectPlatformFreezeIndex.ts";

export * from "./projectExecutionIndex.ts";
export * from "./projectMetadataIndex.ts";
export * from "./projectModelIndex.ts";
export * from "./projectValidationIndex.ts";
export * from "./projectPlatformManifestIndex.ts";
export * from "./projectPlatformIndex.ts";
export * from "./projectPlatformCertificationIndex.ts";
export * from "./projectPlatformFreezeIndex.ts";

export const ExecutiveProjectExecutionPublicIndexId = "OPS-4:9" as const;

export const ExecutiveProjectExecutionPublicIndexVersion = "1.0.0" as const;

export const ExecutiveProjectExecutionPublicIndexNamespace =
  "nexora.ops.executive-project-execution.public-index" as const;

export const ExecutiveProjectExecutionPublicIndexName =
  "Executive Project Execution Public Index" as const;

export const ExecutiveProjectExecutionPublicIndexDescription =
  "Final canonical public entry point for the Project Execution Platform." as const;

export const ExecutiveProjectExecutionPublicIndexStatus = Object.freeze({
  certificationStatus: "Certified",
  freezeStatus: "Frozen",
  releaseStatus: "Released",
  metadataOnly: true,
  publicApiStable: true,
  architectureComplete: true,
  immutable: true,
} as const);

export const ExecutiveProjectExecutionPublicApiRegistry = Object.freeze({
  foundationApis: Object.freeze(
    ExecutiveProjectExecutionPlatformPublicRegistry.foundationApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  metadataApis: Object.freeze(
    ExecutiveProjectExecutionPlatformPublicRegistry.metadataApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  modelApis: Object.freeze(
    ExecutiveProjectExecutionPlatformPublicRegistry.modelApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  validationApis: Object.freeze(
    ExecutiveProjectExecutionPlatformPublicRegistry.validationApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  manifestApis: Object.freeze(
    ExecutiveProjectExecutionPlatformPublicRegistry.manifestApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  platformApis: Object.freeze(
    ExecutiveProjectExecutionPlatformPublicRegistry.platformIndexApis.map((entry) =>
      Object.freeze({ ...entry }),
    ),
  ),
  certificationApis: Object.freeze([
    Object.freeze({
      name: "ProjectPlatformCertificationRegistry",
      phaseId: "OPS-4:7",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ProjectPlatformCompatibility",
      phaseId: "OPS-4:7",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "buildProjectPlatformCertificationManifest",
      phaseId: "OPS-4:7",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "runProjectPlatformCertification",
      phaseId: "OPS-4:7",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
  ]),
  freezeApis: Object.freeze([
    Object.freeze({
      name: "ProjectPlatformFreezeRegistry",
      phaseId: "OPS-4:8",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ProjectPlatformFreezeCompatibility",
      phaseId: "OPS-4:8",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ProjectPlatformTaskCompatibility",
      phaseId: "OPS-4:8",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ProjectPlatformWorkflowCompatibility",
      phaseId: "OPS-4:8",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "buildProjectPlatformFreezeManifest",
      phaseId: "OPS-4:8",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "runProjectPlatformFreeze",
      phaseId: "OPS-4:8",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
  ]),
  publicIndexApis: Object.freeze([
    Object.freeze({
      name: "ExecutiveProjectExecutionPlatformPublicFoundation",
      phaseId: "OPS-4:9",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveProjectExecutionPublicApiRegistry",
      phaseId: "OPS-4:9",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveProjectExecutionPublicIndexId",
      phaseId: "OPS-4:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveProjectExecutionPublicIndexVersion",
      phaseId: "OPS-4:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveProjectExecutionPublicIndexNamespace",
      phaseId: "OPS-4:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveProjectExecutionPublicIndexName",
      phaseId: "OPS-4:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveProjectExecutionPublicIndexDescription",
      phaseId: "OPS-4:9",
      kind: "Constant",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "ExecutiveProjectExecutionPublicIndexStatus",
      phaseId: "OPS-4:9",
      kind: "Object",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "getExecutiveProjectExecutionPublicFoundation",
      phaseId: "OPS-4:9",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "getExecutiveProjectExecutionPublicMetadata",
      phaseId: "OPS-4:9",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "getExecutiveProjectExecutionPublicApiRegistry",
      phaseId: "OPS-4:9",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
    Object.freeze({
      name: "getExecutiveProjectExecutionReleaseSummary",
      phaseId: "OPS-4:9",
      kind: "Function",
      stability: "Stable",
      metadataOnly: true,
    }),
  ]),
  totalExportCount:
    ExecutiveProjectExecutionPlatformPublicRegistry.totalExportCount + 9 + 6 + 12,
  publicApiStatus: "Stable",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const publicMetadata = Object.freeze({
  publicIndexId: ExecutiveProjectExecutionPublicIndexId,
  publicIndexVersion: ExecutiveProjectExecutionPublicIndexVersion,
  publicIndexNamespace: ExecutiveProjectExecutionPublicIndexNamespace,
  publicIndexName: ExecutiveProjectExecutionPublicIndexName,
  publicIndexDescription: ExecutiveProjectExecutionPublicIndexDescription,
  platformId: ProjectExecutionIdentity.platformId,
  platformName: ProjectExecutionIdentity.platformName,
  platformVersion: ProjectExecutionIdentity.platformVersion,
  status: ExecutiveProjectExecutionPublicIndexStatus,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const releaseSummary = Object.freeze({
  platformId: ExecutiveProjectExecutionPlatformReleaseSummary.platformId,
  platformVersion: ExecutiveProjectExecutionPlatformReleaseSummary.platformVersion,
  phaseCount: buildProjectPlatformCertificationManifest().certifiedPhases.length + 2,
  validationStatus: ExecutiveProjectExecutionPlatformReleaseSummary.validationStatus,
  manifestStatus: ExecutiveProjectExecutionPlatformReleaseSummary.manifestStatus,
  taskCompatibilityStatus:
    ExecutiveProjectExecutionPlatformReleaseSummary.taskCompatibilityStatus,
  workflowCompatibilityStatus:
    ExecutiveProjectExecutionPlatformReleaseSummary.workflowCompatibilityStatus,
  certificationStatus: getProjectPlatformCertificationStatus(),
  freezeStatus: getProjectPlatformFreezeStatus(),
  publicApiStatus: ExecutiveProjectExecutionPlatformReleaseSummary.publicApiStatus,
  releaseReadiness: buildProjectPlatformFreezeManifest().releaseReadinessState,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const publicIndex = Object.freeze({
  id: ExecutiveProjectExecutionPublicIndexId,
  version: ExecutiveProjectExecutionPublicIndexVersion,
  namespace: ExecutiveProjectExecutionPublicIndexNamespace,
  name: ExecutiveProjectExecutionPublicIndexName,
  description: ExecutiveProjectExecutionPublicIndexDescription,
  status: ExecutiveProjectExecutionPublicIndexStatus,
  metadata: publicMetadata,
  releaseSummary,
  platformValidationStatus: validateProjectPlatformIndex().status,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ExecutiveProjectExecutionPlatformPublicFoundation = Object.freeze({
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

export const getExecutiveProjectExecutionPublicFoundation = () =>
  ExecutiveProjectExecutionPlatformPublicFoundation;

export const getExecutiveProjectExecutionPublicMetadata = () => publicMetadata;

export const getExecutiveProjectExecutionPublicApiRegistry = () =>
  ExecutiveProjectExecutionPublicApiRegistry;

export const getExecutiveProjectExecutionReleaseSummary = () => releaseSummary;

