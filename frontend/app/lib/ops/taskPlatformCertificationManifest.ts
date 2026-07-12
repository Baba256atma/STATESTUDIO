import { TaskIntelligenceIdentity } from "./taskIntelligenceIndex.ts";
import {
  buildTaskPlatformManifest,
} from "./taskPlatformManifestIndex.ts";
import {
  ExecutiveTaskIntelligencePlatformPublicRegistry,
  ExecutiveTaskIntelligencePlatformReleaseSummary,
} from "./taskPlatformIndex.ts";
import {
  TaskPlatformCertificationRegistry,
  TaskPlatformCertificationRegistryMetadata,
} from "./taskPlatformCertificationRegistry.ts";
import {
  TaskPlatformCompatibility,
  TaskPlatformCompatibilityMetadata,
} from "./taskPlatformCompatibility.ts";
import type { TaskPlatformCertificationManifest } from "./taskPlatformCertificationTypes.ts";

export const buildTaskPlatformCertificationManifest = () =>
  Object.freeze({
    platformIdentity: Object.freeze({
      platformId: TaskIntelligenceIdentity.platformId,
      platformName: TaskIntelligenceIdentity.platformName,
      platformVersion: TaskIntelligenceIdentity.platformVersion,
    }),
    certifiedPhases: Object.freeze([
      "OPS-2:1",
      "OPS-2:2",
      "OPS-2:3",
      "OPS-2:4",
      "OPS-2:5",
      "OPS-2:6",
    ]),
    certificationRegistry: TaskPlatformCertificationRegistry,
    certificationRegistryMetadata: TaskPlatformCertificationRegistryMetadata,
    compatibilityMatrix: TaskPlatformCompatibility,
    compatibilityMetadata: TaskPlatformCompatibilityMetadata,
    publicApiStatus: ExecutiveTaskIntelligencePlatformPublicRegistry.publicApiStatus,
    validationSummary: Object.freeze({
      validationStatus: ExecutiveTaskIntelligencePlatformReleaseSummary.validationStatus,
      manifestStatus: ExecutiveTaskIntelligencePlatformReleaseSummary.manifestStatus,
      releaseReadiness: ExecutiveTaskIntelligencePlatformReleaseSummary.releaseReadiness,
      metadataOnly: true,
      immutable: true,
    }),
    manifestSummary: Object.freeze({
      phaseCount: buildTaskPlatformManifest().phaseRegistry.length,
      dependencyCount: buildTaskPlatformManifest().dependencyMap.length,
      publicApiCount: ExecutiveTaskIntelligencePlatformPublicRegistry.totalExportCount,
      metadataOnly: true,
      immutable: true,
    }),
    certificationStatus:
      ExecutiveTaskIntelligencePlatformReleaseSummary.validationStatus === "PASS"
      && ExecutiveTaskIntelligencePlatformReleaseSummary.manifestStatus === "PASS"
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies TaskPlatformCertificationManifest);
