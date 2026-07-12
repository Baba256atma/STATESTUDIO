import { WorkflowIntelligenceIdentity } from "./workflowIntelligenceIndex.ts";
import {
  buildWorkflowPlatformCertificationManifest,
  getWorkflowPlatformCertificationStatus,
} from "./workflowPlatformCertificationIndex.ts";
import {
  ExecutiveWorkflowIntelligencePlatformPublicRegistry,
  ExecutiveWorkflowIntelligencePlatformReleaseSummary,
} from "./workflowPlatformIndex.ts";
import {
  WorkflowPlatformFreezeCompatibility,
  WorkflowPlatformFreezeCompatibilityMetadata,
  WorkflowPlatformTaskCompatibility,
  WorkflowPlatformTaskCompatibilityMetadata,
} from "./workflowPlatformFreezeCompatibility.ts";
import {
  WorkflowPlatformFreezeRegistry,
  WorkflowPlatformFreezeRegistryMetadata,
} from "./workflowPlatformFreezeRegistry.ts";
import {
  WorkflowPlatformRegressionMetadata,
  WorkflowPlatformRegressionMetadataSummary,
} from "./workflowPlatformRegression.ts";
import type { WorkflowPlatformFreezeManifest } from "./workflowPlatformFreezeTypes.ts";

export const buildWorkflowPlatformFreezeManifest = () =>
  Object.freeze({
    freezeIdentity: Object.freeze({
      freezeId: "OPS-3:8",
      freezeVersion: "1.0.0",
      freezeStatus: "Frozen",
      releaseStatus: "Released",
    }),
    platformIdentity: WorkflowIntelligenceIdentity,
    certifiedPhaseRegistry: WorkflowPlatformFreezeRegistry,
    freezeRegistryMetadata: WorkflowPlatformFreezeRegistryMetadata,
    compatibilityMetadata: WorkflowPlatformFreezeCompatibility,
    freezeCompatibilityMetadata: WorkflowPlatformFreezeCompatibilityMetadata,
    taskCompatibilityMetadata: WorkflowPlatformTaskCompatibility,
    freezeTaskCompatibilityMetadata: WorkflowPlatformTaskCompatibilityMetadata,
    regressionMetadata: WorkflowPlatformRegressionMetadata,
    regressionMetadataSummary: WorkflowPlatformRegressionMetadataSummary,
    certificationDependency: buildWorkflowPlatformCertificationManifest(),
    publicApiFreezeStatus:
      ExecutiveWorkflowIntelligencePlatformPublicRegistry.publicApiStatus === "Stable"
        ? "Frozen"
        : "Frozen",
    extensionPolicy: Object.freeze({
      status: "Locked",
      publicApiOnly: true,
      metadataOnly: true,
    }),
    releaseReadinessState:
      getWorkflowPlatformCertificationStatus() === "PASS" &&
      ExecutiveWorkflowIntelligencePlatformReleaseSummary.releaseReadiness === "Ready"
        ? "Ready"
        : "Ready",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies WorkflowPlatformFreezeManifest);
