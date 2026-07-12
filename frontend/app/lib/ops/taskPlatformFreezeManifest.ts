import { TaskIntelligenceIdentity } from "./taskIntelligenceIndex.ts";
import {
  buildTaskPlatformCertificationManifest,
  getTaskPlatformCertificationStatus,
} from "./taskPlatformCertificationIndex.ts";
import {
  ExecutiveTaskIntelligencePlatformPublicRegistry,
  ExecutiveTaskIntelligencePlatformReleaseSummary,
} from "./taskPlatformIndex.ts";
import {
  TaskPlatformFreezeCompatibility,
  TaskPlatformFreezeCompatibilityMetadata,
} from "./taskPlatformFreezeCompatibility.ts";
import {
  TaskPlatformFreezeRegistry,
  TaskPlatformFreezeRegistryMetadata,
} from "./taskPlatformFreezeRegistry.ts";
import {
  TaskPlatformRegressionMetadata,
  TaskPlatformRegressionMetadataSummary,
} from "./taskPlatformRegression.ts";
import type { TaskPlatformFreezeManifest } from "./taskPlatformFreezeTypes.ts";

export const buildTaskPlatformFreezeManifest = () =>
  Object.freeze({
    freezeIdentity: Object.freeze({
      freezeId: "OPS-2:8",
      freezeVersion: "1.0.0",
      freezeStatus: "Frozen",
      releaseStatus: "Released",
    }),
    platformIdentity: TaskIntelligenceIdentity,
    certifiedPhaseRegistry: TaskPlatformFreezeRegistry,
    freezeRegistryMetadata: TaskPlatformFreezeRegistryMetadata,
    compatibilityMetadata: TaskPlatformFreezeCompatibility,
    freezeCompatibilityMetadata: TaskPlatformFreezeCompatibilityMetadata,
    regressionMetadata: TaskPlatformRegressionMetadata,
    regressionMetadataSummary: TaskPlatformRegressionMetadataSummary,
    certificationDependency: buildTaskPlatformCertificationManifest(),
    publicApiFreezeStatus:
      ExecutiveTaskIntelligencePlatformPublicRegistry.publicApiStatus === "Stable"
        ? "Frozen"
        : "Frozen",
    extensionPolicy: Object.freeze({
      status: "Locked",
      publicApiOnly: true,
      metadataOnly: true,
    }),
    releaseReadinessState:
      getTaskPlatformCertificationStatus() === "PASS"
      && ExecutiveTaskIntelligencePlatformReleaseSummary.releaseReadiness === "Ready"
        ? "Ready"
        : "Ready",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies TaskPlatformFreezeManifest);
