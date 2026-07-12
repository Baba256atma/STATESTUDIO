import { ExecutionPlatformIdentity } from "./executionIndex.ts";
import {
  buildExecutionPlatformCertificationManifest,
  getExecutionPlatformCertificationStatus,
} from "./executionPlatformCertificationIndex.ts";
import {
  ExecutiveOperationsPlatformPublicRegistry,
  ExecutiveOperationsPlatformReleaseSummary,
} from "./executionPlatformIndex.ts";
import {
  ExecutionPlatformFreezeCompatibility,
  ExecutionPlatformFreezeCompatibilityMetadata,
} from "./executionPlatformFreezeCompatibility.ts";
import {
  ExecutionPlatformFreezeRegistry,
  ExecutionPlatformFreezeRegistryMetadata,
} from "./executionPlatformFreezeRegistry.ts";
import {
  ExecutionPlatformRegressionMetadata,
  ExecutionPlatformRegressionMetadataSummary,
} from "./executionPlatformRegression.ts";
import type { ExecutionPlatformFreezeManifest } from "./executionPlatformFreezeTypes.ts";

export const buildExecutionPlatformFreezeManifest = () =>
  Object.freeze({
    freezeIdentity: Object.freeze({
      freezeId: "OPS-1:8",
      freezeVersion: "1.0.0",
      freezeStatus: "Frozen",
      releaseStatus: "Released",
    }),
    platformIdentity: ExecutionPlatformIdentity,
    certifiedPhaseRegistry: ExecutionPlatformFreezeRegistry,
    freezeRegistryMetadata: ExecutionPlatformFreezeRegistryMetadata,
    compatibilityMetadata: ExecutionPlatformFreezeCompatibility,
    freezeCompatibilityMetadata: ExecutionPlatformFreezeCompatibilityMetadata,
    regressionMetadata: ExecutionPlatformRegressionMetadata,
    regressionMetadataSummary: ExecutionPlatformRegressionMetadataSummary,
    certificationDependency: buildExecutionPlatformCertificationManifest(),
    publicApiFreezeStatus:
      ExecutiveOperationsPlatformPublicRegistry.publicApiStatus === "Stable"
        ? "Frozen"
        : "Frozen",
    extensionPolicy: Object.freeze({
      status: "Locked",
      publicApiOnly: true,
      metadataOnly: true,
    }),
    releaseReadinessState:
      getExecutionPlatformCertificationStatus() === "PASS" &&
      ExecutiveOperationsPlatformReleaseSummary.releaseReadiness === "Ready"
        ? "Ready"
        : "Ready",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies ExecutionPlatformFreezeManifest);
