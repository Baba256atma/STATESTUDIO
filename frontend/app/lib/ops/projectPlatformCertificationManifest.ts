import { ProjectExecutionIdentity } from "./projectExecutionIndex.ts";
import {
  buildProjectPlatformManifest,
} from "./projectPlatformManifestIndex.ts";
import {
  ExecutiveProjectExecutionPlatformPublicRegistry,
  ExecutiveProjectExecutionPlatformReleaseSummary,
} from "./projectPlatformIndex.ts";
import {
  ProjectPlatformCertificationRegistry,
  ProjectPlatformCertificationRegistryMetadata,
} from "./projectPlatformCertificationRegistry.ts";
import {
  ProjectPlatformCompatibility,
  ProjectPlatformCompatibilityMetadata,
} from "./projectPlatformCompatibility.ts";
import type { ProjectPlatformCertificationManifest } from "./projectPlatformCertificationTypes.ts";

export const buildProjectPlatformCertificationManifest = () =>
  Object.freeze({
    platformIdentity: Object.freeze({
      platformId: ProjectExecutionIdentity.platformId,
      platformName: ProjectExecutionIdentity.platformName,
      platformVersion: ProjectExecutionIdentity.platformVersion,
    }),
    certifiedPhases: Object.freeze([
      "OPS-4:1",
      "OPS-4:2",
      "OPS-4:3",
      "OPS-4:4",
      "OPS-4:5",
      "OPS-4:6",
    ]),
    certificationRegistry: ProjectPlatformCertificationRegistry,
    certificationRegistryMetadata: ProjectPlatformCertificationRegistryMetadata,
    compatibilityMatrix: ProjectPlatformCompatibility,
    compatibilityMetadata: ProjectPlatformCompatibilityMetadata,
    publicApiStatus: ExecutiveProjectExecutionPlatformPublicRegistry.publicApiStatus,
    validationSummary: Object.freeze({
      validationStatus: ExecutiveProjectExecutionPlatformReleaseSummary.validationStatus,
      manifestStatus: ExecutiveProjectExecutionPlatformReleaseSummary.manifestStatus,
      releaseReadiness: ExecutiveProjectExecutionPlatformReleaseSummary.releaseReadiness,
      metadataOnly: true,
      immutable: true,
    }),
    manifestSummary: Object.freeze({
      phaseCount: buildProjectPlatformManifest().phaseRegistry.length,
      dependencyCount: buildProjectPlatformManifest().dependencyMap.length,
      publicApiCount: ExecutiveProjectExecutionPlatformPublicRegistry.totalExportCount,
      metadataOnly: true,
      immutable: true,
    }),
    certificationStatus:
      ExecutiveProjectExecutionPlatformReleaseSummary.validationStatus === "PASS" &&
      ExecutiveProjectExecutionPlatformReleaseSummary.manifestStatus === "PASS" &&
      ExecutiveProjectExecutionPlatformReleaseSummary.taskCompatibilityStatus === "PASS" &&
      ExecutiveProjectExecutionPlatformReleaseSummary.workflowCompatibilityStatus === "PASS"
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies ProjectPlatformCertificationManifest);

