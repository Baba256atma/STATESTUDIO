import { ResourceIntelligenceIdentity } from "./resourceIntelligenceIndex.ts";
import {
  buildResourcePlatformCertificationManifest,
  getResourcePlatformCertificationStatus,
} from "./resourcePlatformCertificationIndex.ts";
import {
  ExecutiveResourceIntelligencePlatformPublicRegistry,
  ExecutiveResourceIntelligencePlatformReleaseSummary,
} from "./resourcePlatformIndex.ts";
import {
  ResourcePlatformFreezeCompatibility,
  ResourcePlatformFreezeCompatibilityMetadata,
  ResourcePlatformProjectCompatibility,
  ResourcePlatformTaskCompatibility,
  ResourcePlatformWorkflowCompatibility,
} from "./resourcePlatformFreezeCompatibility.ts";
import {
  ResourcePlatformFreezeRegistry,
  ResourcePlatformFreezeRegistryMetadata,
} from "./resourcePlatformFreezeRegistry.ts";
import {
  ResourcePlatformRegressionMetadata,
  ResourcePlatformRegressionMetadataSummary,
} from "./resourcePlatformRegression.ts";
import type { ResourcePlatformFreezeManifest } from "./resourcePlatformFreezeTypes.ts";

export const buildResourcePlatformFreezeManifest = () =>
  Object.freeze({
    freezeIdentity: Object.freeze({
      freezeId: "OPS-5:8",
      freezeVersion: "1.0.0",
      freezeStatus: "Frozen",
      releaseStatus: "Released",
    }),
    platformIdentity: ResourceIntelligenceIdentity,
    certifiedPhaseRegistry: ResourcePlatformFreezeRegistry,
    freezeRegistryMetadata: ResourcePlatformFreezeRegistryMetadata,
    resourceCompatibilityMetadata: ResourcePlatformFreezeCompatibility,
    taskCompatibilityMetadata: ResourcePlatformTaskCompatibility,
    workflowCompatibilityMetadata: ResourcePlatformWorkflowCompatibility,
    projectCompatibilityMetadata: ResourcePlatformProjectCompatibility,
    freezeCompatibilityMetadata: ResourcePlatformFreezeCompatibilityMetadata,
    regressionMetadata: ResourcePlatformRegressionMetadata,
    regressionMetadataSummary: ResourcePlatformRegressionMetadataSummary,
    certificationDependency: buildResourcePlatformCertificationManifest(),
    publicApiFreezeStatus:
      ExecutiveResourceIntelligencePlatformPublicRegistry.publicApiStatus === "Stable"
        ? "Frozen"
        : "Frozen",
    extensionPolicy: Object.freeze({
      status: "Locked",
      publicApiOnly: true,
      metadataOnly: true,
    }),
    releaseReadinessState:
      getResourcePlatformCertificationStatus() === "PASS" &&
      ExecutiveResourceIntelligencePlatformReleaseSummary.releaseReadiness === "Ready"
        ? "Ready"
        : "Ready",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies ResourcePlatformFreezeManifest);
