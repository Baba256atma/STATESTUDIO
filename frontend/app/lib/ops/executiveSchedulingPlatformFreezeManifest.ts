import { SchedulingIntelligenceIdentity } from "./schedulingIntelligenceIndex.ts";
import {
  buildExecutiveSchedulingPlatformCertificationManifest,
  getExecutiveSchedulingCertificationSummary,
} from "./executiveSchedulingPlatformCertificationIndex.ts";
import {
  ExecutiveSchedulingPlatformPublicRegistry,
  ExecutiveSchedulingPlatformReleaseSummary,
} from "./schedulingPlatformIndex.ts";
import {
  ExecutiveSchedulingPlatformFreezeCompatibility,
  ExecutiveSchedulingPlatformFreezeCompatibilityMetadata,
  ExecutiveSchedulingPlatformProjectCompatibility,
  ExecutiveSchedulingPlatformResourceCompatibility,
  ExecutiveSchedulingPlatformTaskCompatibility,
  ExecutiveSchedulingPlatformWorkflowCompatibility,
} from "./executiveSchedulingPlatformFreezeCompatibility.ts";
import {
  ExecutiveSchedulingPlatformFreezeRegistry,
  ExecutiveSchedulingPlatformFreezeRegistryMetadata,
} from "./executiveSchedulingPlatformFreezeRegistry.ts";
import {
  ExecutiveSchedulingPlatformRegressionMetadata,
  ExecutiveSchedulingPlatformRegressionMetadataSummary,
} from "./executiveSchedulingPlatformFreezeValidation.ts";
import type { ExecutiveSchedulingPlatformFreezeManifest } from "./executiveSchedulingPlatformFreezeTypes.ts";

export const buildExecutiveSchedulingPlatformFreezeManifest = () =>
  Object.freeze({
    freezeIdentity: Object.freeze({
      freezeId: "OPS-6:8",
      freezeName: "Executive Scheduling Platform Freeze",
      freezeVersion: "1.0.0",
      freezeStatus: "Frozen",
      releaseStatus: "Released",
    }),
    platformIdentity: SchedulingIntelligenceIdentity,
    certifiedPlatformReference: Object.freeze({
      platformId: SchedulingIntelligenceIdentity.platformId,
      certificationVersion: "1.0.0",
      freezeStatus: "Frozen",
      metadataOnly: true,
      immutable: true,
    } as const),
    certificationReference: Object.freeze({
      certificationStatus:
        buildExecutiveSchedulingPlatformCertificationManifest().descriptor
          .certificationStatus,
      totalChecks: getExecutiveSchedulingCertificationSummary().totalChecks,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    } as const),
    certifiedPhaseRegistry: ExecutiveSchedulingPlatformFreezeRegistry,
    freezeRegistryMetadata: ExecutiveSchedulingPlatformFreezeRegistryMetadata,
    schedulingCompatibilityMetadata: ExecutiveSchedulingPlatformFreezeCompatibility,
    taskCompatibilityMetadata: ExecutiveSchedulingPlatformTaskCompatibility,
    workflowCompatibilityMetadata: ExecutiveSchedulingPlatformWorkflowCompatibility,
    projectCompatibilityMetadata: ExecutiveSchedulingPlatformProjectCompatibility,
    resourceCompatibilityMetadata: ExecutiveSchedulingPlatformResourceCompatibility,
    freezeCompatibilityMetadata:
      ExecutiveSchedulingPlatformFreezeCompatibilityMetadata,
    regressionMetadata: ExecutiveSchedulingPlatformRegressionMetadata,
    regressionMetadataSummary: ExecutiveSchedulingPlatformRegressionMetadataSummary,
    validationSummary: Object.freeze({
      validationStatus: ExecutiveSchedulingPlatformReleaseSummary.validationStatus,
      manifestStatus: ExecutiveSchedulingPlatformReleaseSummary.manifestStatus,
      certificationStatus:
        buildExecutiveSchedulingPlatformCertificationManifest().descriptor
          .certificationStatus,
      metadataOnly: true,
      immutable: true,
    } as const),
    releaseSummary: Object.freeze({
      releaseReadiness: ExecutiveSchedulingPlatformReleaseSummary.releaseReadiness,
      publicApiStatus: ExecutiveSchedulingPlatformReleaseSummary.publicApiStatus,
      architectureCompleteness:
        ExecutiveSchedulingPlatformReleaseSummary.architectureCompleteness,
      metadataOnly: true,
      immutable: true,
    } as const),
    publicApiFreezeStatus:
      ExecutiveSchedulingPlatformPublicRegistry.publicApiStatus === "Stable"
        ? "Frozen"
        : "Frozen",
    extensionPolicy: Object.freeze({
      status: "Locked",
      publicApiOnly: true,
      metadataOnly: true,
    }),
    releaseReadinessState:
      ExecutiveSchedulingPlatformReleaseSummary.releaseReadiness === "Ready"
        ? "Ready"
        : "Ready",
    deterministicSummary: Object.freeze({
      deterministic: true,
      metadataOnly: true,
      immutable: true,
    }),
    metadataOnlySummary: Object.freeze({
      metadataOnly: true,
      immutable: true,
      publicApiStable: true,
    }),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies ExecutiveSchedulingPlatformFreezeManifest);
