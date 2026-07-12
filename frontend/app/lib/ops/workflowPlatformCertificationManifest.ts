import { WorkflowIntelligenceIdentity } from "./workflowIntelligenceIndex.ts";
import {
  buildWorkflowPlatformManifest,
} from "./workflowPlatformManifestIndex.ts";
import {
  ExecutiveWorkflowIntelligencePlatformPublicRegistry,
  ExecutiveWorkflowIntelligencePlatformReleaseSummary,
} from "./workflowPlatformIndex.ts";
import {
  WorkflowPlatformCertificationRegistry,
  WorkflowPlatformCertificationRegistryMetadata,
} from "./workflowPlatformCertificationRegistry.ts";
import {
  WorkflowPlatformCompatibility,
  WorkflowPlatformCompatibilityMetadata,
} from "./workflowPlatformCompatibility.ts";
import type { WorkflowPlatformCertificationManifest } from "./workflowPlatformCertificationTypes.ts";

export const buildWorkflowPlatformCertificationManifest = () =>
  Object.freeze({
    platformIdentity: Object.freeze({
      platformId: WorkflowIntelligenceIdentity.platformId,
      platformName: WorkflowIntelligenceIdentity.platformName,
      platformVersion: WorkflowIntelligenceIdentity.platformVersion,
    }),
    certifiedPhases: Object.freeze([
      "OPS-3:1",
      "OPS-3:2",
      "OPS-3:3",
      "OPS-3:4",
      "OPS-3:5",
      "OPS-3:6",
    ]),
    certificationRegistry: WorkflowPlatformCertificationRegistry,
    certificationRegistryMetadata: WorkflowPlatformCertificationRegistryMetadata,
    compatibilityMatrix: WorkflowPlatformCompatibility,
    compatibilityMetadata: WorkflowPlatformCompatibilityMetadata,
    publicApiStatus: ExecutiveWorkflowIntelligencePlatformPublicRegistry.publicApiStatus,
    validationSummary: Object.freeze({
      validationStatus: ExecutiveWorkflowIntelligencePlatformReleaseSummary.validationStatus,
      manifestStatus: ExecutiveWorkflowIntelligencePlatformReleaseSummary.manifestStatus,
      releaseReadiness: ExecutiveWorkflowIntelligencePlatformReleaseSummary.releaseReadiness,
      metadataOnly: true,
      immutable: true,
    }),
    manifestSummary: Object.freeze({
      phaseCount: buildWorkflowPlatformManifest().phaseRegistry.length,
      dependencyCount: buildWorkflowPlatformManifest().dependencyMap.length,
      publicApiCount: ExecutiveWorkflowIntelligencePlatformPublicRegistry.totalExportCount,
      taskCompatibilityStatus:
        ExecutiveWorkflowIntelligencePlatformReleaseSummary.taskCompatibilityStatus,
      metadataOnly: true,
      immutable: true,
    }),
    certificationStatus:
      ExecutiveWorkflowIntelligencePlatformReleaseSummary.validationStatus === "PASS" &&
      ExecutiveWorkflowIntelligencePlatformReleaseSummary.manifestStatus === "PASS" &&
      ExecutiveWorkflowIntelligencePlatformReleaseSummary.taskCompatibilityStatus === "PASS"
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies WorkflowPlatformCertificationManifest);
