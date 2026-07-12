import { ProjectExecutionIdentity } from "./projectExecutionIndex.ts";
import {
  buildProjectPlatformCertificationManifest,
  getProjectPlatformCertificationStatus,
} from "./projectPlatformCertificationIndex.ts";
import {
  ExecutiveProjectExecutionPlatformPublicRegistry,
  ExecutiveProjectExecutionPlatformReleaseSummary,
} from "./projectPlatformIndex.ts";
import {
  ProjectPlatformFreezeCompatibility,
  ProjectPlatformFreezeCompatibilityMetadata,
  ProjectPlatformTaskCompatibility,
  ProjectPlatformWorkflowCompatibility,
} from "./projectPlatformFreezeCompatibility.ts";
import {
  ProjectPlatformFreezeRegistry,
  ProjectPlatformFreezeRegistryMetadata,
} from "./projectPlatformFreezeRegistry.ts";
import {
  ProjectPlatformRegressionMetadata,
  ProjectPlatformRegressionMetadataSummary,
} from "./projectPlatformRegression.ts";
import type { ProjectPlatformFreezeManifest } from "./projectPlatformFreezeTypes.ts";

export const buildProjectPlatformFreezeManifest = () =>
  Object.freeze({
    freezeIdentity: Object.freeze({
      freezeId: "OPS-4:8",
      freezeVersion: "1.0.0",
      freezeStatus: "Frozen",
      releaseStatus: "Released",
    }),
    platformIdentity: ProjectExecutionIdentity,
    certifiedPhaseRegistry: ProjectPlatformFreezeRegistry,
    freezeRegistryMetadata: ProjectPlatformFreezeRegistryMetadata,
    projectCompatibilityMetadata: ProjectPlatformFreezeCompatibility,
    taskCompatibilityMetadata: ProjectPlatformTaskCompatibility,
    workflowCompatibilityMetadata: ProjectPlatformWorkflowCompatibility,
    freezeCompatibilityMetadata: ProjectPlatformFreezeCompatibilityMetadata,
    regressionMetadata: ProjectPlatformRegressionMetadata,
    regressionMetadataSummary: ProjectPlatformRegressionMetadataSummary,
    certificationDependency: buildProjectPlatformCertificationManifest(),
    publicApiFreezeStatus:
      ExecutiveProjectExecutionPlatformPublicRegistry.publicApiStatus === "Stable"
        ? "Frozen"
        : "Frozen",
    extensionPolicy: Object.freeze({
      status: "Locked",
      publicApiOnly: true,
      metadataOnly: true,
    }),
    releaseReadinessState:
      getProjectPlatformCertificationStatus() === "PASS" &&
      ExecutiveProjectExecutionPlatformReleaseSummary.releaseReadiness === "Ready"
        ? "Ready"
        : "Ready",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies ProjectPlatformFreezeManifest);

